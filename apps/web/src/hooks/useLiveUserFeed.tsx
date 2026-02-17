import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useUserFeedSse } from './useUserFeedSse';
import { PostData } from '../types';

export function useLiveUserFeed(userId: string) {
  const qc = useQueryClient();

  const onNewPost = useCallback(
    (post: PostData) => {
      qc.setQueryData(['feed', 'user', userId], (old: PostData[] | undefined) => {
        const prev = old ?? [];
        if (prev.some((p) => p.id === post.id)) return prev;
        return [post, ...prev];
      });
    },
    [qc, userId],
  );

  useUserFeedSse(userId, onNewPost);
}
