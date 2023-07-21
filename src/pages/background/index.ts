import { connectWeb5, configureProtocol, linksRecordsQuery } from "../../util";
import { qGoProtocol } from "../../protocols";
import { Web5Connection } from "../../types";
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
    recs.push({ record, data, id });
  }
  return recs;
};

const omniboxListener = async (web5: Web5Connection) => {
  chrome.omnibox.onInputEntered.addListener(async (string, ) => {
    const linkData = await queryLinks(web5);
    const links = linkData.map((link) => link.data);
    console.log(links)
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

