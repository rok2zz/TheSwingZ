import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { RootStackParamList } from "../types/stackTypes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import SplashScreen from 'react-native-splash-screen';
import { useIsFirst, useUserInfo, useUsers } from "../hooks/useUsers"
import { UserInfo } from "../slices/auth"
import { useApi, useServerInfo } from "../hooks/useApi";
import { ServerInfo } from "../slices/api";
import { useAuthActions } from "../hooks/useAuthActions"
import { useRefreshToken } from "../hooks/useToken"
import { Payload, Token } from "../types/apiTypes"
import AuthStack from "./authStack/AuthStack"
import Permissions from "./screens/intro/Permissions";
import MainTab from "./mainTab/MainTab";
import ModifyProfile from "./screens/mypage/ModifyProfile";
import Header from "../components/Header";
import CheckPW from "./screens/mypage/CheckPW";
import ModifyUserInfo from "./screens/mypage/ModifyUserInfo";
import Brand from "./screens/brand/Brand";
import ScoreCard from "./screens/mypage/ScoreCard";
import ScreenLogin from "./screens/kiosk/ScreenLogin";
import ResultScreenLogin from "./screens/kiosk/ResultScreenLogin";
import BrandFilm from "./screens/brand/BrandFilm";
import ZTV from "./screens/brand/ZTV";
import FilmVideo from "./screens/brand/FilmVideo";
import Foundation from "./screens/brand/Foundation";
import CourseDetail from "./screens/course/CourseDetail";
import Course from "./screens/course/Course";
import TermsOfUse from "./screens/tos/TermsOfUse";
import PrivacyPolicy from "./screens/tos/PrivacyPolicy";
import MakeReservation from "./screens/reservation/MakeReservation";
import ManageReservation from "./screens/reservation/ManageReservation";
import ResultReservation from "./screens/reservation/ResultReservation";
import ShopDetail from "./screens/reservation/ShopDetail";
import Splash from "./screens/Splash";
import Withdrawal from "./screens/mypage/Withdrawal";
import ResultWithdrawal from "./screens/mypage/ResultWithdrawal";
import { Alert, BackHandler, Linking, Platform } from "react-native";
import SwingVideo from "./screens/nasmo/SwingVideo";
import VideoDetail from "./screens/nasmo/VideoDetail";
import Intro from "./screens/intro/Intro";
import NaverLogin from "@react-native-seoul/naver-login";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import NoticeDetail from "./screens/cs/NoticeDetail";
import Inquiry from "./screens/cs/Inquiry";
import Notice from "./screens/cs/Notice";
import FAQ from "./screens/cs/FAQ";

const Stack = createNativeStackNavigator<RootStackParamList>()

export const version = '1.1.1'

// kakao native key
const kakaoKey = 'ba013042f5a0f6ae1e923f20137aad80'

// naver login Key
const consumerKey = `djATVwGtndKljOjNfTqv`
const consumerSecret = `HhXUQEo4xt`
const appName = Platform.OS === 'android' ? `com.theswingz` : `com.theswinggolf.theswingz`
const serviceUrlSchemeIOS = `com.theswinggolf.theswingz`


