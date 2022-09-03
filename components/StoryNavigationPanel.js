import { StoryNavigationContext } from "../context/StoryNavigationContext";

export const StoryNavigationPanel = () => {
  return (  
    <StoryNavigationContext>
      <section>
        <NavigationBar />
        <StoryList />
      </section>
    </StoryNavigationContext>
  );
}


const NavigationBar = () => {

  return (
    <div>

    </div>
  )
}



const StoryList = ({ type }) => {

  return (
    <>
      <ul>

      </ul>
      <button>
        Load More Stories
      </button>
    </>
  );
}

const StoryItem = ({ story, isSelected }) => {

  return (
    <li>

    </li>
  );
}