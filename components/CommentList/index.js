import CommentItem from "./CommentItem";

const CommentList = ({ commentListData }) => {
  return ( 
    <ul>
      {commentListData.map((commentItemData) => 
        <CommentItem commentItemData={commentItemData} />)}
    </ul>
   );
}
 
export default CommentList;