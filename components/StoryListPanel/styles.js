import styled from "@emotion/styled";
import { pulseAnimation, primaryColor, viewport } from "../../styles/styledConstants";

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
  overflow-y: auto;
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
  align-content: flex-start;

  &[data-list-error] {
    align-content: center;
    padding: 20px 16px;
    font-weight: 500;
    text-align: center;

    h3 {
      font-size: 1.75em;
    }
    p {
      margin-top: 16px;
      font-size: 1.2em;
      color: rgb(255, 50, 50);
    }
  }
`;
export const StoryItem = styled.li`
  display: flex;
  position: relative;
  border-bottom: 1px solid rgba(0,0,0,0.1);

  label {
    flex: 1;
    border: none;
    padding: 6px 8px 6px 12px;
    text-align: left;
    cursor: pointer;
  }

  &[data-loading] {
    &:not(:nth-of-type(-n+8)) {
      display: none;
    }
  
    &:nth-of-type(-n+8) {
      position: relative;
      display: grid;
      gap: 6px;
      padding: 6px 8px;

      &::before,
      &::after {
        content: ' ';
        position: relative;
        border-radius: 4px;
        width: 90%;
        height: 1.75em;
        background: rgba(0,0,0,0.3);
        animation: ${pulseAnimation} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      &::after {
        width: 50%;
        height: 1.25em;
      }

      &:nth-of-type(odd) {
        &::before {
          width: 75%;
        }
        &::after {
          width: 60%;
        }
      }
    }
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

export const StoryItemHeading = styled.h3`
  font-size: 1em;
  line-height: 1.15;
  word-break: break-word;
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