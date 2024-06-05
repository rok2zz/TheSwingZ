import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { AuthStackNavigationProp, AuthStackParamList, RootStackNavigationProp } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { useEffect, useState } from "react"

// svg
import Kakao from "../../../assets/imgs/login/kakao.svg"
import Naver from "../../../assets/imgs/login/naver.svg"
import Google from "../../../assets/imgs/login/google.svg"
import Apple from "../../../assets/imgs/login/apple.svg"
import Check from "../../../assets/imgs/login/check_terms.svg"
import GrayCheck from "../../../assets/imgs/login/check_terms_gray.svg"
import Arrow from "../../../assets/imgs/login/arrow.svg"

interface Props {
    route: RouteProp<AuthStackParamList, 'Terms'>
}

const Terms = ({ route }: Props): JSX.Element =>  {
    const socialType = route.params.type ?? 'normal'
    const navigation = useNavigation<AuthStackNavigationProp>()
    const rootNavigation = useNavigation<RootStackNavigationProp>()

    const [isAllChecked, setIsAllChecked] = useState<boolean>(false)
    const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false)
    const [isPrivacyChecked, setIsPrivacyChecked] = useState<boolean>(false)
    const [isFinanceChecked, setIsFinanceChecked] = useState<boolean>(false)
    const [isAgeChecked, setIsAgeChecked] = useState<boolean>(false)
    const [isMarketingChecked, setIsMarketingChecked] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')

    useEffect(() => {
        setIsTermsChecked(isAllChecked)
        setIsPrivacyChecked(isAllChecked)
        setIsFinanceChecked(isAllChecked)
        setIsAgeChecked(isAllChecked)
        setIsMarketingChecked(isAllChecked)
    }, [isAllChecked])

    const onPress = () => {
        if (isTermsChecked && isPrivacyChecked && isFinanceChecked && isAgeChecked) {
            if (socialType === 'normal') {
                navigation.navigate('IdentifyRegister', { isMarketingChecked: isMarketingChecked })
                // navigation.navigate('Register', { type: 'normal', isMarketingChecked: isMarketingChecked })
                return
            }
            navigation.navigate('Register', { type: socialType, isMarketingChecked: isMarketingChecked })
            return
        }

        setMessage('필수 약관은 모두 동의하셔야 회원가입이 가능합니다.​')
    }

    return (
        <>
            <View style={ styles.bar }>
                <View style={ styles.gauge }></View>
            </View>
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
                <View style={ styles.container }>
                    <View style={ styles.rowContainer }>
                        <Text style={[ styles.boldText, { fontSize: 13, color: '#fd780f' }]}>1</Text>
                        <Text style={[ styles.regularText, { fontSize: 13 }]}> / 3</Text>
                    </View>

                    <Text style={ styles.semiBoldText }>약관동의</Text>

                    <View style={ styles.rowContainer }>
                        <Kakao style={[ styles.socialIcon, socialType === 'kakao' && { opacity: 1 }]} width={ 52 } height={ 52 } />
                        <Naver style={[ styles.socialIcon, socialType === 'naver' && { opacity: 1 }]} width={ 52 } height={ 52 } />
                        <Google style={[ styles.socialIcon, socialType === 'google' && { opacity: 1 }]}  width={ 52 } height={ 52 } />
                        <Apple  style={[ styles.socialIcon, socialType === 'apple' && { opacity: 1 }]} width={ 52 } height={ 52 } />

                        { socialType !== 'normal' &&
                            <View style={[ styles.check, 
                                socialType === 'kakao' && { left: 34 },
                                socialType === 'naver' && { left: 104 },
                                socialType === 'google' && { left: 174 },
                                socialType === 'apple' && { left: 244 },
                            ]}>
                                <Check />
                            </View>
                        }
                    </View>
                </View>

                <View style={ styles.blankContainer }></View>

                <View style={ styles.container }>
                    <Text style={ styles.boldText }>약관동의</Text>

                    <Pressable style={ styles.allAgreeContainer } onPress={ () => setIsAllChecked(prev => !prev) }>
                        { isAllChecked ? (
                            <View style={ styles.filledCircle } >
                                <Check width={ 16 } height={ 16 } />
                            </View>
                            ) : (
                            <View style={ styles.circle } >
                                <GrayCheck />
                            </View>
                        )}
                        <Text style={ styles.regularText }>모든 약관에 동의합니다.</Text>
                    </Pressable>

                    <View style={ styles.agreeContainer }>
                        <View style={ styles.checkBoxContainer }>
                            { isTermsChecked ? (
                                <Pressable style={ styles.filledCircle } onPress={ () => setIsTermsChecked(prev => !prev) }>
                                    <Check width={ 16 } height={ 16 } />
                                </Pressable>
                                ) : (
                                <Pressable style={ styles.circle } onPress={ () => setIsTermsChecked(prev => !prev) }>
                                    <GrayCheck />
                                </Pressable>
                            )}
                            <Pressable style={ styles.rowContainer } onPress={ () => rootNavigation.push('TermsOfUse', { type: 0 }) }>
                                <Text style={[ styles.regularText, { flex: 1 }]}>(필수) 이용약관 동의</Text>
                                <Arrow />
                            </Pressable>
                        </View>
                        <View style={ styles.checkBoxContainer }>
                            { isPrivacyChecked ? (
                                <Pressable style={ styles.filledCircle } onPress={ () => setIsPrivacyChecked(prev => !prev) }>
                                    <Check width={ 16 } height={ 16 } />
                                </Pressable>
                                ) : (
                                <Pressable style={ styles.circle } onPress={ () => setIsPrivacyChecked(prev => !prev) }>
                                    <GrayCheck />
                                </Pressable>
                            )}
                            <Pressable style={ styles.rowContainer } onPress={ () => rootNavigation.navigate('PrivacyPolicy') }>
                                <Text style={[ styles.regularText, { flex: 1 }]}>(필수) 개인정보 수집 및 이용 동의</Text>
                                <Arrow />
                            </Pressable>
                        </View>
                        {/* <View style={ styles.checkBoxContainer }>
                            { isFinanceChecked ? (
                                <Pressable style={ styles.filledCircle } onPress={ () => setIsFinanceChecked(prev => !prev) }>
                                    <Check width={ 16 } height={ 16 } />
                                </Pressable>
                                ) : (
                                <Pressable style={ styles.circle } onPress={ () => setIsFinanceChecked(prev => !prev) }>
                                    <GrayCheck />
                                </Pressable>
                            )}
                            <Pressable style={ styles.rowContainer }>
                                <Text style={[ styles.regularText, { flex: 1 }]}>(필수) 전자금융 이용약관</Text>
                                <Arrow />
                            </Pressable>
                        </View> */}
                        <View style={ styles.checkBoxContainer }>
                            { isAgeChecked ? (
                                <Pressable style={ styles.filledCircle } onPress={ () => setIsAgeChecked(prev => !prev) }>
                                    <Check width={ 16 } height={ 16 } />
                                </Pressable>
                                ) : (
                                <Pressable style={ styles.circle } onPress={ () => setIsAgeChecked(prev => !prev) }>
                                    <GrayCheck />
                                </Pressable>
                            )}
                            <Pressable style={ styles.rowContainer }>
                                <Text style={[ styles.regularText, { flex: 1 }]}>(필수) 만 14세 이상입니다.</Text>
                            </Pressable>
                        </View>
                        <View style={[ styles.checkBoxContainer, { marginBottom: 12 }]}>
                            { isMarketingChecked ? (
                                <Pressable style={ styles.filledCircle } onPress={ () => setIsMarketingChecked(prev => !prev) }>
                                    <Check width={ 16 } height={ 16 } />
                                </Pressable>
                                ) : (
                                <Pressable style={ styles.circle } onPress={ () => setIsMarketingChecked(prev => !prev) }>
                                    <GrayCheck />
                                </Pressable>
                            )}
                            <Pressable style={ styles.rowContainer }>
                                <Text style={[ styles.regularText, { color: 'red' }]}>(선택) </Text>
                                <Text style={[ styles.regularText, { flex: 1 }]}>마케팅 활용</Text>
                            </Pressable>
                        </View>

                        <Text style={[ styles.regularText, { fontSize: 14, marginHorizontal: 15, color: '#666666' }]}>마케팅 정보는 알림톡, 문자, 이메일로 받을 수 있으며 동의 여부는 설정메뉴에서 확인 가능합니다.​</Text>
                    </View>

                    <Text style={[ styles.regularText, { fontSize: 14, marginTop: 12, color: '#c50f0b' }]}>{ message }</Text>

                    <View style={ styles.btnContainer }>
                        <Pressable style={ styles.button } onPress={ () => navigation.goBack() }>
                            <Text style={[ styles.boldText, { paddingVertical: 16 }]}>취소</Text>
                        </Pressable>
                        <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ onPress }>
                            <Text style={[ styles.boldText, { paddingVertical: 16, color: '#ffffff' }]}>다음</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </>

    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    bar: {
        height: 2,

        backgroundColor: '#cccccc'
    },
    gauge: {
        width: Dimensions.get('window').width / 3,
        height: 2,

        backgroundColor: '#fd780f'
    },
    container: {
        paddingVertical: 30,
        marginHorizontal: 15
    },
    rowContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        marginTop: 9,
        marginBottom: 45,

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    socialIcon: {
        marginRight: 18,

        opacity: 0.5
    },
    check: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 18,
        height: 18,

        position: 'absolute',
        top: 0,

        borderRadius: 50,

        backgroundColor: '#121619'
    },
    blankContainer: {
        width: '100%',

        height: 6,

        backgroundColor: '#f2f2f2'
    },
    allAgreeContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 15,
        marginBottom: 6,
        paddingHorizontal: 15,
        paddingVertical: 13,

        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#eeeeee'
    },
    agreeContainer: {
        paddingVertical: 18,

        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#eeeeee'
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 30,
        height: 30,

        marginRight: 12,

        borderWidth: 2,
        borderRadius: 50,
        borderColor: '#cccccc'
    },
    filledCircle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 30,
        height: 30,

        marginRight: 12,

        borderRadius: 50,

        backgroundColor: '#fd780f'
    },
    checkBoxContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 15,
        marginBottom: 15
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 60
    },
    button: {
        alignItems: 'center',

        width: (Dimensions.get('window').width - 36) / 2,

        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    }
})

export default Terms