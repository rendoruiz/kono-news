import styled from "@emotion/styled";
import { viewport } from "../../styles/styledConstants";

/*
  === Structure ====
  > StoryCommentsPanel
  -> StoryCommentsHeader
  --> button (NavToggle)
  -> StoryCommentsContent
  --> StoryCommentsOriginalPost
  --> StoryCommentsList
  ---> StoryCommentsItem
*/

export const StoryCommentsPanel = styled.section`
  /* position: relative; */
  display: grid;
  grid-template-rows: auto 1fr;
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgb(246, 246, 239);
  overflow-y: auto;
  transform: translateX(${({isExpanded}) => isExpanded ? '0' : '100%'});
  transition: transform 200ms ease-in-out;
`;
export const StoryCommentsHeader = styled.header``;
export const StoryCommentsContent = styled.main`

  overflow-y: auto;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 20px;
`;
export const StoryCommentsOriginalPost = styled.article`
  padding: 10px;
  + ul {
    margin-top: 0;
    margin-left: 0;
    padding: 0 10px;
  }
  + ul::before {
    content: none;
  }
`;
export const StoryCommentsList = styled.ul`
  position: relative;
  margin-top: 16px;
  margin-left: 10px;

  ::before {
    content: ' ';
    position: absolute;
    inset: 0 auto 0 -10px;
    border-left: 1.5px solid red;
  }

  ${viewport.md} {
    margin-left: 14px;

    ::before {
      left: -14px;
    }
  } 
`;
export const StoryCommentsItem = styled.li`
  > header {
    font-size: 0.8em;
    letter-spacing: 0.5px;
  }
  > main > div {
    display: grid;
    align-content: flex-start;
    margin-top: 4px;
    font-size: 0.9em;
  }
  &[data-deleted] > main > div {
    opacity: 0.6;
    font-style: italic;
  }

  /* > main > div pre {
    justify-self: flex-start;
  } */
`;