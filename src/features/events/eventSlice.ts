import { PayloadAction } from '@reduxjs/toolkit'
import { AppEvent } from '../../app/types/event'
import { Timestamp } from 'firebase/firestore'
import { GenericActions, GenericState, createGenericSlice } from '../../app/store/genericSlice'
import { auth } from '../../app/config/firebase'

type State = {
    data: AppEvent[],
    loadedInitial: boolean
}

const initialState: State = {
    data: [],
    loadedInitial: false
}

export const eventSlice = createGenericSlice({
    name: 'events',
    initialState: initialState as GenericState<AppEvent[]>,
    reducers: {
        success: {
            reducer: (state, action: PayloadAction<AppEvent[]>) => {
                state.data = removeDuplicates([...action.payload, ...state.data])
                state.status = 'finished'
                state.loadedInitial = true
            },
            prepare: (events: any) => {
                let eventArray: AppEvent[] = [];
                Array.isArray(events) ? eventArray = events : eventArray.push(events)
                const mapped = eventArray.map((e: any) => {
                    return {
                        ...e, 
                        date: (e.date as Timestamp).toDate().toISOString(),
                        isHost: auth.currentUser?.uid === e.hostUid,
                        isGoing: e.attendeeIds.includes(auth.currentUser?.uid)
                    }
                });
                return {payload: mapped}
            }
        }
    }
})

export const actions = eventSlice.actions as GenericActions<AppEvent[]>

function removeDuplicates(events: AppEvent[]) {
    return Array.from(new Set(events
        .map(x => x.id)))
        .map(id => events.find(a => a.id === id) as AppEvent)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}