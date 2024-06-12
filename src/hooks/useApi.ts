import axios from "axios";
import { Alert, Platform } from "react-native";
import { JsonResponse, Payload, YoutubeResponse, YoutubeVideoItemResponse } from "../types/apiTypes";
import { useSelector } from "react-redux";
import { RootState } from "../slices";
import { ServerInfo, YoutubeVideo } from "../slices/api";
import { useApiActions } from "./useApiActions";

interface JsonsHook {
    getApi: (type: string, version: string) => Promise<Payload>,
    getYoutubeVideo: () => Promise<Payload>
}

export const useServerInfo = (): ServerInfo => {
    return useSelector((state: RootState) => state.api.serverInfo)
}

export const useYoutubeVideo = (): YoutubeVideo[] => {
    return useSelector((state: RootState) => state.api.youtubeVideo)
}

export const useApi = (): JsonsHook => {
    const { saveServerInfo, saveYoutubeVideo } = useApiActions()

    const CHANNEL_ID = 'UCyZYaCF0PGmqQQK3gWDZ_RA'
    const API_URL = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyC6KBmCuiFtckeiUhe-qzF3zmHTb8ZVlbg&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=5`;

    // get server info
    const getApi = async (type: string, version: string): Promise<Payload> => {
        const time = new Date()
        try {
            const res: any = await axios.get(`https://version.the-swing.net/app/theswingz/${type}/${Platform.OS}/${version}.json?time=${time}`)
            if (!res.data.auth_server || !res.data.office_server || !res.data.app_server || !res.data.game_server || res.data.auth_server === '' || res.data.game_server === '' || res.data.office_server === '' || res.data.app_server === '') {
                Alert.alert('알림', '서버에 연결할 수 없습니다.')
                
                const payload: Payload = {
                    code: -1,
                    msg: '서버에 연결할 수 없습니다.'
                }

                return payload
            }
			saveServerInfo({
                authServer: res.data.auth_server,
                appServer: res.data.app_server,
                officeServer: res.data.office_server,
                gameServer: res.data.game_server,
                update: res.data.update,
                inspection: res.data.inspection,
                startTime: res.data.start,
                endTime: res.data.end,
            })

            const payload: Payload = {
                code: 1000,
                update: res.data.update
            }

            return payload
        } catch (error: any) {
            errorHandler(error)
        }

        const payload: Payload = {
            code: -1,
            msg: '서버에 연결할 수 없습니다.'
        }

        return payload
    }   

    // get youtube video
    const getYoutubeVideo = async (): Promise<Payload> => {
        try {
            const res: YoutubeResponse = await axios.get(API_URL)
            // 오류 발생시
            if (!res.data.items) {
                return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
            }

            // 성공
            const videoArr: YoutubeVideo[] = []

            for (let i = 0; i < 5; i++) {
                const response: YoutubeVideoItemResponse = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${res.data.items[i].id.videoId}&key=AIzaSyC6KBmCuiFtckeiUhe-qzF3zmHTb8ZVlbg`)
                if (response.data.items[0].statistics?.viewCount) {
                    videoArr[i] = {
                        id: res.data.items[i]?.id.videoId,
                        title: res.data.items[i].snippet?.title,
                        thumbnails: res.data.items[i].snippet?.thumbnails.high.url,
                        publishTime: res.data.items[i].snippet?.publishedAt,
                        view: response.data.items[0].statistics?.viewCount
                    }
                }
            }

            saveYoutubeVideo(videoArr)

            const payload: Payload = {
                code: 1000,
            }

            return payload

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }   

    return { getApi, getYoutubeVideo }
}

const errorHandler = (error: any): void => {
    Alert.alert('알림', error ?? '서버에 연결할 수 없습니다.')
}
