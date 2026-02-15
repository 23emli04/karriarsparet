import useFetch from "./useFetch.tsx";
import type {Page} from "../types/Page.ts";
import type {Education} from "../types/Education.ts";


interface UseAllEducationsPagedParams {
    page: number;
    size?: number;
}

export default function useAllEducationsPaged({
                                                  page,
                                                  size = 20,
                                              }: UseAllEducationsPagedParams) {

    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
        sortBy: "id",
        sortDirection: "DESC",
    });

    const url = `http://localhost:8080/api/educations?${params}`;

    return useFetch<Page<Education>>(url);
}
