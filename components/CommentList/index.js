import CommentItem from "./CommentItem";

const CommentList = ({ commentListData }) => {
  return ( 
    <ul>
      {commentListData.map((commentItemData, index) => 
        <CommentItem 
          key={`${commentItemData.id}-${index}`}
          {...commentItemData}
        />
        )}
    </ul>
   );
}
 
export default CommentList;