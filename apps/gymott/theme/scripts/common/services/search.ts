import { HttpService } from "@ribajs/core";
import { defaultCache } from "./cache";
import { SearchResult } from "../types/search-result";

export class SearchService {
  protected static instance: SearchService;

  protected constructor() {
    /** protected */
  }

  public static getInstance() {
    if (SearchService.instance) {
      return SearchService.instance;
    }
    SearchService.instance = new SearchService();
    return SearchService.instance;
  }

  async _get(term: string) {
    const res = await HttpService.getJSON<SearchResult[]>(url, {});
    if (res.status !== 200) {
      throw new Error(res.body.toString());
    }
    return res.body;
  }

  async get(term: string) {
    const url = "/api/search/" + encodeURIComponent(term);
    return defaultCache.resolve<SearchResult[]>(
      url,
      async () => {
        const res = await HttpService.getJSON<SearchResult[]>(url, {});
        return res.body;
      },
      "5 mins"
    );
  }
}