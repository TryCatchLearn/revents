import { createSlice } from '@reduxjs/toolkit';

type State = {
    data: number
}

const initialState: State = {
    data: 42
}

export const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        increment: (state) => {
            state.data += 1
        },
        decrement: (state) => {
            state.data -= 1
        },
        incrementByAmount: (state, action) => {
            state.data += action.payload
        }
    }
})

export const {increment, decrement, incrementByAmount} = testSlice.actions