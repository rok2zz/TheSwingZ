import React, { useCallback, useEffect, useRef, useState } from "react"
import { Keyboard, Pressable, StyleSheet, Text, View, Image, Modal, Platform, BackHandler, ToastAndroid, Dimensions, PixelRatio, ScrollView, StatusBar, Alert } from "react-native"
import { TextInput } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp } from "../../../types/stackTypes"
import { useUsers } from "../../../hooks/useUsers"
import { Focus } from "../../../types/screenTypes"
import { GoogleResponse, Payload } from "../../../types/apiTypes"
import ChangePasswordModal from "../../../components/authStackComponents/ChangePasswordModal"
import { GoogleSignin } from "@react-native-google-signin/google-signin"
import NaverLogin,  { GetProfileResponse, NaverLoginResponse } from "@react-native-seoul/naver-login"
import { SafeAreaView } from "react-native-safe-area-context"
import appleAuth, { AndroidSigninResponse, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import { useAuthActions } from "../../../hooks/useAuthActions"
import { useRefreshToken } from "../../../hooks/useToken"
import Loading from "../../../components/Loading"
import { KakaoLoginToken, KakaoUser, login, logout, me } from "@react-native-kakao/user"
import AsyncStorage from "@react-native-async-storage/async-storage"

// svg
import Logo from "../../../assets/imgs/common/logo_w.svg"
import Check from "../../../assets/imgs/login/message_ok.svg"
import NotCheck from "../../../assets/imgs/login/select_check.svg"
import Eraser from "../../../assets/imgs/login/eraser.svg"
import Kakao from "../../../assets/imgs/login/kakao.svg"
import Naver from "../../../assets/imgs/login/naver.svg"
import Google from "../../../assets/imgs/login/google.svg"
import Apple from "../../../assets/imgs/login/apple.svg"



interface ModalType {
    type: number | null,
    visible: boolean
}

const Login = (): JSX.Element => {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const { idLogin, socialLogin } = useUsers()
    const { saveSocialId } = useAuthActions()
    const refreshToken = useRefreshToken()

    const backPressedTimeRef = useRef(0)
	const idRef = useRef<TextInput>(null)
	const passwordRef = useRef<TextInput>(null)

    const [message, setMessage] = useState<string>('')
    const [userID, setUserID] = useState<string>('')
    const [userPW, setUserPW] = useState<string>('')
    const [isFocused, setIsFocused] = useState<Focus>({ ref: idRef, isFocused: false })
    const [isChecked, setIsChecked] = useState<boolean>(true)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [uid, setUid] = useState<number>(0)
    const [modal, setModal] = useState<ModalType>({
        type: 1001,
        visible: false
    })

    const [success, setSuccessResponse] = useState<NaverLoginResponse['successResponse']>()
    const [failure, setFailureResponse] = useState<NaverLoginResponse['failureResponse']>()
    const [getProfileRes, setGetProfileRes] = useState<GetProfileResponse>()

    // 뒤로가기 두번시 종료
    useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				const currentTime = Date.now()
				const timeDiff = currentTime - backPressedTimeRef.current

				if (timeDiff < 2000) {
					BackHandler.exitApp();
				} else {
					backPressedTimeRef.current = currentTime
					ToastAndroid.show('뒤로가기 버튼을 한번 더 누르면 종료됩니다.', ToastAndroid.SHORT)
				}

				return true
			}

			BackHandler.addEventListener('hardwareBackPress', onBackPress)

			return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
		}, [])
	)

    // check auto login after
    const checkAutoLogin = () => {
        setIsChecked(previousState => !previousState)
    }
    
    // id clear
    const clearIdTextInput = () => {
        if (idRef.current) {
            idRef.current.setNativeProps({ text: '' })
        }
    }

    // pw clear
    const clearPwTextInput = () => {
        if (passwordRef.current) {
            passwordRef.current.setNativeProps({ text: '' })
        }
    }

    // focus id textinput
    const handleFocus = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: true
        })
    }

    // focus pw textinput
    const handleBlur = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: false
        })
    }
    
    // login
	const onPressLogin = async () => {
        Keyboard.dismiss()
        if (isConnected) return // 중복 호출 방지

        if (userID === "") {
            setMessage('아이디를 입력해주세요.')
            return
        } else if (userID.search(/\s/) > 0 || !/^[a-z]|[0-9]{5,20}$/.test(userID)) {
            setMessage('아이디는 5~20자의 영문, 숫자만 사용할 수 있습니다.')
            return 
        } else if (userPW === '') {
            setMessage('비밀번호를 입력해주세요.')
            return
        // } else if (userPW.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(userPW)) {
        //     setMessage('비밀번호는 8~16자의 영문, 숫자, 특수문자만 입력 가능하며,반드시 영문과 숫자를 포함하여야 합니다.')
        //     return 
        } 

        setIsConnected(true)

        // 서버 호출
        const payload: Payload = await idLogin(userID, userPW, isChecked)
        if (payload.code !== 1000) { // 실패시 오류메시지 가져와서 보여줌
            setMessage(payload.msg ?? '오류가 발생했습니다.')
            setIsConnected(false)
        }

        setIsConnected(false)

        if (payload.code === 1002) { // 비밀번호 변경 후 90일
            setModal({ type: payload.code, visible: true })
        } else if (payload.code === 1003) { // 비밀번호 변경 후 180일
            setModal({ type: payload.code, visible: true })
        } 
	}

    // kakao login
    const signInWithKakao = async () => {
        if (isConnected) return // 중복 호출 방지

		try {
            setIsConnected(true)
			const res: KakaoLoginToken = await login()
            if (res) {
                const profile: KakaoUser = await me()
                const kakaoId = (profile.id).toString()
                saveSocialId(kakaoId)
                const payload: Payload = await socialLogin(kakaoId, 'KAKAO', isChecked)
                setIsConnected(false)
                    
                if (payload.code !== 1000) {
                    if (payload.code === -3015) {
                        navigation.navigate('Terms', { type: 'KAKAO' })
                    }
                }
            }
		} catch (error) {
            setIsConnected(false)
		}
        setIsConnected(false)
	}

    // naver login
    const signInWithNaver = async () => {
        if (isConnected) return // 중복 호출 방지

        const naverToken = await AsyncStorage.getItem('naver') ?? ''
        if (naverToken && !refreshToken) {
            await AsyncStorage.setItem('naver', '')
            await NaverLogin.deleteToken()
                    
            setSuccessResponse(undefined)
            setFailureResponse(undefined)
            setGetProfileRes(undefined)
        }

        const { failureResponse, successResponse } = await NaverLogin.login()


        setSuccessResponse(successResponse)
        setFailureResponse(failureResponse)
        if (successResponse) {
            await AsyncStorage.setItem('naver', successResponse.refreshToken)
            const profileResult: GetProfileResponse = await NaverLogin.getProfile(successResponse.accessToken)
            saveSocialId(profileResult.response.id)
            setIsConnected(true)

            const payload: Payload = await socialLogin(profileResult.response.id, 'NAVER', isChecked)
            if (payload.code !== 1000) {
                if (payload.code === -3015) {
                    setIsConnected(false)
                    navigation.navigate('Terms', { type: 'NAVER' })
                    return
                }
            }
            setIsConnected(false)
        }

        setIsConnected(false)
    }

    // google login
    const signInWithGoogle = async () => {
        if (isConnected) return

        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
            webClientId: `417264241402-pkirhqlegssrerjshqgpd8mg6d0e2haf.apps.googleusercontent.com`, // client ID of type WEB for your server (needed to verify user ID and offline access)
            offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
            iosClientId: '417264241402-flbh9kuiel6cjacvhksln6huisqbiptd.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
        })

        setIsConnected(true)

        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
            const userInfo: GoogleResponse = await GoogleSignin.signIn()
            if (userInfo) {
                saveSocialId(userInfo.user.id)
                const payload: Payload = await socialLogin(userInfo.user.id, 'GOOGLE', isChecked)
                setIsConnected(false)
                
                if (payload.code !== 1000) {
                    if (payload.code === -3015) {
                        navigation.navigate('Terms', { type: 'GOOGLE' })
                    }
                }
            }
        } catch (error) {
            setIsConnected(false)
        }
        setIsConnected(false)
	}
    
    // apple login
    const signInWithApple = async () => {
        if (isConnected) return

        try {
            setIsConnected(true)
            if (Platform.OS === 'ios') {
                const appleAuthRequestResponse = await appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
                })
                const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

                // if (credentialState === appleAuth.State.AUTHORIZED) {
                // }
    
                if (appleAuthRequestResponse.user) {
                    saveSocialId(appleAuthRequestResponse.user)
                    const payload: Payload = await socialLogin(appleAuthRequestResponse.user, 'APPLE', isChecked)
                    setIsConnected(false)
                    
                    if (payload.code !== 1000) {
                        if (payload.code === -3015) {
                            navigation.navigate('Terms', { type: 'APPLE' })
                        }
                    }
        
                }
            } else if (Platform.OS === 'android') {
                const rawNonce = Math.random().toString(36).substring(2, 10) // Example nonce, generate your own secure nonce
                const state = Math.random().toString(36).substring(2, 10)    
                        
                appleAuthAndroid.configure({
                    clientId: 'com.theswinggolf.theswingz.android',
                    redirectUri: 'https://theswing-z.com',
                    responseType: appleAuthAndroid.ResponseType.ALL,
                    scope: appleAuthAndroid.Scope.ALL,
                    nonce: rawNonce,
                    state,
                })
                
                const response: AndroidSigninResponse = await appleAuthAndroid.signIn()

                if (response) {
                    saveSocialId(response.id_token ?? '')
                    const payload: Payload = await socialLogin(response.id_token ?? '', 'APPLE', isChecked)
                    setIsConnected(false)
                    
                    if (payload.code !== 1000) {
                        if (payload.code === -3015) {
                            navigation.navigate('Terms', { type: 'APPLE' })
                        }
                    }
                }
            }
        } catch (error) {
            setIsConnected(false)
        }
        setIsConnected(false)
    }

    return (
        <SafeAreaView style={ styles.wrapper } >
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }

            {/* 비밀번호 만료 알림 및 변경 권장 알림
            { modal.type === 1002 && (
                <Modal animationType="fade" transparent={ true } visible={ modal.visible } onRequestClose={ () => { setModal({ type: null, visible: false })}}>
                    <ChangePasswordModal uid={ uid } expired={ false } onClose={ () => setModal({ type: null, visible: false }) } />
                </Modal>
            )} */}
            <StatusBar backgroundColor='#272727' />

            {/* 로그인 화면 */}
            <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false }>
                <Logo width={ 202 } height={ 39 } style={ styles.logo } />
                {/* id & password input */}
                <View style={ styles.inputContainer }>
                    <TextInput style={[ styles.input, { marginBottom: 20 }, isFocused.ref === idRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#ffffff'}]} 
                        placeholder="아이디 입력" placeholderTextColor="white" ref={ idRef } returnKeyType="next" autoCapitalize='none' onFocus={ () => handleFocus(idRef) } onBlur={ () => handleBlur(idRef)}
                        onChangeText={(userID: string): void => setUserID(userID)} onSubmitEditing={() => passwordRef.current && passwordRef.current.focus() }/>
                    <Eraser style={ styles.eraser } onPress={ clearIdTextInput } /> 
                </View>
                <View style={ styles.inputContainer }>
                    <TextInput style={[ styles.input, isFocused.ref === passwordRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#ffffff'} ]} 
                        placeholder="비밀번호 입력" placeholderTextColor="white" ref={ passwordRef } returnKeyType="done" secureTextEntry  onFocus={ () => handleFocus(passwordRef) } onBlur={ () => handleBlur(passwordRef)}
                        onChangeText={(userPW: string): void => setUserPW(userPW)} onSubmitEditing={ onPressLogin } textContentType="oneTimeCode" />
                    <Eraser style={ styles.eraser } onPress={ clearPwTextInput } />
                </View>
            
                {/* error message */}
                <Text style={ styles.message }>{ message }</Text>
                    
                {/* login btn */}
                <Pressable style={({ pressed }) => [ styles.button, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]}
                    onPress={ onPressLogin } android_ripple={{ color: '#b4b4b4' }}>
                    <Text style={ styles.buttonText }>로그인</Text>
                </Pressable>

                {/* autoLogin & find id,pw */}
                <View style={ styles.menuContainer }>
                    <Pressable style={ styles.circle } onPress={ checkAutoLogin }>
                        { isChecked ? 
                            (
                                <Check width={ 30 } height={ 30 } />
                            ) : (
                                <NotCheck width={ 28 } height={ 28 } />
                            )
                        }
                    </Pressable>
                    <Text style={[ styles.text, { flex: 1 }]}>자동로그인</Text>
                    <Text style={[ styles.text, { textDecorationLine: 'underline' }]} onPress={ () => navigation.navigate('Find') }>아이디/비밀번호 찾기</Text>
                </View>
                
                {/* sns 로그인 */}
                <View style={[ styles.social, Platform.OS === 'ios' && { marginBottom: 50 } ]}>
                    <Pressable onPress={ signInWithKakao }>
                        <Kakao />
                    </Pressable>
                    <Pressable onPress={ signInWithNaver }>
                        <Naver />
                    </Pressable>
                    <Pressable onPress={ signInWithGoogle }>
                        <Google />
                    </Pressable>
                    <Pressable onPress={ signInWithApple }>
                        <Apple />
                    </Pressable>
                </View>

                {/* create account */}
                <View style={ styles.registerContainer }>
                    <Text style={ styles.grayText }>계정이 없으신가요?</Text>
                    <Text style={ styles.register } onPress={ () => navigation.navigate('Terms', { type: 'normal' })}>회원가입</Text>
                </View>
            </ScrollView>
		</SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727'
    },
	container: {    
        paddingTop: 60,
        marginHorizontal: 15,
	},
    logo: {
        marginBottom: 84
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 45,

        paddingHorizontal: 10,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        borderBottomWidth: 1,

        color: 'white'
	},
    eraser: {
        position: 'absolute',
        right: 0,
        top: 13,

        zIndex: 1
    },
    message: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginLeft: 8,

        color: '#fd780f'
    },
    button: {
        marginTop: 24,
        marginBottom: 15,

        borderRadius: 3,

        backgroundColor: '#fd780f'
    },
    buttonText: {
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 13,

        color: 'white'
    },
    menuContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        
        width: 30,
        height: 30,

        marginRight: 12,
    },
    text: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    social: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        
        marginTop: 60,
        marginBottom: 100,
        marginHorizontal: 21
    },
    registerContainer: {
        alignItems: 'center',

        marginBottom: 102
    },
    grayText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#949494'
    },
    register: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        marginTop: 9,

        color: '#ffffff'
    }
})

export default Login