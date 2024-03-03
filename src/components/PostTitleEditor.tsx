'use client';

import autosize from 'autosize';

type Props = { setTitle: Function };
const PostTitleEditor = ({ setTitle }: Props) => {
  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      autosize(event.target);
    }
  };
  return (
    <textarea
      rows={1}
      className="textarea text-4xl font-extrabold min-h-14 w-full focus:border-0 rounded-lg"
      placeholder="Post title"
      onKeyDown={(e) => handleKeyDown(e)}
      onChange={(e) => setTitle(e.target.value)}
    />
  );
};
export default PostTitleEditor;
