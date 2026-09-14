import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'Al Insaf General Hospital Ltd. (AIGH) | Leading Tertiary Care & Diagnostics',
  description:
    'Al Insaf General Hospital is a 500+ beds tertiary healthcare institution in Dhaka, Bangladesh, offering 24/7 emergency, ICU/CCU, outdoor diagnostics, and 24+ super-specialized departments.',
  keywords: [
    'Al Insaf General Hospital',
    'Al Insaf Hospital',
    'AIGH',
    'Hospital Dhaka',
    'Doctors Appointment Bangladesh',
    'ICU Dhaka',
    'Diagnostic Center Dhanmondi',
    'Medical Specialists',
  ],
  authors: [{ name: 'Al Insaf General Hospital' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b9e53',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
