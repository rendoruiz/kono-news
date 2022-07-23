import styled from "@emotion/styled";
import { DefaultIconStyle, primaryColor, viewport } from "../../styles/styledConstants";

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
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgb(246, 246, 239);
  overflow-y: auto;
  transform: translateX(${({isExpanded}) => isExpanded ? '0' : '100%'});
  transition: transform 200ms ease-in-out;
  
  overscroll-behavior: contain;
`;

export const StoryCommentsHeader = styled.header`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 6px 4px 4px;

  button {
    ${DefaultIconStyle}
    border: 1px solid rgba(200, 200, 200, 1);
    line-height: 0;
    cursor: pointer;
  }

  p {
    font-size: 0.9em;
    font-weight: 500;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
export const StoryCommentsContent = styled.main`
  overflow-y: auto;
  display: grid;
  grid-template-rows: auto 1fr;
  row-gap: 8px;
`;
export const StoryCommentsOriginalPost = styled.article`
  border-bottom: 3px solid rgba(0,0,0,0.1);
  padding: 10px 10px 16px;

  > header {
    display: flex;
    flex-direction: column;

    h2 {
      font-size: 1.1em;
      line-height: 1.25;
    }
    p {
      margin-top: 4px;
      font-size: 0.85em;
      color: rgb(130, 130, 130);
    }
    a {
      border: 1px solid ${primaryColor()};
      align-self: flex-start;
      border-radius: 16px;
      margin-top: 8px;
      padding: 4px 10px;
      background: ${primaryColor(0.05)};
      font-size: 0.75em;
      font-weight: 500;
      color: rgb(50, 50, 50);
      line-height: 1;
      text-transform: uppercase;
    }
  }

  main:not(:empty) {
    margin-top: 12px;
  }

  + ul {
    margin-top: 0;
    margin-left: 0;
    padding: 0 10px;

    &::before {
      content: none;
    }
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
    border-left: 1.5px solid ${primaryColor()};
    border-left: 1.5px solid hsl(24, 100%, 80%);
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
    padding-bottom: 2px;
    font-size: 0.8em;
    color: rgb(130, 130, 130);
    letter-spacing: 0.5px;
  }
  > main {
    margin-top: 4px;
  }
  &[data-deleted] > main > div {
    opacity: 0.6;
    font-style: italic;
  }
`;