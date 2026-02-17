import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { UserFeedCard } from '../components/UserFeedCard';
import { useUserFeedSse } from '../hooks/useUserFeedSse';
import { CreatePostForm, CreatePostFormValues } from '../components/forms/CreatePostForm';
import { BASE_API_URL } from '../constants';
import { UserDataResponse, UserPostsResponse } from '../types';

export function UserPage() {
  const queryClient = useQueryClient();
  const { username } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userQuery = useQuery({
    queryKey: ['user-by-username', username],
    enabled: !!username,
    queryFn: async (): Promise<UserDataResponse> => {
      const response = await fetch(`${BASE_API_URL}/users/username/${username}`);
      if (!response.ok) {
        throw new Error('Failed to load user.');
      }
      return (await response.json()) as UserDataResponse;
    },
  });

  const authorId = userQuery.data?.id ?? '';
  const onNewPost = useCallback(async () => {
    if (!authorId) {
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['posts-by-user-id', authorId] });
  }, [authorId, queryClient]);

  useUserFeedSse(authorId, onNewPost);

  const userPostsQuery = useQuery({
    queryKey: ['posts-by-user-id', userQuery.data?.id],
    enabled: !!userQuery.data?.id,
    queryFn: async (): Promise<UserPostsResponse> => {
      const response = await fetch(`${BASE_API_URL}/posts/users/${userQuery.data?.id}`);
      if (!response.ok) {
        throw new Error('Failed to load posts.');
      }
      return (await response.json()) as UserPostsResponse;
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (values: CreatePostFormValues) => {
      const authorId = userQuery.data?.id;
      if (!authorId) {
        throw new Error('User is not selected.');
      }

      const response = await fetch(`${BASE_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId,
          title: values.title.trim(),
          content: values.content.trim(),
        }),
      });

      if (!response.ok) {
        let message = 'Failed to create post.';
        try {
          const data = (await response.json()) as { message?: string | string[] };
          if (Array.isArray(data.message)) {
            message = data.message.join(', ');
          } else if (typeof data.message === 'string') {
            message = data.message;
          }
        } catch {
          // Keep generic error message when response is not JSON.
        }
        throw new Error(message);
      }
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onSubmit = async (values: CreatePostFormValues) => {
    try {
      await createPostMutation.mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ['posts-by-user-id', userQuery.data?.id] });
      closeModal();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Failed to create post.');
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  return (
    <section className="page-section">
      <header className="page-header">
        <div className="page-title-row">
          <h1 className="page-title">User Page</h1>
          <button
            type="button"
            className="add-post-button"
            onClick={() => setIsModalOpen(true)}
            disabled={userQuery.isLoading || !!userQuery.error}
          >
            Add post
          </button>
        </div>
        <p className="page-description">Posts by @{username ?? 'unknown'}</p>
      </header>

      {userQuery.isLoading ? <p className="feed-empty">Loading user...</p> : null}
      {userQuery.error ? <p className="feed-empty">Failed to load user.</p> : null}
      {userPostsQuery.isLoading ? <p className="feed-empty">Loading posts...</p> : null}
      {userPostsQuery.error ? <p className="feed-empty">Failed to load posts.</p> : null}
      {!userQuery.error && !userPostsQuery.isLoading && !userPostsQuery.error ? (
        <UserFeedCard
          posts={userPostsQuery.data?.posts ?? []}
          emptyMessage="This user has no posts yet."
        />
      ) : null}

      {isModalOpen && (
        <CreatePostForm
          onSubmit={onSubmit}
          onModalClose={closeModal}
          createPostMutation={createPostMutation}
        />
      )}
    </section>
  );
}
