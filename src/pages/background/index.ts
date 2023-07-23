import { connectWeb5, configureProtocol, linksRecordsQuery } from "../../util";
import { qGoProtocol } from "../../protocols";
import { QGoLink, QGoLinkResponse, Web5Connection } from "../../types";
import { findLink } from "./util";

const connect = async () => {
  const web5 = await connectWeb5();
  web5.web5 && await configureProtocol(web5.web5, qGoProtocol);
  return web5;
};

const queryLinks = async (web5: Web5Connection) => {
  const recordsRes = web5.web5 && await linksRecordsQuery(web5.web5);
  let recs = [];
  for (const record of recordsRes?.records || []) {
    const data = await record.data.json();
    const id = record.id;
    recs.push({ record, data, id } as QGoLinkResponse);
  }
  return recs;
};

// Function to calculate similarity score between two strings
function calculateSimilarity(str1: string, str2: string) {
  // You can use any similarity metric here. For simplicity, I'll use the Jaccard index.
  const set1 = new Set(str1.toLowerCase());
  const set2 = new Set(str2.toLowerCase());
  const intersectionSize = new Set([...set1].filter(x => set2.has(x))).size;
  const unionSize = new Set([...set1, ...set2]).size;
  const similarity = intersectionSize / unionSize;
  return similarity;
}

const suggestLink = (searchString: string, links: QGoLink[]) => {
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

const omniboxListener = async (web5: Web5Connection) => {
  chrome.omnibox.onInputChanged.addListener(async (text, sendSuggestion) => {
      const linkData = await queryLinks(web5);
      const recs = suggestLink(text, linkData.map((link) => link.data));
      sendSuggestion(
        recs.map((rec) => {
          return {
            content: rec.name,
            description: `<dim><match>${rec.name}</match></dim> - <url>${rec.url}</url>`
          }
        })
      )
  })
  chrome.omnibox.onInputEntered.addListener(async (string,) => {
    const linkData = await queryLinks(web5);
    const links = linkData.map((link) => link.data);
    const url = findLink(string, links);
    if (url) {
      chrome.tabs.update({ url });
    }
  });
};

const webNavigationHandler = async (web5: Web5Connection) => {
  const linkData = await queryLinks(web5);
  const links = linkData.map((link) => link.data);
  chrome.webNavigation.onBeforeNavigate.addListener((details) => {
    const regexp = new RegExp("go%2F([a-zA-Z0-9_]*)");
    const regexMatch = details.url.match(regexp);
    if (regexMatch) {
      const target = regexMatch[1];
      const url = findLink(target, links);
      if (url) {
        chrome.tabs.update({ url });
      }
    }
  });
};



connect().then(async (web5) => {
  await omniboxListener(web5);
  await webNavigationHandler(web5);
})

