import { useState } from 'react';
import { useForm } from 'react-hook-form';
// @ts-expect-error: side-effect import of SCSS without type declarations
import './Form.scss';
export interface CreatePostFormValues {
  title: string;
  content: string;
}

export interface CreatePostFormProps {
  onModalClose: () => void;
  onSubmit: (values: CreatePostFormValues) => Promise<void>;
  createPostMutation: {
    isPending: boolean;
  };
}

export function CreatePostForm({
  onModalClose,
  onSubmit,
  createPostMutation,
}: CreatePostFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    defaultValues: {
      title: '',
      content: '',
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
        aria-labelledby="add-post-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mblg-app__modal-header">
          <h2 id="add-post-title" className="mblg-app__modal-title">
            Add New Post
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
            <span>Title</span>
            <input
              type="text"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 120,
                  message: 'Title must be 120 characters or less',
                },
              })}
            />
            {errors.title ? <small>{errors.title.message}</small> : null}
          </label>

          <label className="form-field">
            <span>Content</span>
            <textarea
              {...register('content', {
                required: 'Content is required',
                maxLength: {
                  value: 280,
                  message: 'Content must be 280 characters or less',
                },
              })}
            />
            {errors.content ? <small>{errors.content.message}</small> : null}
          </label>

          {submitError ? <p className="form-error">{submitError}</p> : null}

          <div className="mblg-app__modal-actions">
            <button type="button" className="secondary-button" onClick={closeModal}>
              Cancel
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={createPostMutation.isPending}
            >
              {createPostMutation.isPending ? 'Creating...' : 'Create post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
