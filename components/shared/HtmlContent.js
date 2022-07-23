import styled from "@emotion/styled";
import { primaryColor } from "../../styles/styledConstants";
import { sanitizeHtmlLinks } from "../../utils";

const StyledHtmlContent = styled.div`
  font-size: 0.9em;
  line-height: 1.15;

  > *:not(:first-child) {
    margin-top: 6px;
  }

  a,
  p, 
  span {
    word-break: break-word;
  }
  a {
    color: ${primaryColor(0.8)}
  }

  pre {
    font-family: monospace;
    display: flex;
    overflow-x: auto;
    background-color: rgba(0,0,0,.05);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    padding: 5px 2px;
    margin: 1em 0px;
  }
`;

const HtmlContent = ({ htmlString }) => {
  if (!htmlString) {
    return null;
  } else {
    const decodedHtml = sanitizeHtmlLinks(htmlString);

    return (
      <StyledHtmlContent
        dangerouslySetInnerHTML={{ __html: decodedHtml }}
      />
    );
  }
}
 
export default HtmlContent;