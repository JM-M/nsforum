import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Loader2, Plus, X } from 'lucide-react';

import { PostTag } from '@/types/post';
import useTags from '@/hooks/useTags';

type Props = {
  postTags: PostTag[];
  setPostTags: Dispatch<SetStateAction<PostTag[]>>;
};
const PostTagsMultiSelect = ({ postTags, setPostTags }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { tags = [], isLoading, createTagMutation } = useTags();

  const filteredTags = useMemo(() => {
    if (!tags?.length) return [];
    return tags
      .filter((tag) =>
        tag?.content?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!a || !b) return 0;
        const valueA = a?.content?.name?.toLowerCase();
        const valueB = b?.content?.name?.toLowerCase();

        if (valueA < valueB) {
          return -1;
        } else if (valueA > valueB) {
          return 1;
        } else {
          return 0;
        }
      });
  }, [tags, searchTerm]);

  if (isLoading) return null;

  const addToPostTags = (postTag: PostTag) => {
    const postHasTag = !!postTags.find(
      (_postTag) => _postTag?.slug === postTag.slug
    );
    if (!postHasTag) {
      setPostTags((v = []) => [...v, postTag]);
      setSearchTerm('');
    }
  };
  const addNewTag = async () => {
    const res = await createTagMutation.mutateAsync(searchTerm);
    if (res.status === 200 && res.stream) {
      addToPostTags({ title: searchTerm.toLowerCase(), slug: res.stream });
      setSearchTerm('');
    }
  };
  const removePostTag = (slug: string) => {
    setPostTags((v) => v.filter((postTag) => postTag?.slug !== slug));
  };
  return (
    <div className="p-2 text-sm rounded-md border border-neutral-300">
      {!!postTags?.length && (
        <ul className="flex gap-2 flex-wrap mb-2">
          {postTags.map(({ slug, title }) => (
            <li
              key={slug}
              className="inline-flex gap-2 items-center px-2 py-1 text-sm capitalize rounded-md border border-neutral-300"
            >
              <span>{title}</span>
              <X
                strokeWidth={1.4}
                size={16}
                onClick={() => removePostTag(slug)}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="flex justify-between items-center">
        <div className="dropdown w-80">
          <input
            type="text"
            placeholder="Add Tags"
            className="input w-full min-h-10 h-10 text-sm focus:border-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {!!searchTerm && (
            <ul
              tabIndex={0}
              className={clsx(
                'dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 capitalize',
                {
                  hidden: !filteredTags?.length,
                }
              )}
            >
              {!!tags?.length ? (
                filteredTags.map((tag) => {
                  const name = tag?.content?.name;
                  const stream_id = tag?.stream_id;
                  return (
                    <li
                      key={stream_id}
                      onClick={() =>
                        addToPostTags({ title: name, slug: stream_id })
                      }
                    >
                      <span>{name}</span>
                    </li>
                  );
                })
              ) : (
                <li>
                  <span className="text-neutral-500">No tags added yet</span>
                </li>
              )}
            </ul>
          )}
        </div>
        <button
          className="btn btn-sm flex gap-2 items-center"
          onClick={() => addNewTag()}
          disabled={createTagMutation.isPending}
        >
          {createTagMutation.isPending ? (
            <Loader2 strokeWidth={1.4} size={16} className="animate-spin" />
          ) : (
            <Plus strokeWidth={1.4} size={16} />
          )}
          Add New Tag
        </button>
      </div>
    </div>
  );
};
export default PostTagsMultiSelect;
