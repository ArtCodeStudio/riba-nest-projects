import { Component } from "@ribajs/core";
import { ToolbarService } from "../../services/toolbar";

export interface Link {
  name: string;
  link: string;
}

export interface Scope {
  type: string;
  items: Link[];
}

export class GyLinkListComponent extends Component {
  public static tagName = "gy-link-list";
  public _debug = false;
  protected autobind = true;

  protected ToolbarService = ToolbarService.getInstance();

  scope: Scope = {
    type: "toolbar",
    items: [],
  };

  static get observedAttributes(): string[] {
    return ["type"];
  }

  constructor() {
    super();
  }

  protected async beforeBind() {
    await super.beforeBind();
    if (this.scope.type === "toolbar") {
      try {
        const toolbar = await this.ToolbarService.get();
        // console.debug("toolbar", toolbar);
        if (toolbar) {
          if (toolbar?.items) {
            this.scope.items = toolbar.items;
          }
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      console.warn("Unknown gy-link-list type: " + this.scope.type);
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(GyLinkListComponent.observedAttributes);
  }

  protected template(): null {
    return null;
  }
}
