import type { Metadata, Viewport } from 'next';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  title: 'Al Insaf General Hospital Ltd. (AIGH) | Leading Tertiary Care & Diagnostics',
  description:
    'Al Insaf General Hospital is a premier healthcare institution in Dewanganj, Jamalpur, Bangladesh, offering 24/7 emergency, ICU, outdoor consultations, diagnostics, and 24+ specialized departments.',
  keywords: [
    'Al Insaf General Hospital',
    'Al Insaf Hospital Dewanganj',
    'Hospital Dewanganj Jamalpur',
    'Doctors Appointment Dewanganj',
    'ICU Jamalpur',
    'Diagnostic Center Dewanganj',
    'Medical Specialists Jamalpur',
    'AIGH',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.maateen.me/kalpurush/font.css"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}


