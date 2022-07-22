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
  /* position: relative; */
  display: grid;
  grid-template-rows: auto 1fr;
  overflow-y: auto;
`;
export const StoryListHeader = styled.header`
  display: flex;
  align-items: center;
  padding: 4px;

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
    font-size: 1em;
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
    }

    &:checked + label::before {
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
`;
export const StoryItemLoader = styled.li`
  display: none;
`

export const StoryItemHeading = styled.h3`
  font-size: 1.1em;
`;

export const StoryItemStats = styled.p`
  margin-top: 6px;
  font-size: 0.75em;
  opacity: 0.6;
`;