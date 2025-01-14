interface ClientOptions {
  apiKey: string;
  swiftyUrl?: string;
}

interface OpenOptions {
  newWindow?: boolean;
  message?: string;
}

interface LoadWidgetOptions {
  selector: string;
  message?: string;
}

class SpeechRecognitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpeechRecognitionError';
  }
}

class Swifty {
  private readonly apiKey: string;
  private readonly swiftyUrl: string;
  private iframeInstance: HTMLIFrameElement | null = null;
  
  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.swiftyUrl = options.swiftyUrl || 'https://app.swifty.so/loading';
  }

  private buildUrl(message?: string): string {
    const url = new URL(this.swiftyUrl);
    url.searchParams.append('t', this.apiKey);
    if (message) {
      url.searchParams.append('m', message);
    }
    return url.toString();
  }

  async loadWidget(options: LoadWidgetOptions): Promise<boolean> {
    try {
      const container = document.querySelector(options.selector);
      if (!container) {
        throw new Error(`Container ${options.selector} not found`);
      }

      // Clean up any existing iframe
      if (this.iframeInstance) {
        this.iframeInstance.remove();
      }

      // Create and configure iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.src = this.buildUrl(options.message);

      // Wait for iframe to load
      const loaded = new Promise<boolean>((resolve, reject) => {
        iframe.onload = () => resolve(true);
        iframe.onerror = () => reject(new Error('Failed to load widget'));
        
        // Timeout after 10 seconds
        setTimeout(() => reject(new Error('Widget load timeout')), 10000);
      });

      // Append iframe to container
      container.appendChild(iframe);
      this.iframeInstance = iframe;

      await loaded;
      return true;
    } catch (error) {
      console.error('Widget load failed:', error);
      return false;
    }
  }

  open(options: OpenOptions = {}): void {
    const url = this.buildUrl(options.message);
    
    if (options.newWindow) {
      window.open(url, '_blank');
    } else {
      window.location.href = url;
    }
  }

  async recognizeSpeech(): Promise<string> {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new SpeechRecognitionError('Speech recognition not supported in this browser');
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      return new Promise((resolve, reject) => {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          stream.getTracks().forEach(track => track.stop());
          resolve(transcript);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          stream.getTracks().forEach(track => track.stop());
          reject(new SpeechRecognitionError(event.error));
        };

        recognition.onend = () => {
          stream.getTracks().forEach(track => track.stop());
        };

        recognition.start();
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new SpeechRecognitionError(
          error.message === 'Permission denied' 
            ? 'Microphone permission denied'
            : error.message
        );
      }
      throw new SpeechRecognitionError('Failed to initialize speech recognition');
    }
  }
}

export default Swifty;
