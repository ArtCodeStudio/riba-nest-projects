import { Component } from "@ribajs/core";
import { replaceBodyPageClass } from "../../../common";

export type Scope = Record<string, never>;

export class BlogPageComponent extends Component {
  public static tagName = "blog-page";
  public _debug = false;

  scope: Scope = {};

  static get observedAttributes(): string[] {
    return [];
  }

  protected connectedCallback() {
    super.connectedCallback();
    replaceBodyPageClass(this);
    this.init(BlogPageComponent.observedAttributes);
  }

  protected template() {
    // See apps/gymott/theme/scripts/ssr/pages/blog/blog.component.pug
    return null;
  }
}
