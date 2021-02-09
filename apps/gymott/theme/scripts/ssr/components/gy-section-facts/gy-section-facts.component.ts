import { Component } from "@ribajs/core";
import pugTemplate from "./gy-section-facts.component.pug";

export interface Scope {
  section?: any;
}

export class GySectionFactsComponent extends Component {
  public static tagName = "gy-section-facts";
  public _debug = false;
  protected autobind = true;

  scope: Scope = {
    section: null,
  };

  static get observedAttributes() {
    return ["section"];
  }

  protected requiredAttributes() {
    return ["section"];
  }

  constructor(element?: HTMLElement) {
    super(element);
  }

  protected async afterBind() {
    await super.afterBind();
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(GySectionFactsComponent.observedAttributes);
  }

  protected template() {
    return pugTemplate(this.scope);
  }
}
