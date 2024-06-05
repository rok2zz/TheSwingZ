import { View, Text, Pressable, Keyboard, TextInput, Platform, Alert } from "react-native"
import { styles } from "./modalStyles"
import { useUsers } from "../../hooks/useUsers"
import { Payload } from "../../types/apiTypes"
import { useEffect, useRef, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { AuthStackNavigationProp } from "../../types/stackTypes"
import { Focus } from "../../types/screenTypes"

interface Props {
    uid: number,
    expired: boolean,
    onClose(): void
}

function ChangePasswordModal({ uid, expired, onClose }: Props): JSX.Element {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const [isExpired, setIsExpired] = useState<boolean>(expired)
    const { changePW } = useUsers()
    const [editable, setEditable] = useState<boolean>(true)
    const [message, setMessage] = useState<string>('')
    const [userID, setUserID] = useState<string>('')
    const [phone, setPhone] = useState<string>('')
    const [authentification, setAuthentification] = useState<string>('')
    const [requestNum, setRequestNum] = useState<number | null>(null)
    const [min, setMin] = useState<number>(0)
    const [sec, setSec] = useState<number>(0)
    const [timer, setTimer] = useState<boolean>(false)
    const idRef = useRef<TextInput>(null)
    const phoneRef = useRef<TextInput>(null)
    const authentificationRef = useRef<TextInput>(null)
    const passwordRef = useRef<TextInput>(null)
    const newPasswordRef = useRef<TextInput>(null)
	const newPasswordCheckRef = useRef<TextInput>(null)
    const [password, setPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [newPasswordCheck, setNewPasswordCheck] = useState<string>('')
    const [isFocused, setIsFocused] = useState<Focus>({ ref: phoneRef, isFocused: false });
    const userUid: number = uid

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

    // 인증 요청시 타이머 세팅
    useEffect(() => {
        if (min === 0 && sec === 0) {
            setRequestNum(null)
            setTimer(false)
            setEditable(true)
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

    // 타이머 실행시 메시지 업데이트
    useEffect(() => {
        if (timer) {
            setMessage('휴대폰으로 전송된 인증번호를 입력해주세요.')
        }       
    }, [timer])

    // 휴대폰 인증 메소드 실행
    // const getAuthCode = async (): Promise<void> => {
    //     Keyboard.dismiss()

    //     if (phone === '') {
    //         setMessage('휴대전화번호를 입력해주세요.')
    //         return
    //     } else if (phone.search(/\s/) > 0 || !/^(010)[0-9]{4}[0-9]{4}$/.test(phone)) {
    //         setMessage('유효하지 않은 휴대전화번호입니다.')
    //         return 
    //     }

    //     // 서버 호출 (등록된 번호인지 확인)
    //     const payload: Payload = await authPhoneNum(phone)
    //     console.log(payload.authCode)

    //     // 성공시 휴대폰 입력칸 비활성화, 타이머 실행 및 requestNum에 인증번호 저장
    //     if (payload.code === 1000) {
    //         setRequestNum(Number(payload.authCode))
    //         setEditable(false)
    //         setMin(3)
    //         setSec(0)
    //         setTimer(true)
        
    //         return
    //     }      

    //     // 실패시 에러 메시지 호출, 타이머 실행 x
    //     if (payload.msg) setMessage(payload.msg)
            
    //     return
    // }

    // 인증 성공시 재설정 페이지로 이동
    const goResetPWPage = (): void => {
        if (authentification === '')  {
            setMessage('인증번호를 입력해주세요.')
            return 
        } else if (authentification.search(/\s/) > 0 || authentification.length !== 6) {
            setMessage('유효하지 않은 인증번호입니다.')
            return
        } 

        if (Number(authentification) !== requestNum) {
            setMessage('유효하지 않은 인증번호입니다.')
            return
        }

        // 메시지와 인증번호 초기화
        setMessage('')
        setRequestNum(null)
        setTimer(false)
        setEditable(true)
        
        navigation.push('ResetPW', { uid: userUid })

        return
    }

    // 비밀번호 재설정 메소드 호출
    const onPressChangePW = (): void => {
        Keyboard.dismiss()

        if (password === "") {
            setMessage('현재 비밀번호를 입력해주세요.')
            return
        } else if (newPassword.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(password)) {
            setMessage("올바른 현재 비밀번호 형식이 아닙니다")
            return 
        } else if (newPassword === "") {
            setMessage('새 비밀번호를 입력해주세요.')
            return
        } else if (newPassword.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(newPassword)) {
            setMessage("올바른 새 비밀번호 형식이 아닙니다")
            return 
        } else if (newPasswordCheck === "") {
            setMessage('비밀번호 확인 정보를 입력해주세요.')
            return
        } else if (newPasswordCheck.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(newPasswordCheck)) {
            setMessage("올바른 비밀번호 확인 형식이 아닙니다")
            return 
        } else if (newPassword !== newPasswordCheck) {
            setMessage('새 비밀번호, 새 비밀번호 확인이 일치하지 않습니다')
            return
        } 

        setMessage('')

        Alert.alert(
            '알림',
            '비밀번호를 재설정 하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { return },
                    style: 'cancel',
                },
                {
                    text: '확인', 
                    onPress: async (): Promise<void> => { 
                        const payload: Payload = await changePW(userUid, newPassword, password)
                        // 기존 비밀번호와 일치할 경우 체크

                        if (payload.code === 1000) {
                            Alert.alert('비밀번호 변경 완료', '회원님의 비밀번호가 정상적으로 변경 되었습니다.',[
                                {
                                    text: '확인',
                                    onPress: () => { navigation.push('Login') }
                                }
                            ])
                        }       
                        
                        if (payload.msg) {
                            setMessage(payload.msg)
                        }
                    },
                }
            ],
        )

	}

    return (
        <Pressable style={ styles.modalContainer } onPress={ () => { Keyboard.dismiss() }}>
            <View style={ styles.modal }>
                <Text style={ styles.modalTitle }>비밀번호 변경 안내</Text>

                { isExpired ? (
                    <View style={ styles.modalTextContainer }>
                        <Text style={ styles.modalText }>개인정보 도용으로 인한 피해를 예방하기 위해</Text>
                        <Text style={ styles.modalText }>180일 이상 비밀번호를 변경하지 않아</Text>
                        <Text style={ styles.modalText }>비밀번호가 만료되었습니다.</Text>
                        <Text style={ styles.modalText }>본인인증 후 비밀번호를 재 설정하셔야</Text>
                        <Text style={ styles.modalText }>서비스를 이용하실 수 있습니다.</Text>
                    </View>
                ) : (
                    <View style={ styles.modalTextContainer }>
                        <Text style={ styles.modalText }>회원님의 개인정보를 안전하게 보호하고,</Text>
                        <Text style={ styles.modalText }>개인정보 도용으로 인한 피해를 예방하기 위해</Text>
                        <Text style={ styles.modalText }>90일 이상 비밀번호를 변경하지 않은 경우</Text>
                        <Text style={ styles.modalText }>비밀번호 변경을 권장하고 있습니다.</Text>
                    </View>
                )}

                <View style={ styles.inputContainer }>
                    { isExpired ? (
                        <>
                            <TextInput style={[ styles.input, { marginBottom: 20 }, (isFocused.ref === idRef && isFocused.isFocused) ? { borderBottomColor: '#3c83ff'} : { borderBottomColor: '#b4b4b4'}]}
                                ref={ idRef } placeholder=" 아이디 입력" returnKeyType="next" autoCapitalize='none'
                                onChangeText={(id: string): void => setUserID(id)} editable={ editable }
                                onFocus={ () => handleFocus(idRef) } onBlur={ () => handleBlur(idRef)}
                                onSubmitEditing={() => phoneRef.current && phoneRef.current.focus() }
                            />

                            <View>
                                <TextInput style={[ styles.input, { marginBottom: 20 }, (isFocused.ref===phoneRef && isFocused.isFocused) ? { borderBottomColor: '#3c83ff'} : { borderBottomColor: '#b4b4b4'}]}
                                    ref={ phoneRef } placeholder=" - 를 제외한 휴대전화번호 입력" returnKeyType="next" autoCapitalize='none'
                                    onChangeText={(phone: string): void => setPhone(phone)} editable={ editable } keyboardType="decimal-pad"
                                    onFocus={ () => handleFocus(phoneRef) } onBlur={ () => handleBlur(phoneRef)}
                                    onSubmitEditing={() => authentificationRef.current && authentificationRef.current.focus() }
                                />                       
                                {/* <Pressable onPress={ getAuthCode } style={({ pressed }) => [ styles.authBtn, Platform.OS === 'ios' && pressed && { backgroundColor: '#efefef' }]}
                                    android_ripple={{ color: '#ededed' }}>
                                    { timer ? <Text style={ styles.authBtnText }>재전송</Text> : <Text style={ styles.authBtnText }>인증요청</Text> }
                                </Pressable>     */}
                            </View>     
                            
                            <View>
                                <TextInput style={[ styles.input, (isFocused.ref === authentificationRef && isFocused.isFocused) ? { borderBottomColor: '#3c83ff'} : { borderBottomColor: '#b4b4b4'}]}
                                    ref={ authentificationRef } placeholder=" 인증번호 입력" returnKeyType="done" autoCapitalize='none' 
                                    onChangeText={(text: string): void => setAuthentification(text)} keyboardType="decimal-pad"
                                    onFocus={ () => handleFocus(authentificationRef) } onBlur={ () => handleBlur(authentificationRef)}
                                    onSubmitEditing={ () => { Keyboard.dismiss() } } 
                                />
                                { timer ? <Text style={ styles.timer }>{ min } : { sec }</Text> : <></> }
                            </View>
                        </>
                    ) : (
                        <>
                            <View>
                                <TextInput style={[ styles.input, { marginBottom: 20 }, (isFocused.ref === passwordRef && isFocused.isFocused) ? { borderBottomColor: '#3c83ff'} : { borderBottomColor: '#b4b4b4'}]}  
                                    ref={ passwordRef } placeholder=" 현재 비밀번호" returnKeyType="next" secureTextEntry
                                    onFocus={ (): void => handleFocus(passwordRef) } onBlur={ () => handleBlur(passwordRef)}
                                    onChangeText={(pw: string): void => setPassword(pw)} onSubmitEditing={(): void | null =>
                                        newPasswordRef.current && newPasswordRef.current.focus()
                                }/>
                                <TextInput style={[ styles.input, { marginBottom: 20 }, (isFocused.ref === newPasswordRef && isFocused.isFocused) ? { borderBottomColor: '#3c83ff'} : { borderBottomColor: '#b4b4b4'}]}  
                                    ref={ newPasswordRef } placeholder=" 새 비밀번호 (8~16자 영문, 숫자, 특수문자 중 2개 이상 조합)" returnKeyType="next" secureTextEntry
                                    onFocus={ (): void => handleFocus(newPasswordRef) } onBlur={ () => handleBlur(newPasswordRef)}
                                    onChangeText={(pw: string): void => setNewPassword(pw)} onSubmitEditing={(): void | null =>
                                        newPasswordCheckRef.current && newPasswordCheckRef.current.focus()
                                }/>
                                <TextInput style={[ styles.input, (isFocused.ref === newPasswordCheckRef && isFocused.isFocused) ? { borderBottomColor: '#3c83ff'} : { borderBottomColor: '#b4b4b4'}]} 
                                    ref={ newPasswordCheckRef } placeholder=" 새 비밀번호 확인" returnKeyType="next" secureTextEntry
                                    onFocus={ (): void => handleFocus(newPasswordCheckRef) } onBlur={ () => handleBlur(newPasswordCheckRef)}
                                    onChangeText={(pw: string): void => setNewPasswordCheck(pw)} onSubmitEditing={ Keyboard.dismiss } 
                                    />
                            </View>
                        </>
                    )}   

                    <View style={ styles.messageContainer }>
                        <Text style={ styles.message }>{ message }</Text>
                    </View>
                </View>

                <View style={ styles.modalBtnContainer}>
                    { isExpired ? (
                        <Pressable style={[ styles.modalBtn, { borderRightWidth: 0.7, borderRightColor: 'white', backgroundColor: '#3c83ff' }]} onPress={ goResetPWPage }>
                            <Text style={ styles.modalBtnText}>비밀번호 재설정</Text>
                        </Pressable>
                    ) : (
                        <Pressable style={[ styles.modalBtn, { borderRightWidth: 0.7, borderRightColor: 'white', backgroundColor: '#3c83ff' }]} onPress={ onPressChangePW }>
                            <Text style={ styles.modalBtnText}>비밀번호 변경</Text>
                        </Pressable>
                    )}

                    <Pressable style={ styles.modalBtn } onPress={ onClose }>
                        <Text style={ styles.modalBtnText }> 취소 </Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    )
}

export default ChangePasswordModal