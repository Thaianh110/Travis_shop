import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
}

export const bookingSlide = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        updatebooking: (state, action) => {
            const { name = '', email = '', phone = '', date = '', time = '' } = action.payload
            state.name = name ? name : state.name;
            state.email = email ? email : state.email;
            state.phone = phone ? phone : state.phone;
            state.date = date ? date : state.date;
            state.time = time ? time : state.time;

        },
        // resetbooking: (state) => {
        //     state.name = '';
        //     state.email = '';
        //     state.address = '';
        //     state.phone = '';
        //     state.avatar = '';
        //     state.id = '';
        //     state.access_token = '';
        //     state.isAdmin = false;
        //     state.city = '';
        //     state.refreshToken = ''
        // },
    },
})

// Action creators are generated for each case reducer function
export const { updatebooking } = bookingSlide.actions

export default bookingSlide.reducer