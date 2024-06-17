import axios from "axios";
import { Alert } from "react-native";
import { LoginData, Response, Body, Payload, SettingResponse, UserSettingBody, LoginResponse } from "../types/apiTypes";
import { useAuthActions } from "./useAuthActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { RootState } from "../slices"
import { UserInfo, UserSetting, User, AuthInfo } from "../slices/auth";
import { useRecordActions } from "./useRecordActions";
import { ServerInfo } from "../slices/api";
import { useServerInfo } from "./useApi";
import ImageResizer from "react-native-image-resizer";
import { useAccessToken, useRefreshToken } from "./useToken";

interface UsersHook {
    idLogin: (userID: string, userPW: string, auto: boolean) => Promise<Payload>,
    socialLogin: (socialID: string, category: string) => Promise<Payload>,
    autoLogin: (refreshToken: string) => Promise<Payload>,
    logout: (refreshToken: string) => Promise<Payload>,

    createAccount: (user: User) => Promise<Payload>,
    socialCreate: (socialID: string, category: string, realName: string, email: string, phone: string, nickname: string, location: string, code: string) => Promise<Payload>,
    checkDuplicatedId: (userID: string) => Promise<Payload>,
    checkDuplicatedNickname: (nickname: string) => Promise<Payload>,

    sendMessage: (phone: string, type: number) => Promise<Payload>,

    findID: (phone: string) => Promise<Payload>,
    checkPW: (password: string) => Promise<Payload>,
    resetPW: (userID: string, newPassword: string) => Promise<Payload>,
    
    screenLogin: (type: number, code: string | number) => Promise<Payload>,

    modifyProfile: (prevNickname: string, nickname: string, uri: string, isImgChanged: boolean) => Promise<Payload>,
    modifyUserInfo: (password: string, location: string) => Promise<Payload>,
    deleteAccount: (reason: string, password: string) => Promise<Payload>,

    getProfileImages: (uidArr: number[]) => Promise<Payload>,

    getSettingValue: (uid: number) => Promise<Payload>,
    setSettingValue: (uid: number, setting: UserSetting) => Promise<Payload>,
}

export const useAuthInfo = (): AuthInfo => {
    return useSelector((state: RootState) => state.auth.authInfo)
}

export const useUserInfo = (): UserInfo => {
    return useSelector((state: RootState) => state.auth.userInfo)
}

export const useUserSetting = (): UserSetting => {
    return useSelector((state: RootState) => state.auth.userSetting)
}

export const useSocialId = (): string => {
    return useSelector((state: RootState) => state.auth.socialId)
}

export const useIsFirst = (): boolean => {
    return useSelector((state: RootState) => state.auth.isFirst)
}

export const useIsTabConnected = (): boolean => {
    return useSelector((state: RootState) => state.auth.isTabConnected)
}

export const useIsMainLoaded = (): boolean => {
    return useSelector((state: RootState) => state.auth.isMainLoaded)
}

