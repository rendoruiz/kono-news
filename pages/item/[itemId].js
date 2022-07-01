import Link from 'next/link'

import CommentList from "../../components/CommentList";
import ItemHeading from "../../components/ItemHeading";
import { getCommentData } from "../../utils/hnComments";

const ItemPage = ({ 
  id,
  type: storyType,
  author,
  title,
  url,
  text,
  points,
  children,
}) => {
  return (  
    <>
      <ItemHeading>
        <section>
          <h2>{title}</h2>
          <p>
            {id} | {points}pts |&nbsp;
            
            <Link href={'/user/' + author}>
              <a>{author}</a>
            </Link>

            {url && (
              <>
                &nbsp;|&nbsp;
                <a
                  href={url} 
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {url}
                </a>
              </>
            )}
          </p>
          {text && (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          )}
        </section>
      </ItemHeading>
      
      {children && (
        <CommentList commentListData={children} />
      )}
    </>
  );
}

export const getServerSideProps = async ({ params }) => {
  const itemId = params.itemId;
  const initialData = await getCommentData(itemId);

  return {
    props: initialData,
  }
}
 
export default ItemPage;