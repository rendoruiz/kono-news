import clsx from "clsx";

import NavigationPanel from "./NavigationPanel";
import StoryListPanel from "./StoryListPanel";
import StoryDiscussionPanel from "./StoryDiscussionPanel";

import { NavigationProvider } from "../context/NavigationContext";
import { StoryDiscussionProvider } from "../context/StoryDiscussionContext";

const AppDashboardPage = ({ initialStoryListModeId, initialStoryDiscussionId, initialIsPermalink }) => {
  return ( 
    <NavigationProvider initialStoryListModeId={initialStoryListModeId}>
      <StoryDiscussionProvider
        initialIsPermalink={initialIsPermalink}
        initialStoryDiscussionId={initialStoryDiscussionId}
      >
        <div className={clsx(
          'relative grid mx-auto w-full h-screen max-w-screen-2xl',
          'md:grid-cols-[1fr_2fr] md:gap-x-1.5',
          'xl:grid-cols-[1fr_2.5fr]',
          '2xl:grid-cols-[1fr_3fr] 2xl:gap-x-2 2xl:overflow-hidden 2xl:p-2'
        )}>
          <NavigationPanel />
          <StoryListPanel />
          <StoryDiscussionPanel />
        </div>
      </StoryDiscussionProvider>
    </NavigationProvider>
  );
}

export default AppDashboardPage;