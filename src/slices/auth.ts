import { PayloadAction, Update, createSlice } from "@reduxjs/toolkit"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface AuthInfo {
    name: string,
    phone: string,
    birth: string,
    gender: string
}

export interface User {
    userID: string,
    password: string,
    passwordCheck: string,

    realName: string,
    birth: string,
    gender: string,

    name: string,
    email: string,
    nickname: string,
    phone: string,
    authcode: string,
    location: string,
    alarm: boolean
}

export interface UserInfo {
    uid: number,
    type: number,
    status: string,
    realName: string,
    phone: string,
    country: string,
    language: string,
    updatedAt: string,
    birth: string,
    gender: string,
    name: string,
    nick: string,
    email: string,
    point: number,
    createdAt: string,
    pwdUpdatedAt: string,
    category: string,
    favoriteLocate: string,
    profileImg: string | null
}

export interface UserSetting {
    groupCode: string,
    codeId: string,
    codeName: string,
    codeValue: string,
    codeStatus: string
}

export interface SettingOption {
    codeId: string,
    optionName: string,
    optionValue: string,
    optionNo: string
}

export interface UpdatedProfile {
    nick: string,
    uri: string
}

interface AuthState {
    accessToken?: string | null,
    refreshToken?: string | null,
    authInfo: AuthInfo,
    userInfo: UserInfo,
    userSetting: UserSetting[],
    socialId: string,
    isFirst: boolean,
    isTabConnected: boolean,
    isMainLoaded: boolean
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    authInfo: {
        name: '',
        phone: '',
        birth: '',
        gender: ''
    },
    userInfo: {
        uid: 0,
        type: 0,
        status: '',
        realName: '',
        phone: '',
        country: '',
        language: '',
        updatedAt: '',
        birth: '',
        gender: '',
        name: '',
        nick: '',
        email: '',
        point: 0,
        createdAt: '',
        pwdUpdatedAt: '',
        category: '',
        favoriteLocate: '',
        profileImg: null
    },
    userSetting: [{
        groupCode: '',
        codeId: '',
        codeName: '',
        codeValue: '',
        codeStatus: ''
    }],
    socialId: '',
    isFirst: true,
    isTabConnected: true,
    isMainLoaded: false
}

const authSlice = createSlice ({
    name: 'auth',
    initialState,
    reducers: {
        saveRefreshToken(state, action: PayloadAction<string | null>) {
            state.refreshToken = action.payload
        },
        saveAccessToken(state, action: PayloadAction<string | null>) {
            state.accessToken = action.payload
        },
        saveAuthInfo(state, action: PayloadAction<AuthInfo>){
            state.authInfo = action.payload
        },
        saveUserInfo(state, action: PayloadAction<UserInfo>) {
            state.userInfo = action.payload
        },
        saveUserSetting(state, action: PayloadAction<UserSetting[]>) {
            state.userSetting = action.payload
        },
        saveSocialId(state, action: PayloadAction<string>) {
            state.socialId = action.payload
        },
        saveIsFirst(state, action: PayloadAction<boolean>) {
            state.isFirst = action.payload
        },
        saveIsTabConnected(state, action: PayloadAction<boolean>) {
            state.isTabConnected = action.payload
        },
        saveIsMainLoaded(state, action: PayloadAction<boolean>) {
            state.isMainLoaded = action.payload
        },
        modifyMyProfile(state, action: PayloadAction<UpdatedProfile>) {
            state.userInfo.profileImg = action.payload.uri
            state.userInfo.nick = action.payload.nick
        },
        clearUserInfo() {
            AsyncStorage.removeItem('token')
            AsyncStorage.removeItem('userInfo')

            return initialState
        }
    }
})

export default authSlice.reducer
export const { saveRefreshToken, saveAccessToken, clearUserInfo, saveUserInfo, saveAuthInfo, saveUserSetting, saveSocialId, saveIsFirst, modifyMyProfile, saveIsTabConnected, saveIsMainLoaded } = authSlice.actions