
let selectedTabId = null;
let scrapingData = false;
const commentScrapingRateLimit = 15;
const youtubeWatchString = "youtube.com/watch";

function isYoutubeVideo(urlString)
{
    const lowerCaseUrlString = urlString.toLowerCase();
    return lowerCaseUrlString.includes(youtubeWatchString);
}

async function getTabWithId(id)
{

    try 
    {
        const currentTab = await new Promise((resolve, reject) => {
            chrome.tabs.get(id, (tab) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(tab);
                }
            });
        });

        return currentTab;
    }
    catch(errorMessage)
    {
        console.log("Error encountered when getting tab (" + id + "), " + errorMessage);
    }

}

async function focusChanged(tabInfo) {
    if (tabInfo.tabId == chrome.tabs.TAB_ID_NONE) {
        console.log("Encountered tab with invalid ID");
        return;
    }

    const currentTab = await getTabWithId(tabInfo.tabId);

    if (currentTab)
    {
        selectedTabId = currentTab.id;
    }

}

async function onUpdate(tabId)
{

    if (scrapingData)
    {
        return;
    }

    if (selectedTabId == null)
    {
        return;
    }

    if (selectedTabId == chrome.tabs.TAB_ID_NONE)
    {
        return;
    }
    
    const currentTab = await getTabWithId(selectedTabId);

    if (isYoutubeVideo(currentTab.pendingUrl || currentTab.url))
    {
        scrapingData = true;
        try {
            chrome.scripting.executeScript({
                target: { tabId: selectedTabId },
                files: ['content.js']
            });
        }
        catch(errorMessage) {
            console.log("Error encountered while trying to execute content.js after youtube video was detected, " + errorMessage);
            scrapingData = false;
        }

    }

}

async function onMessage(message, senderInfo, sendResponse)
{
    if (message.action === "scrapedData") {

        if (message.data == "commentSectionLoadTimedOut" || message.data == "noCommentsLoaded")
        {
            try {
                chrome.scripting.executeScript({
                    target: { tabId: selectedTabId },
                    files: ['content.js']
                });
            }
            catch(errorMessage) {
                console.log("Error encountered while trying to execute content.js after youtube video was detected, " + errorMessage);
            }
            return;
        }

        scrapingData = false;
        console.log("Scraped data: ", message.data);
    }
}

chrome.tabs.onActivated.addListener(focusChanged);
chrome.tabs.onUpdated.addListener(onUpdate);
chrome.runtime.onMessage.addListener(onMessage);