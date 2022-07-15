import styled from "@emotion/styled";


export const StoryList = styled.ol`
  counter-reset: css-counter 0;
  list-style-type: none;
  padding-left: 0;
`;

export const StoryItem = styled.li`
  counter-increment: css-counter 1;

  :before {
    content: counter(css-counter) ".";
    display: inline-block;
    min-width: 3.25ch;
    margin-right: 1.5ch;
    text-align: right;
    font-size: 0.9em;
  }
`;