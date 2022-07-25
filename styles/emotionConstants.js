const getBreakpointMediaQuery = (sizeInPx) => `@media (min-width: ${sizeInPx})`;

export const breakpoint = {
  md: getBreakpointMediaQuery(768),
  lg: getBreakpointMediaQuery(1024),
  xl: getBreakpointMediaQuery(1440),
  xxl: getBreakpointMediaQuery(2560),
}

export const color = {
 brandPrimary: 'rgb(255, 102, 0)',
 brandSecondary: 'rgb(246, 246, 239)',
 textPrimary: 'rgb(30, 30, 30)',
 textSecondary: 'rgb(130, 130, 130)',
}

export const fontSize = {
  heading1: '',
  heading2: '',
  heading3: '',
  base: '1em',
  contentPrimary: '0.9em',
  contentSecondary: '0.85em',
}

export const spacing = {
  2: '2px',
  4: '4px',
  6: '6px',
  8: '8px',
  10: '10px',
  12: '12px',
  16: '16px',
  20: '20px',
  40: '40px',
  60: '60px',
}