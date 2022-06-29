import CommentItem from "./CommentItem";

const CommentList = ({ commentListData }) => {
  return ( 
    <ul>
      {commentListData.map((commentItemData, index) => 
        <CommentItem 
          key={`${id}-${index}`}
          commentItemData={commentItemData} 
        />
        )}
    </ul>
   );
}
 
export default CommentList;