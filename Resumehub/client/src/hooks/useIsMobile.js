import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 900;

/**
 * Returns true when the viewport width is below 900px.
 * Updates reactively on window resize (debounced 100ms).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    let timer;
    const handler = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }, 100);
    };

    window.addEventListener('resize', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handler);
    };
  }, []);

  return isMobile;
}
