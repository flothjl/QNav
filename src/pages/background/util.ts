import { QNavLink } from "../../types";

export const findLink = (target: string, links: QNavLink[]) => {
    for (var i = 0; i < links.length; i++) {
        if (target == links[i].name) {
            return links[i].url;
        }
    }
};

export function escapeXml(xmlString: string): string {
    return xmlString.replace(/[<>&'"]/g, (char) => {
        switch (char) {
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '&':
                return '&amp;';
            case "'":
                return '&apos;';
            case '"':
                return '&quot;';
            default:
                return char;
        }
    });
};

// Function to calculate similarity score between two strings
export function calculateSimilarity(str1: string, str2: string) {
    const set1 = new Set(str1.toLowerCase());
    const set2 = new Set(str2.toLowerCase());
    const intersectionSize = new Set([...set1].filter(x => set2.has(x))).size;
    const unionSize = new Set([...set1, ...set2]).size;
    const similarity = intersectionSize / unionSize;
    return similarity;
}
