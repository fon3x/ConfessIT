'use client';

import { useEffect, useRef } from 'react';

export default function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Reset container to avoid duplicate scripts on client navigation
    const container = bannerRef.current;
    container.innerHTML = '';

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : 'bb38c335f61f6946c6ea59c8a43cc3a3',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://bicea.org/22/bb38c335f61f6946c6ea59c8a43cc3a3';
    invokeScript.async = true;

    container.appendChild(confScript);
    container.appendChild(invokeScript);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000]/95 backdrop-blur border-t border-white/5 py-2">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-center">
        {/* Live Adsterra 320x50 Banner */}
        <div
          ref={bannerRef}
          className="w-[320px] h-[50px] overflow-hidden flex items-center justify-center"
        />
      </div>
    </div>
  );
}