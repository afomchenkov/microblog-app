import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { BASE_API_URL } from '../constants';
import { UserDataResponse } from '../types';
// @ts-expect-error: side-effect import of SCSS without type declarations
import './UserDetailPage.scss';

export function UserDetailPage() {
  const { username } = useParams();

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

  return (
    <section className="page-section">
      <header className="page-header">
        <h1 className="page-title">User Details</h1>
        <p className="page-description">Profile for @{username ?? 'unknown'}</p>
        <Link to={`/users/${username}`} className="user-page-link">
          Back to User Page
        </Link>
      </header>

      {userQuery.isLoading ? <p className="feed-empty">Loading user details...</p> : null}
      {userQuery.error ? <p className="feed-empty">Failed to load user details.</p> : null}

      {userQuery.data ? (
        <article className="mblg__user-detail-card">
          <h2 className="mblg__user-detail-card-title">{userQuery.data.username}</h2>
          <p className="mblg__user-detail-row">
            <strong>ID:</strong> {userQuery.data.id}
          </p>
          <p className="mblg__user-detail-row">
            <strong>Email:</strong> {userQuery.data.email}
          </p>
          <p className="mblg__user-detail-row">
            <strong>First name:</strong> {userQuery.data.firstName}
          </p>
          <p className="mblg__user-detail-row">
            <strong>Last name:</strong> {userQuery.data.lastName}
          </p>
          <p className="mblg__user-detail-row">
            <strong>Created at:</strong> {new Date(userQuery.data.createdAt).toLocaleString()}
          </p>
          <p className="mblg__user-detail-row">
            <strong>Updated at:</strong> {new Date(userQuery.data.updatedAt).toLocaleString()}
          </p>
        </article>
      ) : null}
    </section>
  );
}
