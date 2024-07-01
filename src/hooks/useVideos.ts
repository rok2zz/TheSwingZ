import { Alert } from "react-native";
import { Body, Payload, VideoResponse } from "../types/apiTypes";
import { useSelector } from "react-redux";
import { SwingVideo, Thumbnail, VideoList } from "../slices/video";
import { RootState } from "../slices";
import { ServerInfo } from "../slices/api";
import { useServerInfo } from "./useApi";
import { useAccessToken, useRefreshToken } from "./useToken";
import { useAuthActions } from "./useAuthActions";
import { useVideoActions } from "./useVideoActions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface VideosHooks {
	getMySwingVideoList: (startIndex: number, cnt: number) => Promise<Payload>,
	getScoreCardVideo: (roomId: number) => Promise<Payload>,
	getSwingVideo: (videoId: number) => Promise<Payload>,
	deleteSwingVideo: (videoId: number) => Promise<Payload>,
}

export const useVideoList = (): VideoList[] => {
    return useSelector((state: RootState) => state.video.videoList)
}

export const useVideoListLength = (): number => {
    return useSelector((state: RootState) => state.video.videoListLength)
}

export const useThumbnailList = (): Thumbnail[] => {
    return useSelector((state: RootState) => state.video.thumbnailList)
}

export const useSwingVideo = (): SwingVideo => {
    return useSelector((state: RootState) => state.video.swingVideo)
}

export const useScoreCardVideo = (): VideoList => {
    return useSelector((state: RootState) => state.video.scoreCardVideo)
}

export const useIsCached = (): boolean => {
    return useSelector((state: RootState) => state.video.isCached)
}

