'use client';

import { useEffect, useRef, useState } from 'react';
import { PlateEditor as PlateEditorType } from '@udecode/plate-common';
import { deserializeMd } from '@udecode/plate-serializer-md';
import clsx from 'clsx';
import { serialize } from 'remark-slate';

import { EditPostCommentOptions } from '@/types/post';
import usePostComments from '@/hooks/usePostComments';

import { PlateEditor } from './plate-editor';
import { plateNodeTypes } from './plate-node-types';

type Props = {
  post_id: string;
  comment_id: string;
  level?: number;
  content: { body: string };
  close: Function;
};
const EditComment = ({
  post_id,
  comment_id,
  level = 0,
  content,
  close,
}: Props) => {
  const [commentSlate, setCommentSlate] = useState<any[]>([]); // comments in slatejs editor format
  const [editor, setEditor] = useState<PlateEditorType<any[]> | undefined>();

  useEffect(() => {
    if (!editor || !content.body) return;
    editor.children = deserializeMd(editor, content.body);
  }, [editor, content.body]);

  const { editPostCommentMutation } = usePostComments({ post_id });

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
    const editCommentOptions: EditPostCommentOptions = {
      body: commentMarkdown,
      post_id: comment_id,
    };

    await editPostCommentMutation.mutateAsync(editCommentOptions);
    clearEditor();
    if (close) close();
  };

  return (
    <div
      className={clsx('rounded-md border border-neutral-300 p-3', {
        'bg-neutral-100': level % 2 === 1,
        'bg-white': level % 2 === 0,
      })}
    >
      <PlateEditor
        editorClassName="bg-transparent border-0 focus:!ring-0 focus-visible:!ring-0 focus:border-2 focus:border-neutral-300"
        handleChange={handleChange}
        getEditor={(editor) => {
          setEditor(editor);
        }}
        placeholder="Comment goes here!"
        fixedToolbar={false}
      />
      <div className="mt-2 flex gap-3 items-center justify-end">
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
          disabled={editPostCommentMutation.isPending}
        >
          {editPostCommentMutation.isPending && (
            <span className="loading loading-spinner w-5"></span>
          )}
          SUBMIT
        </button>
      </div>
    </div>
  );
};
export default EditComment;
