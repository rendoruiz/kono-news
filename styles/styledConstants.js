import { css } from '@emotion/react';

const getMediaQuery = (size) => `@media (min-width: ${size}px)`;

export const viewport = {
  md: getMediaQuery(768),
  lg: getMediaQuery(1024),
  xl: getMediaQuery(1440),
  xxl: getMediaQuery(2560),
}

export const transitionFunction = (transitionTarget) => css`
  transition: ${transitionTarget ?? 'all'} 0.5s cubic-bezier(0.77, 0, 0.175, 1);
`;

export const DefaultIconStyle = css`
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 4px 8px;
  background: transparent;
  line-height: 1;
  transition: opacity 100ms linear;

  &:hover {
    opacity: 0.5;
  }
  &:active > svg {
    transform: scale(0.8);
    transform-origin: center;
    transition: transform 100ms ease-in-out;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;