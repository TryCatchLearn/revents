import { ActionCreatorWithOptionalPayload, ActionCreatorWithPayload, ActionCreatorWithPreparedPayload, ActionCreatorWithoutPayload, PayloadAction, SliceCaseReducers, ValidateSliceCaseReducers, createSlice } from '@reduxjs/toolkit'

export type GenericState<T> = {
    data: T | []
    status: 'loading' | 'finished' | 'error',
    errors?: any,
    loadedInitial?: boolean
}

export const createGenericSlice = <
    T,
    Reducers extends SliceCaseReducers<GenericState<T>>
>({
    name = '',
    initialState,
    reducers,
}: {
    name: string
    initialState: GenericState<T>
    reducers: ValidateSliceCaseReducers<GenericState<T>, Reducers>
}) => {
    return createSlice({
        name,
        initialState,
        reducers: {
            loading: (state) => {
                state.status = 'loading'
            },
            success: (state: GenericState<T>, action: PayloadAction<T>) => {
                state.data = action.payload
                state.status = 'finished'
            },
            error: (state, action) => {
                state.errors = action.payload
                state.status = 'error'
            },
            reset: (state) => {
                state.data = [];
                state.loadedInitial = false
            },
            ...reducers,
        },
    })
}

export type GenericActions<T> = {
    loading: ActionCreatorWithoutPayload<string>;
    success: ActionCreatorWithPayload<T, string> | ActionCreatorWithPreparedPayload<any, T, string, never, never>;
    error: ActionCreatorWithOptionalPayload<any, string>;
    reset: ActionCreatorWithOptionalPayload<any>;
}