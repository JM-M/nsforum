export type PostTag = { slug: string; title: string };
export type PostCategory = { stream_id: string; name: string };
export type CreatePostOptions = {
  title: string;
  body: string;
  tags: PostTag[];
  context: string;
};
export type CreatePostCommentOptions = {
  body: string;
  master?: string;
  reply_to?: string;
};

export type EditPostCommentOptions = {
  post_id: string;
  body: string;
};
