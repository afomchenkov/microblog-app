import { useEffect, useRef } from 'react';
import { PostData } from '../types';
import { BASE_API_URL } from '../constants';

export function useUserFeedSse(userId: string, onNewPost: (post: PostData) => void) {
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    const es = new EventSource(`${BASE_API_URL}/sse/users/${userId}/feed`);
    esRef.current = es;

    const handler = (e: MessageEvent) => {
      const post = JSON.parse(e.data);
      onNewPost(post);
    };

    es.addEventListener('post.created', handler);

    es.onerror = () => {
      // browser will auto-reconnect;
      // optionally show a "reconnecting" UI state
    };

    return () => {
      es.removeEventListener('post.created', handler);
      es.close();
      esRef.current = null;
    };
  }, [userId, onNewPost]);
}
