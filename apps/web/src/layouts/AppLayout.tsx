import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { LeftMenu } from '../components/LeftMenu';
import { CreateUserForm, CreateUserFormValues } from '../components/forms/CreateUserForm';
import { BASE_API_URL } from '../constants';

export function AppLayout() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createUserMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      const response = await fetch(`${BASE_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username.trim(),
          email: values.email.trim(),
          firstName: values.firstName.trim(),
          lastName: values.secondName.trim(),
        }),
      });

      if (!response.ok) {
        let message = 'Failed to create user.';
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

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      await createUserMutation.mutateAsync(values);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['menu-users'] }),
        queryClient.invalidateQueries({ queryKey: ['users'] }),
      ]);
      closeModal();
    } catch (error) {
      console.log(error instanceof Error ? error.message : 'Failed to create user.');
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
    <div className="mblg-app__shell">
      <aside className="mblg-app__sidebar">
        <LeftMenu />
      </aside>

      <main className="mblg-app__main">
        <header className="mblg-app__header">
          <button className="mblg-app__add-user-button" onClick={() => setIsModalOpen(true)}>
            Add user
          </button>
        </header>

        <section className="mblg-app__content">
          <Outlet />
        </section>
      </main>

      {isModalOpen && (
        <CreateUserForm
          onSubmit={onSubmit}
          onModalClose={closeModal}
          createUserMutation={createUserMutation}
        />
      )}
    </div>
  );
}
