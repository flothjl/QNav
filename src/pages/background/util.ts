import { QGoLink } from "../../types";

export const findLink = (target: string, links: QGoLink[]) => {
    for (var i = 0; i < links.length; i++) {
        if (target == links[i].name) {
            return links[i].url;
        }
    }
};