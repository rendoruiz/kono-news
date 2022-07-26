import clsx from "clsx";

import { sanitizeHtmlLinks } from "../../utils";

const HtmlContent = ({ htmlString }) => {
  if (!htmlString) {
    return null;
  } else {
    const decodedHtml = sanitizeHtmlLinks(htmlString);

    return (
      <div 
        dangerouslySetInnerHTML={{ __html: decodedHtml }} 
        className={clsx(
          'html-content max-w-3xl text-contentPrimary leading-tight'
        )}
      />
    );
  }
}
 
export default HtmlContent;