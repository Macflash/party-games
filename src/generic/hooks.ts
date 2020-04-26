import * as React from "react";
import { Get } from "./apis";

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