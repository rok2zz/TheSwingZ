import { Alert, Dimensions, StyleSheet, View } from "react-native"
import WebView from "react-native-webview"
import { useAuthActions } from "../../../hooks/useAuthActions"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp, AuthStackParamList } from "../../../types/stackTypes"
import { clearUserInfo } from "../../../slices/auth"

interface Props {
	route: RouteProp<AuthStackParamList, 'IdentifyRegister'>
}

const IdentifyRegister = ({ route }: Props): JSX.Element => {
	const navigation = useNavigation<AuthStackNavigationProp>()
	const { saveAuthInfo } = useAuthActions()
	const isMarketingChecked = route.params?.isMarketingChecked ?? true

    // receive message from webview
    const handleMessage = (event: any) => {
        const data = JSON.parse(event?.nativeEvent?.data);

        if(data?.resultMsg == '성공'){
			const getGender = () => {
				if (data.userGender === '1' || data.userGender === '3') {
					return 'M'
				} 
				return 'F'
			}

			saveAuthInfo({
				name: data.name,
				phone: data.userPhone,
				birth: data.userBirthday,
				gender: getGender()
			})

			navigation.navigate('Register', { type: 'normal', isMarketingChecked: isMarketingChecked })

			return
        } 

		Alert.alert('알림', '오류가 발생했습니다. 다시 시도해주세요.',[
			{
				text: '확인',
				onPress: () => { 
					navigation.popToTop() 
				}
			}
		])
    }

    return (
        <View style={ styles.wrapper }>
			<View style={ styles.bar }>
                <View style={ styles.gauge }></View>
            </View>
            <WebView
                source={{ uri: 'https://version.the-swing.net/mok' }}
                onMessage={ handleMessage } 
                javaScriptEnabled={true}
                domStorageEnabled={true}
                mixedContentMode="compatibility"
                sharedCookiesEnabled={ true }
                thirdPartyCookiesEnabled={ true} 
                originWhitelist={["*"]}
                // onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
	bar: {
        height: 2,

        backgroundColor: '#cccccc'
    },
    gauge: {
        width: Dimensions.get('window').width * 2 / 3,
        height: 2,

        backgroundColor: '#fd780f'
    },
})

export default IdentifyRegister