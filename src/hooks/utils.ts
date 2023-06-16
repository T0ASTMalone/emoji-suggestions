import { useEffect, useRef } from 'react';
import type { DependencyList } from 'react';

export function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

export function useDebounce(cb: () => void, deps: DependencyList,  ms = 200) {
  const savedCb = useRef(cb); 
  const timeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    savedCb.current = cb;
  }, [cb]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }

    timeout.current = setTimeout(() => savedCb?.current?.(), ms);

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = null
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ms, ...deps]);
}

export function useClickOutside<T extends HTMLElement>(cb: () => void) {
  const ref = useRef<T | null>(null);
  const savedCb = useRef<() => void>(cb);

  useEffect(() => { 
    savedCb.current = cb;
  }, [cb]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref?.current?.contains(e.target as Node)) {
        return; 
      }
      savedCb.current?.();
    };

    window.addEventListener('click', onClickOutside);
    return () => {
      window.removeEventListener('click', onClickOutside);
    };
  }, []);
  
  return ref;
}
