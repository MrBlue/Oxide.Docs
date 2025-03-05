import { readFileSync } from "fs";
import IDocs from "../entities/hooks/docs";
import IHook from "../entities/hooks/hook";

export function getHookJson() {
  const hookData = readFileSync("docs.json").toString();
  const hooks = JSON.parse(hookData) as IDocs;
  return hooks.Hooks.filter(hook => hook.Category !== "_Patches" && !hook.HookName.includes("["));
}

// Get the return type of the hook from the CodeAfterInjection
function getReturnTypeFromCodeAfterInjection(hook: IHook): string | null {
  if (!hook.CodeAfterInjection) return null;
  
  const code = hook.CodeAfterInjection.replace(/global::/g, '');
  const typeMatch = /\breturnvar is ([a-zA-Z0-9:\.]+)/.exec(code);
  if (typeMatch && typeMatch[1]) return typeMatch[1];
  return null;
}

export function getGroupedHooks() {
  const hooksJson = getHookJson();

  var out = {} as { [key: string]: { [key: string]: IHook[] } };

  hooksJson.forEach((hook) => {
    const returnType = getReturnTypeFromCodeAfterInjection(hook);
    if (returnType) {
      hook.NeedReturnType = returnType;
    }
    if (!out[hook.Category]) {
      out[hook.Category] = {};
    }

    if (!out[hook.Category][hook.HookName]) {
      out[hook.Category][hook.HookName] = [];
    }

    out[hook.Category][hook.HookName].push(hook);
  });

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
