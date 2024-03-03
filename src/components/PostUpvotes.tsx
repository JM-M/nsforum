'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';

import usePost from '@/hooks/usePost';

type Props = { post_id: string };
const PostUpvotes = ({ post_id }: Props) => {
  const { reactToPostMutation, post } = usePost({ post_id });

  const upVote = () => {
    reactToPostMutation.mutate('like');
  };

  const downVote = () => {
    reactToPostMutation.mutate('downvote');
  };

  if (isNaN(post.count_likes)) return null;
  return (
    <div className="h-60 w-full max-w-screen-sm md:ml-auto flex items-center justify-center">
      <div className="flex flex-col items-center">
        <ChevronUp
          size={30}
          className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
          onClick={() => upVote()}
        />
        <span>{post.count_likes}</span>
        <ChevronDown
          size={30}
          className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
          onClick={() => downVote()}
        />
      </div>
    </div>
  );
};
export default PostUpvotes;
