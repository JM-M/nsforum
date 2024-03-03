'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import { serialize } from 'remark-slate';

import { CreatePostCommentOptions } from '@/types/post';
import usePostComments from '@/hooks/usePostComments';

import { PlateEditor } from './plate-editor';
import { plateNodeTypes } from './plate-node-types';

type Props = {
  post_id: string;
  reply_to?: string;
  close?: Function;
  level?: number;
};
const CreateComment = ({ post_id, reply_to, close, level = 0 }: Props) => {
  const [commentSlate, setCommentSlate] = useState<any[]>([]); // comments in slatejs editor format

  const editorRef = useRef<{ children: any[] } | undefined>();
  const editor = editorRef.current;

  const { createPostCommentMutation } = usePostComments({ post_id });

  const clearEditor = () => {
    if (!editor) return;
    editor.children = [
      {
        id: '1',
        type: 'p',
        children: [{ text: '' }],
      },
    ];
  };

  const handleChange = (commentSlate: any) => {
    setCommentSlate(commentSlate);
  };

  const handleSubmit = async () => {
    const commentMarkdown = commentSlate
      ?.map((v) => serialize(v, { nodeTypes: plateNodeTypes as any }))
      .join('');
    const createCommentOptions: CreatePostCommentOptions = {
      body: commentMarkdown,
      master: post_id,
    };
    if (reply_to) createCommentOptions.reply_to = reply_to;

    await createPostCommentMutation.mutateAsync(createCommentOptions);
    clearEditor();
    if (close) close();
  };

  return (
    <div
      className={clsx('rounded-md border border-neutral-300', {
        'bg-neutral-100': level % 2 === 1,
        'bg-white': level % 2 === 0,
      })}
    >
      <PlateEditor
        editorClassName="bg-transparent border-0 focus:!ring-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 focus:border-2 focus:border-transparent"
        handleChange={handleChange}
        getEditor={(editor) => {
          editorRef.current = editor;
        }}
        placeholder="Comment goes here!"
        fixedToolbar={false}
      />
      <div className="mt-2 p-3 pt-0 flex gap-3 items-center justify-end">
        {close && (
          <button
            className="flex items-center btn btn-sm w-fit"
            onClick={() => close()}
          >
            CANCEL
          </button>
        )}
        <button
          className="flex items-center btn btn-sm btn-neutral w-fit"
          onClick={handleSubmit}
          disabled={createPostCommentMutation.isPending}
        >
          {createPostCommentMutation.isPending && (
            <span className="loading loading-spinner w-5"></span>
          )}
          SUBMIT
        </button>
      </div>
    </div>
  );
};
export default CreateComment;
