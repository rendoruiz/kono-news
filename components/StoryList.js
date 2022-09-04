import { useStoryNavigation } from "../hooks/useStoryNavigation";

export const StoryList = ({ type }) => {
  const { listType: { apiQuery } } = useStoryNavigation();
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