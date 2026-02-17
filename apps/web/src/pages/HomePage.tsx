import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { HomeFeedCard } from '../components/HomeFeedCard';
import { BASE_API_URL } from '../constants';
import { PostsResponse, UsersResponse } from '../types';

const PAGE_SIZE = 10;

export function HomePage() {
  const postsQuery = useInfiniteQuery({
    queryKey: ['posts'],
    initialPageParam: 0,
    queryFn: async ({ pageParam }): Promise<PostsResponse> => {
      const response = await fetch(
        `${BASE_API_URL}/posts?offset=${pageParam}&numberPerPage=${PAGE_SIZE}`,
      );
      if (!response.ok) {
        throw new Error('Failed to load posts.');
      }
      return (await response.json()) as PostsResponse;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.posts.length < PAGE_SIZE) {
        return undefined;
      }
      return pages.length * PAGE_SIZE;
    },
  });
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async (): Promise<UsersResponse> => {
      const response = await fetch(`${BASE_API_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to load users.');
      }
      return (await response.json()) as UsersResponse;
    },
  });

  const postsWithUsernames = useMemo(() => {
    const usersById = new Map(
      (usersQuery.data?.users ?? []).map((user) => [user.id, user.username]),
    );
    return (postsQuery.data?.pages ?? [])
      .flatMap((page) => page.posts)
      .map((post) => ({
        ...post,
        authorUsername: usersById.get(post.authorId),
      }));
  }, [postsQuery.data?.pages, usersQuery.data?.users]);

  return (
    <section className="page-section">
      <header className="page-header">
        <h1 className="page-title">Homepage</h1>
        <p className="page-description">Global timeline from all users.</p>
      </header>

      {postsQuery.isLoading ? <p className="feed-empty">Loading posts...</p> : null}
      {postsQuery.error ? <p className="feed-empty">Failed to load posts.</p> : null}
      {!postsQuery.isLoading && !postsQuery.error ? (
        <HomeFeedCard
          posts={postsWithUsernames}
          hasMore={!!postsQuery.hasNextPage}
          isLoadingMore={postsQuery.isFetchingNextPage}
          onLoadMore={() => postsQuery.fetchNextPage()}
        />
      ) : null}
    </section>
  );
}
