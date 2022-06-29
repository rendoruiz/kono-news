import CommentList from "..";

const CommentItem = ({ 
  id,
  author,
  text,
  children,
}) => {
  return (  
    <li>
      <header>
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