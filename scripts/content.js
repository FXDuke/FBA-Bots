const maxTimeToLoad = 2500;
const loadInterval = 100;

function scrapeData() {
    let data = [];

    let commentSection = document.querySelector("#comments");


    let elapsedCommentSectionLoadTime = 0;

    if (commentSection == null)
    {
        return chrome.runtime.sendMessage({ action: "scrapedData", data: "commentSectionLoadTimedOut"});
    }
    
    let comments = commentSection.querySelectorAll("#comment");

    if (comments.length == 0)
    {
         return chrome.runtime.sendMessage({ action: "scrapedData", data: "noCommentsLoaded"});
    }

    comments.forEach((comment) => {
        let commentData = {};

        // Extract the comment text
        let commentTextElement = comment.querySelector("#content-text");
        commentData.text = commentTextElement ? commentTextElement.innerText : "No text found";

        // Extract the author name
        let authorElement = comment.querySelector("#author-text span");
        commentData.author = authorElement ? authorElement.innerText : "No author found";

        data.push(commentData);
    });

    chrome.runtime.sendMessage({ action: "scrapedData", data: data});
}
scrapeData();