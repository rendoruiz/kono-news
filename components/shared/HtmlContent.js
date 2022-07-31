import React from 'react';
import clsx from "clsx";

import { sanitizeHtmlLinks } from "../../utils";

const HtmlContent = React.memo(({ htmlString }) => {
  if (!htmlString) {
    return null;
  } else {
    const decodedHtml = sanitizeHtmlLinks(htmlString);

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: decodedHtml }} 
        className={clsx(
          'html-content max-w-3x text-knPrimary text-sm leading-snug',
          'md:text-base',
        )}
      />
    );
  }
});
 
export default HtmlContent;