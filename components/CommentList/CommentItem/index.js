import CommentList from "..";

const CommentItem = ({ commentItemData }) => {
  return (  
    <li>
      <div dangerouslySetInnerHTML={{ __html: commentItemData.text }} />
      {commentItemData.children && (
        <CommentList commentListData={commentItemData.children} />
      )}
    </li>
  );
}
 
export default CommentItem;