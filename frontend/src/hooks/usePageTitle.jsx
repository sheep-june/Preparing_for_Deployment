import { useEffect } from "react";

const usePageTitle = (title) => {
    useEffect(() => {
        if (!title) return;
        const $title = document.getElementsByTagName("title")[0];
        $title.innerText = title;
    }, [title]);
};

export default usePageTitle;
