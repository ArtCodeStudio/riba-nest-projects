import "@ribajs/ssr/src/polyfills";
import "../common/types/ical";
import { SSRModule } from "@ribajs/ssr";
import { Riba, coreModule } from "@ribajs/core";
// import { i18nModule, LocalesStaticService } from "@ribajs/i18n";
// import { ready } from "@ribajs/utils/src/dom";

// Common
import * as commonBinders from "../common/binders";
import * as commonComponents from "../common/components";
import * as commonFormatters from "../common/formatters";

// Own
import * as pageComponents from "./pages";
import * as components from "./components";
import * as binders from "./binders";
import * as formatters from "./formatters";
// import locales from "./locales";

declare global {
  interface Window {
    model: any;
  }
}

window.model = window.model || window.ssr.templateVars || {};

const riba = new Riba();

// These Riba settings are necessary for the ssr
riba.configure({
  prefix: "ssr-rv",
  blockUnknownCustomElements: false,
  templateDelimiters: ["[", "]"],
});

// Regist custom components
riba.module.regist({
  components: { ...commonComponents, ...pageComponents, ...components },
  binders: { ...commonBinders, ...binders },
  formatters: { ...commonFormatters, ...formatters },
});

// const localesService = new LocalesStaticService(locales, undefined, false);
// window.riba.module.regist(i18nModule(localesService));

// Regist modules
riba.module.regist(coreModule);
riba.module.regist(SSRModule);

console.log("Hello from Riba");

// After all components are bound wie trigger the ssr ready event,
// as soon as this event is triggered the ssr rendering will be done returns the rendered html
riba.lifecycle.events.on("ComponentLifecycle:allBound", () => {
  console.debug("ready!");
  window.ssr.events.trigger("ready");
});

riba.lifecycle.events.on("ComponentLifecycle:timeout", () => {
  console.error("timeout!");
  window.ssr.events.trigger("ready");
});

const view = riba.bind(document.body, window.model);

// WORKAROUND / FIXME view.traverse method seems not to be working in jsdom / happy-dom
view.registComponents();
