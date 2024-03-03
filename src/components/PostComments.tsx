'use client';

import { useState } from 'react';
import { useOrbis } from '@orbisclub/components';
import clsx from 'clsx';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

import usePostComments from '@/hooks/usePostComments';

import { closeModal, openModal } from '../../utils';
import CommentsToc from './CommentsToc';
import CreateComment from './CreateComment';
import EditComment from './EditComment';
import Modal from './Modal';

type CommentDeleteModalProps = { stream_id: string; post_id: string };
const CommentDeleteModal = ({
  stream_id,
  post_id,
}: CommentDeleteModalProps) => {
  const { deletePostCommentMutation } = usePostComments({ post_id });
  const modalId = `delete-comment-modal-${stream_id}`;
  const deletePostComment = async () => {
    await deletePostCommentMutation.mutateAsync(stream_id);
    closeModal(modalId);
  };

  return (
    <Modal id={modalId}>
      <p className="font-medium text-lg">
        Are you sure you want to delete this comment?
      </p>
      <div className="mt-5 flex justify-end items-center">
        <button
          className="btn btn-neutral"
          onClick={deletePostComment}
          disabled={deletePostCommentMutation.isPending}
        >
          {deletePostCommentMutation.isPending && (
            <span className="loading loading-spinner w-5"></span>
          )}
          Delete
        </button>
      </div>
    </Modal>
  );
};

type CommentActionsProps = { edit: Function; stream_id: string };
const CommentActions = ({ edit, stream_id }: CommentActionsProps) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button">
        <MoreVertical
          strokeWidth={1.4}
          size={16}
          className="text-neutral-400 hover:text-neutral-900"
        />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-l-md w-32"
      >
        <li>
          <span
            className="w-full flex gap-3 items-center"
            onClick={() => edit()}
          >
            <Pencil strokeWidth={1.4} size={16} />
            <span>Edit</span>
          </span>
        </li>
        <li>
          <span
            className="w-full flex gap-3 items-center"
            onClick={() => openModal(`delete-comment-modal-${stream_id}`)}
          >
            <Trash2 strokeWidth={1.4} size={16} />
            <span>Delete</span>
          </span>
        </li>
      </ul>
    </div>
  );
};

type CommentProps = {
  comment: {
    content: { body: string };
    stream_id: string;
    creator_details: any;
  };
  post_id: string;
  level?: number;
};
const Comment = ({ comment, post_id, level = 0 }: CommentProps) => {
  const { user } = useOrbis();
  const [showReplyEditor, setShowReplyEditor] = useState<boolean>();
  const [showCommentEditor, setShowCommentEditor] = useState<boolean>(false);
  const { content, creator_details, stream_id } = comment || {};

  return (
    <div>
      <CommentDeleteModal stream_id={stream_id} post_id={post_id} />
      {showCommentEditor ? (
        <EditComment
          post_id={post_id}
          level={level}
          comment_id={stream_id}
          content={content}
          close={() => setShowCommentEditor(false)}
        />
      ) : (
        <>
          <div className="mb-2 flex justify-between">
            <span className="font-medium">
              {creator_details?.profile?.username || ''}
            </span>
            {user?.did && user?.did === creator_details?.did && (
              <CommentActions
                edit={() => setShowCommentEditor(true)}
                stream_id={stream_id}
              />
            )}
          </div>
          <div className="prose text-foreground leading-5 text-sm">
            {content?.body || ''}
          </div>
        </>
      )}
      <div className="mt-1 pr-2">
        {showReplyEditor ? (
          <CreateComment
            post_id={post_id}
            reply_to={stream_id}
            close={() => setShowReplyEditor(false)}
            level={level + 1}
          />
        ) : (
          <button
            className="btn btn-xs flex items-center gap-2 ml-auto rounded-md"
            onClick={() => setShowReplyEditor(true)}
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
};

type CommentsProps = {
  comments: any[];
  post_id: string;
  reply_to?: string;
  level?: number;
};
const Comments = ({
  comments: _comments,
  post_id,
  reply_to,
  level = 0,
}: CommentsProps) => {
  const comments = _comments.filter((_comment) => {
    if (!reply_to) return !_comment.reply_to;
    return _comment.reply_to === reply_to;
  });
  return (
    <ul className={clsx({ 'mt-3': !!comments.length })}>
      {!!comments.length &&
        comments.map((comment, i) => {
          return (
            <li key={i} className="mb-5 last:mb-0">
              <div
                className={clsx(
                  'p-2 pr-0 text-sm border border-neutral-300 rounded-md',
                  {
                    'bg-neutral-100': level % 2 === 1,
                    'bg-white': level % 2 === 0,
                    'border-r-0 rounded-r-none': level,
                  }
                )}
              >
                <div>
                  <Comment comment={comment} post_id={post_id} level={level} />
                </div>
                <Comments
                  post_id={post_id}
                  comments={_comments}
                  reply_to={comment.stream_id}
                  level={level + 1}
                />
              </div>
            </li>
          );
        })}
    </ul>
  );
};

type Props = { post_id: string; comments: any[]; title: string };
const PostComments = ({ post_id, comments: _comments = [], title }: Props) => {
  const { postComments, isLoading } = usePostComments({
    post_id,
    initialData: _comments,
  });
  if (isLoading) return null;
  const commenters = postComments.map(
    (comment: any) => comment?.creator_details?.profile?.username
  );

  return (
    <div className="relative flex gap-3">
      <CommentsToc title={title} commenters={commenters} />
      <div className="w-full max-w-screen-sm mx-auto">
        <h2 className="font-serif font-medium text-lg">Comments</h2>
        <div className="mb-8">
          <CreateComment post_id={post_id} />
        </div>
        <Comments post_id={post_id} comments={postComments} />
      </div>
    </div>
  );
};
export default PostComments;
