import { GenericState, createGenericSlice } from '../../../app/store/genericSlice'
import { Post } from '../../../app/types/post'

type State = {
    data: Post[]
}

const initialState: State = {
    data: []
}

export const feedSlice = createGenericSlice({
    name: 'feed',
    initialState: initialState as GenericState<Post[]>,
    reducers: {}
});

export const actions = feedSlice.actions;