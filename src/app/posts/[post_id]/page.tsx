'use server';

import { Orbis } from '@orbisclub/orbis-sdk';

import PostComments from '@/components/PostComments';
import PostContent from '@/components/PostContent';
import PostUpvotes from '@/components/PostUpvotes';

type Props = { params: { post_id: string } };
const page = async ({ params: { post_id } }: Props) => {
  let orbis_server = new Orbis({
    useLit: true,
  });
  const postResponse = await orbis_server.getPost(post_id);
  const post = postResponse.data;
  const commentsResponse =
    postResponse.data?.stream_id &&
    (await orbis_server.getPosts({
      master: postResponse.data.stream_id,
    }));
  const comments = commentsResponse?.data;

  return (
    <div>
      <PostContent post_id={post_id} post={post} />
      <PostUpvotes />
      <PostComments
        post_id={post_id}
        comments={comments}
        title={post?.content?.title || ''}
      />
    </div>
  );
};
export default page;
