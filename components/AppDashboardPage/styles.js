import styled from "@emotion/styled";
import { secondaryColor, viewport } from "../../styles/styledConstants";

export const AppContainer = styled.div`
  background-color: ${secondaryColor};
`;
export const AppLayout = styled.div`
  position: relative;
  display: grid;
  margin: 0 auto;
  width: 100%;
  max-width: 1536px;
  min-height: 100vh;

  ${viewport.lg} {
    grid-template-columns: auto 1fr 2fr;
  }
`;