import { useSelector } from "react-redux";
import { RootState } from "../slices";
import axios from "axios";
import { Token, Body, Response } from "../types/apiTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { useAuthActions } from "./useAuthActions";

interface TokenHook {
    getNewAccessToken: () => Promise<string>
}

export const useAccessToken = (): string | null | undefined => {
    return useSelector((state: RootState) => state.auth.accessToken)
}

export const useRefreshToken = (): string | null | undefined => {
    return useSelector((state: RootState) => state.auth.refreshToken)
}

export const useToken = (): TokenHook => {
    const { saveAccessToken, clearUserInfo } = useAuthActions()
    const authURL = 'https://xj3ena0qze.execute-api.ap-northeast-2.amazonaws.com/beta_20230815'

    const getNewAccessToken = async (): Promise<string> => {
        const rawToken = await AsyncStorage.getItem('token') ?? ''
                    
        if (rawToken === '') {
            return ''
        }
        
        const token: Token = JSON.parse(rawToken)
    
        const body: Body = {
            cls: "Account",
            method: "autoLogin"
        }
    
        const jsonBody: string = JSON.stringify(body)
        
        try {
            const res: Response = await axios.post(authURL, jsonBody, {
                headers: {
                    "refreshToken": token.refreshToken
                }
            })
    
            if (res.data.code === -5002) {
                Alert.alert('알림', '로그인 세션이 만료되었습니다.')
                clearUserInfo()
    
                return ''
            }
            
            if (res.data.code !== 1000) return ''
    
            token.accessToken = res.data.result?.accessToken
    
            if (token.accessToken) {
                saveAccessToken(token.accessToken)
 
                return token.accessToken
            }
        } catch (error: any) {
            console.log(error)

            return ''
        }

        return ''
    }

    return { getNewAccessToken }
}
