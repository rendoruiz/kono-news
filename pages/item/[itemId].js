const ItemPage = ({ initialData }) => {
  return (  
    <div>{JSON.stringify(initialData)}</div>
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