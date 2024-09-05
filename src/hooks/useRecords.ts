import axios from "axios";
import { Alert } from "react-native";
import { Body, DtStat, Payload, RecordResponse } from "../types/apiTypes";
import { useSelector } from "react-redux";
import { RootState } from "../slices";
import { Record, Stat } from "../slices/record";
import { useServerInfo } from "./useApi";
import { ServerInfo } from "../slices/api";


interface RecordsHook {
    getScore: (flag: string, uid: number | null, roomId: number | null, cnt: number | null, startIndex: number | null) => Promise<Payload>,
    getStat: (flag: string, uid: number | null, roomId: number | null, cnt: number | null, startIndex: number | null) => Promise<Payload>,

	getRecentAvgShots: (stat: Stat) => number,
    getRecentAvgTeeDistance: (stat: Stat) => number,

	getAvgPutts: (record: Record, index: number) => number,
    getRecentAvgPutts: (record: Record) => number,

	getFair: (record: Record, index: number) => number,
    getRecentAvgFair: (record: Record) => number,

	getGreen: (record: Record, index: number) => number,
    getRecentAvgGreen: (record: Record) => number,

    getParSave: (record: Record, index: number) => number
    getRecentAvgParSave: (record: Record) => number,
}

export const useRecentAvgRecord = (): Record => {
    return useSelector((state: RootState) => state.record.avgRecord)
}

export const useRecord = (): Record => {
    return useSelector((state: RootState) => state.record.record)
}

export const useRecentAvgStat = (): Stat => {
    return useSelector((state: RootState) => state.record.avgStat)
}

export const useStat = (): Stat => {
    return useSelector((state: RootState) => state.record.stat)
}


