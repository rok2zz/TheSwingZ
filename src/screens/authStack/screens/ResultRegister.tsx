import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp, AuthStackParamList } from "../../../types/stackTypes"

//svg
import Logo from "../../../assets/imgs/common/logo_w.svg"
import Kakao from "../../../assets/imgs/login/kakao.svg"
import Naver from "../../../assets/imgs/login/naver.svg"
import Google from "../../../assets/imgs/login/google.svg"
import Apple from "../../../assets/imgs/login/apple.svg"

interface Props {
    route: RouteProp<AuthStackParamList, 'ResultRegister'>
}



const ResultRegister = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const nickname = route.params?.nickname ?? '재야의초짜'
    const socialType = route.params?.type ?? 'normal'

    return (
        <SafeAreaView style={ styles.wrapper } >
            <StatusBar backgroundColor='#272727' />
            <ScrollView showsVerticalScrollIndicator={ false }>
                <View style={ styles.container }>
                    <Logo width={ 146.89 } height={ 28 } />
                    
                    <View style={{ width: '100%', marginTop: 47 }}>
                        <View style={ styles.rowContainer }>
                            <Text style={[ styles.boldText, { fontSize: 13, color: '#fd780f' }]}>3</Text>
                            <Text style={[ styles.regularText, { fontSize: 13 }]}> / 3</Text>
                        </View>
                        <Text style={[ styles.semiBoldText, { fontSize: 24, marginTop: 9, color: '#ffffff' }]}>가입완료</Text>
                    </View>

                    <View style={[ styles.rowContainer, { marginTop: 60, marginBottom: 15 }]}>
                        <Text style={ styles.semiBoldText }>{ nickname }</Text>
                        <Text style={[ styles.regularText, { fontSize: 34 }]}>님</Text>
                    </View>

                    <Text style={[ styles.regularText, { marginBottom: 4, color: '#cccccc' }]}>더스윙제트, 또 하나의 필드</Text>
                    { Platform.OS === 'android' ?
                        <Text style={[ styles.regularText, { color: '#cccccc' }, socialType === 'normal' ? { marginBottom: 162 } : { marginBottom: 283 }]}>플레이 할 준비가 되었습니다.​</Text>
                            :
                        <Text style={[ styles.regularText, { color: '#cccccc' }, socialType === 'normal' ? { marginBottom: 100 } : { marginBottom: 200 }]}>플레이 할 준비가 되었습니다.​</Text>
                    }
                   
                    { socialType === 'normal' &&
                        <>
                            <Text style={[ styles.regularText, { fontSize: 14 }]}>SNS 연동하기</Text>
                            <View style={ styles.social }>
                                <Pressable onPress={ ()=> {} }>
                                    <Kakao />
                                </Pressable>
                                <Pressable onPress={ ()=>{} }>
                                    <Naver />
                                </Pressable>
                                <Pressable onPress={ ()=>{} }>
                                    <Google />
                                </Pressable>
                                <Pressable onPress={ () => {} }>
                                    <Apple />
                                </Pressable>
                            </View>
                        </>
                    }

                    <Text style={[ styles.regularText, { fontSize: 14, marginBottom: 4, color: '#cccccc'}]}>스크린골프 후 내 기록 및 영상을 확인하실 수 있으며,</Text>
                    <Text style={[ styles.regularText, { fontSize: 14, color: '#cccccc'}]}>다양한 서비스를 이용하실 수 있습니다.​</Text>
                    
                    <Pressable style={ styles.button } onPress={ () => navigation.navigate('Login') }>
                        <Text style={ styles.boldText }>홈으로 가기</Text>
                    </Pressable>
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
        alignItems: 'center',

        marginHorizontal: 15,
        marginTop: 15
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 34,
        fontFamily: 'Pretendard-SemiBold',
        
        color: '#fd780f'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#ffffff'
    },
    social: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        
        width: 300,

        marginTop: 15,
        marginBottom: 30,
        marginHorizontal: 36
    },
    button: {
        alignItems: 'center',

        width: '100%',

        paddingVertical: 15,
        marginVertical: 75,

        borderRadius:6,
        backgroundColor: '#fd780f'
    }
})

export default ResultRegister