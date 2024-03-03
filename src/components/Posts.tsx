'use client';

import usePosts from '../hooks/usePosts';
import Post from './Post';

const Posts = () => {
  const { posts = [], isLoading } = usePosts();

  return (
    <div className="py-5 max-w-screen-md mx-auto">
      {!isLoading &&
        posts.map((post, index) => {
          return (
            <div key={index} className="mb-2">
              <Post post={post} />
            </div>
          );
        })}
    </div>
  );
};
export default Posts;
