export const sanitizeHtmlLinks = (htmlText) => {
  if (!htmlText) {
    return null;
  }
  
  return !htmlText.includes('rel="nofollow"')
    ? htmlText
    : htmlText.split('rel="nofollow"').join('target="_blank" rel="noopener noreferrer"');
};