import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { CcInfo, Count, DtStat, PositionInfo, RoomInfo } from "../types/apiTypes"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Record {
    totShotCount: string,
    totCount: string,

    parcount: Count[],
    shotcount: Count[],
    puttcount: Count[],
    teeShotArr: Count[],
    holeIdArr: Count[],
    mulliganArr: Count[],
    fairArr: Count[],
    girArr: Count[],
    concedeArr: Count[],
    parSaveArr: Count[],
    ccArr: CcInfo[]
    inArr: RoomInfo[],
    positionArr: PositionInfo[]
}

export interface Stat {
    dtStat: DtStat[],
    handicap: string,
    fullRndCnt: number
}

interface RecordState {
    avgRecord: Record,
    record: Record,
    avgStat: Stat,
    stat: Stat,
}

const initialState: RecordState = {
    avgRecord: {
        totShotCount: '',
        totCount: '',

        parcount: [],
        shotcount: [],
        puttcount: [],
        teeShotArr: [],
        holeIdArr: [],
        mulliganArr: [],
        fairArr: [],
        girArr: [],
        concedeArr: [],
        parSaveArr: [],
        ccArr: [],
        inArr: [],
        positionArr: []
    },
    record: {
        totShotCount: '',
        totCount: '',

        parcount: [],
        shotcount: [],
        puttcount: [],
        teeShotArr: [],
        holeIdArr: [],
        mulliganArr: [],
        fairArr: [],
        girArr: [],
        concedeArr: [],
        parSaveArr: [],
        ccArr: [],
        inArr: [],
        positionArr: []
    },
    avgStat: {
        dtStat: [],  
        handicap: '',
        fullRndCnt: 0
    },
    stat: {
        dtStat: [],
        handicap: '',
        fullRndCnt: 0
    }
}

const recordSlice = createSlice ({
    name: 'record',
    initialState,
    reducers: {
        saveRecentAvgRecord(state, action: PayloadAction<Record>) {
            state.avgRecord = action.payload
        },
        saveRecord(state, action: PayloadAction<Record>) {
            state.record = action.payload
        },
        saveRecentAvgStat(state, action: PayloadAction<Stat>) {
            state.avgStat = action.payload
        },
        saveStat(state, action: PayloadAction<Stat>) {
            state.stat = action.payload
        },
        clearRecord() {
            return initialState
        }
    }
})

export default recordSlice.reducer
export const { saveRecentAvgRecord, saveRecord, saveRecentAvgStat, saveStat, clearRecord } = recordSlice.actions