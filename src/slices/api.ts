import { PayloadAction, createSlice } from "@reduxjs/toolkit" 

export interface ServerInfo {
    authServer: string,
    appServer: string,
    gameServer: string,
    officeServer: string,
    update: string,
    inspection: boolean,
    startTime: string,
    endTime: string,
}

export interface YoutubeVideo {
    id?: string,
    title?: string,
    thumbnails?: string,
    publishTime?: string,
    view?: string
}

interface ApiState {
    serverInfo: ServerInfo
    youtubeVideo: YoutubeVideo[]
}

const initialState: ApiState = {
    serverInfo: {
        authServer: '',
        appServer: '',
        officeServer: '',
        gameServer: '',
        update: '',
        inspection: false,
        startTime: '',
        endTime: '',
    },
    youtubeVideo: []
    
}

const apiSlice = createSlice ({
    name: 'api',
    initialState,
    reducers: {
        saveServerInfo(state, action: PayloadAction<ServerInfo>) {
            state.serverInfo = action.payload
        },
        saveYoutubeVideo(state, action: PayloadAction<YoutubeVideo[]>) {
            state.youtubeVideo = action.payload
        },
        clearApi() {
            return initialState
        }
    }
})

export default apiSlice.reducer
export const { saveServerInfo, saveYoutubeVideo, clearApi } = apiSlice.actions