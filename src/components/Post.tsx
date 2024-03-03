import Link from 'next/link';
import {
  MessageSquareMore,
  MoreHorizontal,
  MoreVertical,
  MoreVerticalIcon,
} from 'lucide-react';

type Props = { post: any };
const Post = ({ post = {} }: Props) => {
  const { content = {}, stream_id } = post;
  const { title } = content;
  return (
    <Link
      href={`/posts/${stream_id}`}
      className="p-2 pl-3 rounded-lg bg-white flex justify-between"
    >
      <div>
        <div className="font-serif text-lg font-medium h-8">{title}</div>
        <div className="text-xs text-neutral-500 flex items-center gap-2">
          <span>20</span>
          <span>JMMichael</span>
          <span>15h</span>
        </div>
      </div>
      <div className="my-auto">
        <div className="flex gap-1 items-center">
          <span className="inline-block relative">
            <MessageSquareMore
              fill="#bbb"
              stroke="0"
              size={28}
              className="relative top-[2px] scale-x-[-1]"
            />
            <span className="text-white text-[10px] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
              56
            </span>
          </span>
          <MoreVerticalIcon className="w-6 text-neutral-400" />
        </div>
      </div>
    </Link>
  );
};
export default Post;
