import { useRouter } from 'next/navigation';
import { useOrbis } from '@orbisclub/components';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { CreatePostOptions } from '@/types/post';

type Props = {
  category?: string;
};

const usePosts = (props?: Props) => {
  const { category = 'all' } = props || {};
  const { orbis } = useOrbis();

  const router = useRouter();

  // Posts
  /** Load list of posts using the Orbis SDK */
  const getPosts = async (
    context: string,
    include_child_contexts: boolean,
    _page: number
  ) => {
    let { data, error } = await orbis.api
      .rpc('get_ranked_posts', { q_context: context })
      .range(_page * 25, (_page + 1) * 50 - 1);

    /** Save data in posts state */
    if (data) {
      const applyVerified = async (items: any) => {
        const list = [];
        for (let i = 0; i < items.length; i++) {
          const requestBody = {
            account: items[i].creator_details.metadata.address.toLowerCase(),
          };
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          };
          const gotAttestations = await fetch(
            '/api/getAttestationsReceived',
            requestOptions
          ).then((response) => response.json());
          // change this to if user has more than 3 instead of greater than zero
          if (
            gotAttestations.data.data.accountAttestationIndex.edges.length > 0
          ) {
            items[i].verified = true;
            items[i].attestationLength =
              gotAttestations.data.data.accountAttestationIndex.edges.length;
          } else {
            items[i].verified = false;
          }
          list.push(items[i]);
        }
        return list;
      };

      const newData = await applyVerified(data);
      return newData;
    }
  };

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: ['posts', { category }],
    queryFn: ({ pageParam }) =>
      getPosts(
        category === 'all' ? (global as any).orbis_context : category,
        true,
        pageParam
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      return undefined;
    } /* lastPage.nextCursor */,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => undefined /* firstPage.prevCursor */,
  });
  const posts = data?.pages?.flatMap((page) => page) || [];

  const createPost = async (options: CreatePostOptions) => {
    const res = await orbis.createPost(options);
    return res;
  };

  const createPostMutation = useMutation({
    mutationKey: ['create-post'],
    mutationFn: createPost,
    onSuccess: (res) => {
      if (res.status === 200 && res.doc) {
        router.push(`/posts/${res.doc}`);
      }
    },
  });

  return { posts, isLoading, getPosts, createPostMutation };
};

export default usePosts;
