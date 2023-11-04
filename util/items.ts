import * as fs from "fs";

import { ISkin } from "../entities/items/item"

export function replaceAll(toSearch: string, toReplace: string, replaceWith) {
  let replacedString: string = toSearch;

  for (let Idx = 0; Idx < toSearch.length; Idx++)
      replacedString = replacedString.replace(toReplace, replaceWith);

  return replacedString;
}

export function getItems() {
    let skinData = JSON.parse(fs.readFileSync("skins.json").toString()) as { itemKey : ISkin[] };
    return Object.keys(skinData)
      .map((category) => {
        return {
          text: category[0].toUpperCase() + category.substring(1) + (`(${skinData[category].length})`),
          link: `/core/items/${replaceAll(category, ".", "_")}`,
          collapsed: true,
          items: Object.keys(skinData[category]).map( (skins) => {
            let skin: ISkin = (skinData[category][skins] as ISkin);
            return {
                text: skin.Name,
                link: `/core/items/${category.toLowerCase()}/${skin.DefinitionId}`,
            }
          })
        };
      });
  }
  