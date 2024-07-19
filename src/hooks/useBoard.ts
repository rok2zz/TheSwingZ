import { Body, CourseResponse, Payload, Response } from "../types/apiTypes";
import axios from "axios";
import { useServerInfo } from "./useApi";
import { ServerInfo } from "../slices/api";
import { useAccessToken, useRefreshToken } from "./useToken";
import { Alert } from "react-native";
import { clearUserInfo } from "../slices/auth";

interface BoardHooks {
    getNoticeList: (searchValue: string, offset: number, pageSize: number, type: number | null) => Promise<Payload>,
    getNotice: (id: number, view: number) => Promise<Payload>,

    getFAQList: (searchValue: string, type: number | null) => Promise<Payload>,

    makeInquiry: (title: string, detail: string, type: number, files: string[]) => Promise<Payload>,
    getInquiryList: () => Promise<Payload>,
    getInquiry: (id: number) => Promise<Payload>,
}

export const useBoard = (): BoardHooks => {
    const serverInfo: ServerInfo = useServerInfo()
    const appURL = serverInfo.appServer
    const accessToken = useAccessToken()
    const refreshToken = useRefreshToken()

    // get notice list
    const getNoticeList = async (searchValue: string, offset: number, pageSize: number, type: number | null): Promise<Payload> => {
        const body: Body = {
            cls: 'Board',
            method: 'getNoticeList',
            params: [
                searchValue,
                offset,
                pageSize,
                type
            ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(appURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
            const payload: Payload = {
                code: res.data.code,
                noticeList: res.data.result?.noticeList
            }
            return payload
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    } 

    // get notice
    const getNotice = async (id: number, view: number): Promise<Payload> => {
        const body: Body = {
            cls: 'Board',
            method: 'getNotice',
            params: [
                id,
                view
            ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(appURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            const payload: Payload = {
                code: res.data.code,
                noticeResult: res.data.result?.notice
            }

            return payload
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    } 

    // get FAQ list
    const getFAQList = async (searchValue: string, type: number | null): Promise<Payload> => {
        const body: Body = {
            cls: 'Board',
            method: 'getFaqList',
            params: [
                searchValue,
                type
            ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(appURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
            const payload: Payload = {
                code: res.data.code,
                faqList: res.data.result?.faqList
            }

            return payload
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    } 

    // make inquiry
    const makeInquiry = async (title: string, detail: string, type: number, files: string[]) => {
        const formData = new FormData()
        formData.append('cls', 'Board')
        formData.append('method', 'inquiry')
        formData.append('title', title)
        formData.append('detail', detail)
        formData.append('type', type)
        formData.append('files', files)


        try {
            const res: Response = await axios.post(appURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accessToken': accessToken
                }
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(appURL, formData, {
                        headers: {
                            'refreshToken': refreshToken
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

                    const payload: Payload = {
                        code: res.data.code,
                    }
                    return payload
                }

                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
            const payload: Payload = {
                code: res.data.code
            }

            return payload
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // get inquiry list
    const getInquiryList = async () => {
        const body: Body = {
            cls: 'Board',
            method: 'getInquiryList',
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(appURL, jsonBody, {
                headers: {
                    'accessToken': accessToken
                }
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(appURL, jsonBody, {
                        headers: {
                            'refreshToken': refreshToken
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
                            code: res.data.code ?? -1,
                            msg: res.data.msg
                        }
       
                        return payload
                    }

                    if (res.data.result?.inquiryList) {
                        const payload: Payload = {
                            code: res.data.code,
                            inquiryList: res.data.result.inquiryList
                        }
                        return payload
                    }
                }

                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            if (res.data.result?.inquiryList) {
                const payload: Payload = {
                    code: res.data.code,
                    inquiryList: res.data.result.inquiryList
                }
                return payload
           }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // get inquiry
    const getInquiry = async (id: number) => {
        const body: Body = {
            cls: 'Board',
            method: 'getInquiry',
            params: [
                id
            ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(appURL, jsonBody, {
                headers: {
                    'accessToken': accessToken
                }
            })
            
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(appURL, jsonBody, {
                        headers: {
                            'refreshToken': refreshToken
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
                            code: res.data.code ?? -1,
                            msg: res.data.msg
                        }
       
                        return payload
                    }

                    if (res.data.result?.inquiry) {
                        const payload: Payload = {
                            code: res.data.code,
                            inquiry: res.data.result.inquiry
                        }
                        return payload
                    }
                }

                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            if (res.data.result?.inquiry) {
                const payload: Payload = {
                    code: res.data.code,
                    inquiry: res.data.result.inquiry
                }
                return payload
           }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    return { getNoticeList, getNotice, getFAQList, makeInquiry, getInquiryList, getInquiry }
}

const errorHandler = (error: any): void => {
}
