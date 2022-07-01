import { getInitialUserData } from "../../utils/hnUser";

const UserPage = ({
  initialUserData,
  initialUserContentData,
}) => {
  return (  
    <div>
      <div>
        <h1>User</h1>
        {JSON.stringify(initialUserData)}
      </div>

      <div>
        <h2>Stories</h2>
        {JSON.stringify(initialUserContentData)}
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ params }) => {
  const userId = params.userId;
  const [initialUserData, initialUserContentData] = await getInitialUserData(userId)

  return {
    props: {
      initialUserData,
      initialUserContentData,
    }
  }
}
 
export default UserPage;