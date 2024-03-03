import { useRouter } from 'next/navigation';
import { useOrbis } from '@orbisclub/components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Props = { post_id: string; initialData?: any };
const usePost = ({ post_id, initialData }: Props) => {
  const { orbis, user } = useOrbis();

  const router = useRouter();

  const queryClient = useQueryClient();

  const getPost = async () => {
    const res = await orbis.getPost(post_id);
    if (res.status === 200 && !res.error) {
      // return post for optimistic update
      return res.data;
    } else {
      throw new Error(res.error || 'An error occured while creating comments');
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ['get-post', { post_id }],
    queryFn: getPost,
    initialData,
  });

  const getLastReaction = async () => {
    if (!user?.did) return null;
    const res = await orbis.getReaction(post_id, user.did);
    if (res.status === 200 && !res.error) {
      return res.data?.type || null;
    } else {
      throw new Error(res.error || 'An error occured while creating comments');
    }
  };

  const lastReactionQuery = useQuery({
    queryKey: ['last-reaction', { post_id, did: user?.did }],
    queryFn: getLastReaction,
    staleTime: Infinity,
  });

  const reactToPost = async (reaction: 'like' | 'downvote') => {
    if (reaction === lastReactionQuery.data) return;
    let res = await orbis.react(post_id, reaction);
    if (res.status === 200 && !res.error) {
      return reaction;
    } else {
      throw new Error(res.error || 'An error occured while creating comments');
    }
  };

  const reactToPostMutation = useMutation({
    mutationKey: ['like-post', { post_id }],
    mutationFn: reactToPost,
    onSuccess: (reaction) => {
      if (data) {
        queryClient.setQueryData(['get-post', { post_id }], () => {
          const lastReaction = lastReactionQuery.data;
          const newData = data;
          if (reaction === 'like') {
            if (lastReaction === 'downvote' && data.count_downvotes > 0) {
              newData.count_downvotes = data.count_downvotes - 1;
            }
            newData.count_likes = data.count_likes + 1;
          }
          if (reaction === 'downvote') {
            if (lastReaction === 'like' && data.count_likes > 0) {
              newData.count_likes = data.count_likes - 1;
            }
            newData.count_downvotes = data.count_downvotes + 1;
          }
          return newData;
        });
      }
      queryClient.setQueryData(
        ['last-reaction', { post_id, did: user?.did }],
        reaction
      );
    },
  });

  const deletePost = async (post_id: string) => {
    const res = await orbis.deletePost(post_id);
    if (res.status === 200 && !res.error) {
      // For optimistic update
      return res.doc;
    } else {
      throw new Error(res.error || 'An error occured while deleting post');
    }
  };

  const deletePostMutation = useMutation({
    mutationKey: ['delete-post'],
    mutationFn: deletePost,
    onSuccess: () => {
      router.push('/');
    },
  });

  return { post: data, isLoading, reactToPostMutation, deletePostMutation };
};

export default usePost;
