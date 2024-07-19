import { LinkingOptions, NavigationContainer, NavigationContainerRef, useNavigation } from "@react-navigation/native"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./slices"
import RootStack from "./screens/RootStack"
import { useEffect, useRef, useState } from "react"
import { Linking } from "react-native"
import { RootStackParamList } from "./types/stackTypes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Token } from "./types/apiTypes"

const store = configureStore({ reducer: rootReducer })

const App = (): JSX.Element => {
	const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null)
	const [isLogged, setIsLogged] = useState<boolean>(false)

	const linking: LinkingOptions<RootStackParamList> = {
		prefixes: [
			'https://theswing-z.com',
			'http://localhost:3000',
			'theswingz://',
		],
	
		async getInitialURL() {
			const url = await Linking.getInitialURL()
			if (url != null) {
				return url
			}
	
			return null
		},
	   
	   //받아준 딥링크 url을 subscribe에 넣어줘야 한다
		subscribe(listener: (arg0: any) => any) {
			const onReceiveURL = (event: { url: any }) => {
				const { url } = event
				console.log('url: ', url)

				return listener(url)
			}
	
			const linkingSub = Linking.addEventListener('url', onReceiveURL)
			return () => {
				linkingSub.remove()
			}
		},
		config: {
			screens: {
				AuthStack:{
					screens: {
						Login: 'login'
					}
				},
				MainTab: {
					screens: {
						Main: {
							path: 'main/:screen',
							parse: {
								screen: (screen: string) => screen
							}
						}
					}
				},
				ManageReservation: 'managereservation',
				Brand: 'brand',
				BrandFilm: 'brandfilm',
				Foundation: 'foundation',
				
				Notice: 'notice/'
			}
		}
	}

	useEffect(() => {
		const checkToken = async () => {
			const rawToken: string = await AsyncStorage.getItem('token') ?? ''

			if (!rawToken) return 

			const token: Token = JSON.parse(rawToken)
			if (!token.refreshToken) {
				return 
			}
			setIsLogged(true)
		}
		checkToken()
  	}, [])

	// useEffect(() => {
	// 	// const linkingListener = Linking.addListener('url', handleDeepLink)

	// 	if (isLogged) {
	// 		Linking.getInitialURL().then((url) => {
	// 			if (url) {
	// 				console.log('url:',url)
	// 				setDeepLink(url)
	// 			}
	// 		})
	// 	}

	// 	// return () => {
	// 	// 	linkingListener.remove()
	// 	// }
	// }, [isLogged])

	return (
		<Provider store={ store }>
			<NavigationContainer linking={ linking } ref={ navigationRef }>
				<RootStack />
			</NavigationContainer>
		</Provider>
	)
}

export default App
