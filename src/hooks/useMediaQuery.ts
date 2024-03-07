import { useEffect, useState } from "react";
import { isBrowser } from "@/helpers/checkClient";

type MediaQuery = {
    windowWidth: number;
    isDesiredWidth: boolean;
};

const useMediaQuery = (minWidth: string | number) => {
    const [state, setState] = useState<MediaQuery>({
        windowWidth: isBrowser() ? window.innerWidth : 0,
        isDesiredWidth: false,
    });

    useEffect(() => {
        if (!isBrowser()) return;

        const resizeHandler = () => {
            const currentWindowWidth = window.innerWidth;
            const isDesiredWidth = currentWindowWidth < Number(minWidth);
            setState({ windowWidth: currentWindowWidth, isDesiredWidth });
        };

        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, [minWidth]);

    return state.isDesiredWidth;
};

export default useMediaQuery;
