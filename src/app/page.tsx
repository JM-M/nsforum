'use client';

import usePosts from '@/hooks/usePosts';
import Posts from '@/components/Posts';

export default function IndexPage() {
  const { posts } = usePosts();
  return (
    <div>
      <Posts />
    </div>
  );
}
