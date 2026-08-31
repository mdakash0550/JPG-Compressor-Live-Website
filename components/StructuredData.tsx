import React from 'react';

export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://jpg-compressor.app/#webapp',
        name: 'JPG Compressor',
        url: 'https://jpg-compressor.app',
        description:
          'Free online batch JPG and image compressor developed by Akash, a Bangladeshi web developer. Reduce JPG, JPEG, PNG, and WebP file sizes up to 80% with lossless clarity.',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: {
          '@type': 'Person',
          '@id': 'https://jpg-compressor.app/#author',
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
        '@id': 'https://jpg-compressor.app/#howto',
        name: 'How to Compress JPG Images Online in 3 Steps',
        description: 'Compress JPG, JPEG, PNG, or WebP images online quickly and for free without losing picture quality.',
        step: [
          {
            '@type': 'HowToStep',
            name: 'Upload JPG Images',
            text: 'Drag and drop your JPG or PNG files into the compressor dropzone or click to select from your device.',
            url: 'https://jpg-compressor.app/#upload',
          },
          {
            '@type': 'HowToStep',
            name: 'Automatic Intelligent Compression',
            text: 'JPG Compressor automatically quantizes colors and optimizes Huffman coding tables to cut file size by 60% to 80%.',
            url: 'https://jpg-compressor.app/#compress',
          },
          {
            '@type': 'HowToStep',
            name: 'Download Compressed Pictures',
            text: 'Download optimized pictures individually or download all compressed photos together in a single ZIP archive.',
            url: 'https://jpg-compressor.app/#download',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://jpg-compressor.app/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is JPG Compressor?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'JPG Compressor is a free online tool designed by Akash, a Bangladeshi web developer, to reduce image file sizes (JPG, JPEG, PNG, WebP) by up to 80% without noticeable quality loss.',
            },
          },
          {
            '@type': 'Question',
            name: 'How does JPG image compression work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'JPG Compressor employs advanced selective quantization algorithms and MozJPEG compression to strip unnecessary metadata and optimize color data while maintaining crisp visual clarity.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is batch image compression supported?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, you can upload multiple images simultaneously. You can compress all pictures at once and download them individually or as a single packaged ZIP file.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are my uploaded pictures secure and private?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, your images are processed securely in memory and never stored permanently or shared with third parties. All files are automatically discarded after processing.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who created the JPG Compressor tool?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The JPG Compressor app was developed by Akash, a Bangladeshi Web Developer passionate about building high-performance web utilities and open tools for the global community.',
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
