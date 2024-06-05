import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { PERMISSIONS, requestMultiple } from "react-native-permissions"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuthActions } from "../../../hooks/useAuthActions"

//svg
import Location from "../../../assets/imgs/intro/icon_permission_location.svg"
import Photo from "../../../assets/imgs/intro/icon_permission_photo.svg"
import Camera from "../../../assets/imgs/intro/icon_permission_camera.svg"
import Push from "../../../assets/imgs/intro/icon_permission_push.svg"
import Call from "../../../assets/imgs/intro/icon_permission_call.svg"

const Permissions = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()

    const onPress = async () => {
		if (Platform.OS === 'ios') {
			requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY, PERMISSIONS.IOS.CONTACTS, PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]).then((statuses) => {
			})
		} else if (Platform.OS === 'android') {
			requestMultiple([PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.READ_CONTACTS, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then((statuses) => {
			})
		}
        
        navigation.navigate('Intro')
    }
    
    return (
        <SafeAreaView style={ styles.wrapper }>
            <ScrollView style={ styles.container }>
                <View >
                    <Text style={ styles.title }>앱 접근 허용안내</Text>
                    <Text style={[ styles.subTitle, { fontSize: 20, paddingBottom: 9 }]}>시작하기 전</Text>
                    <Text style={[ styles.text, { fontSize: 16, color: 'black' }]}>더 나은 서비스 제공을 위해</Text>
                    <Text style={[ styles.text, { fontSize: 16, paddingBottom: 0, color: 'black' }]}>아래와 같은 정보 동의가 필요합니다.</Text>
                </View>

                <View style={ styles.list }>
                    <View style={ styles.listItem }>
                        <View style={ styles.circle }>
                            <Location width={ 16 } height={ 22 } />
                        </View>
                        <View style={ styles.textBox }>
                            <Text style={ styles.subTitle }>위치 (필수)</Text>
                            <Text style={ styles.text }>주변의 가까운 매장을 찾기 위해</Text>
                            <Text style={ styles.text }>위치정보를 사용합니다.</Text>
                        </View>
                    </View>
                    <View style={ styles.listItem }>
                        <View style={ styles.circle }>
                            <Photo width={ 22 } height={ 18 } />
                        </View>
                        <View style={ styles.textBox }>
                            <Text style={ styles.subTitle }>사진 (필수)</Text>
                            <Text style={ styles.text }>스윙영상(나의스윙)을 내 폰에 저장 기능</Text>
                            <Text style={ styles.text }>이용 시 사용합니다.</Text>
                        </View>
                    </View><View style={ styles.listItem }>
                        <View style={ styles.circle }>
                            <Camera width={ 20 } height={ 17 } />
                        </View>
                        <View style={ styles.textBox }>
                            <Text style={ styles.subTitle }>카메라 사용 (필수)</Text>
                            <Text style={ styles.text }>QR로그인 서비스를 제공하기 위해</Text>
                            <Text style={ styles.text }>카메라를 사용합니다.</Text>
                        </View>
                    </View><View style={ styles.listItem }>
                        <View style={ styles.circle }>
                            <Push width={ 16 } height={ 18 } />
                        </View>
                        <View style={ styles.textBox }>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={ styles.subTitle }>알림 APP PUSH 전송 </Text>
                                <Text style={[ styles.text, { fontSize: 16 }]}>(선택)</Text>
                            </View>
                            <Text style={ styles.text }>경고, 사운드 및 아이콘 배지가 알람에</Text>
                            <Text style={ styles.text }>포함될 수 있습니다.</Text>
                        </View>
                    </View><View style={[ styles.listItem, { marginBottom: 0 }]}>
                        <View style={ styles.circle }>
                            <Call width={ 18 } height={ 18 } />
                        </View>
                        <View style={ styles.textBox }>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={ styles.subTitle }>전화 </Text>
                                <Text style={[ styles.text, { fontSize: 16 }]}>(선택)</Text>
                            </View>
                            <Text style={ styles.text }>앱 내에서 원하는 매장 선택 후,</Text>
                            <Text style={ styles.text }>전화 연결 시 사용합니다.</Text>
                        </View>
                    </View>
                </View>
                

                <Pressable style={({ pressed }) => [ styles.button, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]}
                    onPress={ onPress } android_ripple={{ color: '#b4b4b4' }}>
                    <Text style={ styles.buttonText }>동의하고 시작하기</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: 'white'
    },
    container: {
        paddingHorizontal: 15
    },
    title: {
        paddingTop: 24,
        paddingBottom: 48,
        
        includeFontPadding: false,
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 28,

        color: 'black'        
    },
    subTitle: {
        includeFontPadding: false,
        fontFamily: 'Pretendard-Bold',
        fontSize: 16,

        paddingBottom: 3,

        color: 'black'
    },
    text: {
        includeFontPadding: false,
        fontFamily: 'Pretendard-Regular',
        fontSize: 14,

        paddingBottom: 3,

        color: '#666666'
    },
    list: {
        marginTop: 30,
        marginBottom: 47,

        padding: 24,

        backgroundColor: '#f3f3f3'
    },
    listItem: {
        flexDirection: 'row',

        marginBottom: 21
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',

        width: 48,
        height: 48,

        marginRight: 15,
        
        borderRadius: 50,
        backgroundColor: 'white'
    },
    img: {
        color: '#fd780f'
    },
    textBox: {

    },
    button: {
        marginBottom: 36,
        borderRadius: 3,

        backgroundColor: '#fd780f'
    },
    buttonText: {
        textAlign: 'center',

        fontSize: 18,
        fontFamily: 'Pretendard-ExtraBold',

        paddingVertical: 15,

        color: 'white'
    },
})

export default Permissions