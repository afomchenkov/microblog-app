import { useState } from 'react';
import { useForm } from 'react-hook-form';
// @ts-expect-error: side-effect import of SCSS without type declarations
import './Form.scss';

export interface CreateUserFormValues {
  username: string;
  email: string;
  firstName: string;
  secondName: string;
}

export interface CreateUserFormParams {
  onSubmit: (values: CreateUserFormValues) => Promise<void>;
  onModalClose: () => void;
  createUserMutation: {
    isPending: boolean;
  };
}

export function CreateUserForm({
  onSubmit,
  onModalClose,
  createUserMutation,
}: CreateUserFormParams) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    defaultValues: {
      username: '',
      email: '',
      firstName: '',
      secondName: '',
    },
  });

  const closeModal = () => {
    setSubmitError(null);
    onModalClose();
    reset();
  };

  return (
    <div className="mblg-app__modal-overlay" onClick={closeModal}>
      <div
        className="mblg-app__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mblg-app__modal-header">
          <h2 id="add-user-title" className="mblg-app__modal-title">
            Add New User
          </h2>
          <button
            type="button"
            className="mblg-app__modal-close"
            onClick={closeModal}
            aria-label="Close"
          >
            x
          </button>
        </div>

        <form className="mblg-app__modal-form" onSubmit={handleSubmit(onSubmit)}>
          <label className="form-field">
            <span>Username</span>
            <input
              type="text"
              {...register('username', {
                required: 'Username is required',
              })}
            />
            {errors.username ? <small>{errors.username.message}</small> : null}
          </label>

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email',
                },
              })}
            />
            {errors.email ? <small>{errors.email.message}</small> : null}
          </label>

          <label className="form-field">
            <span>First Name</span>
            <input
              type="text"
              {...register('firstName', {
                required: 'First name is required',
              })}
            />
            {errors.firstName ? <small>{errors.firstName.message}</small> : null}
          </label>

          <label className="form-field">
            <span>Second Name</span>
            <input
              type="text"
              {...register('secondName', {
                required: 'Second name is required',
              })}
            />
            {errors.secondName ? <small>{errors.secondName.message}</small> : null}
          </label>

          {submitError ? <p className="form-error">{submitError}</p> : null}

          <div className="mblg-app__modal-actions">
            <button type="button" className="secondary-button" onClick={closeModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create user'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
