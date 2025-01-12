import ReturnBehaviour from "./returnBehaviour";

export default interface IHook {
    Type: number;
    Name: string;
    HookName: string;
    HookDescription?: string;
    HookParameters?: {[key: string]: string};
    ReturnType?: string;
    ReturnBehavior: ReturnBehaviour;
    TargetType: string;
    Category: string;
    MethodData: {
        MethodName: string;
        ReturnType: string;
        Arguments: {[key: string]: string};
    };
    CodeAfterInjection?: string;
}