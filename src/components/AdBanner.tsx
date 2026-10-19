'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdBanner() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  useEffect(() => {
    if (clientId && slotId) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore duplicate push errors
      }
    }
  }, [clientId, slotId]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000]/95 backdrop-blur border-t border-white/5">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-center">
        {clientId && slotId ? (
          /* Live Google AdSense 320x50 Ad Unit */
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '320px', height: '50px' }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
          />
        ) : (
          /* Sleek Minimalist AdSense Placeholder */
          <div className="w-full max-w-[320px] h-[50px] bg-[#1A1512] rounded-lg flex items-center justify-center border border-white/5 select-none">
            <span className="text-[11px] text-gray-500 tracking-wider font-mono">
              Ad Space · 320×50 · Google AdSense
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
