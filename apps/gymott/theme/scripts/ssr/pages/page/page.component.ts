import { PageComponent } from "@ribajs/ssr";
import pugTemplate from "./page.component.pug";
import { PageService } from "../../services";

export interface Scope {
  title: string;
  params: PagePageComponent["ctx"]["params"];
  assets: any[];
  content: any;
  blogEntries: any[];
  calendarKey: string;
  page: any;
}

export class PagePageComponent extends PageComponent {
  public static tagName = "pages-page";
  public _debug = false;
  protected autobind = true;

  protected pageService = PageService.getInstance();

  scope: Scope = {
    title: "{params.slug | capitalize}",
    page: {},
    assets: [],
    blogEntries: [],
    params: {},
    content: {},
    calendarKey: "",
  };

  static get observedAttributes(): string[] {
    return [];
  }

  constructor() {
    super();
    this.scope.params = this.ctx.params;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(PagePageComponent.observedAttributes);
  }

  protected requiredAttributes(): string[] {
    return [];
  }

  protected async beforeBind() {
    this.head.title = "You are " + this.ctx.params.slug;
    try {
      const pages = await this.pageService.get([this.ctx.params.slug]);
      const page = pages[0];
      this.scope.page = page;
      // TODO move to custom strapi model and remove from page?
      this.scope.calendarKey = page?.["calendar_key"] || "";

      console.debug("page", page);
      if (page) {
        if (page?.title) {
          this.scope.title = page?.title;
        }
        if (page?.content) {
          this.scope.content = page.content;
        }
        if (page?.assets) {
          for (const asset of page.assets) {
            console.debug(asset);
            this.scope.assets.push(asset);
          }
        }

        // blog entries
        if (page?.["blog_entries"]) {
          for (const blogEntry of page?.["blog_entries"]) {
            this.scope.blogEntries.push(blogEntry);
          }
        }
        // TODO
        // if (page?.["blog_categories"]) {
        //   if (page?.["blog_categories"]["blog_entries"] !== undefined) {
        //     for (const blogEntry of page?.["blog_categories"]["blog_entries"]) {
        //       let found = false;
        //       for (const existingEntry of this.scope.blogEntries) {
        //         if (existingEntry.id === blogEntry.id) {
        //           found = true;
        //         }
        //       }
        //       if (!found) {
        //         this.scope.blogEntries.push(blogEntry);
        //       }
        //     }
        //   }
        // }
        // TODO sort blog entries
      }
    } catch (error) {
      this.throw(error);
    }
    this.head.title = this.scope.title;
    await super.beforeBind();
  }

  protected async afterBind() {
    await super.afterBind();
  }

  protected template() {
    return pugTemplate(this.scope);
  }
}
