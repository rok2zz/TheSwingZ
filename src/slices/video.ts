import { PayloadAction, createSlice } from "@reduxjs/toolkit"


export interface Thumbnail {
    id: number,
    roomId: number,
    distance: string,
    club: string,
    holeNumber: number,
    headSpeed: string,
    ballSpeed: string,
    url: string
}

export interface VideoList {
    roomId: number,
    ccName: string,
    dayAt: string,
    thumbnail: Thumbnail[]
}

export interface SwingVideo {
    url: string
}

export interface VideoIndex {
    videoIndex: number,
    thumbnailIndex: number
}

interface RecordState {
    videoList: VideoList[],
    thumbnailList: Thumbnail[],
    swingVideo: SwingVideo,
    videoIndex: VideoIndex
    scoreCardVideo: VideoList,
    isCached: boolean,
    videoListLength: number,
}

const initialState: RecordState = {
    videoList: [],
    thumbnailList: [],
    swingVideo: {
        url: ''
    },
    videoIndex: {
        videoIndex: 0,
        thumbnailIndex: 0
    },
    scoreCardVideo: {
        roomId: 0,
        ccName: '',
        dayAt: '',
        thumbnail: []
    },
    isCached: false,
    videoListLength: 0
}

const videoSlice = createSlice ({
    name: 'video',
    initialState,
    reducers: {
        saveVideoList(state, action: PayloadAction<VideoList[]>) {
            state.videoList = action.payload
        },
        saveVideoListLength(state, action: PayloadAction<number>) {
            state.videoListLength = action.payload
        },
        saveScoreCardVideo(state, action: PayloadAction<VideoList>) {
            state.scoreCardVideo = action.payload
        },
        removeScoreCardVideo(state) {
            state.scoreCardVideo = initialState.scoreCardVideo
        },
        saveThumbnailList(state, action: PayloadAction<Thumbnail[]>) {
            state.thumbnailList = action.payload
        },
        saveSwingVideo(state, action: PayloadAction<SwingVideo>) {
            state.swingVideo = action.payload
        },
        saveIsCached(state, action: PayloadAction<boolean>) {
            state.isCached = action.payload
        },
        removeSwingVideo(state, action: PayloadAction<VideoIndex>) {
            state.videoList[action.payload.videoIndex].thumbnail = state.videoList[action.payload.videoIndex].thumbnail.slice(0, action.payload.thumbnailIndex).concat(state.thumbnailList.slice(action.payload.thumbnailIndex + 1))
            if (state.videoList[action.payload.videoIndex].thumbnail.length === 0) {
                state.videoList = state.videoList.slice(0, action.payload.videoIndex).concat(state.videoList.slice(action.payload.videoIndex + 1))
            }
        },
        clearVideo() {
            return initialState
        }
    }
})

export default videoSlice.reducer
export const { saveVideoList, saveVideoListLength, saveThumbnailList, saveScoreCardVideo, saveSwingVideo, removeSwingVideo, clearVideo, removeScoreCardVideo, saveIsCached } = videoSlice.actions