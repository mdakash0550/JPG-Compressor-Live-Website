'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Send,
  Phone,
  X,
  ExternalLink,
} from 'lucide-react';
import { useIsMounted } from '@/lib/hooks';

const WHATSAPP_NUMBER = '+8801785422960';
const CLEAN_NUM = '8801785422960';
const DEFAULT_MESSAGE = 'Hello Akash! I need assistance with the JPG Compressor.';
const ENCODED_MSG = encodeURIComponent(DEFAULT_MESSAGE);
const WHATSAPP_URL = `https://wa.me/${CLEAN_NUM}?text=${ENCODED_MSG}`;
const TELEGRAM_URL = `https://t.me/share/url?text=${ENCODED_MSG}`;

export function FloatingContact() {
  const isMounted = useIsMounted();
  const [isOpen, setIsOpen] = useState(false);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2 font-sans"
      id="floating-contact-container"
    >
      {/* Minimalist Popover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-60 rounded-xl bg-white border border-zinc-200 shadow-lg p-3 text-zinc-900"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
              <span className="text-xs font-semibold text-zinc-800">
                Contact & Support
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Channel Options */}
            <div className="space-y-1.5">
              {/* WhatsApp */}
              <a
                id="floating-whatsapp-action"
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50 text-zinc-800 hover:text-emerald-950 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-emerald-500 text-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 fill-white/20" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-900 leading-none">WhatsApp</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-none">Instant message</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-600 transition-colors" />
              </a>

              {/* Telegram */}
              <a
                id="floating-telegram-action"
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg hover:bg-sky-50 text-zinc-800 hover:text-sky-950 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-sky-500 text-white flex items-center justify-center">
                    <Send className="w-3.5 h-3.5 -rotate-12 translate-x-0.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-900 leading-none">Telegram</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-none">Chat online</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-sky-600 transition-colors" />
              </a>

              {/* Direct Call */}
              <a
                id="floating-call-action"
                href={`tel:${CLEAN_NUM}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 text-zinc-800 transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-zinc-800 text-white flex items-center justify-center">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-900 leading-none">Direct Call</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-none">Voice call</p>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimalist Floating Trigger Dock */}
      <div className="flex items-center gap-1 p-1 bg-white/90 backdrop-blur-md rounded-full border border-zinc-200 shadow-sm hover:shadow transition-shadow">
        {/* Quick WhatsApp */}
        <a
          id="quick-whatsapp-floating-btn"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-transform active:scale-95"
          title="Chat on WhatsApp"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
        </a>

        {/* Quick Telegram */}
        <a
          id="quick-telegram-floating-btn"
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-transform active:scale-95"
          title="Chat on Telegram"
          aria-label="Telegram"
        >
          <Send className="w-3.5 h-3.5 -rotate-12 translate-x-0.5" />
        </a>

        {/* Toggle Contact Menu */}
        <button
          id="floating-contact-toggle-btn"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-8 px-2.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
            isOpen
              ? 'bg-zinc-900 text-white'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
          }`}
          aria-expanded={isOpen}
          aria-label="Contact options"
        >
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
}
