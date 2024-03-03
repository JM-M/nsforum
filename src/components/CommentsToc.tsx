type Props = { title: string; commenters: string[] };
const CommentsToc = ({ title = '', commenters }: Props) => {
  return (
    <div className="hidden md:block min-w-60 max-w-64">
      <div className="sticky top-3">
        <div className="mb-5">
          <div className="uppercase font-medium font-serif">{title}</div>
        </div>
        <ul className="text-sm">
          {commenters.map((commenter, i) => {
            return (
              <li
                key={i}
                // key={heading.id}
                // className={getClassName(heading.level)}
              >
                <span className="block py-1">{commenter}</span>
                {/* <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${heading.id}`)!.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                className={clsx('block py-1', {
                  'text-blue-500': heading.id === activeId,
                })}
              >
                {heading.text}
              </a> */}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
export default CommentsToc;
