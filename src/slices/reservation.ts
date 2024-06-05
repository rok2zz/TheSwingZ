import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface ReservationInfo {
    id: number,
    status: string,
    beginAt: string,
    endAt: string,
    shopId: number,
    title: string,
    contact: string,
    address: string,
    latitude: string,
    longitude: string,
    reason: string,
    userCount: number,
    userMemo: string
}

export interface ReservationSetting {
    date: string,
    people: number
}

export interface ShopInfo {
    id: number,
    title: string,
    address: string,
    latitude: string,
    longitude: string,
    shopNotice: string,
    contact: string,
    totalRoom: number,
    openAt: string,
    closedAt: string,
    option: string,
    pay: Pay,
    favorite: string
}

export interface Pay {
    week: {
        h18: {
            before12: number,
            after12: number
        },
        h9: {
            before12: number,
            after12: number
        }
    },
    holiday: {
        h18: {
            before12: number,
            after12: number
        },
        h9: {
            before12: number,
            after12: number
        }
    }
}

export interface Operation {
    shopId: number,
    openAt: string,
    closedAt: string
}

export interface ReservationTime {
    shopId: number,
    roomId: number,
    beginAt: string,
    endAt: string,
    status: string
}

interface Favorite {
    shopId: number,
    isFavorite: string
}

interface RecordState {
    reservationSetting: ReservationSetting,
    shopList: ShopInfo[],
    revList: ReservationTime[],
    myRevList: ReservationInfo[]
    isOpen: boolean
}

const initialState: RecordState = {
    reservationSetting: {
        date: new Date().toString(),
        people: 0
    },
    shopList: [],
    revList: [],
    myRevList: [],
    isOpen: false
}

const reservationSlice = createSlice ({
    name: 'reservation',
    initialState,
    reducers: {
        saveReservationSetting(state, action: PayloadAction<ReservationSetting>) {
            state.reservationSetting = action.payload
        },
        saveShopList(state, action: PayloadAction<ShopInfo[]>) {
            state.shopList = action.payload
        },
        saveRevList(state, action: PayloadAction<ReservationTime[]>) {
            state.revList = action.payload
        },
        saveMyRevList(state, action: PayloadAction<ReservationInfo[]>) {
            state.myRevList = action.payload
        },
        saveIsOpen(state, action: PayloadAction<boolean>) {
            state.isOpen = action.payload
        },
        setIsFavorite(state, action: PayloadAction<Favorite>) {
            state.shopList.forEach(shop => {
                if (shop.id === action.payload.shopId) {
                    shop.favorite = action.payload.isFavorite === 'F' ? 'D' : 'F'
                }
            })
        },
        clearReservation() {
            return initialState
        }
    }
})

export default reservationSlice.reducer
export const { saveReservationSetting, saveShopList, saveRevList, saveMyRevList, saveIsOpen, clearReservation, setIsFavorite } = reservationSlice.actions