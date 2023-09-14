import { Grid } from 'semantic-ui-react';
import EventList from './EventList';
import { useAppDispatch, useAppSelector } from '../../../app/store/store';
import { useCallback, useEffect, useState } from 'react';
import { actions } from '../eventSlice';
import { useFireStore } from '../../../app/hooks/firestore/useFirestore';
import EventFilters from './EventFilters';
import { QueryOptions } from '../../../app/hooks/firestore/types';
import EventListItemPlaceholder from './EventListItemPlaceholder';

export default function EventDashboard() {
  const dispatch = useAppDispatch();
  const { data: events, status, loadedInitial} = useAppSelector(state => state.events);
  const { loadCollection, hasMore } = useFireStore('events');
  const [query, setQuery] = useState<QueryOptions[]>([
    { attribute: 'date', operator: '>=', value: new Date() }
  ])

  const loadEvents = useCallback(async (reset?: boolean) => {
    loadCollection(actions, {
      queries: query,
      limit: 2,
      sort: { attribute: 'date', order: 'asc' },
      pagination: true,
      reset,
      get: true
    })
  }, [loadCollection, query])

  useEffect(() => {
    loadEvents(true);

    return () => {
      dispatch(actions.reset());
    }
  }, [loadEvents, dispatch])

  function loadMore() {
    loadEvents();
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        {!loadedInitial ? (
          <>
            <EventListItemPlaceholder />
            <EventListItemPlaceholder />
          </>
        ) : (
          <>
            <EventList 
              events={events}
              hasMore={hasMore.current}
              loadMore={loadMore}
              loading={status === 'loading'} 
            />
          </>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <div className='ui fixed top sticky' style={{ top: 98, width: 405, zIndex: 1 }}>
          <EventFilters setQuery={setQuery} />
        </div>
      </Grid.Column>
    </Grid>
  )
}