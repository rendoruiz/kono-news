import styled from "@emotion/styled";
import { DefaultIconStyle } from "../../styles/styledConstants";

import { FluentLineHorizontal3Regular } from "./FluentIcons";

const StyledNavigationToggle = styled.button`
  ${DefaultIconStyle}
  border: 1px solid rgba(200, 200, 200, 1);
  line-height: 0;
  cursor: pointer;
`;

const NavigationToggle = ({ onClick }) => (
  <StyledNavigationToggle
    type='button'
    title='navigation button'
    onClick={onClick}
  >
    <FluentLineHorizontal3Regular />
  </StyledNavigationToggle>
)
 
export default NavigationToggle;