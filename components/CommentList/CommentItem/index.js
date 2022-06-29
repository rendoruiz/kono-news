import clsx from "clsx";
import { useState } from "react";
import CommentList from "..";

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
          [-]
        </button>
        &nbsp;
        {id} | {author}
      </header>

      <main dangerouslySetInnerHTML={{ __html: text }} />

      {children && (
        <CommentList commentListData={children} />
      )}
    </li>
  );
}
 
export default CommentItem;