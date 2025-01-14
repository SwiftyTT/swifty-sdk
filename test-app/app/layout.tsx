import './globals.css';

export const metadata = {
  title: 'IFRAME test app',
  description: 'Full page IFRAME test application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}