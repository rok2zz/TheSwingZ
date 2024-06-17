import React, { useCallback, useEffect, useRef, useState } from "react"
import { Keyboard, Pressable, StyleSheet, Text, View, Image, Modal, Platform, BackHandler, ToastAndroid, Dimensions, PixelRatio, ScrollView, StatusBar } from "react-native"
import { TextInput } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp } from "../../../types/stackTypes"
import { useUsers } from "../../../hooks/useUsers"
import { Focus } from "../../../types/screenTypes"
import { GoogleResponse, Payload } from "../../../types/apiTypes"
import ChangePasswordModal from "../../../components/authStackComponents/ChangePasswordModal"
// import { KakaoOAuthToken, login, getProfile as getKakaoProfile, logout } from '@react-native-seoul/kakao-login';
// import { GoogleSignin } from "@react-native-google-signin/google-signin"
import NaverLogin, { GetProfileResponse, NaverLoginResponse } from "@react-native-seoul/naver-login"
import { SafeAreaView } from "react-native-safe-area-context"
// import appleAuth from '@invertase/react-native-apple-authentication';
import { useAuthActions } from "../../../hooks/useAuthActions"
import { useRefreshToken } from "../../../hooks/useToken"

// svg
import Logo from "../../../assets/imgs/common/logo_w.svg"
import Check from "../../../assets/imgs/login/message_ok.svg"
import NotCheck from "../../../assets/imgs/login/select_check.svg"
import Eraser from "../../../assets/imgs/login/eraser.svg"
import Kakao from "../../../assets/imgs/login/kakao.svg"
import Naver from "../../../assets/imgs/login/naver.svg"
import Google from "../../../assets/imgs/login/google.svg"
import Apple from "../../../assets/imgs/login/apple.svg"
import Loading from "../../../components/Loading"


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

    // useEffect(() => {
    //     if (!refreshToken) {
    //         logoutSocial()
    //     }
    // }, [])

    // const logoutSocial = async () => {
    //     try {
    //             await NaverLogin.deleteToken()
                
    //             setSuccessResponse(undefined)
    //             setFailureResponse(undefined)
    //             setGetProfileRes(undefined)

    //             await logout()
    //             await GoogleSignin.signOut()
    //       } catch (e) {
    //             console.error(e)
    //       }
    // }

    // autoLogin check
    const checkAutoLogin = () => {
        setIsChecked(previousState => !previousState)
    }
    
    // id clear
    const clearIdTextInput = () => {
        if (idRef.current) {
            idRef.current.setNativeProps({ text: '' })
        }
    }

    const clearPwTextInput = () => {
        if (passwordRef.current) {
            passwordRef.current.setNativeProps({ text: '' })
        }
    }

    // 선택한 입력칸 포커스
    const handleFocus = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: true
        })
    }

    // 포커스 해제
    const handleBlur = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: false
        })
    }
    
    // 로그인 메소드 실행
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

    // 카카오 로그인
    // const signInWithKakao = async () => {
    //     if (isConnected) return // 중복 호출 방지
	// 	try {
            
    //         setIsConnected(true)
	// 		const res: KakaoOAuthToken = await login()
    //         console.log(res)
    //         try {
    //             const profile = await getKakaoProfile()

    //             saveSocialId((profile.id).toString())
    //             const payload: Payload = await socialLogin(profile.id.toString(), 'KAKAO')
    //             setIsConnected(false)
                    
    //             if (payload.code !== 1000) {
    //                 if (payload.code === -3015) {
    //                     navigation.navigate('Terms', { type: 'KAKAO' })
    //                 }
    //             }
    //         } catch (error) {
    //             setIsConnected(false)
    //             console.error('login error', error)
    //         }

	// 	} catch (error) {
    //         setIsConnected(false)
	// 		console.error('login err', error)
	// 	}
    //     setIsConnected(false)
	// }

    // 네이버 로그인
    const signInWithNaver = async () => {
        if (isConnected) return // 중복 호출 방지

        const { failureResponse, successResponse } = await NaverLogin.login()
        setSuccessResponse(successResponse)
        setFailureResponse(failureResponse)

        console.log(successResponse)

        if (successResponse) {
            try {
                const profileResult: GetProfileResponse = await NaverLogin.getProfile(successResponse.accessToken)
                saveSocialId(profileResult.response.id)

                setIsConnected(true)
                const payload: Payload = await socialLogin(profileResult.response.id, 'NAVER')
                if (payload.code !== 1000) {
                    if (payload.code === -3015) {
                        navigation.navigate('Terms', { type: 'NAVER' })
                    }
                }
            } catch (error) {
                console.error('login error', error)
            }
            setIsConnected(false)
        }
    }

    // 구글 로그인
    // const signInWithGoogle = async () => {
    //     if (isConnected) return
    //     GoogleSignin.configure({
    //         scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
    //         webClientId: `417264241402-pkirhqlegssrerjshqgpd8mg6d0e2haf.apps.googleusercontent.com`, // client ID of type WEB for your server (needed to verify user ID and offline access)
    //         offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    //         forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    //         iosClientId: '417264241402-flbh9kuiel6cjacvhksln6huisqbiptd.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    //     })

    //     setIsConnected(true)

    //     try {

    //         await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
    //         const userInfo = await GoogleSignin.signIn()
    //         console.log(userInfo)
    //         if (userInfo) {
    //             try {
    //                 saveSocialId(userInfo.user.id)
    //                 const payload: Payload = await socialLogin(userInfo.user.id, 'GOOGLE')
    //                 setIsConnected(false)
                    
    //                 if (payload.code !== 1000) {
    //                     if (payload.code === -3015) {
    //                         navigation.navigate('Terms', { type: 'GOOGLE' })
    //                     }
    //                 }
    //             } catch (err) {
    //                 setIsConnected(false)
    //                 console.error('login error', err)
    //             }
    //         }
    //       } catch (error) {
    //         console.log(error)
    //         setIsConnected(false)

    //       }
	// }
    
    // apple login
    // const signInWithApple = async () => {
    //     const appleAuthRequestResponse = await appleAuth.performRequest({
    //         requestedOperation: appleAuth.Operation.LOGIN,
    //         // Note: it appears putting FULL_NAME first is important, see issue #293
    //         requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    //     })
    //     console.log(appleAuthRequestResponse)
    //       // get current authentication state for user
    //       // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    //       const credentialState = await appleAuth.getCredentialStateForUser(
    //         appleAuthRequestResponse.user,
    //     )
        
    //     // use credentialState response to ensure the user is authenticated
    //     if (credentialState === appleAuth.State.AUTHORIZED) {
    //     // user is authenticated
    //     }
    // }

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
            <ScrollView style={ styles.container } >
                <View style={{  }}>
                    <Logo width={ 202 } height={ 39 } style={ styles.logo } />
                </View>

                {/* id & password input */}
                <View style={ styles.inputContainer }>
                    <TextInput style={[ styles.input, { marginBottom: 20 }, isFocused.ref === idRef && isFocused.isFocused ? { borderBottomColor: '#ffffff'} : { borderBottomColor: '#ffffff'}]} 
                        placeholder="아이디 입력" placeholderTextColor="white" ref={ idRef } returnKeyType="next" autoCapitalize='none' onFocus={ () => handleFocus(idRef) } onBlur={ () => handleBlur(idRef)}
                        onChangeText={(userID: string): void => setUserID(userID)} onSubmitEditing={() => passwordRef.current && passwordRef.current.focus() }/>
                    <Eraser style={ styles.eraser } onPress={ clearIdTextInput } /> 
                </View>
                <View style={ styles.inputContainer }>
                    <TextInput style={[ styles.input, isFocused.ref === passwordRef && isFocused.isFocused ? { borderBottomColor: '#ffffff'} : { borderBottomColor: '#ffffff'} ]} 
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
                    {/* <Pressable onPress={ signInWithKakao }>
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
                    </Pressable> */}
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