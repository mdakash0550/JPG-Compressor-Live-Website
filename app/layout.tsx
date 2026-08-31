import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StructuredData } from '@/components/StructuredData';

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'JPG Compressor | Fast Online Batch Image Size Reducer & Optimizer',
    template: '%s | JPG Compressor',
  },
  description:
    'Free online JPG compressor by Akash, a Bangladeshi web developer. Batch compress JPG, JPEG, PNG, and WebP images by up to 80% with lossless visual quality and single/ZIP bulk downloads.',
  keywords: [
    'JPG Compressor',
    'compress JPG',
    'compress image online',
    'JPEG size reducer',
    'reduce image file size',
    'batch photo compressor',
    'free image optimizer',
    'lossless JPG compression',
    'compress PNG to JPG',
    'convert and compress webp',
    'bulk image compression tool',
    'Akash Bangladeshi web developer',
    'Bangladeshi developer tools',
    'TinyJPG online batch compressor',
    'photo size reducer kb',
  ],
  authors: [
    {
      name: 'Akash',
      url: 'https://wa.me/8801785422960',
    },
  ],
  creator: 'Akash (Bangladeshi Web Developer)',
  publisher: 'JPG Compressor',
  applicationName: 'JPG Compressor',
  category: 'Multimedia & Productivity',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'JPG Compressor | Fast Online Batch Image Optimizer',
    description:
      'Compress JPG, JPEG, PNG, and WebP images up to 80% without losing quality. Created by Akash, Bangladeshi Web Developer.',
    type: 'website',
    locale: 'en_US',
    siteName: 'JPG Compressor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG Compressor - Free Batch Image Size Reducer',
    description:
      'Reduce JPG and photo file sizes instantly online with lossless clarity. Developed by Akash, Bangladeshi Web Developer.',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

