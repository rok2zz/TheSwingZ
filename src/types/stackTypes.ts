import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import { CompositeNavigationProp, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { GoogleResponse } from "./apiTypes"
// import { KakaoOAuthToken } from "@react-native-seoul/kakao-login"
// import { NaverLoginResponse } from "@react-native-seoul/naver-login"
import { Store } from "./screenTypes"
import { CourseInfo } from "../screens/screens/course/courseInfo"
import { ReservationInfo, ReservationSetting, ShopInfo } from "../slices/reservation"
import { Thumbnail, VideoList } from "../slices/video"

// RootStack
export type RootStackParamList = {
	// intro
	Intro: undefined,
	Permissions: undefined,

	// splash
	Splash: undefined,
	
	// 로그인
	AuthStack: undefined,

	// 메인
	MainTab: undefined,

	// QR, 스크린 로그인
	ScreenLogin: undefined,
	ResultScreenLogin: undefined,

	// 프로필
	ModifyProfile: undefined,
	CheckPW: {
		type: number
	},
	ChangePW: {
		uid: number
	},
	ModifyUserInfo: undefined,
	ScoreCard: {
		roomId: number
	},
	Withdrawal: undefined,
	ResultWithdrawal: {
		success: boolean,
		reason?: string
	}

	// shop
	ShopDetail: {
		shopId: number
	},
	MakeReservation: {
		shopInfo: ShopInfo
	},
	ResultReservation: {
		shopInfo: ShopInfo,
		revInfo: ReservationSetting,
		revId: number
	},
	ManageReservation: undefined,
	ReseravtionMap: undefined,

	// brand
	Brand: undefined,
	BrandFilm: undefined,
	ZTV: undefined,
	FilmVideo: {
		type: number
	},
	Foundation: undefined,

	// course
	Course: undefined,
	CourseDetail: {
		course: CourseInfo,
		thumbnail: string
	}

	// Terms
	PrivacyPolicy: undefined,
	TermsOfUse: {
		type: number
	}

	// Nasmo
	SwingVideo: undefined,
	VideoDetail: {
		videoInfo: VideoList,
		videoIndex: number,
		thumbnailIndex: number
	}

	// CS
	FAQ: undefined
}

export type RootStackScreenName = keyof RootStackParamList
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>

// AuthStack
export type AuthStackParamList = {
	// 로그인
	Login: undefined,

	// 회원가입
	Terms: {
		type: string
	},
	IdentifyRegister: {
		isMarketingChecked: boolean
	},
	Register: {
		type: string,
		isMarketingChecked: boolean
	},
	ResultRegister: {
		type: string,
		nickname: string
	},

	// 아이디 찾기
	IdentifyFind: undefined,
	Find: undefined,
	ResultFind: {
		userID?: string,
		category: string
	},
	ResetPW: {
		userID: string
	}
}

export type AuthStackNavigationScreenParams = NavigatorScreenParams<AuthStackParamList>
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>

// MainTab
export type MainTabParamList = {
    Main: undefined,
	ShopStack: undefined,
	MyZ: {
		type: number,
		beforeScreen: string
	},
	Etc: undefined
}

export type MainTabScreenName = keyof MainTabParamList
export type MainTabNavigationScreenParams = NavigatorScreenParams<MainTabParamList>
export type MainTabNavigationProp = NativeStackNavigationProp<MainTabParamList>

// StoreStack
export type ShopStackParamList = {
	Reservation: {
		beforeScreen: string
	},
	FindShop: undefined
}

export type ShopStackScreenName = keyof ShopStackParamList
export type ShopStackNavigationScreenParams = NavigatorScreenParams<ShopStackParamList>
export type ShopStackNavigationProp = NativeStackNavigationProp<ShopStackParamList>
