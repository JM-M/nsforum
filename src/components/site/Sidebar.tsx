'use client';

import Link from 'next/link';
import { cn } from '@udecode/cn';

import { NavItem } from '@/types/nav';
import useCategories from '@/hooks/useCategories';

type SidebarProps = { items?: NavItem[] };
const Sidebar = ({ items }: SidebarProps) => {
  const { categories, isLoading } = useCategories();

  return (
    <div className="drawer-side">
      <label
        htmlFor="my-drawer-3"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="menu p-4 w-80 min-h-full bg-base-200">
        <ul>
          {items?.map(
            (item, index) =>
              item.href && (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center text-sm font-medium text-muted-foreground',
                      item.disabled && 'cursor-not-allowed opacity-80'
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
          )}
          <li>
            <span>Categories</span>
            <ul className="before:h-full before:top-0">
              {!isLoading &&
                // use proper type
                categories?.map((category: any) => {
                  const {
                    content: { displayName },
                    stream_id,
                  } = category;
                  return (
                    <li key={stream_id}>
                      <Link className="h-8 px-2" href="#0">
                        {displayName}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
