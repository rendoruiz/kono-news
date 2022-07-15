import Link from 'next/link';
import { decodeHTML } from 'entities';

import * as Styled from './styles';

const StoryList = ({ storyListData }) => {
  return (
    <Styled.StoryList>
      {storyListData.map((storyItemData, index) => 
        <StoryItem 
          key={`${storyItemData.id}-${index}`}
          {...storyItemData} 
        />
      )}
    </Styled.StoryList>
  );
}

const StoryItem = ({ 
  id,
  title,
  url,
}) => {
  return (
    <Styled.StoryItem>
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
    </Styled.StoryItem>
  );
}
 
export default StoryList;