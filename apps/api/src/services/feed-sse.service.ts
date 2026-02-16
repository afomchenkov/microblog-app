import { Injectable, MessageEvent } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

type ChannelId = string;

export const userFeedChannel = (authorId: string) => `feed:user:${authorId}`;

@Injectable()
export class FeedSseService {
  private subjects = new Map<ChannelId, Subject<MessageEvent>>();

  // Users subscribe to a channel (author profile feed)
  streamForUser(channelId: ChannelId): Observable<MessageEvent> {
    let subject = this.subjects.get(channelId);
    if (!subject) {
      subject = new Subject<MessageEvent>();
      this.subjects.set(channelId, subject);
    }

    subject.next({ type: 'post:start_subscription', data: { ts: Date.now(), channelId } });

    return subject.asObservable();
  }

  push(channelId: ChannelId, type: string, data: object) {
    const subject = this.subjects.get(channelId);

    if (subject) {
      subject.next({ type, data });
    }
  }
}
