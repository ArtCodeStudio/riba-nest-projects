import type { ManagerApp } from "@artcodestudio/node-app-manager/src/types/app";
import type { ManagerOptions } from "@artcodestudio/node-app-manager/src/types/options";
import type { RedbirdOptions } from "@artcodestudio/node-app-manager/src/redbird/types/options";

import { resolve } from "path";

export const manager: ManagerOptions = {
  pkgName: "@artcodestudio/node-app-manager",
  domain: "manage.artandcode.de",
  target: {
    port: 3000,
  },
  pm2: {},
};

export const redbird: RedbirdOptions = {
  /**
   * http port is needed for LetsEncrypt challenge during request / renewal. Also enables automatic http->https redirection for registered https routes.
   */
  port: 80,
  letsencrypt: {
    path: resolve(__dirname, "../..", "certs"),
    /**
     *  LetsEncrypt minimal web server port for handling challenges. Routed 80->9999, no need to open 9999 in firewall.
     */
    port: 9999,
  },
  ssl: {
    http2: true,
    redirect: false, // False to disable HTTPS auto redirect to this route.
    /**
     * SSL port used to serve registered https routes with LetsEncrypt certificate.
     */
    port: 443,
  },
  appDefaults: {
    ssl: {
      letsencrypt: {
        email: "hi@artandcode.studio", // Domain owner/admin email
        production: true, // WARNING: Only use this flag when the proxy is verified to work correctly to avoid being banned!
      },
    },
  },
};
export const apps: ManagerApp[] = [
  {
    pkgName: "@gymott/nest",
    domain: "gym.artandcode.de",
    target: {
      port: 3001,
    },
    pm2: {
      script: "yarn workspace @gymott/nest watch",
      // The app restarts by itself on changes but this is not working fpr new packages, so we also watch the package.json with pm2
      watch: ["package.json"],
      env: {
        STRAPI_INTERN_URL: "http://127.0.0.1:3002",
        STRAPI_EXTERN_URL: "https://gym-strapi.artandcode.de",
        STRAPI_STUDENT_INTERN_URL: "http://127.0.0.1:3003",
        STRAPI_STUDENT_EXTERN_URL: "https://gym-strapi-student.artandcode.de",
        NEST_INTERN_URL: "http://127.0.0.1:3001",
        NEST_EXTERN_URL: "https://gym.artandcode.de/",
      },
    },
  },
  {
    pkgName: "@gymott/strapi",
    domain: "gym-strapi.artandcode.de",
    target: {
      port: 3002,
    },
    pm2: {
      script: "npm run develop",
      watch: [".cache", "package.json"],
      env: {
        // Yarn 2 automatically injects the .pnp file over NODE_OPTIONS, this causes problems with packages that do not belong to the workspace
        NODE_OPTIONS: "",
        HOST: "127.0.0.1",
        ADMIN_URL: "/admin",
        DATABASE_CONNECTOR: "bookshelf",
        DATABASE_CLIENT: "sqlite",
        DATABASE_NAME: "strapi",
        DATABASE_USERNAME: "strapi",
      },
    },
  },
  {
    pkgName: "@gymott/strapi-student",
    domain: "gym-strapi-student.artandcode.de",
    target: {
      port: 3003,
    },
    pm2: {
      script: "npm run develop",
      watch: [".cache", "package.json"],
      env: {
        // Yarn 2 automatically injects the .pnp file over NODE_OPTIONS, this causes problems with packages that do not belong to the workspace
        NODE_OPTIONS: "",
        HOST: "127.0.0.1",
        ADMIN_URL: "/admin",
        DATABASE_CONNECTOR: "bookshelf",
        DATABASE_CLIENT: "sqlite",
        DATABASE_NAME: "strapi",
        DATABASE_USERNAME: "strapi",
      },
    },
  },
];