// UsersHook
export const useUsers = (): UsersHook => {
    const serverInfo: ServerInfo = useServerInfo()
    const { saveRefreshToken, saveAccessToken, clearUserInfo, saveUserInfo, saveUserSetting, modifyMyProfile, saveIsFirst } = useAuthActions()
    const { clearRecord } = useRecordActions()
    const accessToken = useAccessToken()
    const refreshToken = useRefreshToken()

    const authURL = serverInfo.authServer
    const gameURL = serverInfo.gameServer
    const appURL = serverInfo.appServer

    // 로그인 메소드
    const idLogin = async (userID: string, userPW: string, auto: boolean): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'login',
            params: [ 
                userID,
                userPW,
                2
            ]
        }
  
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: LoginResponse = await axios.post(authURL, jsonBody)
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
                const loginData: LoginData = {
                    userInfo: {
                        uid: res.data.result.uid,
                        type: res.data.result.type,
                        status: res.data.result.status,
                        realName: res.data.result.realName,
                        phone: res.data.result.phone,
                        country: res.data.result.country,
                        language: res.data.result.language,
                        updatedAt: res.data.result.updatedAt,
                        birth: res.data.result.birth,
                        gender: res.data.result.gender,
                        name: res.data.result.name,
                        nick: res.data.result.nick,
                        email: res.data.result.email,
                        point: res.data.result.point,
                        createdAt: res.data.result.createdAt,
                        pwdUpdatedAt: res.data.result.pwdUpdatedAt,
                        category: res.data.result.category,
                        favoriteLocate: res.data.result.favoriteLocate,
                        profileImg: res.data.result.profileImg
                    },
                    token: {
                        accessToken: res.data.result?.accessToken,
                        refreshToken: res.data.result?.refreshToken
                    }
                }


                // 성공시 복호화 후 AsyncStorage, redux에 저장
                if (loginData.token) {
                    saveRefreshToken(loginData.token.refreshToken ?? null)
                    saveAccessToken(loginData.token.accessToken ?? null)
                    saveUserInfo(loginData.userInfo)
                        
                    if (auto) {
                        await AsyncStorage.setItem('token', JSON.stringify(loginData.token))
                    }

                    return {
                        code: res.data.code,
                    }
                }
            }

        } catch (error: any) {
            console.log(error)
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }   

    // 소셜 로그인
    const socialLogin = async (socialID: string, category: string): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'socialLogin',
            params: [ 
                0,
                socialID,
                category,
                'login'
            ]
        }
  
        const jsonBody: string = JSON.stringify(body)
    
        try {
            const res: LoginResponse = await axios.post(authURL, jsonBody)
            console.log(res.data)
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
                const loginData: LoginData = {
                    userInfo: {
                        uid: res.data.result.uid,
                        type: res.data.result.type,
                        status: res.data.result.status,
                        realName: res.data.result.realName,
                        phone: res.data.result.phone,
                        country: res.data.result.country,
                        language: res.data.result.language,
                        updatedAt: res.data.result.updatedAt,
                        birth: res.data.result.birth,
                        gender: res.data.result.gender,
                        name: res.data.result.name,
                        nick: res.data.result.nick,
                        email: res.data.result.email,
                        point: res.data.result.point,
                        createdAt: res.data.result.createdAt,
                        pwdUpdatedAt: res.data.result.pwdUpdatedAt,
                        category: res.data.result.category,
                        favoriteLocate: res.data.result.favoriteLocate,
                        profileImg: res.data.result.profileImg
                    },
                    token: {
                        accessToken: res.data.result?.accessToken,
                        refreshToken: res.data.result?.refreshToken
                    }
                }

                // 성공시 복호화 후 AsyncStorage, redux에 저장
                if (loginData.token) {
                    const settingPayload: Payload = await getSettingValue(loginData.userInfo.uid)

                    if (settingPayload.code !== 1000) {
                        return {
                            code: settingPayload.code,
                            msg: settingPayload.msg
                        }
                    }

                    saveRefreshToken(loginData.token.refreshToken ?? null)
                    saveAccessToken(loginData.token.accessToken ?? null)
                    saveUserInfo(loginData.userInfo)
                        
                    await AsyncStorage.setItem('token', JSON.stringify(loginData.token))

                    const payload: Payload = {
                        code: res.data.code,
                    }

                    return payload
                }
            }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }   

    // 자동 로그인
    const autoLogin = async (refreshToken: string): Promise<Payload> => {
   
        const body: Body = {
            cls: "Account",
            method: "autoLogin"
        }
    
        const jsonBody: string = JSON.stringify(body)
        
        try {
            const res: LoginResponse = await axios.post(authURL, jsonBody, {
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
    
            // 성공
            if (res.data.result && 'type' in res.data.result && 'uid' in res.data.result) {
                const loginData: LoginData = {
                    userInfo: {
                        uid: res.data.result.uid,
                        type: res.data.result.type,
                        status: res.data.result.status,
                        realName: res.data.result.realName,
                        phone: res.data.result.phone,
                        country: res.data.result.country,
                        language: res.data.result.language,
                        updatedAt: res.data.result.updatedAt,
                        birth: res.data.result.birth,
                        gender: res.data.result.gender,
                        name: res.data.result.name,
                        nick: res.data.result.nick,
                        email: res.data.result.email,
                        point: res.data.result.point,
                        createdAt: res.data.result.createdAt,
                        pwdUpdatedAt: res.data.result.pwdUpdatedAt,
                        category: res.data.result.category,
                        favoriteLocate: res.data.result.favoriteLocate,
                        profileImg: res.data.result.profileImg
                    },
                    token: {
                        accessToken: res.data.result?.accessToken,
                        refreshToken: refreshToken
                    }
                }
                
                if (res.data.result.profileImg) {
                    const img = res.data.result.profileImg


                }


                // 휴면상태 code 1001
                if (loginData.userInfo.status === 'S') { 
                    const payload: Payload = {
                        code: 1001,
                        uid: loginData.userInfo.uid
                    }

                    return payload
                } 

                // 성공시 복호화 후 AsyncStorage, redux에 저장
                if (loginData.token) {
                    saveRefreshToken(refreshToken)
                    saveAccessToken(loginData.token.accessToken ?? null)
                    saveUserInfo(loginData.userInfo)
                        
                    await AsyncStorage.setItem('token', JSON.stringify(loginData.token))

                    const payload: Payload = {
                        code: res.data.code,
                    }

                    return payload
                }
            }
        } catch (error: any) {
            console.log(error)
        }

        return  { code: -1, msg: '오류가 발생했습니다.' }
    }

    // 회원가입 메소드
    const createAccount = async (user: User): Promise<Payload> => {
        const body: Body = {
            cls: "Account",
            method: "create",
    
            params: [
                user.userID,
                user.password,
                user.nickname,
                user.realName ?? null,
                user.email ?? null,
                user.phone ?? null,
                user.birth ?? null,
                user.gender ?? null,
                user.location
            ]
        }

        const jsonBody = JSON.stringify(body)

        try {
            const res: Response = await axios.post(authURL, jsonBody)

            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }    

                return payload
            }
            if (res.data.result && res.data.result.uid) {
                const settingPayload: Payload = await createSettingValue(res.data.result.uid)

                if (settingPayload.code !== 1000) {
                    return  { 
                        code: settingPayload.code, 
                        msg: settingPayload.msg 
                    }
                }
            }
            
            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 소셜 계정 생성
    const socialCreate = async (socialID: string, category: string, realName: string, email: string, phone: string, nickname: string, location: string, code: string): Promise<Payload> => {
        const body: Body = {
            cls: "Account",
            method: "socialLogin",
    
            params: [
                0,
                socialID ?? '',
                category ?? '',
                'create',
                realName,
                email,
                phone,
                nickname ?? '',
                location ?? '',
                code ?? ''
            ]
        }
        
        const jsonBody = JSON.stringify(body)
        try {
            const res: LoginResponse = await axios.post(authURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }    

                return payload
            }
            
            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    const checkDuplicatedId = async (userID: string): Promise<Payload> => {
        const body: Body = {
            cls: "Account",
            method: "checkName",
            params: [
                userID
            ]
        }

        const jsonBody = JSON.stringify(body)
        try {
            const res: Response = await axios.post(authURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }    

                return payload
            }
            
            return { code: 1000 }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    const checkDuplicatedNickname = async (nickname: string): Promise<Payload> => {
        const body: Body = {
            cls: "Account",
            method: "checkNick",
            params: [
                nickname
            ]
        }

        const jsonBody = JSON.stringify(body)
        try {
            const res: Response = await axios.post(authURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }    

                return payload
            }
            
            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 휴대폰 인증요청 메소드
    const sendMessage = async (phone: string, type: number): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'sendMessage',
            params: [ 
                phone, 
                type 
            ]
        }
        const jsonBody: string = JSON.stringify(body)
        try {
            const res: Response = await axios.post(authURL, jsonBody)
            console.log(res.data)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: 1000 }     
        } catch (error: any) {
            errorHandler(error)
        }
        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 아이디 찾기 메소드
    const findID = async (phone: string): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'findUser',
            params: [ phone ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(authURL, jsonBody)
            console.log(res.data)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }
 
                return payload
            }

            if (res.data.result && res.data.result.name) {
                if (res.data.result.name) {
                    const payload: Payload = {
                        code: res.data.code,
                        userID: res.data.result?.name
                    }

                    return payload
                }
            }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 비밀번호 확인
    const checkPW = async (password: string): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'checkPassword',
            params: [ password ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(authURL, jsonBody, {
                headers: {
                    'accessToken': accessToken
                }
            })

            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(authURL, jsonBody, {
                        headers: {
                            'refreshToken': refreshToken
                        }
                    })

                    if (res.data.code !== 1000) {
                        // 자동 로그인 만료시
                        if (res.data.code === -5002) {
                            Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                            clearUserInfo()

                            return { code: 1001 }
                        }

                        const payload: Payload = {
                            code: res.data.code ?? -1,
                            msg: res.data.msg
                        }

                        return payload
                    }
                    
                    return { code: 1000 }
                }

                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }
    
    // 비밀번호 찾기 후 재설정 메소드
    const resetPW = async (userID: string, newPassword: string): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'resetPassword',
            params: [ 
                userID,
                newPassword 
            ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: Response = await axios.post(authURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // QR, number 로그인 0: QR, 1: number
    const screenLogin = async (type: number, code: string | number): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'easyLogin',
            params: [ 
                type,
                code
            ]
        }
  
        const jsonBody: string = JSON.stringify(body)
    
        try {
            const res: Response = await axios.post(authURL, jsonBody, {
                headers: {
                    'accessToken': accessToken
                }
            })  

            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(authURL, jsonBody, {
                        headers: {
                            'refreshToken': refreshToken
                        }
                    })

                    if (res.data.code !== 1000) {
                        // 자동 로그인 만료시
                        if (res.data.code === -5002) {
                            Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                            clearUserInfo()

                            return { code: 1001 }
                        }

                        const payload: Payload = {
                            code: res.data.code ?? -1,
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
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }  

    const modifyProfile = async (prevNickname: string, nickname: string, uri: string, isImgChanged: boolean): Promise<Payload> => {
        const formData = new FormData()
        formData.append('cls', 'Account')
        formData.append('method', 'changeProfile')
        formData.append('prevNick', prevNickname)
        formData.append('nick', nickname)

        const imgUri = isImgChanged ? uri : ''

        if (imgUri !== '' && isImgChanged) {
            try {
                const resizedImage = await ImageResizer.createResizedImage(
                    uri,
                    600, // maxWidth
                    600, // maxHeight
                    'JPEG', // format
                    70, // quality
                    0, //rotation
                    undefined,
                    false,
                    { onlyScaleDown: true }
                )
                formData.append('image', {
                    uri: resizedImage.uri,
                    name: `profileImg`,
                    type: 'image/jpeg'
                })

            } catch (e) {
                console.error('파일 복사 오류:', e)
            }
        } else if (imgUri === '' && isImgChanged) {
            formData.append('isChanged', 0)
        } else if (imgUri === '' && !isImgChanged) {
            formData.append('isChanged', 1)
        }

        try {
            const res: Response = await axios.post(authURL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'accessToken': accessToken
                },
                transformRequest: () => formData            
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(authURL, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'refreshToken': refreshToken
                        },
                        transformRequest: () => formData
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
        
                    if (res.data.result && res.data.result.accessToken) {
                        saveAccessToken(res.data.result.accessToken)
                        modifyMyProfile({
                            uri: (imgUri === '' && !isImgChanged) ? uri : res.data.result?.url ?? '',
                            nick: res.data.result?.nick ?? nickname
                        })
                        
                        const token = {
                            accessToken: res.data.result?.accessToken,
                            refreshToken: refreshToken
                        }
                        await AsyncStorage.setItem('token', JSON.stringify(token))
                    }
    
                    return { code: 1000 }
                }

                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
            modifyMyProfile({
                uri: (imgUri === '' && !isImgChanged) ? uri : res.data.result?.url ?? '',
                nick: res.data.result?.nick ?? nickname
            })

            return { code: 1000 }

        } catch (error: any) {
            console.log(error)
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 정보수정 메소드
    const modifyUserInfo = async (password: string, location: string): Promise<Payload> => {
        const body: Body = {
            cls: 'Account',
            method: 'setInfo',
            params: [ 
                location,
                password
            ]
        }
  
        const jsonBody: string = JSON.stringify(body)
    
        try {
            const res: Response = await axios.post(authURL, jsonBody, {
                headers: {
                    'accessToken': accessToken
                }
            }) 
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(authURL, jsonBody, {
                        headers: {
                            'accessToken': accessToken
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
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            // 다른 오류 발생시
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 로그아웃 메소드 로컬스토리지, 리덕스 제거
    const logout = async (refreshToken: string): Promise<Payload> => {
        const body: Body = {
            cls: "Account",
            method: "logout",
        }
    
        const jsonBody: string = JSON.stringify(body)   

        try {
            const res: Response = await axios.post(authURL, jsonBody, {
                headers: {
                    "refreshToken": refreshToken
                }
            })
            console.log(res.data)
            saveIsFirst(false)
            clearUserInfo()
            clearRecord()
            saveRefreshToken(null)
            saveAccessToken(null)

            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: 1000 }

        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 계정 탈퇴 메소드
    const deleteAccount = async (reason: string, password: string): Promise<Payload> => {
        const body: Body = {
            cls: "Account",
            method: "delete",
            params: [
                password,
                reason
            ]
        }
    
        const jsonBody: string = JSON.stringify(body)
    
        try {
            const res: Response = await axios.post(authURL, jsonBody, {
                headers: {
                    "accessToken": accessToken
                }
            })
            if (res.data.code !== 1000) {
                if (res.data.code === -5000) {
                    const res: Response = await axios.post(authURL, jsonBody, {
                        headers: {
                            'refreshToken': refreshToken
                        }
                    })
                    console.log(res.data)
                    if (res.data.code !== 1000) {
                        // 자동 로그인 만료시
                        if (res.data.code === -5002) {
                            Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                            clearUserInfo()

                            return { code: 1001 }
                        }

                        const payload: Payload = {
                            code: res.data.code ?? -1,
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
                    clearUserInfo()
                    
                    return { code: 1000 }
                }

                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }
            clearUserInfo()
            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // get profileImg
    const getProfileImages = async (uidArr: number[]): Promise<Payload> => {
        const body: Body = {
            cls: 'Play',
            method: 'getUserProfileImages',
            params: [ 
                uidArr
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
                    const res: Response = await axios.post(authURL, jsonBody, {
                        headers: {
                            'accessToken': accessToken
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
        
                    if (res.data.result && res.data.result.users && res.data.result.accessToken) {
                        saveAccessToken(res.data.result.accessToken)

                        const token = {
                            accessToken: res.data.result?.accessToken,
                            refreshToken: refreshToken
                        }
                        await AsyncStorage.setItem('token', JSON.stringify(token))

                        const payload: Payload = {
                            code: res.data.code,
                            userProfileImgs: res.data.result.users
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

            if (res.data.result && res.data.result.users) {
                const payload: Payload = {
                    code: res.data.code,
                    userProfileImgs: res.data.result.users
                }

                return payload
            }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 회원가입시 설정 테이블 생성
    const createSettingValue = async (uid: number): Promise<Payload> => {
        const body: Body = {
            cls: "UserConfig",
            method: "add",
            params: [
                uid,
                'C'
            ]
        }
    
        const jsonBody: string = JSON.stringify(body)   

        try {
            const res: SettingResponse = await axios.post(gameURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            return { code: res.data.code }

        } catch (error: any) {
            errorHandler(error)
        }
        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 설정 불러오기
    const getSettingValue = async (uid: number): Promise<Payload> => {
        const body: Body = {
            cls: "UserConfig",
            method: "list",
            params: [
                uid,
                'C'
            ]
        }
    
        const jsonBody: string = JSON.stringify(body)   
        try {
            const res: SettingResponse = await axios.post(gameURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            if (res.data.result && res.data.result?.confList.length > 0) {
                saveUserSetting({
                    openProfileRecord: res.data.result.confList[0].codeValue === 'Y' ? true : false,
                    searchFriend: res.data.result.confList[1].codeValue === 'Y' ? true : false,

                    notification: res.data.result.confList[2].codeValue === 'Y' ? true : false,
                    friend: res.data.result.confList[3].codeValue === 'Y' ? true : false,
                    comment: res.data.result.confList[4].codeValue === 'Y' ? true : false,

                    marketing: res.data.result.confList[5].codeValue === 'Y' ? true : false,
                })
            }

            if (res.data.result && res.data.result.confList.length <= 0) {
                console.log('설정값없음')
                await createSettingValue(uid)
                await getSettingValue(uid)

                // const userSetting: UserSetting = {
                //     openProfileRecord: true ,
                //     searchFriend: true,

                //     notification: true,
                //     friend: true,
                //     comment: true,

                //     marketing: true,
                // }
            }

            return { code: res.data.code }

        } catch (error: any) {
            errorHandler(error)
        }
        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // 설정 변경하기
    const setSettingValue = async (uid: number, setting: UserSetting): Promise<Payload> => {
        const userSetting: UserSettingBody[] = [
            {
                codeId: 'C0001',
                codeValue: setting.openProfileRecord ? 'Y' : 'N',
                codeStatus: 'Y'
            },
            {
                codeId: 'C0002',
                codeValue: setting.searchFriend ? 'Y' : 'N',
                codeStatus: 'Y'
            },
            {
                codeId: 'C0003',
                codeValue: setting.notification ? 'Y' : 'N',
                codeStatus: 'Y'
            },
            {
                codeId: 'C0004',
                codeValue: setting.friend ? 'Y' : 'N',
                codeStatus: 'Y'
            },
            {
                codeId: 'C0005',
                codeValue: setting.comment ? 'Y' : 'N',
                codeStatus: 'Y'
            },
            {
                codeId: 'C0006',
                codeValue: setting.marketing ? 'Y' : 'N',
                codeStatus: 'Y'
            },
        ]

        
        const body: Body = {
            cls: "UserConfig",
            method: "change",
            params: [
                uid,
                'C',
                userSetting
            ]
        }
    
        const jsonBody: string = JSON.stringify(body)   

        try {
            const res: SettingResponse = await axios.post(gameURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code,
                    msg: res.data.msg
                }

                return payload
            }

            if (res.data.result?.confList) {

            }


            return { code: res.data.code }

        } catch (error: any) {
            errorHandler(error)
        }
        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    return { idLogin, socialLogin, autoLogin, createAccount, socialCreate, 
        sendMessage, findID, checkPW, resetPW, screenLogin, getProfileImages,
        modifyProfile, modifyUserInfo, logout, deleteAccount, getSettingValue, setSettingValue,
        checkDuplicatedId, checkDuplicatedNickname }
}

const errorHandler = (error: any): void => {
}
