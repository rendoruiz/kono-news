import styled from "@emotion/styled";
import { primaryColor, viewport } from "../../styles/styledConstants";

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
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  /* overflow-y: auto; */
`;
export const StoryListHeader = styled.header`
  position: sticky;
  z-index: 10;
  top: 0;
  display: flex;
  align-items: center;
  padding: 6px 4px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);

  h2 {
    margin-left: 8px;
    font-size: 1.15em;
    font-weight: medium;
  }
`;
export const StoryListContent = styled.main`
  padding: 4px;
  overflow-y: auto;

  & > button {
    border: none;
    border-radius: 4px;
    margin-top: 4px;
    padding: 12px 4px;
    width: 100%;
    background: none;
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    cursor: pointer;
  }
`;
export const StoryList = styled.ol`
  display: grid;
`;
export const StoryItem = styled.li`
  display: flex;
  position: relative;

  label {
    flex: 1;
    border: none;
    padding: 6px 8px 6px 12px;
    text-align: left;
    cursor: pointer;
  }

  &:not(:last-of-type) {
    border-bottom: 1px solid rgba(0,0,0,0.1);
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

    &:checked + label {
      background: rgba(0,0,0,0.05);
      
      ::before {
        content: ' ';
        position: absolute;
        inset: 0 auto 0 0;
        border-radius: 4px;
        margin: auto 0;
        width: 3px;
        height: 70%;
        background: ${primaryColor()};
        pointer-events: none;
      }
    }
  }
`;
export const StoryItemLoader = styled.li`
  display: none;
`

export const StoryItemHeading = styled.h3`
  font-size: 1em;
`;

export const StoryItemStats = styled.div`
  display: flex;
  margin-top: 6px;
  font-size: 0.8em;
  color: rgb(130, 130, 130);

  span {
    flex-shrink: 0;
    margin-left: auto;
    padding-left: 2px;
  }
`;