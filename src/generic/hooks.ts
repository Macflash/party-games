import * as React from "react";
import { Get, CB } from "./apis";

/**
 * Use state with a dirty flag
 */
export function useDirtyState<T>(initial: T, startDirty = false): [T, CB<T>, boolean, CB<boolean>] {
    const [state, setState] = React.useState<T>(initial);
    const [isDirty, setDirty] = React.useState(startDirty);

    const setter = React.useCallback((newState: T) => {
        setDirty(true);
        setState(newState);
    }, [setState, setDirty]);

    return [state, setter, isDirty, setDirty];
}

/**
 * Use an api call
 * @param getter Function to load the data
 * @returns [data, isLoading, refresh()]
 */
export function useGet<T>(getter: Get<T>): [T | null, boolean, () => void] {
    const [state, setState] = React.useState<T | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    const refresh = React.useCallback(async () => {
        setIsLoading(true);
        const newState = await getter();
        setState(newState);
        setIsLoading(false);
    }, [getter, setState, setIsLoading]);

    React.useEffect(() => { refresh() }, []);

    return [state, isLoading, refresh];
}

// This is bad actually.... don't do this from rendering! use pure rendering controls dude
// /** this one will just ALWAYS run. BUT you CAN NEVER change the action */
// export function useInterval(interval: number, action: CB) {
//     React.useEffect(() => {
//         var int = setInterval(action, interval);
//         return () => clearInterval(int);
//     }, []);
// }


// // This one will start and stop based on some value. E.G. YOUR turn?
// // TODO handle starting and stopping...
// var intervals: {[key: string]: boolean} = {};
// var counter = 0;
// export function usePausableInterval(pause: boolean, interval: number, action: CB) {
//     // Get an immutable id for this instance of the hook
//     // this will track the pause status
//     const [id] = React.useState(counter++);

//     React.useEffect(() => {
//         var int = setInterval(action, interval);
//         return () => clearInterval(int);
//     }, [action, interval]);
// }
