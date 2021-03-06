import { Controller, Response, Post, Body, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { StrapiWebhookData } from './types';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('webhook')
export class WebhookController {
  constructor(protected readonly webhook: WebhookService) {
    //
  }

  @ApiExcludeEndpoint()
  @Post('strapi')
  async post(@Res() res: Response, @Body() body: StrapiWebhookData) {
    this.webhook.onWebhook(body);
    res.json();
  }
}
