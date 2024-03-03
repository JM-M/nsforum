import { ChevronDown, ChevronUp } from 'lucide-react';

type Props = {};
const PostUpvotes = (props: Props) => {
  return (
    <div className="h-60 w-full max-w-screen-sm md:ml-auto flex items-center justify-center">
      <div className="flex flex-col items-center">
        <ChevronUp size={30} />
        <span>30</span>
        <ChevronDown size={30} />
      </div>
    </div>
  );
};
export default PostUpvotes;
