import { PayloadAction, createSlice } from "@reduxjs/toolkit" 

export interface ServerInfo {
    authServer: string,
    appServer: string,
    gameServer: string,
    officeServer: string,
    inspection: boolean,
    startTime: string,
    endTime: string,

    androidApi: string,
    iosApi: string
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
        inspection: false,
        startTime: '',
        endTime: '',

        androidApi: '',
        iosApi: '',
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