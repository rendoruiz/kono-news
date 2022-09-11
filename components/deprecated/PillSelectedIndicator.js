import { memo } from 'react';
import clsx from "clsx";

const PillSelectedIndicator = memo(({ isSelected, large = false }) => (
  <div className={clsx(
    'hidden absolute z-10 inset-0 right-auto rounded my-auto w-[3px] h-2/5 bg-KonoAccentLight pointer-events-none',
    'dark:bg-KonoAccentDark',
    {'md:!block': isSelected},
    {'h-3/5': large}
  )} />
));
 
export default PillSelectedIndicator;