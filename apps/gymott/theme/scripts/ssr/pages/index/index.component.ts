import { PageComponent } from "@ribajs/ssr";

import { GyHomeService } from "../../services/home";
import pugTemplate from "./index.component.pug";

export class IndexPageComponent extends PageComponent {
  public static tagName = "index-page";
  public _debug = false;
  protected autobind = true;
  protected homeService: GyHomeService = GyHomeService.getInstance();

  protected head = {
    title: "Startseite",
  };

  scope = {
    content: {},
  };

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(IndexPageComponent.observedAttributes);
  }

  protected requiredAttributes(): string[] {
    return [];
  }

  protected async beforeBind() {
    this.scope.content = await this.homeService.getHomeSections();
    await super.beforeBind();
  }

  protected async afterBind() {
    await super.afterBind(); // This must be called on the end of this function
  }

  protected template() {
    return pugTemplate(this.scope);
  }
}
