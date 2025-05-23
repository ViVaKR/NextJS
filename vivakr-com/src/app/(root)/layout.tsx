import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';
import NavMenu from '@/menus/NavMenu';
import { AuthProvider } from '@/lib/AuthContext';
import { SnackbarProvider } from '@/lib/SnackbarContext';
import VivBottomNav from '@/components/VivBottom';
import { Suspense } from 'react';
import ClientSessionProvider from '@/components/ClientSessionProvider';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vivakr.com'),
  title: {
    default: "KIM BUM JUN's - CodeSnippets",
    template: '%s | CodeSnippets',
    absolute: ''
  },
  description: 'Generated by BJ - Kim Bum Jun',
  keywords: '김범준, 프로그램밍, Code, 코드, 코드조각, Programming, 코드나눔',
  openGraph: {
    title: 'KIM BUM JUN',
    description: '김범준의 개인 웹사이트에 오신 것을 환영합니다!',
    url: '/',
    images: ['/images/robot-man.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`sticky-footer ${poppins.className} antialiased`}>
        <ClientSessionProvider>
          <AuthProvider>
            <SnackbarProvider>
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
                <nav><NavMenu /></nav>
                <main className='grow-main'>{children}</main>
                <footer className='bg-slate-200 xs:h-auto md:h-[248px]'>
                  <VivBottomNav />
                </footer>
              </Suspense>
            </SnackbarProvider>
          </AuthProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
