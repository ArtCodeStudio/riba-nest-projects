import { Component } from "@ribajs/core";
import { hasChildNodesTrim } from "@ribajs/utils/src/dom";
import { PodloveService } from "../../services";
import { StrapiGqlPodcastEpisodeDetailFragmentFragment } from "../../../common";
import pugTemplate from "./gy-podcast-episode-item.component.pug";

export interface Scope {
  showDate: boolean;
  episode?: StrapiGqlPodcastEpisodeDetailFragmentFragment;
  catTextAt: number;
  episodeConfigUrl: string;
  md: string;
  configUrl: string;
}

export class GyPodcastEpisodeItemComponent extends Component {
  public static tagName = "gy-podcast-episode-item";
  public _debug = false;
  protected autobind = true;

  scope: Scope = {
    showDate: true,
    episode: undefined,
    catTextAt: 300,
    episodeConfigUrl: "",
    md: "",
    configUrl: PodloveService.getConfigPath(),
  };

  static get observedAttributes(): string[] {
    return ["episode", "cat-text-at", "show-date"];
  }

  protected requiredAttributes() {
    return ["episode"];
  }

  protected async beforeBind() {
    await super.beforeBind();
    if (!this.scope.episode?.slug) {
      this.throw(new Error("episode object with slug property is required!"));
      return;
    }

    this.scope.md =
      this.scope.episode.subtitle || this.scope.episode.description || "";

    this.scope.episodeConfigUrl = PodloveService.getEpisodeConfigPath(
      this.scope.episode.slug
    );
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(GyPodcastEpisodeItemComponent.observedAttributes);
  }

  protected template() {
    if (!hasChildNodesTrim(this)) {
      return pugTemplate(this.scope);
    } else {
      return null;
    }
  }
}
