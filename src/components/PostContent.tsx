'use client';

import { useRef } from 'react';
/** For Markdown support */
import parse from 'html-react-parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { PostTag } from '@/types/post';
import usePost from '@/hooks/usePost';

import PostActions from './PostActions';
import PostToc from './PostToc';

type Props = { post_id: string; post: any };
const PostContent = ({ post_id, post: _post }: Props) => {
  const articleRef = useRef<HTMLElement | null>(null);

  const { post } = usePost({ post_id, initialData: _post });

  /** Will replace classic code <pre> support with a more advanced integration */
  const replacePreWithSyntaxHighlighter = (node: any) => {
    if (node.type === 'tag' && node.name === 'pre') {
      const codeNode = node.children.find(
        (child: any) => child.name === 'code'
      );
      const language = codeNode.attribs.class?.split('-')[1] || ''; // Assumes a format like "language-js"

      return (
        <SyntaxHighlighter language="javascript" style={{}}>
          {codeNode.children[0].data}
        </SyntaxHighlighter>
      );
    }
  };

  const title = post?.content?.title || '';
  const markdownContent = post?.content?.body || '';

  const file = unified()
    .use(remarkParse)
    .use(remarkHtml)
    .processSync(markdownContent);
  const htmlContent = String(file);

  const reactComponent = parse(htmlContent, {
    replace: replacePreWithSyntaxHighlighter,
  });
  const tags = post?.content?.tags;

  return (
    <div className="relative flex gap-3">
      <PostToc articleRef={articleRef} title={title} />
      <div className="prose text-foreground w-full max-w-screen-sm mx-auto">
        <PostActions post_id={post_id} />
        <h1 className="font-serif text-foreground">{title}</h1>
        <article ref={articleRef}>{reactComponent}</article>
        {!!tags?.length && (
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag: PostTag) => {
              const { slug, title } = tag;
              return (
                <span
                  key={slug}
                  className="capitalize inline-block px-2 py-1 text-xs border border-neutral-300 rounded-md"
                >
                  {title}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default PostContent;
