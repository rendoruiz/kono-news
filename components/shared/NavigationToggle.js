import React from "react";
import clsx from "clsx";

import { FluentLineHorizontal3Regular } from "./FluentIcons";

import { useNavigation } from "../../context/NavigationContext";

import { NAVIGATION_ACTION } from "../../utils/constants";

const NavigationToggle = React.memo(() => {
  const dispatch = useNavigation();
  const handleClick = () => dispatch({ type: NAVIGATION_ACTION.TOGGLE_PANEL });

  return (
    <button
      type='button'
      title='navigation panel toggle button'
      className={clsx(
        'group rounded -mx-3 -my-2 px-3 py-2 leading-none transition-colors cursor-pointer',
        'hover:bg-FluentLightSubtleFillColorSecondary active:bg-FluentLightSubtleFillColorTertiary active:text-FluentLightTextFillColorTertiary',
        'dark:hover:bg-FluentDarkSubtleFillColorSecondary dark:active:bg-FluentDarkSubtleFillColorTertiary dark:active:text-FluentDarkTextFillColorTertiary',
        'md:border-1 md:border-transparent',
        'md:hover:border-FluentLightControlStrokeColorDefault md:active:border-FluentLightControlStrokeColorSecondary md:hover:bg-FluentLightControlFillColorSecondary md:active:bg-FluentLightControlFillColorTertiary md:hover:shadow',
        'dark:md:hover:border-FluentDarkControlStrokeColorDefault dark:md:active:border-FluentDarkControlStrokeColorSecondary dark:md:hover:bg-FluentDarkControlFillColorSecondary dark:md:active:bg-FluentDarkControlFillColorTertiary',
      )}
      onClick={handleClick}
    >
      <FluentLineHorizontal3Regular 
        className={clsx(
          'w-6 h-6 origin-center transition-transform',
          'group-active:scale-x-[.60]',
          'md:w-5 md:h-5'
        )}
      />
    </button>
  );
});
 
export default NavigationToggle;