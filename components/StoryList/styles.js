import styled from "@emotion/styled";


export const StoryList = styled.ol`
  counter-reset: css-counter 0;
  list-style-type: none;
  padding-left: 0;

  li {
    display: grid;
    padding: 4px 16px 4px 20px;
  }
`;

export const StoryTitle = styled.h3`
  counter-increment: css-counter 1;
  position: relative;
  font-size: 1.05em;
  font-weight: 400;

  :before {
    content: counter(css-counter) ".";
    position: absolute;
    top: 1ch;
    left: -3ch;
    display: block;
    text-align: right;
    font-size: 0.6em;
    font-weight: 400;
  }
`;

export const StoryUrl = styled.a`
  font-size: 0.75em;
  font-weight: 400;
  opacity: 0.6;
`;

export const StoryDetailsWrapper = styled.div`
  margin-top: 4px;
  opacity: 0.6;
  font-size: 0.75em;
`;