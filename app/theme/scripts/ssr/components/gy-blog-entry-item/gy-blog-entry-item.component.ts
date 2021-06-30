import { Component } from "@ribajs/core";
import { hasChildNodesTrim } from "@ribajs/utils/src/dom";
import {
  BlogService,
  SectionObject,
  Post,
  StrapiGqlImageFragmentFragment,
} from "../../../common";
import pugTemplate from "./gy-blog-entry-item.component.pug";

export interface Scope {
  post?: Post;
  showDate: boolean;
  showCategory: boolean;
  catTextAt: number;
  sections: SectionObject;
  md: string;
  image?: StrapiGqlImageFragmentFragment;
}

export class GyBlogEntryItemComponent extends Component {
  public static tagName = "gy-blog-entry-item";
  public _debug = false;
  protected autobind = true;
  protected blog = BlogService.getInstance();

  scope: Scope = {
    post: undefined,
    showDate: true,
    showCategory: true,
    catTextAt: 300,
    sections: {},
    md: "",
    image: undefined,
  };

  static get observedAttributes(): string[] {
    return ["post", "cat-text-at", "show-date", "show-category"];
  }

  protected requiredAttributes() {
    return ["post"];
  }

  protected async beforeBind() {
    await super.beforeBind();
    if (this.scope.post) {
      this.scope.sections = await this.blog.getSectionsObject(this.scope.post);
      this.scope.md =
        this.scope.sections.text?.text ||
        this.scope.sections.podcastEpisode?.description ||
        "";

      this.scope.image =
        this.scope.sections.image?.image ||
        this.scope.sections.podcastEpisode?.image ||
        undefined;
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(GyBlogEntryItemComponent.observedAttributes);
  }

  protected template() {
    if (!hasChildNodesTrim(this)) {
      return pugTemplate(this.scope);
    } else {
      return null;
    }
  }
}
