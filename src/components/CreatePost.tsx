'use client';

import { useState } from 'react';
import { serialize } from 'remark-slate';

import { CreatePostOptions, PostCategory, PostTag } from '@/types/post';
import usePosts from '@/hooks/usePosts';

import CategorySelect from './CategorySelect';
import { plateNodeTypes } from './plate-node-types';
import PostContentEditor from './PostContentEditor';
import PostTagsMultiSelect from './PostTagsMultiSelect';
import PostTitleEditor from './PostTitleEditor';

type Props = {};
const CreatePost = (props: Props) => {
  const [title, setTitle] = useState<string>();
  const [contentSlate, setContentSlate] = useState<any[]>();
  const [postTags, setPostTags] = useState<PostTag[]>([]);
  const [postCategory, setPostCategory] = useState<PostCategory>();

  const { createPostMutation } = usePosts();

  const handleSubmit = () => {
    const contentMarkdown = contentSlate
      ?.map((v) => serialize(v, { nodeTypes: plateNodeTypes as any }))
      .join('');
    const options: CreatePostOptions = {
      title: title!,
      body: contentMarkdown!,
      tags: postTags,
      context: postCategory?.stream_id!,
    };
    createPostMutation.mutate(options);
  };

  return (
    <div className="max-w-screen-sm mx-auto">
      <PostTitleEditor setTitle={setTitle} />
      <PostContentEditor setContent={setContentSlate} />
      <div className="flex flex-col gap-3 mt-10">
        <CategorySelect
          postCategory={postCategory}
          setPostCategory={setPostCategory}
        />
        <PostTagsMultiSelect postTags={postTags} setPostTags={setPostTags} />
      </div>
      <div className="mt-10">
        <button
          className="flex items-center btn btn-neutral w-fit ml-auto"
          onClick={handleSubmit}
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending && (
            <span className="loading loading-spinner w-5"></span>
          )}
          SUBMIT
        </button>
      </div>
    </div>
  );
};
export default CreatePost;
