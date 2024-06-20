import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp, AuthStackParamList } from "../../../types/stackTypes"

//svg
import Check from "../../../assets/imgs/login/check_result.svg"
import { useEffect, useState } from "react"

interface Props {
    route: RouteProp<AuthStackParamList, 'ResultFind'>
}

const ResultFind = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const userID = route.params.userID ?? ''
    const category = route.params.category

    const [isSocial, setIsSocial] = useState<boolean>(false)

    useEffect(() => {
        if (category !== 'NORMAL' && category !== 'GUEST') {
            setIsSocial(true)
        }
    }, [category])

    const getSocialType = () => {
        switch (category) {
            case 'KAKAO':
                return '카카오'
            case 'GOOGLE':
                return '구글'
            case 'NAVER':
                return '네이버'
            case 'APPLE':
                return '애플'                       
        }
    }

    return (
        <SafeAreaView style={ styles.wrapper } >
            <StatusBar backgroundColor='#272727' />
            <View style={ styles.container }>
                <View style={ styles.circle }>
                    <Check />
                </View>

                { isSocial ? (
                    <>
                        <View style={ styles.rowContainer }>
                            <Text style={ styles.regularText }>이미 </Text>
                            <Text style={ styles.boldText }>{ getSocialType() }</Text>
                            <Text style={ styles.regularText }>로 가입한 계정입니다.</Text>
                        </View>
            
                        <Pressable style={[ styles.filledBtn, { marginTop: 100}]} onPress={ () => navigation.navigate('Login' )}>
                            <Text style={[ styles.semiBoldText, { fontSize: 16, color: '#ffffff'}]}>로그인 바로가기</Text>
                        </Pressable>
                    </>
                    ) : (
                    <>
                        { userID !== '' ? (
                            <>
                                <Text style={ styles.regularText }>회원님의 아이디는</Text>
                                <Text style={ styles.regularText }>아래와 같습니다.​</Text>

                                <View style={ styles.idContainer }>
                                    <Text style={ styles.semiBoldText }>{ userID }</Text>
                                </View>

                                <Pressable style={ styles.filledBtn } onPress={ () => navigation.navigate('Login' )}>
                                    <Text style={[ styles.semiBoldText, { fontSize: 16, color: '#ffffff'}]}>로그인 바로가기</Text>
                                </Pressable>
                                <Pressable style={[ styles.emptyBtn, { marginTop: 20 }]} onPress={ () => navigation.navigate('ResetPW', { userID: userID } )}>
                                    <Text style={[ styles.semiBoldText, { fontSize: 16, color: '#fd780f'}]}>비밀번호 재설정</Text>
                                </Pressable>
                            </>
                        ) : (
                            <>
                                <Text style={ styles.regularText }>회원님의 정보로 가입된</Text>
                                <Text style={ styles.regularText }>아이디가 없습니다.​</Text>

                                <View style={ styles.idContainer }>
                                    <Text style={[ styles.regularText, { fontSize: 18, marginBottom: 3 }]}>입력 정보를 확인 후 다시 시도하시거나</Text>
                                    <Text style={[ styles.regularText, { fontSize: 18 }]}>새로 회원가입을 해 주시기 바랍니다.</Text>
                                </View>

                                <Pressable style={ styles.emptyBtn } onPress={ () => navigation.navigate('Find')}>
                                    <Text style={[ styles.semiBoldText, { fontSize: 16, color: '#fd780f'}]}>아이디/비밀번호 찾기</Text>
                                </Pressable>

                                <Pressable style={[ styles.filledBtn, { marginTop: 20 }]} onPress={ () => navigation.push('Terms', { type: 'normal' })}>
                                    <Text style={[ styles.semiBoldText, { fontSize: 16, color: '#ffffff'}]}>회원가입 바로가기</Text>
                                </Pressable>
                            </>
                        )}
                    </>
                )}

                

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

        marginHorizontal: 15,
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 48,
        height: 48,

        marginVertical: 24,

        borderRadius: 50,
        backgroundColor: '#fd780f'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Bold',

        color: '#fd780f'
    },
    idContainer: {
        alignItems: 'center',
        width: '100%',

        paddingVertical: 24,
        marginTop: 30,
        marginBottom: 24,

        borderRadius: 3,
        backgroundColor: '#f9f9f9'
    },
    filledBtn: {
        alignItems: 'center',
        width: '100%',

        paddingVertical: 13,

        borderRadius: 3,

        backgroundColor: '#fd780f'
    },
    emptyBtn: {
        alignItems: 'center',
        width: '100%',

        paddingVertical: 13,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fd780f'
    },
    rowContainer: {
        flexDirection: 'row'
    }
})

export default ResultFind