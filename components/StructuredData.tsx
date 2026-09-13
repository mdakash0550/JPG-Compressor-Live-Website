import React from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jpg-compressor.vercel.app';

export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${BASE_URL}/#webapp`,
        name: 'JPG Compressor – Reduce Image Size in KB',
        alternateName: ['JPG Size Reducer', 'Photo Compressor Online', 'Compress JPEG to 100KB', 'TinyJPG Alternative'],
        url: BASE_URL,
        description:
          'Free online batch JPG compressor and photo size reducer by Akash, a Bangladeshi web developer. Reduce JPG, JPEG, PNG, and WebP file sizes down to 100KB, 200KB, or 50KB with lossless visual clarity.',
        applicationCategory: 'MultimediaApplication',
        applicationSubCategory: 'Image Compression and Optimization Tool',
        operatingSystem: 'All (Web Browser, Windows, Mac, Linux, Android, iOS)',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        featureList: [
          'Batch JPG, JPEG, PNG, and WebP compression',
          'Reduce image size in KB without quality loss',
          'Compress JPG to 100KB, 200KB, and 50KB for job forms and passports',
          'Intelligent MozJPEG color quantization',
          'Interactive split before/after image quality comparison slider',
          'One-click single and bulk ZIP archive download',
          '100% privacy: In-memory real-time processing with zero data storage',
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          '@id': `${BASE_URL}/#author`,
          name: 'Akash',
          jobTitle: 'Web Developer',
          nationality: {
            '@type': 'Country',
            name: 'Bangladesh',
          },
          description: 'Bangladeshi Web Developer & Software Engineer specializing in fast, responsive web applications and optimization utilities.',
        },
      },
      {
        '@type': 'HowTo',
        '@id': `${BASE_URL}/#howto`,
        name: 'How to Compress JPG and Reduce Image Size in KB in 3 Steps',
        description: 'Compress JPG, JPEG, PNG, or WebP images to 100KB, 200KB, or 50KB quickly and for free without losing picture clarity.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Upload JPG or Photos',
            text: 'Drag and drop your JPG, JPEG, PNG, or WebP files into the compressor dropzone or click to choose files from your device.',
            url: `${BASE_URL}/#upload`,
          },
          {
            '@type': 'HowToStep',
            name: 'Automatic Lossless Compression',
            text: 'The engine uses intelligent MozJPEG quantization and Huffman coding tables to cut file size by up to 80% while retaining sharp visual fidelity.',
            url: `${BASE_URL}/#compress`,
          },
          {
            '@type': 'HowToStep',
            name: 'Download in Single or ZIP Archive',
            text: 'Preview image quality with the interactive comparison slider and download individual photos or all images packaged together in a single ZIP file.',
            url: `${BASE_URL}/#download`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How do I compress JPG or reduce photo size to 100KB or 200KB?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Simply drag and drop your photos into JPG Compressor. Our intelligent compression engine analyzes color palettes, strips bloated EXIF metadata, and optimizes chroma subsampling to drastically reduce file sizes to 100KB, 200KB, or 50KB while preserving pristine image resolution.',
            },
          },
          {
            '@type': 'Question',
            name: 'Does compressing images cause blurriness or visual quality loss?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. JPG Compressor utilizes perceptual quantization algorithms that specifically target high-frequency details and subtle gradients that human eyes cannot perceive. You get up to 80% smaller file sizes with crisp, visually lossless results.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I batch compress multiple JPG, PNG, and WebP pictures at once?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! You can select and batch compress dozens of photos simultaneously. Once compressed, you can download pictures individually or download all optimized photos in a single ZIP archive.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why should I compress images for website SEO and Core Web Vitals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Uncompressed images are the leading cause of slow page loading speeds and poor Largest Contentful Paint (LCP) scores in Google Core Web Vitals. Compressing images speeds up website loading, decreases bounce rates, and directly improves organic search engine ranking.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are my uploaded pictures and confidential documents secure and private?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, 100%. We take privacy seriously. Your uploaded images are processed entirely in memory on the server and are never saved to disks, permanent databases, or shared with third parties. Once downloaded, all files are immediately purged.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is this JPG Compressor tool free to use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, JPG Compressor is completely free with no hidden charges, watermarks, or mandatory registrations. Created by Akash, a Bangladeshi web developer, to provide a fast, privacy-first tool for creators worldwide.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
