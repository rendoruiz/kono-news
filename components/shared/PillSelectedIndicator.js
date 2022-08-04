import React from 'react';
import clsx from "clsx";

const PillSelectedIndicator = React.memo(({ isSelected }) => (
  <div className={clsx(
    'hidden absolute inset-0 right-auto rounded my-auto w-[3px] h-2/5 bg-KonoAccentLight pointer-events-none',
    'dark:bg-KonoAccentDark',
    {'md:!block': isSelected},
  )} />
));
 
export default PillSelectedIndicator;