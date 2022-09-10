import { useRouter } from 'next/router';
import { createContext, useEffect, useReducer } from 'react';
 
import { NAVIGATION_ITEMS } from '../components/NavigationBar';

import { QUERY_KEY } from '../utils/constants';

export const StoryNavigationContext = createContext(null);

const getListType = (listTypeId) => {
  let listType = NAVIGATION_ITEMS.filter((item) => item.id === listTypeId).pop();
  if (!listType) {
    listType = NAVIGATION_ITEMS[0];
  }
  return {
    id: listType.id,
    name: listType.name,
    apiQuery: listType.apiQuery,
  }
}

const initState = (initialListTypeId) => {
  const listType = getListType(initialListTypeId);
  return {
    listType,
    isExpanded: false,
  }
}

const ACTION = {
  SET_LIST_TYPE: 'SET_LIST_TYPE',
  TOGGLE_PANEL: 'TOGGLE_PANEL',
}

const storyNavigationReducer = (state, action) => {
  switch (action.type) {
    case ACTION.SET_LIST_TYPE:
      return {
        ...state,
        listType: action.listType,
        isExpanded: false,
      }
    case ACTION.TOGGLE_PANEL:
      return {
        ...state,
        isExpanded: !state.isExpanded,
      }
    default:
      return state;
  }
}

export const StoryNavigationProvider = ({ children, initialListTypeId }) => {
  const [state, dispatch] = useReducer(storyNavigationReducer, initialListTypeId, initState);
  const router = useRouter();

  useEffect(() => {
    const { 
      [QUERY_KEY.STORY_LIST_TYPE_ID]: listTypeId,
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: isExpanded
    } = router.query;

    const listType = getListType(listTypeId);
    if (listType.id !== state.listType.id) {
      dispatch({
        type: ACTION.SET_LIST_TYPE,
        listType,
      });
    }

    if (!isExpanded && state.isExpanded) {
      dispatch({ type: ACTION.TOGGLE_PANEL });
    }
  }, [router.query]);

  const toggleNavigation = () => {
    if (state.isExpanded) {
      router.back(1);
    } else {
      router.push({
        query: {
          ...router.query,
          [QUERY_KEY.IS_NAVIGATION_EXPANDED]: true,
        }
      }, undefined, { shallow: true })
    }
    dispatch({ type: ACTION.TOGGLE_PANEL });
  }

  const setListType = (listType) => {
    if (listType.id === state.listType.id) {
      dispatch({ type: ACTION.TOGGLE_PANEL });
      router.back(1);
    } else {
      dispatch({
        type: ACTION.SET_LIST_TYPE,
        listType,
      });
    }
  }

  return (
    <StoryNavigationContext.Provider value={{ ...state, toggleNavigation, setListType }}>
      {children}
    </StoryNavigationContext.Provider>
  );
}