'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useOrbis } from '@orbisclub/components';
import { cn } from '@udecode/cn';
import { CircleUser, LogOut, Menu } from 'lucide-react';

import { NavItem } from '@/types/nav';
import { siteConfig } from '@/config/site';
import { Icons } from '@/components/icons';

import { ThemeToggle } from './theme-toggle';

const User = ({ user, pfpSize = 20 }: { user: any; pfpSize?: number }) => {
  if (!user?.profile) return null;
  const username = user?.profile?.username;
  const pfp = user?.profile?.pfp;
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-sm btn-ghost m-1">
        <div className="flex items-center gap-2">
          {pfp ? (
            <Image
              src={pfp}
              alt={username}
              height={pfpSize}
              width={pfpSize}
              className="rounded-full"
            />
          ) : (
            <CircleUser size={pfpSize} strokeWidth={1.4} />
          )}
          <span className="inline-block text-sm">{username}</span>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-lg w-40"
      >
        <li>
          <span>Profile</span>
        </li>
        <li>
          <span className="flex items-center justify-between">
            Logout <LogOut strokeWidth={1.4} size={16} />
          </span>
        </li>
      </ul>
    </div>
  );
};

interface NavbarProps {
  items?: NavItem[];
}

export function Navbar({ items }: NavbarProps) {
  const { setConnectModalVis, user } = useOrbis();

  return (
    <div className="w-full navbar bg-base-300">
      <div className="flex-none">
        <label
          htmlFor="my-drawer-3"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost !p-1 rounded-full"
        >
          <Menu className="w-6" strokeWidth={1.4} />
        </label>
      </div>
      <div className="flex-1 px-2 mx-2">{siteConfig.name}</div>
      {/* Navbar links */}
      {/* <div className="flex-none hidden lg:block">
        <ul className="menu menu-horizontal">
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
        </ul>
      </div> */}
      <div className="ml-auto w-fit flex gap-3">
        {user?.profile ? (
          <User user={user} />
        ) : (
          <button
            className="btn btn-sm"
            onClick={() => setConnectModalVis(true)}
          >
            Connect
          </button>
        )}
        <Link className="btn btn-sm" href="/posts/new">
          New post
        </Link>
        <ThemeToggle />
      </div>
    </div>
  );

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Icons.logo className="size-6" />
        <span className="inline-block font-bold">{siteConfig.name}</span>
      </Link>
      {items?.length ? (
        <nav className="flex gap-6">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    'flex items-center text-sm font-medium text-muted-foreground',
                    item.disabled && 'cursor-not-allowed opacity-80'
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  );
}