const RootStack = (): JSX.Element => {
	const serverInfo: ServerInfo = useServerInfo()
	const isFirst = useIsFirst()
	const [first, setFirst] = useState<boolean>(false)
    const { autoLogin } = useUsers()
	const { saveRefreshToken, saveUserInfo, clearUserInfo } = useAuthActions()
	const { getApi } = useApi()
	const refresh = useRefreshToken()
	const userInfo = useUserInfo()

	const [refreshToken, setRefreshToken] = useState<string | null>()
	const [openSplash, setOpenSplash] = useState<boolean>(true)

	useEffect(() => {
		async function getServerInfo(): Promise<void> {
			const payload: Payload = await getApi('alpha', version)
			if (payload.code !== 1000) {
				Alert.alert(
					'알림',
					'서버에 연결할 수 없습니다.',
					[{
						text: '확인', 
						onPress: ()=> { 
							BackHandler.exitApp()
							return
						},
					}]
				)
			}

			socialInitialize()

			if (payload.update === 'must') {
				Alert.alert(
					'알림',
					'최신 버전으로 업데이트가 필요합니다.',
					[
						{
							text: '업데이트', 
							onPress: async (): Promise<void> => { 
								if (Platform.OS === 'android') {
									Linking.openURL('https://play.google.com/store/apps/details?id=com.theswingz')
								} else if (Platform.OS === 'ios') {
									Linking.openURL('https://apps.apple.com/app/%EB%8D%94-%EC%8A%A4%EC%9C%99-%EC%A0%9C%ED%8A%B8/id6473002250')
								}
							},
						}
					],
				)
			} else if (payload.update === 'can') {
				Alert.alert(
					'알림',
					'새 버전이 출시되었습니다. 최신 버전으로 업데이트 할 수 있습니다.',
					[
						{
							text: '취소',
							onPress: () => { 
								return },
							style: 'cancel',
						},{
							text: '업데이트', 
							onPress: async (): Promise<void> => { 
								if (Platform.OS === 'android') {
									Linking.openURL('https://play.google.com/store/apps/details?id=com.theswingz')
								} else if (Platform.OS === 'ios') {
									Linking.openURL('https://apps.apple.com/app/%EB%8D%94-%EC%8A%A4%EC%9C%99-%EC%A0%9C%ED%8A%B8/id6473002250')
								}
							},
						}
					],
				)
			}
		}
		setRefreshToken(refresh)
		getServerInfo()
		setTimeout(() => {
			SplashScreen.hide()
		}, 2000)

		checkIsFirst()
	}, [])

	// auto login
	useEffect(() => {
		async function login (): Promise<void> {
			const rawToken: string = await AsyncStorage.getItem('token') ?? ''

			if (!rawToken) return

			const token: Token = JSON.parse(rawToken)
			if (!token.refreshToken) {
				return
			}

			const payload: Payload = await autoLogin(token.refreshToken)

			if (payload.code !== 1000) {
				clearUserInfo()
				return
			}

			if (payload.code === 1000) {
				const rawToken = await AsyncStorage.getItem('token') ?? ''
				const rawUserInfo = await AsyncStorage.getItem('userInfo') ?? ''
                    
				if (rawToken === '' || rawUserInfo === '') {
					SplashScreen.hide()
					return 
				}
				
				const userInfo: UserInfo = JSON.parse(rawUserInfo)
				saveUserInfo(userInfo)
				saveRefreshToken(token.refreshToken ?? '')
			}
		}

		async function start(): Promise<void> {
			if (userInfo.uid === 0) {
				await login()
			}
		}
		
		if (serverInfo.authServer !== '') {
			start()
		}

		setTimeout(() => {
			setOpenSplash(false)
		}, 2000)
	}, [serverInfo])


	useEffect(() => {
		setRefreshToken(refresh)
	}, [refresh])

	// check if app is launched for first time
	useEffect((): void => {
		checkIsFirst()
	}, [isFirst])

	const checkIsFirst = async (): Promise<void> => {
		const isFirstVisit = await AsyncStorage.getItem('isFirst') === 'false' ? false : true
		setFirst(isFirstVisit)
	}

	// social login initialize
	const socialInitialize = () => {
		initializeKakaoSDK(kakaoKey)
		NaverLogin.initialize({
			appName,
			consumerKey,
			consumerSecret,
			serviceUrlSchemeIOS,
			disableNaverAppAuthIOS: false,
	   })
	}

	

	return (
		<Stack.Navigator>
			{ openSplash &&
				<Stack.Screen name='Splash' component={ Splash } options={{ headerShown: false }} />
			}

			{ !first ? 
				<>
					{ !refreshToken ? 
						<Stack.Screen name='AuthStack' component={ AuthStack } options={{ headerShown: false }} /> 
							:
						<>
							{/* maintab */	}
							<Stack.Screen name='MainTab' component={ MainTab } options={{ headerShown: false }} />

							{/* profile */}
							<Stack.Screen name='ModifyProfile' component={ ModifyProfile } options={{ 
								header: () => <Header title="프로필설정" type={ 1 } isFocused />
							}} />
							<Stack.Screen name='CheckPW' component={ CheckPW } options={{ 
								header: () => <Header title="프로필설정" type={ 0 } isFocused />
							}} />	
							<Stack.Screen name='ModifyUserInfo' component={ ModifyUserInfo } options={{ 
								header: () => <Header title="회원정보 수정" type={ 0 } isFocused/>
							}} />	
							<Stack.Screen name='Withdrawal' component={ Withdrawal } options={{ 
								header: () => <Header title="회원탈퇴" type={ 0 } isFocused/>
							}} />	
							<Stack.Screen name='ResultWithdrawal' component={ ResultWithdrawal } options={{ 
								header: () => <Header title="회원탈퇴" type={ 0 } isFocused/>
							}} />	

							{/* QRLogin and ScreenLogin */}
							<Stack.Screen name='ScreenLogin' component={ ScreenLogin } options={{ 
								header: () => <Header title="스크린 로그인​" type={ 3 } isFocused />
							}} />	
							<Stack.Screen name='ResultScreenLogin' component={ ResultScreenLogin } options={{ headerShown: false }} />	

							{/* record */}
							<Stack.Screen name='ScoreCard' component={ ScoreCard } options={{ 
								header: () => <Header title="스코어카드 상세" type={ 2 } isFocused />
							}} />	

							{/* reservation */}
							<Stack.Screen name='ShopDetail' component={ ShopDetail } options={{ 
								header: () => <Header title="매장 상세" type={ 0 } isFocused />
							}} />	
							<Stack.Screen name='MakeReservation' component={ MakeReservation } options={{ 
								header: () => <Header title="스크린예약" type={ 4 } isFocused />
							}} />
							<Stack.Screen name='ResultReservation' component={ ResultReservation } options={{ 
								header: () => <Header title="스크린예약" type={ 0 } isFocused />
							}} />
							<Stack.Screen name='ManageReservation' component={ ManageReservation } options={{ 
								header: () => <Header title="예약관리" type={ 4 } isFocused />
							}} />

							{/* brand */}
							<Stack.Screen name='Brand' component={ Brand } options={{ 
								header: () => <Header title="브랜드소개" type={ 5 } isFocused />
							}} />	
							<Stack.Screen name='BrandFilm' component={ BrandFilm } options={{ 
								header: () => <Header title="브랜드필름" type={ 1 } isFocused />
							}} />	
							<Stack.Screen name='ZTV' component={ ZTV } options={{ 
								header: () => <Header title="더스윙제트 TV" type={ 1 } isFocused />
							}} />	
							<Stack.Screen name='FilmVideo' component={ FilmVideo } options={{ headerShown: false }} />
							<Stack.Screen name='Foundation' component={ Foundation } options={{ 
								header: () => <Header title="가맹점 모집" type={ 1 } isFocused />
							}} />	

							{/* course */}
							<Stack.Screen name='Course' component={ Course } options={{ 
								header: () => <Header title="코스소개" type={ 0 } isFocused />
							}} />	
							<Stack.Screen name='CourseDetail' component={ CourseDetail } options={{ 
								header: () => <Header title="코스상세" type={ 0 } isFocused />
							}} />	

							{/* nasmo */}
							<Stack.Screen name='SwingVideo' component={ SwingVideo } options={{ 
								header: () => <Header type={ 0 } title="마이 스윙폼" isFocused />
							 }} />	
							<Stack.Screen name='VideoDetail' component={ VideoDetail } options={{ headerShown: false }} />	

							{/* CS */}
							<Stack.Screen name='Notice' component={ Notice } options={{ 
								header: () => <Header title="공지사항" type={ 0 } isFocused />
							}} />
							<Stack.Screen name='NoticeDetail' component={ NoticeDetail } options={{ 
								header: () => <Header title="공지사항 상세" type={ 0 } isFocused />
							}} />
							<Stack.Screen name='FAQ' component={ FAQ } options={{ 
								header: () => <Header title="FAQ" type={ 0 } isFocused />
							}} />
							<Stack.Screen name='Inquiry' component={ Inquiry } options={{ 
								headerShown: false
							}} />
						</>
					}
				</>
				:
				<>
					<Stack.Screen name='Permissions' component={ Permissions } options={{ headerShown: false }} />
					<Stack.Screen name='Intro' component={ Intro } options={{ headerShown: false }} />
				</>
			}

			{/* policy */}
			<Stack.Screen name='PrivacyPolicy' component={ PrivacyPolicy } options={{ 
				header: () => <Header title="개인정보처리방침" type={ 0 } isFocused />
			}} />	
			<Stack.Screen name='TermsOfUse' component={ TermsOfUse } options={{ 
				header: () => <Header title="이용약관" type={ 0 } isFocused />
			}} />	
		</Stack.Navigator>	
	)
}

export default RootStack
