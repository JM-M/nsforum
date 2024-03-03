import { useEffect, useRef, useState } from 'react';

export function useTocHeadsObserver() {
  const observer = useRef<IntersectionObserver>();
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleObsever: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: '-10% 0% -25% 0px',
    });

    const elements = document.querySelectorAll('h2, h3, h4, h5, h6');
    elements.forEach((elem) => observer.current?.observe(elem));
    return () => observer.current?.disconnect();
  }, []);

  return { activeId };
}
