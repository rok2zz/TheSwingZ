import { ServerInfo } from "../slices/api";
import { useServerInfo } from "./useApi";
import { Body, Payload, Response } from "../types/apiTypes";
import axios from "axios";
import { useUserInfo } from "./useUsers";

interface CompetitionHooks {
    getCompetitionList: (type: number, sortType: number, length: number, pageIndex: number) => Promise<Payload>,
    getCompetitionDetail: (id: number) => Promise<Payload>
    getCompetitionRank: (course: string, sort: string, compId: number, pageIndex: number) => Promise<Payload>
}


export const useCompetition = (): CompetitionHooks => {
    const serverInfo: ServerInfo = useServerInfo()
    const officeURL = serverInfo.officeServer
    const userInfo = useUserInfo()

    // get competition list
    const getCompetitionList = async (type: number, sortType: number, length: number, pageIndex: number) => {
        const body: Body = {
            cls: 'Comp',
            method: 'getList',
            params: [
                type === 0 ? 'H' : 'L',
                sortType === 0 ? 'A' : 'C',
                null,
                null,
                null,
                type === 0 ? '' : userInfo.uid.toString(),
                length,
                pageIndex ?? 0
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: Response = await axios.post(officeURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
       
            if (res.data.result) {
                const payload: Payload = {
                    code: res.data.code,
                    compList: res.data.result?.listArr
                }
                return payload
            }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // get detail
    const getCompetitionDetail = async (id: number) => {
        const body: Body = {
            cls: 'Comp',
            method: 'getDetail',
            params: [
                id
            ]
        }
        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(officeURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
       
            if (res.data.result) {
                const payload: Payload = {
                    code: res.data.code,
                    compDetail: res.data.result.detailArr
                }
                return payload
            }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // get ranking
    const getCompetitionRank = async (course: string, sort: string, compId: number, pageIndex: number) => {
        const body: Body = {
            cls: 'Comp',
            method: 'getRank',
            params: [
                course,
                sort,
                compId,
                userInfo.uid,
                20,
                pageIndex ?? 0
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: Response = await axios.post(officeURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
       
            if (res.data.result) {
                const payload: Payload = {
                    code: res.data.code,
                    rankArr: res.data.result.cRankArr,
                    myRankArr: res.data.result.uRankArr
                }

                return payload
            }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    return { getCompetitionList, getCompetitionDetail, getCompetitionRank }
}

const errorHandler = (error: any): void => {
}
