// const browser = browser || chrome;
const css = `
  [data-component-context="suggest_activity_tweet"] {
    display: none;
    /* opacity: 0.2; /* debugging purposes */
  }
`;
const TITLE_APPLY = "Remove Likes";
const TITLE_REMOVE = "Show Likes";

browser.pageAction.onClicked.addListener(async (tab) => {
  const title = await browser.pageAction.getTitle({tabId: tab.id});

  if (title === TITLE_APPLY) {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/on.svg"});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
    browser.tabs.insertCSS({code: css});
  } else {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/off.svg"});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
    browser.tabs.removeCSS({code: css});
  }
});

/*
Initialize the page action: set icon and title, then show.
Only operates on tabs whose URL's protocol is applicable.
*/
function initializePageAction(tab) {
  if (tab.url.match(/twitter\.com/)) {
    browser.pageAction.setIcon({tabId: tab.id, path: "icons/on.svg"});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
    browser.tabs.insertCSS(tab.id, {code: css});
    browser.pageAction.show(tab.id);
  }
}

/*
When first loaded, initialize the page action for all tabs.
*/
var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
  for (let tab of tabs) {
    initializePageAction(tab);
  }
});

/*
Each time a tab is updated, reset the page action for that tab.
*/
browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
  initializePageAction(tab);
});
