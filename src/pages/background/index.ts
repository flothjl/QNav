import { QNavApi } from "@src/qNavApi";
import { QNavLink, QNavLinkResponse } from "../../types";
import { findLink, escapeXml, calculateSimilarity } from "./util";

const connect = async () => {
  const qNavApi = await QNavApi.create();
  return qNavApi;
};

const queryLinks = async (qNavApi: QNavApi) => {
  const links = await qNavApi.queryAllLinks();
  if (links?.status.code !== 200) {
    console.log("Failed to query links", links?.status);
  }
  return links?.recs || [];
};

const suggestLink = (searchString: string, links: QNavLink[]) => {
  const regex = new RegExp(searchString, 'i');
  const matchingObjects = [];

  for (const obj of links) {
    if (regex.test(obj.name)) {
      matchingObjects.push(obj);
    }
  }

  // Sort the matching objects based on similarity score
  matchingObjects.sort((a, b) => {
    const similarityA = calculateSimilarity(searchString, a.name);
    const similarityB = calculateSimilarity(searchString, b.name);
    return similarityB - similarityA; // Sort in descending order
  });

  // Return the top 4 closest matches
  return matchingObjects.slice(0, 4);

}

const omniboxListener = async (qNavApi: QNavApi) => {
  let linkData: QNavLinkResponse[] = [];

  chrome.omnibox.onInputStarted.addListener(async () => {
    linkData = await queryLinks(qNavApi);
  })

  chrome.omnibox.onInputChanged.addListener(async (text, sendSuggestion) => {
      const recs = suggestLink(text, linkData.map((link) => link.data));
      sendSuggestion(
        recs.map((rec) => {
          return {
            content: rec.name,
            description: `<dim><match>${rec.name}</match></dim> - <url>${escapeXml(rec.url || '')}</url>`
          }
        })
      )
  })

  chrome.omnibox.onInputEntered.addListener(async (string,) => {
    const linkData = await queryLinks(qNavApi);
    const links = linkData.map((link) => link.data);
    const url = findLink(string, links);
    if (url) {
      chrome.tabs.update({ url });
    }
  });
};

connect().then(async (qNavApi) => {
  console.log('service worker connected')
  omniboxListener(qNavApi);
})
