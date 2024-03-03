'use client';

import { useOrbis } from '@orbisclub/components';
import { Pencil, Trash2 } from 'lucide-react';

import usePost from '@/hooks/usePost';

import { closeModal, openModal } from '../../utils';
import Modal from './Modal';

type PostDeleteModalProps = { post_id: string; modalId: string };
const PostDeleteModal = ({ post_id, modalId }: PostDeleteModalProps) => {
  const { deletePostMutation } = usePost({ post_id });

  const deletePost = async () => {
    await deletePostMutation.mutateAsync(post_id);
    closeModal(modalId);
  };

  return (
    <Modal id={modalId}>
      <p className="font-medium text-lg">
        Are you sure you want to delete this post?
      </p>
      <div className="mt-5 flex justify-end items-center">
        <button
          className="btn btn-neutral"
          onClick={deletePost}
          disabled={deletePostMutation.isPending}
        >
          {deletePostMutation.isPending && (
            <span className="loading loading-spinner w-5"></span>
          )}
          Delete
        </button>
      </div>
    </Modal>
  );
};

type Props = { post_id: string };
const PostActions = ({ post_id }: Props) => {
  const { user } = useOrbis();
  const { post, isLoading } = usePost({ post_id });
  if (isLoading || post?.creator_details?.did !== user?.did) return null;
  const deleteModalId = `delete-post-modal-${post_id}`;
  return (
    <div className="mb-3 flex gap-3 justify-end">
      <PostDeleteModal post_id={post_id} modalId={deleteModalId} />
      <button className="btn btn-sm">
        <Pencil strokeWidth={1.4} size={16} />
        Edit
      </button>
      <button className="btn btn-sm" onClick={() => openModal(deleteModalId)}>
        <Trash2 strokeWidth={1.4} size={16} />
        Delete
      </button>
    </div>
  );
};
export default PostActions;
