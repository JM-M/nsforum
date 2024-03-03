'use client';

import { MutableRefObject, useEffect, useState } from 'react';
import clsx from 'clsx';

import { useTocHeadsObserver } from '@/hooks/useTocHeadsObserver';

type Heading = { id: string; text: string; level: number };
type Props = {
  articleRef: MutableRefObject<HTMLElement | null>;
  title: string;
};

const PostToc = ({ articleRef, title }: Props) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  const { activeId } = useTocHeadsObserver();

  useEffect(() => {
    const articleElement = articleRef.current;
    if (!articleElement) return;
    const elements = Array.from(
      articleElement.querySelectorAll('h2, h3, h4, h5, h6')
    ).map((elem) => ({
      id: elem.id,
      text: (elem as HTMLElement).innerText,
      level: Number(elem.nodeName.charAt(1)),
    }));
    setHeadings(elements);
  }, [articleRef.current]);

  const getClassName = (level: number) => {
    switch (level) {
      case 2:
        return 'text-base';
      case 3:
        return 'text-sm pl-3';
      case 4:
        return 'text-xs pl-6';
      case 5:
        return 'text-xs pl-9';
      case 6:
        return 'text-xs pl-12';
      default:
        return '';
    }
  };

  return (
    <aside className="hidden md:block min-w-60 max-w-64">
      <div className="sticky top-3">
        <div className="mb-5">
          <div className="uppercase font-medium font-serif">{title}</div>
          <div className="text-sm text-muted-foreground">Feb 20, 2024</div>
        </div>
        <ul>
          {headings.map((heading) => (
            <li key={heading.id} className={getClassName(heading.level)}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${heading.id}`)!.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                className={clsx('block py-1', {
                  'text-blue-500': heading.id === activeId,
                })}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
export default PostToc;
