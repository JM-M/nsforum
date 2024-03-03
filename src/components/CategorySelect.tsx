'use client';

import { Dispatch, SetStateAction } from 'react';

import { PostCategory } from '@/types/post';
import useCategories from '@/hooks/useCategories';

type Props = {
  postCategory: PostCategory | undefined;
  setPostCategory: Dispatch<SetStateAction<PostCategory | undefined>>;
};
const CategorySelect = ({ setPostCategory }: Props) => {
  const { categories = [], isLoading } = useCategories();
  if (isLoading) return null;

  const handleChange = (stream_id: string) => {
    const name = categories.find(
      (category) => category?.stream_id === stream_id
    )?.content?.name;
    if (name) setPostCategory({ name, stream_id });
  };

  return (
    <select
      className="text-sm select select-bordered rounded-md w-full min-h-10 h-10"
      id="category"
      onChange={(e) => handleChange(e.target.value)}
    >
      {!!categories?.length &&
        categories.map((category: any) => {
          const {
            stream_id,
            content: { name },
          } = category;
          return (
            <option key={stream_id} value={stream_id}>
              {name}
            </option>
          );
        })}
    </select>
  );
};
export default CategorySelect;
