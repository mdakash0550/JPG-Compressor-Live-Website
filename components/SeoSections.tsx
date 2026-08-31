'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  Cpu,
  Download,
  ShieldCheck,
  Zap,
  Layers,
  ChevronDown,
  Code2,
  Globe,
  Sparkles,
  CheckCircle2,
  FileImage,
  ArrowRight,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does JPG Compressor reduce file sizes without losing quality?',
    a: 'JPG Compressor uses intelligent color quantization and MozJPEG encoding algorithms. By eliminating redundant metadata and selectively reducing similar color shades that the human eye cannot distinguish, file size decreases by 60% to 80% while retaining sharp clarity.',
  },
  {
    q: 'Is there a limit on how many images I can compress in batch?',
    a: 'You can upload and batch compress dozens of photos simultaneously. We support JPG, JPEG, PNG, and WebP images up to 50MB per file with single or instant ZIP archive bulk downloads.',
  },
  {
    q: 'Are my uploaded images safe and private?',
    a: 'Absolutely. Privacy is our top priority. Your images are processed in-memory securely and are never permanently stored, indexed, or shared with any third party. Once you download your files or clear the queue, they are instantly discarded.',
  },
  {
    q: 'Can I resize dimensions or customize compressed file suffixes?',
    a: 'Yes! Click the "Options" button in the top navigation bar to enable automatic dimension resizing (Fit, Scale, Cover) and customize your output filename suffix (such as "-min" or "-compressed").',
  },
  {
    q: 'Who developed this JPG Compressor website?',
    a: 'This web application was designed and engineered by Akash, a Bangladeshi Web Developer & Software Engineer passionate about crafting fast, accessible, and privacy-focused web utilities for creators worldwide.',
  },
];

export function SeoSections() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full mt-10 space-y-10 text-zinc-900 border-t border-zinc-200/80 pt-8" id="learn-more">
      {/* 1. How It Works Section */}
      <section className="space-y-4" aria-labelledby="how-it-works-title">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-800 border border-amber-200/60 mb-1.5">
            <Sparkles className="w-3 h-3" /> Step-by-Step Guide
          </div>
          <h2 id="how-it-works-title" className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
            How to Compress JPG & Photos Online in 3 Easy Steps
          </h2>
          <p className="text-xs text-zinc-600 max-w-2xl mt-0.5">
            Optimize your images for websites, social media, portfolios, or email attachments in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <UploadCloud className="w-4 h-4 text-zinc-400" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 mb-1">Select or Drag Images</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Drop your JPG, JPEG, PNG, or WebP files directly into the upload area or click to browse.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center text-[10px] text-zinc-400 font-medium">
              <span>Supports up to 50MB</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <Cpu className="w-4 h-4 text-zinc-400" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 mb-1">Smart Compression</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Our engine optimizes quantization tables & chroma subsampling to reduce weight by up to 80%.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center text-[10px] text-zinc-400 font-medium">
              <span>Lossless visual quality</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <Download className="w-4 h-4 text-zinc-400" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 mb-1">Instant Single / ZIP Download</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Inspect before & after preview, then download single files or bundle everything into a single ZIP.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center text-[10px] text-zinc-400 font-medium">
              <span>Single or Bulk ZIP download</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Advantages & Benefits */}
      <section className="space-y-4" aria-labelledby="why-choose-title">
        <div>
          <h2 id="why-choose-title" className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
            Why Choose JPG Compressor for Your Web & Photo Workflow?
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Designed specifically to improve website loading speeds, Core Web Vitals, and SEO rankings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">Faster Page Speed & Better Google SEO</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                Compressing high-resolution images prevents website lag, accelerates time-to-interactive (TTI), and boosts organic search rankings.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">Visual Quality Comparison Slider</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                Review side-by-side interactive split slider comparisons to ensure pixel-perfect fidelity before downloading.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">100% Privacy & Data Protection</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                Files are compressed in real time and immediately discarded. No photos are stored on servers or saved to databases.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileImage className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900">Multi-Format Versatility</h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed mt-0.5">
                Handles JPG, JPEG, PNG, and modern WebP formats smoothly with customizable dimensions and naming patterns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Image Optimization Technical Matrix */}
      <section className="p-4 rounded-2xl bg-zinc-900 text-white space-y-3" aria-labelledby="tech-guide-title">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="tech-guide-title" className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-400" />
              Technical Compression Breakdown
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              How our dual MozJPEG & TinyJPG quantization pipeline achieves smaller sizes.
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] bg-white/10 px-2 py-0.5 rounded text-amber-300 font-mono">
            Chroma 4:2:0 • Huffman Optimized
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[11px] font-semibold text-amber-300 mb-1">JPG / JPEG Photos</p>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Discrete Cosine Transform (DCT) combined with progressive MozJPEG encoding cuts 60%–80% weight without blur.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[11px] font-semibold text-sky-300 mb-1">PNG Graphics</p>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Converts 24-bit PNGs to efficient 8-bit indexed palettes while maintaining crisp alpha transparency.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[11px] font-semibold text-emerald-300 mb-1">Next-Gen WebP</p>
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              Supports predictive block coding and modern web compression standards for ultra-fast mobile loading.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Interactive FAQ Section (Schema-aligned) */}
      <section className="space-y-3" aria-labelledby="faq-title">
        <div>
          <h2 id="faq-title" className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Everything you need to know about JPG Compressor and online image optimization.
          </p>
        </div>

        <div className="space-y-2">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-zinc-200 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-zinc-800' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 pt-0 text-[11px] text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/50">
                    <p className="pt-2">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Developer Attribution & Bio Card */}
      <section
        className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-zinc-50 border border-amber-200/80 shadow-xs"
        aria-labelledby="developer-bio-title"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-amber-900 tracking-wide uppercase">
                Creator Profile
              </span>
            </div>
            <h2 id="developer-bio-title" className="text-sm font-bold text-zinc-900">
              Developed by Akash — Bangladeshi Web Developer
            </h2>
            <p className="text-[11px] text-zinc-600 max-w-xl leading-relaxed">
              Akash is a dedicated Web Developer and Software Engineer from Bangladesh specializing in high-performance frontend architectures, Next.js web applications, and accessible developer utilities.
            </p>
          </div>

          <a
            href="https://wa.me/8801785422960"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium shadow-xs transition-transform active:scale-95 flex-shrink-0"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </a>
        </div>

        <div className="mt-3 pt-3 border-t border-amber-200/50 flex flex-wrap items-center gap-3 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-amber-600" /> Made in Bangladesh
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Free & Open for Global Users
          </span>
          <span>•</span>
          <span>Fast MozJPEG Processing</span>
        </div>
      </section>
    </div>
  );
}
