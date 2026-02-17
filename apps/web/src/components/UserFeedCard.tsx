import { parseISO, format } from 'date-fns';
import { FeedPost } from '../types';

type UserFeedCardProps = {
  posts: FeedPost[];
  emptyMessage?: string;
};

const DATE_FORMAT = 'MMM d, yyyy • h:mm a';

export function UserFeedCard({ posts, emptyMessage = 'No posts yet.' }: UserFeedCardProps) {
  if (!posts.length) {
    return <p className="feed-empty">{emptyMessage}</p>;
  }

  return (
    <div className="user-feed-list">
      {posts.map((post) => (
        <article key={post.id} className="mblg__user-feed-card">
          <p className="mblg__user-feed-card-date">
            Posted at: {format(parseISO(post.createdAt), DATE_FORMAT)}
          </p>
          <h3 className="mblg__user-feed-card-title">{post.title}</h3>
          <p className="mblg__user-feed-card-content">{post.content}</p>
        </article>
      ))}
    </div>
  );
}
