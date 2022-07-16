import styled from "@emotion/styled";

const getMediaQuery = (size) => `@media (min-width: ${size})px`;

export const viewport = {
  md: getMediaQuery(768),
  lg: getMediaQuery(1024),
  xl: getMediaQuery(1440),
  xxl: getMediaQuery(2560),
}

export const MainLayout = styled.div`
  position: relative;
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: rgb(246, 246, 239);

  ${viewport.md} {
    grid-template-columns: auto 1fr;
  }
`;

