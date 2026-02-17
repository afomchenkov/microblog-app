import { parseISO, format } from 'date-fns';
import { Virtuoso } from 'react-virtuoso';
// @ts-expect-error: side-effect import of SCSS without type declarations
import './HomeFeedCard.scss';

type FeedPost = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername?: string;
  createdAt: string;
};

type HomeFeedCardProps = {
  posts: FeedPost[];
  emptyMessage?: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
};

const DATE_FORMAT = 'MMM d, yyyy • h:mm a';

export function HomeFeedCard({
  posts,
  emptyMessage = 'No posts yet.',
  hasMore,
  isLoadingMore,
  onLoadMore,
}: HomeFeedCardProps) {
  if (!posts.length) {
    return <p className="feed-empty">{emptyMessage}</p>;
  }

  return (
    <div className="mblg__home-feed-viewport">
      <Virtuoso
        data={posts}
        className="feed-list"
        endReached={() => {
          if (hasMore && !isLoadingMore) {
            onLoadMore();
          }
        }}
        itemContent={(_index, post) => (
          <article key={post.id} className="mblg__home-feed-card">
            <p className="mblg__home-feed-card-date">
              Posted at: {format(parseISO(post.createdAt), DATE_FORMAT)}
            </p>
            <p className="mblg__home-feed-card-author">
              Author: @{post.authorUsername ?? post.authorId}
            </p>
            <h3 className="mblg__home-feed-card-title">{post.title}</h3>
            <p className="mblg__home-feed-card-content">{post.content}</p>
          </article>
        )}
        components={{
          Footer: () =>
            isLoadingMore ? <p className="feed-empty">Loading more posts...</p> : <div />,
        }}
      />
    </div>
  );
}
