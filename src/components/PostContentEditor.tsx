import { PlateEditor } from './plate-editor';

type Props = { setContent: Function };
const PostContentEditor = ({ setContent }: Props) => {
  return (
    <div>
      <PlateEditor
        editorClassName="focus:!ring-0 focus-visible:!ring-0 focus:border-2 focus:border-neutral-300"
        handleChange={setContent as (value: any[]) => void}
        placeholder="Post content goes here!"
      />
    </div>
  );
};
export default PostContentEditor;
