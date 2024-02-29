import { definition } from '@/__generated__/definition';
import { ComposeClient } from '@composedb/client';

export async function POST(req: Request) {
  //instantiate a composeDB client instance
  const composeClient = new ComposeClient({
    ceramic: 'https://ceramic-arcanumsci-mainnet.hirenodes.io/',
    definition: definition as any,
  });

  const body = await req.json();

  console.log('API: ', body);

  try {
    const data = await composeClient.executeQuery(`
            query {
              accountAttestationIndex(filters: 
          {
            where: {
              recipient: { 
                    equalTo: "${body.account}"
                  } 
            }
          }
          first: 100) {
            edges {
              node {
                    id
                    uid
                    schema
                    attester
                    verifyingContract 
                    easVersion
                    version 
                    chainId 
                    types{
                      name
                      type
                    }
                    r
                    s
                    v
                    recipient
                    refUID
                    data
                    time
                }
              }
            }
          }
      `);

    return Response.json({ data });
  } catch (error) {
    return new Response(`Webhook error: ${(error as any)?.message || ''}`, {
      status: 500,
    });
  }
  // const res = await fetch('https://data.mongodb-api.com/...', {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'API-Key': process.env.DATA_API_KEY,
  //   },
  // });
  // const data = await res.json();

  // return Response.json({ data })
}