// RecordsHook
export const useRecords = (): RecordsHook => {
	const serverInfo: ServerInfo = useServerInfo()
	const record: Record = useRecord()
	const stat: Stat = useStat()
    const gameURL = serverInfo.gameServer

    // 스코어 카드
    const getScore = async (flag: string, uid: number | null = null, roomId: number | null = null, cnt: number | null, startIndex: number | null): Promise<Payload> => {
        const body: Body = {
            cls: 'MyRecord',
            method: 'getScore',
            params: [ 
				flag,
                uid,
                roomId,
                cnt,
                startIndex
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
			const res: RecordResponse = await axios.post(gameURL, jsonBody)
			// 오류 발생시
			if (res.data.code !== 1000) {
				const payload: Payload = {
					code: res.data.code,
					msg: res.data.msg
				}

				return payload
			}
			// 성공
			if (res.data.result) {
				if (startIndex && startIndex > 0) {
					const addRecord = record

					if (addRecord) {
						const parcount = addRecord.parcount?.concat(res.data.result.parcount)
						const shotcount = addRecord.shotcount?.concat(res.data.result.shotcount)
						const puttcount = addRecord.puttcount?.concat(res.data.result.puttcount)
						const teeShotArr = addRecord.teeShotArr?.concat(res.data.result.teeShotArr)
						const holeIdArr = addRecord.holeIdArr?.concat(res.data.result.holeIdArr)
						const mulliganArr = addRecord.mulliganArr?.concat(res.data.result.mulliganArr)
						const fairArr = addRecord.fairArr?.concat(res.data.result.fairArr)
						const girArr = addRecord.girArr?.concat(res.data.result.girArr)
						const concedeArr = addRecord.concedeArr?.concat(res.data.result.concedeArr)
						const parSaveArr = addRecord.parSaveArr?.concat(res.data.result.parSaveArr)
						const ccArr = addRecord.ccArr?.concat(res.data.result.ccArr)
						const inArr = addRecord.inArr?.concat(res.data.result.inArr)
						const positionArr = addRecord.positionArr?.concat(res.data.result.positionArr)

						const payload: Payload = {
							code: res.data.code,
							record: {
								totCount: res.data.result?.totCnt,
								totShotCount: res.data.result?.totShotCnt,	
								
								parcount: parcount,
								shotcount: shotcount,
								puttcount: puttcount,
								teeShotArr: teeShotArr,
								holeIdArr: holeIdArr,
								mulliganArr: mulliganArr,
								fairArr: fairArr,
								girArr: girArr,
								concedeArr: concedeArr,
								parSaveArr: parSaveArr,
								ccArr: ccArr,
								inArr: inArr,
								positionArr: positionArr
							}
						}

						return payload
					}
				}
				const payload: Payload = {
					code: res.data.code,
					record: {
						totCount: res.data.result?.totCnt,
						totShotCount: res.data.result?.totShotCnt,

						parcount: res.data.result?.parcount,
						shotcount: res.data.result?.shotcount,
						puttcount: res.data.result?.puttcount,
						teeShotArr: res.data.result.teeShotArr,
						holeIdArr: res.data.result?.holeIdArr,
						mulliganArr: res.data.result?.mulliganArr,
						fairArr: res.data.result?.fairArr,
						girArr: res.data.result?.girArr,
						concedeArr: res.data.result?.concedeArr,
						parSaveArr: res.data.result?.parSaveArr,
						ccArr: res.data.result?.ccArr,
						inArr: res.data.result?.inArr,
						positionArr: res.data.result?.positionArr
					}
				}

				return payload
			}

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }   

    // 스코어 카드
    const getStat = async (flag: string, uid: number | null , roomId: number | null, cnt: number | null, startIndex: number | null): Promise<Payload> => {
        const body: Body = {
            cls: 'MyRecord',
            method: 'getStat',
            params: [ 
				flag,
                uid,
				roomId,
				cnt,
				startIndex
            ]
        }
  
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: RecordResponse = await axios.post(gameURL, jsonBody)
            // 오류 발생시
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            // 성공
            if (res.data.result?.dtStat) {
				if (startIndex !== 0) {
					const newStat = stat

					if (newStat) {
						const newDtStat: DtStat[] = newStat.dtStat?.concat(res.data.result.dtStat)
	
						const payload: Payload = {
							code: res.data.code,
							stat: {
								dtStat: newDtStat,
								handicap: res.data.result.handicap,
								fullRndCnt: res.data.result.fullRndCnt
							}
						}

						return payload
					}
				}
				
				const payload: Payload = {
					code: res.data.code,
					stat: {
						dtStat: res.data.result.dtStat,
						handicap: res.data.result.handicap,
						fullRndCnt: res.data.result.fullRndCnt
					}
				}

                return payload
            }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }   

	// 최근 5경기 평균 타수
	const getRecentAvgShots = (stat: Stat): number => {
		let shot: number = 0
		if (stat.dtStat && stat.dtStat.length > 0) {
			for (let i = 0; i < stat.dtStat.length; i++) {
				shot += Number(stat.dtStat[i].totCnt)
			}

			return Number((shot / stat.dtStat.length).toFixed(1))
		}

		return shot
	}

	// 최근 5경기 평균 비거리
	const getRecentAvgTeeDistance = (stat: Stat): number => {
		let distance: number = 0

		if (stat.dtStat && stat.dtStat.length > 0) {
			for (let i = 0; i < stat.dtStat.length; i++) {
				distance += stat.dtStat[i].avgTeeDist
			} 
			
			return Number((distance / 5).toFixed(1))
		}

		return distance
	}

	// 1경기 평균 퍼트 수
	const getAvgPutts = (record: Record, index: number): number => {
		let putt: number = 0
		let count: number = 0

		if (record.puttcount && record.puttcount.length > 0) {
			for (let i = 1; i <= 18; i++) {
				if ((record.puttcount[index] as any)[`hole${i}`] && (record.puttcount[index] as any)[`hole${i}`] > 0) {
					putt += (record.puttcount[index] as any)[`hole${i}`]
					count ++
				}
			}
			if (count > 0) {
				return Number((putt / count).toFixed(1))
			}
		}

		return putt
	}

	// 최근 5경기 평균 퍼트 수
	const getRecentAvgPutts = (record: Record): number => {
		let putt: number = 0
		let count: number = 0

		if (record.puttcount && record.puttcount.length > 0) {
			for (let i = 1; i <= record.puttcount.length; i++) {
				for (let j = 1; j<= 18; j++) {
					if ((record.puttcount[i - 1] as any)[`hole${j}`]) {
						putt += (record.puttcount[i - 1] as any)[`hole${j}`]
						count ++
					}
				} 
			}

			return Number((putt / count).toFixed(1))
		}

		return putt
	}

	// 1경기 페어웨이 안착률
	const getFair = (record: Record, index: number): number => {
		let success: number = 0
		let attempt: number = 0

		if (record.fairArr && record.fairArr.length > 0) {
			for (let i = 1; i <= 18; i++) {
				if ((record.fairArr[index] as any)[`hole${i}`] && (record.fairArr[index] as any)[`hole${i}`] === 'Y') {
					success ++
					attempt ++
				} else if ((record.fairArr[index] as any)[`hole${i}`] && (record.fairArr[index] as any)[`hole${i}`] === 'N') {
					attempt ++
				}
			}
			if (attempt > 0) {
				return Number((success / attempt * 100).toFixed(1))
			}
		}

		return success
	}

	// 최근 5경기 페어웨이 안착률
	const getRecentAvgFair = (record: Record): number => {
		let success: number = 0
		let attempt: number = 0

		if (record.fairArr && record.fairArr.length > 0) {
			for (let i = 0; i < record.fairArr.length; i++) {
				for (let j = 1; j <= 18; j++) {
					if ((record.fairArr[i] as any)[`hole${j}`] && (record.fairArr[i] as any)[`hole${j}`] === 'Y') {
						success ++
						attempt ++
					} else if ((record.fairArr[i] as any)[`hole${j}`] && (record.fairArr[i] as any)[`hole${j}`] === 'N') {
						attempt ++
					}
				}
			}

			if (attempt > 0) {
				return Number((success / attempt * 100).toFixed(1)) 	
			}
		}
		return success
	}

	// 1경기 그린 적중률
	const getGreen = (record: Record, index: number): number => {
		let success: number = 0
		let attempt: number = 0

		if (record.girArr && record.girArr.length > 0) {
			for (let i = 1; i <= 18; i++) {
				if ((record.girArr[index] as any)[`hole${i}`] && (record.girArr[index] as any)[`hole${i}`] === 'Y') {
					success ++
					attempt ++
				} else if ((record.girArr[index] as any)[`hole${i}`] && (record.girArr[index] as any)[`hole${i}`] === 'N') {
					attempt ++
				}
			}
			if (attempt > 0) {
				return Number((success / attempt * 100).toFixed(1))
			}
		}

		return success
	}


	// 최근 5경기 그린 적중률
	const getRecentAvgGreen = (record: Record): number => {
		let success: number = 0
		let attempt: number = 0

		if (record.girArr && record.girArr.length > 0) {
			for (let i = 0; i < record.girArr.length; i++) {
				for (let j = 1; j <= 18; j++) {
					if ((record.girArr[i] as any)[`hole${j}`] && (record.girArr[i] as any)[`hole${j}`] === 'Y') {
						success ++
						attempt ++
					} else if((record.girArr[i] as any)[`hole${j}`] && (record.girArr[i] as any)[`hole${j}`] === 'N') {
						attempt ++
					}
				}
			}
			if (attempt > 0) {
				return Number((success / attempt * 100).toFixed(1)) 	
			}
		}
		return success	
	}

	// 1경기 파 세이브율
	const getParSave = (record: Record, index: number): number => {
		let parSave: number = 0
		
		if (record.parSaveArr && record.parSaveArr.length > 0) {
			let attempt: number = 0
			let success: number = 0

			for (let i = 1; i <= 18; i++) {
				if ((record.parSaveArr[index] as any)[`hole${i}`] && (record.parSaveArr[index] as any)[`hole${i}`] === 'Y') {
					success++
					attempt++
				} else if ((record.parSaveArr[index] as any)[`hole${i}`] && (record.parSaveArr[index] as any)[`hole${i}`] === 'N') {
					attempt++
				} 
			}

			if (attempt > 0) {
				parSave = success / attempt * 100
				return Number(parSave.toFixed(1))
			}
		}

		return parSave
	}

	// 최근 5경기 파 세이브율
	const getRecentAvgParSave = (record: Record): number => {
		let parSave: number = 0
		let sum: number = 0
		
		if (record.parSaveArr && record.parSaveArr.length > 0) {
			for (let i = 0; i < record.parSaveArr.length; i++) {
				let attempt: number = 0
				let success: number = 0

				for (let j = 1; j <= 18; j++) {
					if ((record.parSaveArr[i] as any)[`hole${j}`] && (record.parSaveArr[i] as any)[`hole${j}`] === 'Y') {
						success++
						attempt++
					} else if ((record.parSaveArr[i] as any)[`hole${j}`] &&(record.parSaveArr[i] as any)[`hole${j}`] === 'N') {
						attempt++
					} 
				}
				
				if (attempt > 0) {
					sum += success / attempt * 100	
				}
			}

			parSave = sum / 5
		}
		return Number(parSave.toFixed(1)) ?? 0
	}

    return { getScore, getStat, getRecentAvgShots, getRecentAvgTeeDistance, getAvgPutts, getRecentAvgPutts,
        getFair, getRecentAvgFair, getGreen, getRecentAvgGreen, getParSave ,getRecentAvgParSave  } 
}

const errorHandler = (error: any): void => {
    Alert.alert('알림', error ?? '서버에 연결할 수 없습니다.')
}
