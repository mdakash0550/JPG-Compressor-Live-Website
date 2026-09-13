import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StructuredData } from '@/components/StructuredData';

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jpg-compressor.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'JPG Compressor – Reduce Image Size in KB (100KB, 200KB, 50KB) | Batch Photo Optimizer',
    template: '%s | JPG Compressor',
  },
  description:
    'Free online JPG compressor and image size reducer. Batch compress JPG, JPEG, PNG, and WebP images to 100KB, 200KB, or 50KB without losing quality. Fast, lossless optimization with single and bulk ZIP download. 100% private.',
  keywords: [
    'JPG compressor',
    'compress JPG',
    'compress JPEG',
    'reduce image size in kb',
    'compress jpeg to 100kb',
    'compress image to 50kb',
    'compress jpeg to 200kb',
    'compress jpg to 20kb',
    'photo size reducer in kb',
    'compress image online',
    'compress jpg without losing quality',
    'batch image compressor',
    'bulk photo size reducer',
    'compress multiple images at once',
    'free image optimizer',
    'lossless JPG compression',
    'compress PNG to JPG',
    'convert and compress webp',
    'image compressor for website',
    'optimize images for SEO',
    'Core Web Vitals image compression',
    'passport photo size reducer',
    'job application image compressor',
    'tinyjpg alternative free',
    'tinypng alternative online',
    'Akash Bangladeshi web developer',
    'free online image optimizer',
    'photo compressor online',
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
    title: 'JPG Compressor – Reduce Image Size in KB | Free Batch Photo Optimizer',
    description:
      'Compress JPG, JPEG, PNG, and WebP images up to 80% without losing quality. Compress to 100KB, 200KB, or 50KB with lossless clarity. Developed by Akash, Bangladeshi Web Developer.',
    type: 'website',
    locale: 'en_US',
    siteName: 'JPG Compressor',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JPG Compressor – Free Batch Image Size Reducer in KB',
    description:
      'Reduce JPG, JPEG, PNG, and photo file sizes instantly online without quality loss. Supports 100KB, 200KB, and 50KB targets. Developed by Akash, Bangladeshi Web Developer.',
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: '0fjxQfwx8lDkG3zx2xNGq4T4xWMWt4jWX3YyMZfPt3I',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="0fjxQfwx8lDkG3zx2xNGq4T4xWMWt4jWX3YyMZfPt3I" />
        <StructuredData />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

