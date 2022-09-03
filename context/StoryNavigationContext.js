import { useRouter } from 'next/router';
import { createContext, useReducer } from 'react';
import { NAVIGATION_ITEMS } from '../components/NavigationBar';

import { QUERY_KEY } from '../utils/constants';

export const StoryNavigationContext = createContext(null);

const ACTION = {
  SET_LIST_TYPE: 'SET_LIST_TYPE',
  TOGGLE_PANEL: 'TOGGLE_PANEL',
}

const getListType = (listTypeId) => {
  let listType = NAVIGATION_ITEMS.filter((item) => item.id === listTypeId).pop();
  if (!listType) {
    listType = NAVIGATION_ITEMS[0];
  }
  return {
    id: listType.id,
    name: listType.name,
  }
}

const initState = (initialListTypeId) => {
  const listType = getListType(initialListTypeId);
  return {
    listType,
    isExpanded: false,
  }
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

  const toggleNavigation = () => {
    if (state.isExpanded) {
      router.back(2);
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

  const setListType = (_type) => {
    if (_type.id === state.listType.id) {
      dispatch({ type: ACTION.TOGGLE_PANEL });
      router.back(2);
    } else {
      dispatch({
        type: ACTION.SET_LIST_TYPE,
        listType: _type,
      });

      const { 
        [QUERY_KEY.IS_NAVIGATION_EXPANDED]: _,
        ...query
      } = router.query;
      router.replace({ 
        query: {
          [QUERY_KEY.STORY_LIST_TYPE_ID]: true,
          ...query
        }
      }, undefined, { shallow: true });
    }
  }

  return (
    <StoryNavigationContext.Provider value={{ ...state, toggleNavigation, setListType }}>
      {children}
    </StoryNavigationContext.Provider>
  );
}