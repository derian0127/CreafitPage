import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import Cart from '@/components/Cart';
import NewsletterPopup from '@/components/NewsletterPopup';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Creafit - Suplementos Deportivos',
  description: 'La mejor tienda de suplementos en Colombia',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <div className="layout">
          <Nav />
          <main className="main-content">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <Cart />
          <NewsletterPopup />
        </div>
      </body>
    </html>
  );
}
