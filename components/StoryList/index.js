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
  score: points,
  by: author,
  time: created_at,
  descendants,
}) => {
  const decodedTitle = decodeHTML(title);

  return (
    <li>
      <Link href={`/item/${id}`}>
        <a>
          <Styled.StoryTitle>
            {decodedTitle}
            {url && (<StoryUrlHostname url={url} />)}
          </Styled.StoryTitle>
          <Styled.StoryDetailsWrapper>
            {points} points | {descendants} comments | {author} | {created_at}
          </Styled.StoryDetailsWrapper>
        </a>
      </Link>
    </li>
  );
}

const StoryUrlHostname = ({ url }) => (
  <Styled.StoryUrlHostname
    href={url} 
    target='_blank'
    rel='noopener noreferrer'
  >
    &nbsp;({new URL(url).hostname.split('www.').join('')})
  </Styled.StoryUrlHostname>
)
 
export default StoryList;