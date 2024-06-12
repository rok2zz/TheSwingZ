import { useSelector } from "react-redux";
import { RootState } from "../slices";
import { ReservationInfo, ReservationSetting, ReservationTime, ShopInfo } from "../slices/reservation";
import { Body, Payload, ShopResponse } from "../types/apiTypes";
import { ServerInfo } from "../slices/api";
import { useServerInfo } from "./useApi";
import axios from "axios";
import { Alert } from "react-native";
import { useAccessToken, useRefreshToken } from "./useToken";
import { useReservationActions } from "./useReservationActions";
import { useAuthActions } from "./useAuthActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ReservationHook {
    getShop: (date: Date | null, people: number | null) => Promise<Payload>,
    getShopInfo: (shopId: number) => Promise<Payload>,
    getReservationInfo: (date: Date, count: number, shopId: number) => Promise<Payload>,
    getMyReservation: (revId: number | null) => Promise<Payload>,
    registReservation: (shopId: number, revInfo: ReservationSetting, name: string, phone: string, gameMode: string, selectedHole: number, isLeft: boolean, linkedRoom: boolean, twoRoom: boolean, twoGame: boolean) => Promise<Payload>
    deleteReservation: (revId: number) => Promise<Payload>,
    setFavoriteShop: (shopId: number, isFavorite: number) => Promise<Payload>
}

export const useReservationInfo = (): ReservationSetting => {
    return useSelector((state: RootState) => state.reservation.reservationSetting)
}

export const useIsOpen = (): boolean => {
    return useSelector((state: RootState) => state.reservation.isOpen)
}

export const useShopList = (): ShopInfo[] => {
    return useSelector((state: RootState) => state.reservation.shopList)
}

export const useRevList = (): ReservationTime[] => {
    return useSelector((state: RootState) => state.reservation.revList)
}

export const useMyRevList = (): ReservationInfo[] => {
    return useSelector((state: RootState) => state.reservation.myRevList)
}

