import { Alert, StyleSheet, View } from "react-native"
import WebView from "react-native-webview"
import { useAuthActions } from "../../../hooks/useAuthActions"
import { useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp } from "../../../types/stackTypes"
import { Payload } from "../../../types/apiTypes"
import { useUsers } from "../../../hooks/useUsers"

const IdentifyFind = (): JSX.Element => {
	const navigation = useNavigation<AuthStackNavigationProp>()
	const { saveAuthInfo } = useAuthActions()
    const { findID } = useUsers()

    const findUserID = async (phone: string) => {
        const payload: Payload = await findID(phone)

        if (payload.code !== 1000) {
            Alert.alert('알림', payload.code === -4000 ? '가입되지 않은 유저정보입니다.' : payload.msg,[
                {
                    text: '확인',
                    onPress: () => { 
                        navigation.popToTop() 
                    }
                }
            ])
            return
        }

        if (payload.category) {
            if (payload.userID) {
                navigation.navigate('ResultFind', { userID: payload.userID, category: payload.category })
                return
            }
            navigation.navigate('ResultFind', { category: payload.category })
        }
    }

    const handleMessage = (event: any) => {
        const data = JSON.parse(event?.nativeEvent?.data);

        if(data?.resultMsg == '성공'){
			const getGender = () => {
				if (data.userGender === 1 || data.userGender === 3) {
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

            findUserID(data.userPhone)
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
    }
})

export default IdentifyFind