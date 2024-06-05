import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { SafeAreaView } from "react-native-safe-area-context"
import { useUserInfo } from "../../../hooks/useUsers"

//svg
import EmptyImg from "../../../assets/imgs/my/empty_img.svg"

const ResultScreenLogin = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const userInfo = useUserInfo()

    return (
        <SafeAreaView style={ styles.wrapper }>
            <View style={ styles.container }>
                <View style={ styles.profileImg }>
                    <EmptyImg />
                </View>

                <View style={ styles.rowContainer }>
                    <Text style={ styles.nicknameText }>{ userInfo.nick ?? '재야의초짜' }</Text>
                    <Text style={ styles.bigText }>님 환영합니다.​</Text>
                </View>

                <Text style={ styles.text }>시스템에 로그인 되었습니다.​</Text>
                <Text style={ styles.text }>스크린 화면을 확인해주세요.​</Text>

                <Pressable style={ styles.button } onPress={ () => navigation.push('MainTab') }>
                    <Text style={ styles.btnText }>홈으로 가기</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        alignItems: 'center',
        ...Platform.select({
            ios: {
                paddingTop: 153
            },
            android: {
                paddingTop: 223
            }
        })
    },
    profileImg: {
        width: 96,
        height: 96,

        borderRadius: 40,
        marginBottom: 24,

        backgroundColor: '#f1f3f8'
    },
    rowContainer: {
        flexDirection: 'row',

        marginBottom: 12
    },
    nicknameText: { 
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    bigText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    text: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 6,

        color: '#666666'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 13,
        paddingHorizontal: 30,

        color: '#ffffff'
    },
    button: {
        marginTop: 24,

        borderRadius: 3,

        backgroundColor: '#fd780f'
    }

})

export default ResultScreenLogin