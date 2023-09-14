import InfiniteScroll from 'react-infinite-scroller';
import { AppEvent } from '../../../app/types/event';
import EventListItem from './EventListItem';

type Props = {
  events: AppEvent[]
  loadMore: () => void
  hasMore: boolean
  loading: boolean
}

export default function EventList({ events, hasMore, loadMore, loading }: Props) {
  return (
    <>
      {events.length !== 0 && (
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={!loading && hasMore}
          initialLoad={false}
        >
          {events.map(event => (
            <EventListItem
              key={event.id}
              event={event}
            />
          ))}
        </InfiniteScroll>
      )}
    </>
  )
}