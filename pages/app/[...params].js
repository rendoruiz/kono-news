import styled from "@emotion/styled";




const StyledAppLayout = styled.div`

`;
const AppPage = ({ initialStoryListIds, initialStoryListData, initialStoryCommentsData, }) => {
  const storyListData = initialStoryListData;

  return (  
    <StyledAppLayout>
      {/* Navigation Panel */}

      {/* Story List Panel */}
      <StoryListPanel 
        storyListMode={null} 
        storyListData={storyListData} 
      />

      {/* Story Comments Panel */}

    </StyledAppLayout>
  );
}


const StyledStoryListPanel = styled.section``;
const StyledStoryListHeader = styled.div``;
const StyledStoryList = styled.ol``;
const StyledStoryItem = styled.li``;
const StoryListPanel = ({ storyListMode, storyListData }) => {
  return (
    <StyledStoryListPanel>
      {/* header w/ nav toggle */}
      <StoryListHeader listMode={storyListMode} />

      {/* story list */}
      <StoryList storyListData={storyListData} />
    
      {/* story list propagation button */}
    </StyledStoryListPanel>
  );
}

const StoryListHeader = ({ listMode }) => {   // deconstruct props
  return (
    <StyledStoryListHeader>

    </StyledStoryListHeader>
  );
}

const StoryList = ({ storyListData }) => {
  return (
    <StyledStoryList>
      {storyListData.map((storyItemData) => 
        <Storyitem
          key={storyItemData.id}
          storyItemData={storyItemData}
        >

        </Storyitem>
      )}
    </StyledStoryList>
  );
}

const Storyitem = ({ storyItemData }) => {    // deconstruct props
  return (
    <StyledStoryItem>

    </StyledStoryItem>
  );
}


const StyledStoryCommentsPanel = styled.section``;
const StyledStoryCommentsHeader = styled.div``;
const StyledStoryCommentsList = styled.ol``;
const StyledStoryCommentsItem = styled.li``;
const StoryCommentsPanel = ({ storyItemData, storyCommentData, }) => {
  return (
    <StyledStoryCommentsPanel>
      {/* header with: back button (close story), full screen, story urls */}
      <StoryCommentsHeader storyItemData={storyItemData} />

      {/* story comments list */}

    </StyledStoryCommentsPanel>
  );
}

const StoryCommentsHeader = ({ storyItemData }) => {   // deconstruct props
  return (
    <StyledStoryCommentsHeader>

    </StyledStoryCommentsHeader>
  )
}

const StoryCommentsList = ({ storyCommentData }) => {
  return (
    <StyledStoryCommentsList>
      {storyCommentData.map((storyCommentItemData) =>
        <StoryCommentItem
          key={storyCommentItemData.id}
          {...storyCommentItemData}
        />
      )}
    </StyledStoryCommentsList>
  );
} 

const StoryCommentItem = ({ id, author, text, children, }) => {   // deconstruct props
  return (
    <StyledStoryCommentsItem>

    </StyledStoryCommentsItem>
  );
}





 
export default AppPage;