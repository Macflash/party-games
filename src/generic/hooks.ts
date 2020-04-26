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

    return [ state, setter, isDirty, setDirty ];
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

    return [state, isLoading, refresh ];
}