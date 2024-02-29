'use client';

import { ReactNode } from 'react';
import { GlobalContext } from '@/contexts/GlobalContext';
import { Orbis, OrbisProvider } from '@orbisclub/components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Set the global forum context here (you can create categories using the dashboard by clicking on "Create a sub-context"
 * from your main forum context)
 */
(global as any).orbis_context = process.env.NEXT_PUBLIC_ORBCONTEXT;

/**
 * Set the global chat context here (the chat displayed when users click on the "Community Chat" button).
 */
(global as any).orbis_chat_context = process.env.NEXT_PUBLIC_ORBCONTEXT;

let orbis = new Orbis({
  useLit: true,
  node: 'https://node2.orbis.club',
  PINATA_GATEWAY: 'https://orbis.mypinata.cloud/ipfs/',
  PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  PINATA_SECRET_API_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OrbisProvider
      defaultOrbis={orbis}
      authMethods={['metamask', 'wallet-connect', 'email']}
    >
      <QueryClientProvider client={queryClient}>
        <GlobalContext.Provider value={{ orbis }}>
          {children}
        </GlobalContext.Provider>
      </QueryClientProvider>
    </OrbisProvider>
  );
}
