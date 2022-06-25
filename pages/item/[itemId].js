import CommentList from "../../components/CommentList";
import ItemHeading from "../../components/ItemHeading";

const ItemPage = ({ initialData }) => {
  return (  
    <>
      <ItemHeading>
        <section>
          <h2>{initialData.title}</h2>
          {initialData.text && (
            <div dangerouslySetInnerHTML={{ __html: initialData.text }} />
          )}
        </section>
      </ItemHeading>
      
      {initialData.children && (
        <CommentList commentListData={initialData.children} />
      )}
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const itemId = params.itemId;
  const res = await fetch(`https://hn.algolia.com/api/v1/items/${itemId}`);
  const initialData = await res.json();
  return {
    props: { initialData }
  }
}
 
export default ItemPage;