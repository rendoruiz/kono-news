import styled from "@emotion/styled";
import { viewport } from "../../styles/styledConstants";

/*
  === Structure ===
  > StoryListPanel
  -> StoryListHeader
  --> button (NavToggle)
  -> StoryListContent
  --> button (StoryListContentFetcher)
  --> StoryList
  ---> StoryItem
  ----> StoryTitle
  -----> StoryHeading
  -----> StoryItemUrl
  ----> StoryStats
  ---> StoryItemLoader
*/


export const StoryListPanel = styled.section`
  /* position: relative; */
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: auto;
`;
export const StoryListHeader = styled.header``;
export const StoryListContent = styled.main`
  overflow-y: auto;
`;
export const StoryList = styled.ol`
  display: grid;
  gap: 2px;
`;
export const StoryItem = styled.li`
  display: flex;
  position: relative;

  label {
    flex: 1;
    border: none;
    padding: 2px 8px;
    text-align: left;
    cursor: pointer;
  }

  &[data-loading] ~ [data-loader] {
    display: block !important;
  }

  &[data-loading] {
    display: none !important;
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  input[type="radio"]:checked + label {
    background: rgba(0,0,0,0.25);
  }
`;
export const StoryItemLoader = styled.li`
  display: none;
`
export const StoryTitle = styled.div`
  /* display: inline; */
`
export const StoryHeading = styled.h3`
  display: inline;
  font-size: 1.1em;
`;
export const StoryUrl = styled.span`
  font-size: 0.75em;
  opacity: 0.6;
  
  ::before {
    content: '  ';
  }
`;
export const StoryStats = styled.p`
  font-size: 0.75em;
  opacity: 0.6;
`;