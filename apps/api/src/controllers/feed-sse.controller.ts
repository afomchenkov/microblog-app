import { Controller, Sse, MessageEvent, Param } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeedSseService, userFeedChannel } from '../services/feed-sse.service';

@Controller('sse')
export class FeedController {
  constructor(private readonly sse: FeedSseService) {}

  @Sse('users/:authorId/feed')
  userFeed(@Param('authorId') authorId: string): Observable<MessageEvent> {
    return this.sse.streamForUser(userFeedChannel(authorId));
  }
}
