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
  height: 100vh;
  max-width: 1536px;

  ${viewport.lg} {
    grid-template-columns: auto 1fr 2fr;
  }
`;