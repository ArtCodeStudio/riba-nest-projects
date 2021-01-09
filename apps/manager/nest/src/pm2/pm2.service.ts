import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ManagerApp } from '../types/app';
import * as pm2 from 'pm2';
import type { Proc, ProcessDescription } from 'pm2';
import { promisify } from 'util';
import { exists } from '../helper/cmd';

@Injectable()
export class Pm2Service
  implements OnApplicationBootstrap, OnApplicationShutdown {
  log = new Logger('Pm2');

  // constructor() {}

  async onApplicationBootstrap() {
    this.connect();
  }

  onApplicationShutdown() {
    this.disconnect();
  }

  protected onError(err: Error) {
    if (err) {
      this.log.debug('Stop');
      this.log.error(err);
      this.disconnect();
      throw err;
    }
  }

  public async connect() {
    this.log.debug('connect');
    const pm2Exists = await exists('pm2');
    this.log.debug('exists: ' + pm2Exists);
    if (!pm2Exists) {
      throw new Error(
        'pm2 not found, do you have pm2 installed globally with npm or yarn? If not, please follow the instructions on https://pm2.keymetrics.io/docs/usage/quick-start/',
      );
    }
    pm2.connect(this.onError.bind(this));
  }

  public async disconnect() {
    this.log.debug('disconnect');
    pm2.disconnect();
  }

  /**
   *
   * @param app
   * @see https://pm2.keymetrics.io/docs/usage/pm2-api/#programmatic-api
   */
  public async startApp(app: ManagerApp) {
    this.log.debug(`Start new process "${app.pkgName}"`);
    return new Promise((resolve, reject) => {
      pm2.start(app.pm2, (err: Error, proc: Proc) => {
        if (err) {
          this.log.error(err);
          return reject(err);
        }
        this.log.log(`Process started: ${app.pm2.name} on ${app.host}`);
        resolve(proc);
      });
    });
  }

  /**
   *
   * @param apps
   * @see https://pm2.keymetrics.io/docs/usage/pm2-api/#programmatic-api
   */
  public async startApps(apps: ManagerApp[], excludeName: string[]) {
    for (const app of apps) {
      if (!excludeName.includes(app.pkgName)) {
        await this.startApp(app);
      }
    }
  }

  public async delete(id: number | string) {
    return new Promise((resolve, reject) => {
      pm2.delete(id, (err, proc) => {
        if (err) {
          this.log.error(err);
          return reject(err);
        }
        return resolve(proc);
      });
    });
  }

  public async stop(id: number | string) {
    return new Promise((resolve, reject) => {
      pm2.stop(id, (err, proc) => {
        if (err) {
          this.log.error(err);
          return reject(err);
        }
        return resolve(proc);
      });
    });
  }

  public async restartApp(app: ManagerApp) {
    this.log.debug(`Restart process "${app.pkgName}"`);
    let proc = await this.getProcessByName(app.pm2.name);
    if (!proc) {
      this.log.warn('Process not found!');
      return;
    }
    proc = await this.stop(proc.pid);
    proc = await this.delete(proc.pid);
    return this.startApp(app);
  }

  public async getProcessByName(slug: string) {
    try {
      const processDescriptionList = await promisify(pm2.list)();
      const matches = processDescriptionList.filter(
        (proc) => proc.name === slug,
      );
      if (matches.length > 0) {
        return matches[0];
      }
      return null;
    } catch (error) {
      this.log.error(error);
      return null;
    }
  }
}
