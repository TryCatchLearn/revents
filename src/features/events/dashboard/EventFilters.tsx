import { Header, Menu } from 'semantic-ui-react';
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';
import { useRef, useState } from 'react';
import { QueryOptions } from '../../../app/hooks/firestore/types';
import { useAppSelector } from '../../../app/store/store';

type Props = {
    setQuery: (query: QueryOptions[]) => void;
}

export default function EventFilters({ setQuery }: Props) {
    const startDate = useRef(new Date());
    const { currentUser } = useAppSelector(state => state.auth);
    const [filter, setFilter] = useState('all');
    const { status } = useAppSelector(state => state.events);

    function handleSetFilter(filter: string) {
        let q: QueryOptions[];
        if (!currentUser?.uid) {
            q = [{ attribute: 'date', operator: '>=', value: startDate.current }];
            setQuery(q);
        } else {
            switch (filter) {
                case 'isGoing':
                    q = [
                        { attribute: 'attendeeIds', operator: 'array-contains', value: currentUser.uid },
                        { attribute: 'date', operator: '>=', value: startDate.current }
                    ]
                    break;
                case 'isHost':
                    q = [
                        { attribute: 'hostUid', operator: '==', value: currentUser.uid },
                        { attribute: 'date', operator: '>=', value: startDate.current }
                    ];
                    break;
                default:
                    q = [
                        { attribute: 'date', operator: '>=', value: startDate.current }
                    ]
                    break;
            }
            setFilter(filter);
            setQuery(q);
        }


    }

    return (
        <>
        {currentUser &&
            <Menu vertical size='large' style={{ width: '100%' }}>
                <Header icon='filter' attached color='teal' content='Filters' />
                <Menu.Item
                    content='All events'
                    onClick={() => handleSetFilter('all')}
                    active={filter === 'all'}
                    disabled={status === 'loading'}
                />
                <Menu.Item
                    content="I'm going"
                    onClick={() => handleSetFilter('isGoing')}
                    active={filter === 'isGoing'}
                    disabled={status === 'loading'}
                />
                <Menu.Item
                    content="I'm hosting"
                    onClick={() => handleSetFilter('isHost')}
                    active={filter === 'isHost'}
                    disabled={status === 'loading'}
                />
            </Menu>}
            <Header icon='calendar' attached color='teal' content='Select date' />
            <Calendar
                onChange={date => {
                    startDate.current = date as Date;
                    handleSetFilter(filter);
                }}
                value={startDate.current}
            />
        </>
    )
}