const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const useReservation = (): ReservationHook => {
    const serverInfo: ServerInfo = useServerInfo()
    const accessToken = useAccessToken()
    const refreshToken = useRefreshToken()
    const { clearUserInfo, saveAccessToken } = useAuthActions()
    const { saveShopList, saveRevList, saveMyRevList } = useReservationActions()
    const appURL = serverInfo.appServer
    const officeURL = serverInfo.officeServer

    const getShop = async (date: Date | null, people: number | null): Promise<Payload> => {
        const body: Body = {
            cls: 'Shop',
            method: 'getShopList',
            params: [ 
                date !== null ? formatDate(date) : null,
                people
            ]
        }

        const jsonBody: string = JSON.stringify(body)
    
        try {
            const res: ShopResponse = await axios.post(appURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })

            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: ShopResponse = await axios.post(appURL, jsonBody, {
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
                    
                    if (res.data.result && res.data.result.shopList && res.data.result.revList && res.data.result.accessToken) {
                        saveShopList(res.data.result.shopList)
                        saveRevList(res.data.result.revList)
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
            
            if (res.data.result && res.data.result.shopList && res.data.result.revList) {
                saveShopList(res.data.result?.shopList)
                saveRevList(res.data.result?.revList)
            }

            return { code: 1000 }
            
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    const getShopInfo = async (shopId: number): Promise<Payload> => {
        const body: Body = {
            cls: 'Shop',
            method: 'getShopInfo',
            params: [ 
                shopId
            ]
        }

        const jsonBody: string = JSON.stringify(body)
    
        try {
                const res: ShopResponse = await axios.post(appURL, jsonBody, {
                    headers: {
                        "accessToken": accessToken
                    }
                })
                if (res.data.code !== 1000) {
                    if (res.data.code === -5000) {
                        const res: ShopResponse = await axios.post(appURL, jsonBody, {
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
                        
                        if (res.data.result && res.data.result.bill && res.data.result.notice && res.data.result.accessToken) {
                            const token = {
                                accessToken: res.data.result?.accessToken,
                                refreshToken: refreshToken
                            }
                            await AsyncStorage.setItem('token', JSON.stringify(token))

                            const payload: Payload = {
                                code: res.data.code,
                                bill: res.data.result.bill,
                                notice: res.data.result.notice
                            }

                            return payload
                        }
                    }

                    const payload: Payload = {
                        code: res.data.code,
                        msg: res.data.msg
                    }   
    
                    return payload
                }
                
                if (res.data.result && res.data.result.notice && res.data.result.bill) {
                    const payload: Payload = {
                        code: res.data.code,
                        bill: res.data.result.bill,
                        notice: res.data.result.notice
                    }

                    return payload
                }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    const getReservationInfo = async (date: Date, count: number, shopId?: number): Promise<Payload> => {
        const body: Body = {
            cls: 'Shop',
            method: 'getReservationInfo',
            params: [ 
                formatDate(date),
                count,
                shopId ?? null
            ]
        }

        const jsonBody: string = JSON.stringify(body)
    
        try {
                const res: ShopResponse = await axios.post(appURL, jsonBody, {
                    headers: {
                        "accessToken": accessToken
                    }
                })
                if (res.data.code !== 1000) {
                    if (res.data.code === -5000) {
                        const res: ShopResponse = await axios.post(appURL, jsonBody, {
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
                        
                        if (res.data.result && res.data.result.shopList && res.data.result.revList && res.data.result.accessToken) {
                            saveShopList(res.data.result.shopList)
                            saveRevList(res.data.result.revList)
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
                
                if (res.data.result && res.data.result.shopList && res.data.result.revList) {
                    saveShopList(res.data.result.shopList)
                    saveRevList(res.data.result.revList)
                }

                return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    const getMyReservation = async (revId: number | null): Promise<Payload> => {
        const body: Body = {
            cls: 'Shop',
            method: 'getMyReservation',
            params: [ 
               revId
            ]
        }
        
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: ShopResponse = await axios.post(appURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }    

                if (res.data.code === -5000) {
                    const res: ShopResponse = await axios.post(appURL, jsonBody, {
                        headers: {
                            "refreshToken": refreshToken
                        }
                    })

                    // 자동 로그인 만료시
                    if (res.data.code === -5002) {
                        Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                        await AsyncStorage.removeItem('token')
                        await AsyncStorage.removeItem('userInfo')
                        clearUserInfo()

                        const payload: Payload = {
                            code: 1001,
                            msg: res.data.msg
                        }

                        return payload
                    }

                    if (res.data.code !== 1000) {
                        const payload: Payload = {
                            code: res.data.code,
                            msg: res.data.msg
                        }    
        
                        return payload
                    }
                    
                    if (res.data.result && res.data.result.myRevList && res.data.result.accessToken) {
                        saveMyRevList(res.data.result.myRevList)
                        saveAccessToken(res.data.result.accessToken)
                    }
                    
                    return { code: 1000 }
                }

                return payload
            }
            
            if (res.data.result && res.data.result.myRevList) {
                saveMyRevList(res.data.result.myRevList)
            }

            return { code: 1000 }
            
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }

    } 

    const registReservation = async (shopId: number, revInfo: ReservationSetting, name: string, phone: string, gameMode: string, selectedHole: number, isLeft: boolean, linkedRoom: boolean, twoRoom: boolean, twoGame: boolean) => { 
        const beginAt = formatDate(new Date(revInfo.date))
        const endAt = twoGame ? formatDate(new Date(new Date(revInfo.date).setHours(new Date(beginAt).getHours() + (revInfo.people + 1) * 2))) : formatDate(new Date(new Date(revInfo.date).setHours(new Date(beginAt).getHours() + revInfo.people + 1)))

        const getUserMemo = () => {
            let userMemo = ''
            if (isLeft) userMemo += '좌타석​,'
            if (linkedRoom) userMemo += '연결된 방​,'
            if (twoRoom) userMemo += '방2개로 예약​,' 
            if (twoGame) userMemo += '2게임 연속 예약​'

            return userMemo
        }

        const body: Body = {
            cls: 'Reservation',
            method: 'registApp',
            params: [ 
                shopId,
                beginAt,
                endAt,
                name,
                phone,
                revInfo.people + 1,
                gameMode,
                selectedHole,
                getUserMemo()
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: ShopResponse = await axios.post(officeURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: ShopResponse = await axios.post(officeURL, jsonBody, {
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
                    
                    if (res.data.result && res.data.result.revList && res.data.result.accessToken) {
                        saveRevList(res.data.result.revList)
                        saveAccessToken(res.data.result.accessToken)

                        const token = {
                            accessToken: res.data.result?.accessToken,
                            refreshToken: refreshToken
                        }
                        await AsyncStorage.setItem('token', JSON.stringify(token))
                    }
                    
                    return { 
                        code: 1000, 
                        revId: res.data.result?.revId
                    }
                }

                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }    

                return payload
            }
            
            if (res.data.result && res.data.result.revList) {
                saveRevList(res.data.result.revList)
            }

            return { 
                code: 1000, 
                revId: res.data.result?.revId
            }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    const modifyReservation = async (shopId: number, revInfo: ReservationSetting, gameMode: string, selectedHole: number, isLeft: boolean, linkedRoom: boolean, twoRoom: boolean, twoGame: boolean) => {
        
        const beginAt = formatDate(new Date(revInfo.date))
        const endAt = formatDate(new Date(new Date(revInfo.date).setHours(new Date(beginAt).getHours() + 2)))

        const getUserMemo = () => {
            let userMemo = ''
            if (isLeft) userMemo += '좌타석​,'
            if (linkedRoom) userMemo += '연결된 방​,'
            if (twoRoom) userMemo += '방2개로 예약​,' 
            if (twoGame) userMemo += '2게임 연속 예약​'

            return userMemo
        }

        const body: Body = {
            cls: 'Reservation',
            method: 'registApp',
            params: [ 
                shopId,
                beginAt,
                endAt,
                revInfo.people + 1,
                gameMode,
                selectedHole,
                getUserMemo()
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            if (accessToken) {
                const res: ShopResponse = await axios.post(appURL, jsonBody, {
                    headers: {
                        "accessToken": accessToken
                    }
                })
                if (res.data.code !== 1000) {
                    const payload: Payload = {
                        code: res.data.code,
                        msg: res.data.msg
                    }    

                    if (res.data.code === -5000) {
                        const res: ShopResponse = await axios.post(appURL, jsonBody, {
                            headers: {
                                "refreshToken": refreshToken
                            }
                        })
            
                        if (res.data.code !== 1000) {
                            const payload: Payload = {
                                code: res.data.code,
                                msg: res.data.msg
                            }    
            
                            return payload
                        }
                        
                        if (res.data.result && res.data.result.revList && res.data.result.accessToken) {
                            saveRevList(res.data.result.revList)
                            saveAccessToken(res.data.result.accessToken)
                        }
                        
                        return { code: 1000 }
                    }
    
                    return payload
                }
                
                if (res.data.result && res.data.result.revList) {
                    saveRevList(res.data.result.revList)
                }

                return { code: 1000 }
            }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    const deleteReservation = async (revId: number): Promise<Payload>  => {
        const body: Body = {
            cls: 'Shop',
            method: 'deleteReservation',
            params: [ 
                revId
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: ShopResponse = await axios.post(appURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }                    
                if (res.data.code === -5000) {
                    const res: ShopResponse = await axios.post(appURL, jsonBody, {
                        headers: {
                            "refreshToken": refreshToken
                        }
                    })
        
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

                    if (res.data.code !== 1000) {
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

                return payload
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    const setFavoriteShop = async (shopId: number, isFavorite: number): Promise<Payload>  => {
        const body: Body = {
            cls: 'Shop',
            method: 'favoriteShop',
            params: [ 
                shopId,
                isFavorite
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: ShopResponse = await axios.post(appURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }                    
                if (res.data.code === -5000) {
                    const res: ShopResponse = await axios.post(appURL, jsonBody, {
                        headers: {
                            "refreshToken": refreshToken
                        }
                    })
        
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

                    if (res.data.code !== 1000) {
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

                return payload
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '알 수 없는 에러가 발생했습니다.' }
    }

    return { getShop, getShopInfo, getReservationInfo, getMyReservation, registReservation, deleteReservation, setFavoriteShop }
}

const errorHandler = (error: any): void => {
    Alert.alert('알림', '서버에 연결할 수 없습니다.')
}