import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux'
import { saveRefreshToken, saveAccessToken, clearUserInfo, saveUserInfo, saveUserSetting, saveAuthInfo, saveIsFirst, modifyMyProfile, saveIsTabConnected, saveIsMainLoaded } from "../slices/auth";
import { useMemo } from "react";

export const useAuthActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => bindActionCreators({ saveRefreshToken, saveAuthInfo, saveAccessToken, clearUserInfo, saveUserInfo, saveUserSetting, saveIsFirst, modifyMyProfile, saveIsTabConnected, saveIsMainLoaded }, dispatch), [ dispatch ]) 
}