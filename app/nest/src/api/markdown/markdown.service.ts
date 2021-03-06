/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
const remark = require('remark');
const strip = require('strip-markdown');
const html = require('remark-html');

@Injectable()
export class MarkdownService {
  public async strip(md: string) {
    const file = await remark().use(strip).process(md);
    return file.toString() as string;
  }

  public async html(md: string) {
    const file = await remark().use(html).process(md);
    return file.toString() as string;
  }
}
