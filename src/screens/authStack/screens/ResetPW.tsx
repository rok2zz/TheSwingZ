import { Alert, Keyboard, KeyboardAvoidingView, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from "react-native"
import { AuthStackNavigationProp, AuthStackParamList } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"

//svg
import Check from "../../../assets/imgs/login/check_result.svg"
import { useRef, useState } from "react"
import { Focus, Message } from "../../../types/screenTypes"
import { useUsers } from "../../../hooks/useUsers"
import { Payload } from "../../../types/apiTypes"
import Loading from "../../../components/Loading"

interface Props {
    route: RouteProp<AuthStackParamList, 'ResetPW'>
}

const ResetPW = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const userID = route.params.userID ?? ''

    const { resetPW } = useUsers()

    const passwordRef = useRef<TextInput>(null)
    const passwordCheckRef = useRef<TextInput>(null)

    const [isFocused, setIsFocused] = useState<Focus>({ ref: passwordRef, isFocused: false })
    const [isConnected, setIsConnected] = useState<boolean>(false)  
    const [password, setPassword] = useState<string>('')
    const [passwordCheck, setPasswordCheck] = useState<string>('')
    const [message, setMessage] = useState<Message>({ type: '', msg: ''})

    
     // 선택한 입력칸 포커스
     const handleFocus = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: true
        })
    }

    // 포커스 해제
    const handleBlur = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: false
        })
    }

    const onPressResetPW = async () => {
        if (isConnected) return
        Alert.alert(
            '알림',
            '재설정하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { 
                        return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async () => { 
                        setMessage({ type: 'password', msg: '' })
                        if (password === '') {
                            setMessage({ type: 'password', msg: '비밀번호를 입력해주세요.' })
                            return
                        } else if (password.search(userID) > 0) {
                            setMessage({ type: 'password', msg: '아이디와 다른 비밀번호를 입력해주세요.' })
                            return
                        } else if (password.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(password)) {
                            setMessage({ type: 'password', msg: '비밀번호는 8~16자의 영문, 숫자, 특수문자만 입력 가능하며, 반드시 영문과 숫자를 포함하여야 합니다.' })
                            return 
                        } else if (passwordCheck === '') {
                            setMessage({ type: 'passwordCheck', msg: '비밀번호 확인 정보를 입력해주세요.' })
                            return
                        } else if (passwordCheck.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(passwordCheck)) {
                            setMessage({ type: 'passwordCheck', msg: '비밀번호는 8~16자의 영문, 숫자, 특수문자만 입력 가능하며,반드시 영문과 숫자를 포함하여야 합니다.' })
                            return 
                        } else if (password !== passwordCheck) {
                            setMessage({ type: 'passwordCheck', msg: '비밀번호, 비밀번호 확인이 일치하지 않습니다' })
                            return
                        }

                        setIsConnected(true)
                        const payload: Payload = await resetPW(userID, password)
                        setIsConnected(false)

                        if (payload.code !== 1000) {
                            setMessage({ type: 'passwordCheck', msg: payload.msg ?? '서버와 연결할 수 없습니다.' })
                            return
                        }
                        
                        Alert.alert('알림', '비밀번호가 재설정되었습니다. 로그인 페이지로 이동합니다.', [
                            {
                                text: '확인', 
                                onPress: async () => {
                                    navigation.navigate('Login')
                                }
                            }
                        ])
                    },
                }
            ],
        )
    }
    
    return (
        <KeyboardAvoidingView style={ styles.wrapper } behavior='height' keyboardVerticalOffset={ 80 }>
            <StatusBar backgroundColor='#272727' />
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <View style={ styles.container }>
                <View style={ styles.circle }>
                    <Check />
                </View>

                <Text style={ styles.regularText }>비밀번호를 재설정해 주세요​</Text>

                <View style={{ width: '100%', marginTop: 30 }}>
                    <Text style={ styles.boldText }>아이디</Text>
                    <View style={ styles.idContainer }>
                        <Text style={[ styles.regularText, { fontSize: 16, color: '#949494' }]}>{ userID }</Text>
                    </View>
                    <View style={ styles.rowContainer }>
                        <TextInput style={[ styles.input, isFocused.ref === passwordRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                            placeholder="비밀번호 입력" placeholderTextColor="#aaaaaa" ref={ passwordRef } returnKeyType="next" autoCapitalize='none' secureTextEntry  
                            onFocus={ () => handleFocus(passwordRef) } onBlur={ () => handleBlur(passwordRef)} textContentType="oneTimeCode"
                            onChangeText={(password: string): void => setPassword(password) } onSubmitEditing={ () => passwordCheckRef.current && passwordCheckRef.current.focus() } />
                    </View>
                    { message.type === 'password' ? <Text style={[ styles.message, { marginBottom: 9 }]}>{ message.msg }</Text> : <View style={{ marginBottom: 9 }}></View> }

                    <View style={ styles.rowContainer }>
                        <TextInput style={[ styles.input, isFocused.ref === passwordCheckRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                            placeholder="비밀번호 확인 입력​" placeholderTextColor="#aaaaaa" ref={ passwordCheckRef } returnKeyType="next" autoCapitalize='none' secureTextEntry  
                            onFocus={ () => handleFocus(passwordCheckRef) } onBlur={ () => handleBlur(passwordCheckRef)} textContentType="oneTimeCode"
                            onChangeText={(passwordCheck: string): void => setPasswordCheck(passwordCheck) } onSubmitEditing={ Keyboard.dismiss } />
                    </View>
                    { message.type === 'passwordCheck' ? <Text style={ styles.message }>{ message.msg }</Text> : <></> }
                </View>

                { message.msg === '' &&
                    <View style={ styles.subContainer }>
                        <Text style={[ styles.regularText, { fontSize: 13, color: '#aaaaaa' }]}>8~16자의 영문, 숫자, 특수문자만 입력 가능하며,</Text>
                        <Text style={[ styles.regularText, { fontSize: 13, color: '#aaaaaa' }]}>반드시 영문과 숫자를 포함하여야 합니다.</Text>
                    </View>
                }
                
                <Pressable style={[ styles.emptyBtn, { marginTop: 24 }]} onPress={ onPressResetPW }>
                    <Text style={[ styles.semiBoldText, { fontSize: 16, color: '#fd780f'}]}>비밀번호 재설정</Text>
                </Pressable>
            
          

            </View>
        </KeyboardAvoidingView>
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
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 3
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
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    emptyBtn: {
        alignItems: 'center',
        width: '100%',

        paddingVertical: 13,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fd780f'
    },
    idContainer: {
        paddingVertical: 13,

        marginBottom: 30,
        paddingLeft: 10,

        borderBottomWidth: 1,
        borderBottomColor: '#cccccc'
    },
    input: {
        flex: 1,
        height: 45,

        paddingHorizontal: 10,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        borderBottomWidth: 1,

        color: '#121619'
	},
    message: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginLeft: 6,
        marginBottom: 24,

        color: '#c50f0b'
    },
    subContainer: {
        width: '100%',

        marginLeft: 10,
        marginTop: 6
    }
})

export default ResetPW