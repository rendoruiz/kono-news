const getMediaQuery = (size) => `@media (min-width: ${size})px`;

export const viewport = {
  md: getMediaQuery(768),
  lg: getMediaQuery(1024),
  xl: getMediaQuery(1440),
  xxl: getMediaQuery(2560),
}