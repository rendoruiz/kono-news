import Link from 'next/link'
import { useState } from "react";
import clsx from "clsx";

import CommentList from "..";
import { sanitizeHtmlLinks } from '../../../utils';

const CommentItem = ({ 
  id,
  author,
  text,
  children,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const handleToggleHideComment = (e) => {
    e.preventDefault();
    setIsHidden(!isHidden);
  }

  return (  
    <li className={clsx({'hidden-comment': isHidden})}>
      <header>
        <button
          type='button'
          onClick={handleToggleHideComment}
        >
          {isHidden ? "+" : "-"}
        </button>
        <span>&nbsp;&nbsp;{id} | </span>
        <Link href={'/user/' + author}>
          <a>{author}</a>
        </Link>
      </header>

      {text && (
        <main dangerouslySetInnerHTML={{ __html: sanitizeHtmlLinks(text) }} />
      )}

      {children && (
        <CommentList commentListData={children} />
      )}
    </li>
  );
}
 
export default CommentItem;