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
        'key' : '75660084edbcf45797884b6da8d8d179',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://bicea.org/22/75660084edbcf45797884b6da8d8d179';
    invokeScript.async = true;

    container.appendChild(confScript);
    container.appendChild(invokeScript);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#000000]/95 backdrop-blur border-t border-white/5 py-2">
      <div className="max-w-3xl mx-auto px-4 flex items-center justify-center overflow-x-auto">
        {/* Live Adsterra 728x90 Banner */}
        <div
          ref={bannerRef}
          className="min-w-[728px] h-[90px] overflow-hidden flex items-center justify-center"
        />
      </div>
    </div>
  );
}