import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    absolute: '', // '
    default: 'Kim Bum Jun Next Tutorial', // 'default', 기본값입니다.
    template: '%s | Kim Bum Jun', // 템플릿은 %s 를 포함하고, %s 는 default 값으로 대체됩니다.
  },
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header
          style={{
            backgroundColor: 'lightblue',
            padding: '1rem',
            textAlign: 'center',
          }}>
          <p
            style={{
              fontSize: '1.5rem',

              fontWeight: 'bold',
            }}>
            Header
          </p>
        </header>
        {children}
        <footer
          style={{
            backgroundColor: 'ghostwhite',
            padding: '1rem',
            textAlign: 'center',
          }}>
          <p>Footer</p>
        </footer>
      </body>
    </html>
  );
}
