import { decodeHTML } from 'entities'

const TopicItem = ({ 
  id,
  title,
  url,
}) => {
  return (
    <li>
      <a href={url} target='_blank'>
        <span><strong>{id}</strong> {decodeHTML(title)}</span>
      </a>
    </li>
  );
}
 
export default TopicItem;