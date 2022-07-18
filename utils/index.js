export const sanitizeHtmlLinks = (htmlText) => {
  return !htmlText.includes('rel="nofollow"')
    ? htmlText
    : htmlText.split().join('target="_blank" rel="noopener noreferrer"');
};