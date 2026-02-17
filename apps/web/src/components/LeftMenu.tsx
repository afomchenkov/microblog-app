import { useQuery } from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import { BASE_API_URL } from '../constants';
import { UsersResponse } from '../types';
// @ts-expect-error: side-effect import of SCSS without type declarations
import './LeftMenu.scss';

export function LeftMenu() {
  const usersQuery = useQuery({
    queryKey: ['menu-users'],
    queryFn: async (): Promise<UsersResponse> => {
      const response = await fetch(`${BASE_API_URL}/users`);
      if (!response.ok) {
        throw new Error('Failed to load users.');
      }
      return (await response.json()) as UsersResponse;
    },
  });

  const menuUsers = usersQuery.data?.users ?? [];

  return (
    <nav className="mblg__left-menu" aria-label="Primary">
      <h2 className="mblg__left-menu-title">Microblog</h2>

      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `mblg__left-menu-link${isActive ? ' mblg__left-menu-link-active' : ''}`
        }
      >
        Home
      </NavLink>

      <p className="mblg__left-menu-section-label">Users</p>
      <div className="mblg__left-menu-users">
        {usersQuery.isLoading ? <p className="mblg__left-menu-section-label">Loading...</p> : null}
        {usersQuery.error ? (
          <p className="mblg__left-menu-section-label">Failed to load users</p>
        ) : null}
        {menuUsers.map((user) => (
          <NavLink
            key={user.id}
            to={`/users/${user.username}`}
            className={({ isActive }) =>
              `mblg__left-menu-link${isActive ? ' mblg__left-menu-link-active' : ''}`
            }
          >
            {user.username}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
