import { useOrbis } from '@orbisclub/components';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import cloneDeep from 'lodash/cloneDeep';

import { CreatePostCommentOptions, EditPostCommentOptions } from '@/types/post';

type Props = {
  post_id?: string;
  initialData?: any[];
};

const usePostComments = (props?: Props) => {
  const { post_id, initialData } = props || {};
  const { orbis, user } = useOrbis();

  const queryClient = useQueryClient();

  // Posts
  /** Load list of posts using the Orbis SDK */
  const getPostComments = async (page: number) => {
    if (!post_id) return null;
    let res = await orbis.getPosts({ master: post_id }, page);
    if (res.status === 200 && !res.error) {
      return res.data;
    } else {
      throw new Error(res.error || 'An error occured while fetching comments');
    }
  };

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    data,
  } = useInfiniteQuery({
    queryKey: ['post-comments', { post_id }],
    queryFn: ({ pageParam }) => getPostComments(pageParam),
    initialPageParam: 1, // Start from page 1, page 0 is fetched during SSG or SSR
    initialData: initialData
      ? { pageParams: [0], pages: [initialData] }
      : undefined,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      return undefined;
    } /* lastPage.nextCursor */,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => undefined /* firstPage.prevCursor */,
  });

  const postComments = data?.pages?.flatMap((page) => page) || [];

  const createPostComment = async (options: CreatePostCommentOptions) => {
    const res = await orbis.createPost(options);
    if (res.status === 200 && !res.error) {
      // return post for optimistic update
      const { body, master, reply_to } = options;
      return {
        stream_id: res.doc,
        content: { body, master },
        creator_details: { profile: user.profile },
        reply_to,
      };
    } else {
      throw new Error(res.error || 'An error occured while creating comments');
    }
  };

  const createPostCommentMutation = useMutation({
    mutationKey: ['create-post-comment'],
    mutationFn: createPostComment,
    onSuccess: (newPostComment) => {
      queryClient.setQueryData(['post-comments', { post_id }], (data: any) => {
        let newData;
        if (data?.pages?.length) {
          const [firstPage, ...otherPages] = data.pages;
          newData = {
            pages: [[newPostComment, ...firstPage], ...otherPages],
            pageParams: data.pageParams,
          };
        } else {
          newData = { pages: [newPostComment], pageParams: [0] };
        }
        return cloneDeep(newData);
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['post-comments', { post_id }],
        });
      }, 2000); // it takes a bit for the posts to be saved.
    },
  });

  const editPostComment = async (options: EditPostCommentOptions) => {
    const { post_id, ...content } = options;
    const res = await orbis.editPost(post_id, content);
    if (res.status === 200 && !res.error) {
      // return post for optimistic update
      const { body } = options;
      return {
        stream_id: res.doc,
        content: { body },
      };
    } else {
      throw new Error(res.error || 'An error occured while editing comments');
    }
  };

  const editPostCommentMutation = useMutation({
    mutationKey: ['edit-post-comment'],
    mutationFn: editPostComment,
    onSuccess: (newPostComment) => {
      queryClient.setQueryData(['post-comments', { post_id }], (data: any) => {
        let newData;
        if (data?.pages?.length) {
          const pages: [][] = [];
          let updatedComment: boolean = false;
          for (let i = 0; i < data.pages.length; i++) {
            const page = data.pages[i];
            if (updatedComment) {
              pages.push(page);
            } else {
              pages.push(
                page.map((comment: any) => {
                  if (comment.stream_id === newPostComment.stream_id) {
                    updatedComment = true;
                    return {
                      ...comment,
                      content: {
                        ...comment.body,
                        body: newPostComment.content.body,
                      },
                    };
                  }
                  return comment;
                })
              );
            }
          }
          newData = {
            pages,
            pageParams: data.pageParams,
          };
        }
        return cloneDeep(newData);
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['post-comments', { post_id }],
        });
      }, 2000); // it takes a bit for the posts to be saved.
    },
  });

  const deletePostComment = async (stream_id: string) => {
    const res = await orbis.deletePost(stream_id);
    if (res.status === 200 && !res.error) {
      // For optimistic update
      return res.doc;
    } else {
      throw new Error(res.error || 'An error occured while deleting comment');
    }
  };

  const deletePostCommentMutation = useMutation({
    mutationKey: ['delete-comment'],
    mutationFn: deletePostComment,
    onSuccess: (stream_id) => {
      queryClient.setQueryData(['post-comments', { post_id }], (data: any) => {
        let newData;
        if (data?.pages?.length) {
          const pages: [][] = [];
          let deletedComment: boolean = false;
          for (let i = 0; i < data.pages.length; i++) {
            const page = data.pages[i];
            if (deletedComment) {
              pages.push(page);
            } else {
              pages.push(
                page.filter((comment: any) => {
                  const match = comment.stream_id === stream_id;
                  if (match) {
                    deletedComment = true;
                  }
                  return !match;
                })
              );
            }
          }
          newData = {
            pages,
            pageParams: data.pageParams,
          };
        }
        return cloneDeep(newData);
      });
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['post-comments', { post_id }],
        });
      }, 2000); // it takes a bit for the posts to be saved.
    },
  });

  return {
    postComments,
    isLoading,
    // getPostComments,
    createPostCommentMutation,
    editPostCommentMutation,
    deletePostCommentMutation,
  };
};

export default usePostComments;
