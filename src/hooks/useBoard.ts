import { Body, CourseResponse, Payload, Response } from "../types/apiTypes";
import axios from "axios";
import { useServerInfo } from "./useApi";
import { ServerInfo } from "../slices/api";

interface BoardHooks {
    getNoticeList: (searchValue: string, offset: number, pageSize: number, type: number) => Promise<Payload>,
    getNotice: (id: number, view: number) => Promise<Payload>,
    getFAQList: (searchValue: string, type: number) => Promise<Payload>,
}

export const useBoard = (): BoardHooks => {
    const serverInfo: ServerInfo = useServerInfo()
    const appURL = serverInfo.appServer

    // get notice list
    const getNoticeList = async (searchValue: string, offset: number, pageSize: number, type: number): Promise<Payload> => {
        const body: Body = {
            cls: 'Board',
            method: 'getNoticeList',
            params: [
                searchValue,
                offset,
                pageSize,
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
    const getFAQList = async (searchValue: string, type: number): Promise<Payload> => {
        const body: Body = {
            cls: 'Board',
            method: 'getFAQList',
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
                noticeList: res.data.result?.noticeList
            }

            return payload
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    } 

    return { getNoticeList, getNotice, getFAQList }
}

const errorHandler = (error: any): void => {
}
