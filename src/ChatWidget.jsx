import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import TgcChatbot from './TgcChatbot.jsx';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onMouseDown = (e) => {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target)) setOpen(false);
    };

    window.addEventListener('mousedown', onMouseDown);
    return () => window.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Sluit chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-[0_12px_30px_rgba(79,70,229,0.35)] transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />

          <div
            ref={panelRef}
            className="absolute bottom-20 right-5 h-[min(720px,calc(100vh-6.5rem))] w-[min(420px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            role="dialog"
            aria-modal="true"
          >
            <TgcChatbot className="h-full" initialLang="NL" />
          </div>
        </div>
      )}
    </>
  );
}
