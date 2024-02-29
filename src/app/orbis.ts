import { Orbis } from '@orbisclub/components';

/**
 * Set the global forum context here (you can create categories using the dashboard by clicking on "Create a sub-context"
 * from your main forum context)
 */
(global as any).orbis_context = process.env.ORBCONTEXT;

/**
 * Set the global chat context here (the chat displayed when users click on the "Community Chat" button).
 * The Community Chat button will be displayed only if this variable is set
 */
(global as any).orbis_chat_context = process.env.ORBCONTEXT;

const orbis = new Orbis({
  useLit: true,
  node: 'https://node2.orbis.club',
  PINATA_GATEWAY: 'https://orbis.mypinata.cloud/ipfs/',
  PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
  PINATA_SECRET_API_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
});

export default orbis;
