import Link from 'next/link';
import { decodeHTML } from 'entities';

const StoryItem = ({ 
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
        <a 
          href={url} 
          target='_blank'
          rel='noopener noreferrer'
        >
          [url]
        </a>
      )}
      &nbsp;
      <a 
        href={`https://news.ycombinator.com/item?id=${id}`} 
        target='_blank'
        rel='noopener noreferrer'
      >
        [orig]
      </a>
    </li>
  );
}
 
export default StoryItem;