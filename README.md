# Kono News - A Fluent Hacker News Viewer

> https://news.kono.cx/

> https://kono-news.vercel.app/

Kono News is a heavily-opinionated Hacker News viewer with a splash of Microsoft's Fluent Design. The project uses [Fluent Icons](https://github.com/microsoft/fluentui-system-icons) and Fluent color schemes used on [WinUI](https://github.com/microsoft/microsoft-ui-xaml) applications.

This project is my third attempt at a Hacker News viewer that focuses on the following:

- Best performance out of all iterations.
- Implementing Fluent Design on most parts as possible.
- Flicker-free app theme switcher.
- Device back button handling.
- Use of React Context.
- An actual alternative viewer that I will use and not just a project dedicated to learning.

Kono News introduces improvements and new features from the previous iterations:

- Use of [Hacker News Algolia API](https://hn.algolia.com/api).
  - This greatly improved the loading time for comments as they only need to be fetched once.
  - Before, every single comment item are fetched individually.
- Custom React Query parameters.
  - The new parameters encourage reloading for new content as it only caches the current page instance.
    - This is a personal preference as I dislike page reshuffling whenever the data becomes stale.
- Route-based app navigation.
  - Using the back button on mobile after opening a story item should close it and bring the user back to the home page (story list panel).

## Features

- Dismissible story discussion panel on mobile using the device/browser back button.
- 2-pane layout for story list and story discussions on tablet+.
- Support for comment permalink by pressing the comment datetime.
  - Located on the right of the comment header on mobile 
  - Located beside the comment author on tablet+.
- Retracting/Minimizing comment items.
  - Pressing anywhere on the comment item header except for the comment datetime on mobile.
  - Pressing the [+] or [-] button right beside the comment author on tablet+.
- Minimum width set for comment discussion objects.
  - This is a personal preference as any more than the current content width limit would be uncomfortable to read on.

## Missing features from previous iterations

- User Page
  - I do not visit Hacker News user pages at all. So, the functionality is not implemented. I might implement it if I ever need it, but I doubt that happening.
  - The author's name is made clickable on the story discussion panel on tablet+.
    - It will throw the user on the respective user page on ycombinator in a new tab.

## Feature freezer

Possible new features for future updates that are currently on hold ~~*(forever)*~~ due to lack of personal use-case.

- Search (Any, Story, Comment)
- Bookmarks (Story, Comment)
- History (Story)
- User Page