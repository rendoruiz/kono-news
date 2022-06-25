import Link from 'next/link';
import { decodeHTML } from 'entities';

const TopicItem = ({ 
  id,
  title,
  url,
}) => {
  return (
    <li>
      <Link href={`/item/${id}`}>
        <a>
          {decodeHTML(title)}
        </a>
      </Link>
      &nbsp;
      {url && (
        <a href={url} target='_blank'>
          [url]
        </a>
      )}
      &nbsp;
      <a href={`https://news.ycombinator.com/item?id=${id}`} target='_blank'>
        [orig]
      </a>
    </li>
  );
}
 
export default TopicItem;