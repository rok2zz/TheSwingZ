import { useNavigation } from "@react-navigation/native"
import React, { useRef, useState, useEffect } from "react"
import { Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useUsers } from "../../../hooks/useUsers"
import { Payload } from "../../../types/apiTypes"
import { Focus, Message, Timer } from "../../../types/screenTypes"
import { AuthStackNavigationProp } from "../../../types/stackTypes"

//svg
import Check from "../../../assets/imgs/login/message_ok.svg"
import NotCheck from "../../../assets/imgs/login/select_check.svg"
import Loading from "../../../components/Loading"

const Find = (): JSX.Element => {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const { sendMessage, findID } = useUsers()

    const idRef = useRef<TextInput>(null)
    const phoneRef = useRef<TextInput>(null)
    const authNumRef = useRef<TextInput>(null)

    const [methodType, setMethodType] = useState<number>(0)

    const [isMessageSended, setIsMessageSended] = useState<boolean>(false)
    const [message, setMessage] = useState<Message>({ type: '', msg: '' })
    const [userID, setUserID] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [authCode, setAuthCode] = useState<string>('')
    const [min, setMin] = useState<number>(0)
    const [sec, setSec] = useState<number>(0)
    const [timer, setTimer] = useState<boolean>(false)
    const [isFocused, setIsFocused] = useState<Focus>({ ref: phoneRef, isFocused: false })
    const [isConnected, setIsConnected] = useState<boolean>(false)

    // set timer
    useEffect(() => {
        if (min === 0 && sec === 0) {
            setTimer(false)
        } else if (sec === -1) {
            setSec(59)
            setMin(min - 1)
        } else if (timer) {
            const timeout: NodeJS.Timeout = setTimeout((): void => {
                setSec(sec - 1)
            }, 1000)
            
            return () => clearTimeout(timeout)
        } 
    }, [timer, sec])

    // timer message
    useEffect(() => {
        if (timer) {
            setMessage({ type: 'phone', msg: '휴대폰으로 전송된 인증번호를 입력해주세요.' })
        }       
    }, [timer])


    // focus
    const handleFocus = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: true
        })
    }

    // blur
    const handleBlur = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: false
        })
    }

    const onPressSendMessage = async () => {
        if (isConnected) return
        if (phone === '') {
            setMessage({ type: 'phone', msg: '휴대전화번호를 입력해주세요.' })
            return
        } else if (phone.search(/\s/) > 0 || !/^(010)[0-9]{4}[0-9]{4}$/.test(phone)) {
            setMessage({ type: 'phone', msg: '유효하지 않은 휴대전화번호입니다.' })
            return 
        }

        setIsConnected(true)
        const payload: Payload = await sendMessage(phone, 0)
        setTimer(true)
        setMin(3)
        setSec(0)
        setIsConnected(false)

        if (payload.code !== 1000 ) {
            setMessage({ type: 'auth', msg: payload.msg ?? '서버와 연결할 수 없습니다.'})
            setTimer(false)
            return
        }
    }

    // 아이디 찾기 메소드 실행
    const onPressFindID = async () => {
        if (isConnected) return // 중복 호출 방지

        if (authCode === '')  {
            setMessage({ type: 'auth', msg: '인증번호를 입력해주세요.' })
            return 
        } else if (authCode.search(/\s/) > 0 || authCode.length !== 6) {
            setMessage({ type: 'auth', msg: '유효하지 않은 인증번호입니다.' })
            return
        } 

        // 서버 호출
        const payload: Payload = await findID(phone)
        setTimer(false)
        setIsConnected(false)

        if (payload.code !== 1000) {
            setMessage({ type: 'auth', msg: payload.msg ?? '서버와 연결할 수 없습니다.'})
            return
        }

        if (payload.category) {
            if (payload.userID) {
                navigation.navigate('ResultFind', { userID: payload.userID, category: payload.category })
                return
            }
            navigation.navigate('ResultFind', { category: payload.category })
        }


        return
        
    }

    const onPressMethodTypeChange = () => {
        setUserID('')
        setPhone('')
        setAuthCode('')
        setMethodType(1 - methodType)
    }
    
    return (
        <KeyboardAvoidingView style={ styles.wrapper }  behavior='height' keyboardVerticalOffset={ 80 }>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false }>
                <Pressable style={ styles.rowContainer } onPress={ onPressMethodTypeChange }>
                    { methodType === 0 ? <Check style={{ marginRight: 12 }} /> : <NotCheck style={{ marginRight: 12 }} />}
                    <Text style={ styles.regularText }>휴대폰 인증으로 찾기</Text>
                </Pressable>

                { methodType === 0 && 
                    <View style={{ marginTop: 30 }}>
                        <Text style={[ styles.regularText, { fontSize: 20, marginBottom: 3 }]}>회원가입시 등록한 휴대폰 번호를</Text>
                        <Text style={[ styles.regularText, { fontSize: 20, marginBottom: 23 }]}>입력해 주세요.</Text>

                        <View style={ styles.inputContainer }>
                            <TextInput style={[ styles.input, (isFocused.ref === phoneRef && isFocused.isFocused) ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'}]}                             
                                ref={ phoneRef } placeholder=" - 를 제외한 휴대전화번호 입력"  placeholderTextColor="#aaaaaa" returnKeyType="next" autoCapitalize='none'
                                onChangeText={(phoneNum: string): void => setPhone(phoneNum)} keyboardType="decimal-pad"
                                onFocus={ () => handleFocus(phoneRef) } onBlur={ () => handleBlur(phoneRef)}
                                onSubmitEditing={ () => authNumRef.current && authNumRef.current.focus() }
                            />             

                            { timer ?
                                ( 
                                    <Pressable style={({ pressed }) => [ styles.authBtn, { borderWidth: 1, borderColo: '#121619'}, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]}
                                        onPress={ onPressSendMessage } android_ripple={{ color: '#b4b4b4' }}>
                                        <Text style={ styles.authBtnText } >재 요청</Text>
                                    </Pressable>
                                ) : (
                                    <Pressable style={({ pressed }) => [ styles.authBtn, { backgroundColor: '#121619' }, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]}
                                        onPress={ onPressSendMessage } android_ripple={{ color: '#b4b4b4' }}>
                                        <Text style={[ styles.authBtnText, { color: '#ffffff'} ]}>인증요청</Text>
                                    </Pressable>
                                )
                            }
                        </View>

                        { message.type === 'phone' && <Text style={ styles.message }>{ message.msg }</Text> }

                        <View style={ styles.inputContainer }>
                            <TextInput style={[ styles.input, (isFocused.ref === authNumRef && isFocused.isFocused) ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'}]} 
                                ref={ authNumRef } placeholder=" 인증번호 입력" placeholderTextColor="#aaaaaa" returnKeyType="done" autoCapitalize='none' 
                                onChangeText={(code: string): void => setAuthCode(code)} keyboardType="decimal-pad"
                                onFocus={ () => handleFocus(authNumRef) } onBlur={ () => handleBlur(authNumRef)}
                                onSubmitEditing={ Keyboard.dismiss } 
                            />

                            { timer ? <Text style={ styles.timer }>{ min } : { sec }</Text> : <></> }
                        </View>

                        { message.type === 'auth' && <Text style={ styles.message }>{ message.msg }</Text> }

                        <Pressable style={({ pressed }) => [ styles.button, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]}
                            onPress={ onPressFindID } android_ripple={{ color: '#b4b4b4' }}>
                            <Text style={ styles.semiBoldText }>아이디 찾기</Text>
                        </Pressable>
                    </View>
                }
                
                <Pressable style={[ styles.rowContainer, { marginTop: 30 }]} onPress={ onPressMethodTypeChange }>
                    { methodType === 1 ? <Check style={{ marginRight: 12 }} /> : <NotCheck style={{ marginRight: 12 }} />}
                    <Text style={ styles.regularText }>본인인증으로 찾기</Text>
                </Pressable>

                { methodType === 1 && 
                    <Pressable style={({ pressed }) => [ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]}
                        android_ripple={{ color: '#b4b4b4' }} onPress={ () => navigation.navigate('IdentifyFind') }>
                        <Text style={[ styles.semiBoldText, { color: '#ffffff' }]}>본인인증 하러 가기</Text>
                    </Pressable>
                }

                <View style={ styles.subContainer }>
                    <Text style={[ styles.regularText, { fontSize: 13, color: '#aaaaaa' }]}>인증 후 비밀번호를 재설정 하실 수 있습니다.</Text>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        marginHorizontal: 15,
        paddingVertical: 30
    },
    typeBtnContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 25
    },
    typeBtn: {
        alignItems: 'center',
        width: '50%',

        paddingVertical: 13,

        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#fd780f'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        color: '#fd780f'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color : '#121619'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 5
    },
    input: {
        flex: 1,

        height: 45,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        borderBottomWidth: 1,

        color: '#121619'
    },
    authBtn: {
        position: 'absolute',
        right: 8,

        borderRadius: 3
    },
    authBtnText: {
        padding: 6,

        includeFontPadding: false,
        fontSize: 15,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    timer: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        position: 'absolute',
        right: 10,

        color: '#949494'
    },
    message: {
        marginVertical: 6, 
        marginLeft: 8,

        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        color: '#d61111'
    },
    button: {
        alignItems: 'center',
        marginTop: 18,
        paddingVertical: 13,

        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#fd780d'
    },
    subContainer: {
        marginTop: 20,
        marginLeft: 5,

    }
})

export default Find