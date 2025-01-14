'use client'

import React, { useEffect, useRef } from 'react';
import Swifty from 'swifty-sdk';

interface IFrameContainerProps {
  containerId?: string;
}

const IFrameContainer: React.FC<IFrameContainerProps> = ({ 
  containerId = 'swifty-iframe-container' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const swifty = new Swifty({ apiKey: 'test-api-key' });

  useEffect(() => {
    if (containerRef.current) {
      swifty.loadWidget({ 
        selector: `#${containerId}`,
        message: 'Hi!' 
      });
    }
  }, [containerId]);

  return (
    <div 
      id={containerId}
      ref={containerRef}
      className="w-full h-screen bg-white relative overflow-hidden"
    />
  );
};

export default IFrameContainer;