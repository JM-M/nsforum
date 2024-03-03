import { cn } from '@udecode/cn';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/lib/fonts';
import { TooltipProvider } from '@/components/plate-ui/tooltip';
import { SiteHeader } from '@/components/site/site-header';
import { TailwindIndicator } from '@/components/site/tailwind-indicator';
import { ThemeProvider } from '@/components/site/theme-provider';

import { Providers } from './providers';

import '@orbisclub/components/dist/index.modern.css';
import '@/styles/globals.css';

import { Metadata, Viewport } from 'next';

import { Navbar } from '@/components/site/Navbar';
import Sidebar from '@/components/site/Sidebar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            '[&_.slate-selected]:!bg-primary/20 [&_.slate-selection-area]:border [&_.slate-selection-area]:border-primary [&_.slate-selection-area]:bg-primary/10'
            // fontSans.variable
          )}
          suppressHydrationWarning
        >
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="light">
              <TooltipProvider
                disableHoverableContent
                delayDuration={500}
                skipDelayDuration={0}
              >
                {/* <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <div className="flex-1">{children}</div>
                </div> */}
                <div className="drawer">
                  <input
                    id="my-drawer-3"
                    type="checkbox"
                    className="drawer-toggle"
                  />
                  <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <Navbar items={siteConfig.navbar} />
                    {/* Page content here */}
                    <main className="p-3 md:p-5">{children}</main>
                  </div>
                  <Sidebar items={siteConfig.navbar} />
                </div>
                <TailwindIndicator />
              </TooltipProvider>
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </>
  );
}
