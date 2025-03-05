import { readFileSync } from "fs";
import IDocs from "../entities/hooks/docs";
import IHook from "../entities/hooks/hook";

// Todo: improve code to merge both JSON files docs.json and docs_core.json
// this quick implementation is for test. 
// docs_core.json contain hook info for oxide.code, oxide.csharp and oxide.rust
export function getHookJson(filename: string) {
  const hookData = readFileSync(filename).toString();
  const hooks = JSON.parse(hookData) as IDocs;
  return hooks.Hooks.filter(hook => hook.Category !== "_Patches" && !hook.HookName.includes("["));
}

export function getGroupedHooks() {
  const docsNames: string[] = ["docs.json", "docs_core.json"];

  var out = {} as { [key: string]: { [key: string]: IHook[] } };

  for (let filename of docsNames) {
	const hooksJson = getHookJson(filename);
	hooksJson.forEach((hook) => {
	  if (!out[hook.Category]) {
	    out[hook.Category] = {};
	  }
 
	  if (!out[hook.Category][hook.HookName]) {
	    out[hook.Category][hook.HookName] = [];
	  }

	  out[hook.Category][hook.HookName].push(hook);
	});
  }

  // Sort categories, hooks and hooks by TargetType and MethodData.MethodName using tolocaleCompare
  Object.keys(out).forEach((category) => {
    out[category] = Object.keys(out[category])
      .sort((a, b) => a.localeCompare(b))
      .reduce((obj, key) => {
        obj[key] = out[category][key].sort((a, b) => {
          if (a.TargetType === b.TargetType) {
            return a.MethodData.MethodName.localeCompare(b.MethodData.MethodName);
          }
          return a.TargetType.localeCompare(b.TargetType);
        });
        return obj;
      }, {});
  });

  return out;
}

export function getHooksSidebar() {
  let data = getGroupedHooks();

  return Object.keys(data)
    .sort()
    .map((category) => {
      return {
        text: category + " (" + Object.keys(data[category]).length + ")",
        collapsed: true,
        items: Object.keys(data[category]).map((hookName) => {
          return {
            text: hookName,
            link: `/hooks/${category.toLowerCase()}/${hookName}`,
          };
        }),
      };
    });
}
