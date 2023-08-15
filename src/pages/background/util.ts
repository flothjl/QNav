import { QNavLink } from "../../types";

export const findLink = (target: string, links: QNavLink[]) => {
    for (var i = 0; i < links.length; i++) {
        if (target == links[i].name) {
            return links[i].url;
        }
    }
};