// VideosHooks
export const useVideos = (): VideosHooks => {
	const serverInfo: ServerInfo = useServerInfo()
	const videoList: VideoList[] = useVideoList()
	const appURL = serverInfo.appServer

	const accessToken = useAccessToken()
	const refreshToken = useRefreshToken()
	const { saveAccessToken, clearUserInfo } = useAuthActions()
	const { saveVideoList, saveVideoListLength, saveSwingVideo, saveScoreCardVideo } = useVideoActions()

	// get swingthumbnail
	const getMySwingVideoList = async (startIndex: number, cnt: number): Promise<Payload> => {
		const body: Body = {
            cls: 'Play',
            method: 'getMySwingThumbnailList',
            params: [ 
				startIndex,
				cnt
            ]
        }
        const jsonBody: string = JSON.stringify(body)
   
        try {
            const res: any = await axios.post(appURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: VideoResponse = await axios.post(appURL, jsonBody, {
                        headers: {
                            "refreshToken": refreshToken
                        }
                    })
                    
                    if (res.data.code !== 1000) {
                            // 자동 로그인 만료시
                        if (res.data.code === -5002) {
                            Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                            clearUserInfo()

                            const payload: Payload = {
                                code: 1001,
                                msg: res.data.msg
                            }

                            return payload
                        }
                        const payload: Payload = {
                            code: res.data.code,
                            msg: res.data.msg
                        }    
        
                        return payload
                    }
                    
                    if (res.data.result && res.data.result.roomList && res.data.result.total && res.data.result.accessToken) {
                        if (startIndex && startIndex > 0) {
                            const list = videoList
                            if (list) {
                                const addVideoList = list.concat(res.data.result.roomList)
                                saveVideoList(addVideoList)
                                saveVideoListLength(res.data.result.total)

                                const payload: Payload = {
                                    code: res.data.code,
                                }

                                return payload
                            }
                        }

                        saveAccessToken(res.data.result.accessToken)
                        saveVideoListLength(res.data.result.total)

                        const token = {
                            accessToken: res.data.result?.accessToken,
                            refreshToken: refreshToken
                        }

                        await AsyncStorage.setItem('token', JSON.stringify(token))
                    }
                    
                    return { code: 1000 }
                }

                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }   

                return payload
            }
            
            if (res.data.result && res.data.result.roomList && res.data.result.total) {
                if (startIndex && startIndex > 0) {
                    const list = videoList
                    if (list) {
                        const addVideoList = list.concat(res.data.result.roomList)
                        saveVideoList(addVideoList)
                        saveVideoListLength(res.data.result.total)

                        const payload: Payload = {
                            code: res.data.code,
                        }

                        return payload
                    }
                }

                saveVideoList(res.data.result.roomList)
                saveVideoListLength(res.data.result.total)
            }

            return { code: 1000 }
        } catch (error: any) {
			console.log(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
	}

    // get score card video
	const getScoreCardVideo = async (roomId: number): Promise<Payload>  => {
		const body: Body = {
            cls: 'Play',
            method: 'getGameSwingThumbnail',
            params: [ 
				roomId
            ]
        }
        const jsonBody: string = JSON.stringify(body)
    
        try {
            const res: VideoResponse = await axios.post(appURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: VideoResponse = await axios.post(appURL, jsonBody, {
                        headers: {
                            "refreshToken": refreshToken
                        }
                    })
                    
                    if (res.data.code !== 1000) {
                            // 자동 로그인 만료시
                        if (res.data.code === -5002) {
                            Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                            clearUserInfo()

                            const payload: Payload = {
                                code: 1001,
                                msg: res.data.msg
                            }

                            return payload
                        }
                        const payload: Payload = {
                            code: res.data.code,
                            msg: res.data.msg
                        }    
        
                        return payload
                    }
                    
                    if (res.data.result && res.data.result.roomList && 'thumbnail' in res.data.result?.roomList && res.data.result.accessToken) {
                        saveAccessToken(res.data.result.accessToken)
                        saveScoreCardVideo(res.data.result.roomList)

                        const token = {
                            accessToken: res.data.result?.accessToken,
                            refreshToken: refreshToken
                        }

                        await AsyncStorage.setItem('token', JSON.stringify(token))
                    }
                    
                    return { code: 1000 }
                }

                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }   

                return payload
            }
            
            if (res.data.result && res.data.result.roomList && 'thumbnail' in res.data.result?.roomList) {
                saveScoreCardVideo(res.data.result.roomList)
            }

            return { code: 1000 }
        } catch (error: any) {
			console.log(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
	}

    const getSwingVideo = async (videoId: number): Promise<Payload>  => {
		const body: Body = {
            cls: 'Play',
            method: 'getSwingVideo',
            params: [ 
				videoId
            ]
        }
        const jsonBody: string = JSON.stringify(body)
    
        try {
                const res: VideoResponse = await axios.post(appURL, jsonBody, {
                    headers: {
                        "accessToken": accessToken
                    }
                })
                if (res.data.code !== 1000) {
                    if (res.data.code === -5000) {
                        const res: VideoResponse = await axios.post(appURL, jsonBody, {
                            headers: {
                                "refreshToken": refreshToken
                            }
                        })
                        
                        if (res.data.code !== 1000) {
                             // 자동 로그인 만료시
                            if (res.data.code === -5002) {
                                Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                                clearUserInfo()

                                const payload: Payload = {
                                    code: 1001,
                                    msg: res.data.msg
                                }

                                return payload
                            }
                            const payload: Payload = {
                                code: res.data.code,
                                msg: res.data.msg
                            }    
            
                            return payload
                        }
                        
                        if (res.data.result && res.data.result.url && res.data.result.accessToken) {
							saveSwingVideo({ url: res.data.result.url })
                            saveAccessToken(res.data.result.accessToken)

                            const token = {
                                accessToken: res.data.result?.accessToken,
                                refreshToken: refreshToken
                            }

                            await AsyncStorage.setItem('token', JSON.stringify(token))
                        }
                        
                        return { code: 1000 }
                    }

                    const payload: Payload = {
                        code: res.data.code,
                        msg: res.data.msg
                    }   
    
                    return payload
                }
                
				if (res.data.result && res.data.result.url ) {
                    saveSwingVideo({ url: res.data.result.url })
				}

                return { code: 1000 }
        } catch (error: any) {
			console.log(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
	}

    const deleteSwingVideo = async (videoId: number): Promise<Payload>  => {
		const body: Body = {
            cls: 'Play',
            method: 'deleteSwingVideo',
            params: [ 
				videoId
            ]
        }
        const jsonBody: string = JSON.stringify(body)
    
        try {
                const res: VideoResponse = await axios.post(appURL, jsonBody, {
                    headers: {
                        "accessToken": accessToken
                    }
                })
                if (res.data.code !== 1000) {
                    if (res.data.code === -5000) {
                        const res: VideoResponse = await axios.post(appURL, jsonBody, {
                            headers: {
                                "refreshToken": refreshToken
                            }
                        })
                        
                        if (res.data.code !== 1000) {
                             // 자동 로그인 만료시
                            if (res.data.code === -5002) {
                                Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                                clearUserInfo()

                                const payload: Payload = {
                                    code: 1001,
                                    msg: res.data.msg
                                }

                                return payload
                            }
                            const payload: Payload = {
                                code: res.data.code,
                                msg: res.data.msg
                            }    
            
                            return payload
                        }
                        
                        if (res.data.result && res.data.result.accessToken) {
                            saveAccessToken(res.data.result.accessToken)

                            const token = {
                                accessToken: res.data.result?.accessToken,
                                refreshToken: refreshToken
                            }

                            await AsyncStorage.setItem('token', JSON.stringify(token))
                        }
                        
                        return { code: 1000 }
                    }

                    const payload: Payload = {
                        code: res.data.code,
                        msg: res.data.msg
                    }   
    
                    return payload
                }

                return { code: 1000 }
        } catch (error: any) {
			console.log(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
	}

    return { getMySwingVideoList, getScoreCardVideo, getSwingVideo, deleteSwingVideo } 
}

const errorHandler = (error: any): void => {
    Alert.alert('알림', error ?? '서버에 연결할 수 없습니다.')
}
