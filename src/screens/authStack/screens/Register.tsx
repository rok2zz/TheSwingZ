import { RouteProp, useNavigation } from "@react-navigation/native"
import { Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { AuthStackNavigationProp, AuthStackParamList } from "../../../types/stackTypes"
import { useEffect, useRef, useState } from "react"
import { Focus, Message } from "../../../types/screenTypes"
import { User } from "../../../slices/auth"
import { Payload } from "../../../types/apiTypes"
import { useAuthInfo, useSocialId, useUsers } from "../../../hooks/useUsers"
import validate from "validate.js"

//svg
import DownArrow from "../../../assets/imgs/login/arrow_down.svg"
import UpArrow from "../../../assets/imgs/login/arrow_up.svg"
import Loading from "../../../components/Loading"
import { ServerInfo } from "../../../slices/api"
import { useServerInfo } from "../../../hooks/useApi"

interface Props {
    route: RouteProp<AuthStackParamList, 'Register'>
}

interface ChangeTextHandler {
	(value: string): void
}

const locationList: string[] = [
    '서울', '광주', '대구', '대전', '부산', '울산', '인천', '경기', '강원도', '충청북도', '충청남도', '경상북도', '경상남도', '전라북도', '전라남도', '제주'
]

const Register = ({ route }: Props): JSX.Element =>  {
    const navigation = useNavigation<AuthStackNavigationProp>()
    const agreeMarketing = route.params.isMarketingChecked
    const socialType = route.params.type
    const serverInfo: ServerInfo = useServerInfo()
    const isReviewServer = Platform.OS === 'ios' && serverInfo.authServer === 'https://xjiptnq8k7.execute-api.ap-northeast-2.amazonaws.com/review_231123/'

    const { createAccount, socialCreate, checkDuplicatedId, checkDuplicatedNickname, sendMessage } = useUsers()
    const authInfo = useAuthInfo()

    const scrollViewRef = useRef<ScrollView>(null)
    const idRef = useRef<TextInput>(null)
	const passwordRef = useRef<TextInput>(null)
    const passwordCheckRef = useRef<TextInput>(null)
    const nameRef = useRef<TextInput>(null)
    const emailRef = useRef<TextInput>(null)
    const phoneRef = useRef<TextInput>(null)
    const authNumRef = useRef<TextInput>(null)
    const nicknameRef = useRef<TextInput>(null)

    const socialId = useSocialId()
    const [user, setUser] = useState<User>({
        userID: '',
        password: '',
        passwordCheck: '',
        realName: '',
        birth: '',
        gender: '',

        name: '',
        email: '',
        nickname: '',
        phone: '',
        authcode: '',
        location: '서울',
        alarm: agreeMarketing
    })
    const [authCode, setAuthCode] = useState<string>('')
    const [min, setMin] = useState<number>(0)
    const [sec, setSec] = useState<number>(0)
    const [timer, setTimer] = useState<boolean>(false)

    const [isFocused, setIsFocused] = useState<Focus>({ ref: idRef, isFocused: false })
    const [isConnected, setIsConnected] = useState<boolean>(false)    
    const [idDuplicated, setIdDuplicated] = useState<boolean>(true)
    const [nicknameDuplicated,setNicknameDuplicated] = useState<boolean>(true)

    const [openDropdown, setOpenDropdown] = useState<boolean>(false)    
    const [message, setMessage] = useState<Message>({ type: '', msg: ''})

    useEffect(() => {
        setIsConnected(false)
        if (authInfo.name !== '') {
            setUser({ 
                ...user, 
                realName: authInfo.name,
                phone: authInfo.phone,
                birth: authInfo.birth,
                gender: authInfo.gender 
            })
        }
    }, [authInfo])

    useEffect(() => {
        if (openDropdown) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
            }
        }
    }, [openDropdown])


   // 인증 요청시 타이머 세팅
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

    // 타이머 실행시 메시지 업데이트
    useEffect(() => {
        if (timer) {
            setMessage({ type: 'phone', msg: '휴대폰으로 전송된 인증번호를 입력해주세요.' })
        }       
    }, [timer])

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

    // 입력할때마다 user의 정보 업데이트
    const createChangeTextHadler = (text: string): ChangeTextHandler => (value: string): void => {
        if (text === 'nickname') {
            setNicknameDuplicated(true)
        } else if (text === 'userID') {
            setIdDuplicated(true)
        }
        
        setMessage({ type: '', msg: '' })
        setUser({ ...user, [text]: value })
    }

    // id duplicate check
    const idDuplicateCheck = async () => {
        if (isConnected) return 
        if (user.userID === "" && socialType === 'normal') {
            setMessage({ type: 'id', msg: '아이디를 입력해주세요.' })
            return
        } else if (user.userID.search(/\s/) > 0 || !/^[a-z0-9]{5,20}$/.test(user.userID) && socialType === 'normal') {
            setMessage({ type: 'id', msg: '올바른 아이디 형식이 아닙니다' })
            return 
        } 

        setIsConnected(true)
        const payload: Payload = await checkDuplicatedId(user.userID)
        setIsConnected(false)

        if (payload.code !== 1000) {
            setMessage({ type: 'id', msg: '이미 사용중인 아이디입니다.' })
            return
        }   

        setIdDuplicated(false)
        setMessage({ type: 'id', msg: '사용할 수 있는 아이디입니다.' })
    }

    // nickname duplicate check
    const nicknameDuplicateCheck = async () => {
        if (isConnected) return 

        const constraints = {
            nickname: {
                presence: true,
                format: {
                    pattern: /^[가-힣a-zA-Z0-9]{2,10}$/,
                },
            }
        }
        
        const isValidNickname = (nickname: string) => {
            const result = validate({ nickname: nickname }, constraints)

            if (result === undefined) {
                return true
            }

            return false
        }

        if (user.nickname === '') {
            setMessage({ type: 'nickname', msg: '닉네임을 입력해주세요.' })
            return
        } else if (user.nickname.search(/\s/) > 0 || !isValidNickname(user.nickname)){
            setMessage({ type: 'nickname', msg: '올바른 닉네임 형식이 아닙니다' })
            return 
        } 

        setIsConnected(true)
        const payload: Payload = await checkDuplicatedNickname(user.nickname)
        setIsConnected(false)
        if (payload.code !== 1000) {
            if (payload.code === -3002) {
                setMessage({ type: 'nickname', msg: payload.msg ?? '올바르지 않은 닉네임 입니다.' })
                return
            } else if (payload.code === -3003) {
                setMessage({ type: 'nickname', msg: payload.msg ?? '이미 사용중인 닉네임입니다.' })
                return
            }
            setMessage({ type: 'nickname', msg: payload.msg ?? '서버에 연결할 수 없습니다.' })
            return
        }   

        setNicknameDuplicated(false)
        setMessage({ type: 'nickname', msg: '사용할 수 있는 닉네임입니다.' })
    }

    // 회원가입 메소드 호출
    const onPressRegister = (): void => {
        if (isConnected) return

        if (socialType === 'normal') {
            const constraints = {
                name: {
                    presence: true,
                    format: {
                        pattern: /^[가-힣a-zA-Z]{2,20}$/
                    },
                }
            }
            
            const isValidName = (name: string) => {
                const result = validate({ name }, constraints)

                if (result === undefined) {
                    return true
                }

                return false
            }
            if (idDuplicated) {
                setMessage({ type: 'id', msg: '아이디 중복확인을 해주세요.' })
                return 
            } else if (user.password === "") {
                setMessage({ type: 'password', msg: '비밀번호를 입력해주세요.' })
                return
            } else if (user.password.search(user.userID) > 0) {
                setMessage({ type: 'password', msg: '아이디와 다른 비밀번호를 입력해주세요.' })
                return
            } else if (user.password.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(user.password)) {
                setMessage({ type: 'password', msg: '비밀번호는 8~16자의 영문, 숫자, 특수문자만 입력 가능하며,반드시 영문과 숫자를 포함하여야 합니다.' })
                return 
            } else if (user.passwordCheck === "") {
                setMessage({ type: 'passwordCheck', msg: '비밀번호 확인 정보를 입력해주세요.' })
                return
            } else if (user.passwordCheck.search(/\s/) > 0 || !/^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W)).{8,16}$/.test(user.passwordCheck)) {
                setMessage({ type: 'passwordCheck', msg: '비밀번호는 8~16자의 영문, 숫자, 특수문자만 입력 가능하며,반드시 영문과 숫자를 포함하여야 합니다.' })
                return 
            } else if (user.password !== user.passwordCheck) {
                setMessage({ type: 'passwordCheck', msg: '비밀번호, 비밀번호 확인이 일치하지 않습니다' })
                return
            } else if (user.realName === '') {
                setMessage({ type: 'name', msg: '이름을 입력해주세요.' })
                return
            } else if (user.realName.search(/\s/) > 0 || !isValidName(user.realName)){
                setMessage({ type: 'name', msg: '올바른 이름 형식이 아닙니다' })
                return 
            } else if (user.email === ''){
                setMessage({ type: 'email', msg: '이메일을 입력해주세요.' })
                return 
            } else if (user.email.search(/\s/) > 0 || !/^[a-zA-Z0-9._%+-]{1,20}@[a-zA-Z0-9.-]{1,15}\.[a-zA-Z]{2,10}$/.test(user.email)){
                setMessage({ type: 'email', msg: '올바른 이메일 형식이 아닙니다' })
                return 
            }
        } else { 
            if (authCode === '')  {
                setMessage({ type: 'auth', msg: '인증번호를 입력해주세요.' })
                return 
            } else if (authCode.search(/\s/) > 0 || authCode.length !== 6) {
                setMessage({ type: 'auth', msg: '유효하지 않은 인증번호입니다.' })
                return
            } 
        }
        
        if (nicknameDuplicated) {
            setMessage({ type: 'nickname', msg: '닉네임 중복확인을 해주세요.' })
            return 
        }

        setMessage({ type: '', msg: ''})
        Alert.alert(
            '알림',
            '가입하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { 
                        return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async (): Promise<void> => { 
                        setIsConnected(true)

                        if (socialType === 'normal') {
                            const payload: Payload = await createAccount(user) 
                            if (payload.code !== 1000) {
                                if (payload.code === -3002 || payload.code === -3003){
                                    setMessage({ type: 'nickname', msg: payload.msg ?? '서버에 연결할 수 없습니다.' })
                                    setIsConnected(false)
                                    return
                                } else if (payload.code === -3001) {
                                    Alert.alert('알림', '이미 회원가입된 사용자입니다.')
                                    setIsConnected(false)
                                    return
                                }
                                setMessage({ type: 'userID', msg: payload.msg ?? '서버에 연결할 수 없습니다.' })  
                                setIsConnected(false)
                                return
                            }
                        } else {

                            const payload: Payload = await socialCreate(socialId, socialType, isReviewServer ? 'name' : user.realName, isReviewServer ? 'email@apple.com' :  user.email, user.phone, user.nickname, user.location, authCode) 
                            if (payload.code !== 1000) {
                                if (payload.code === -3002 || payload.code === -3003){
                                    setMessage({ type: 'nickname', msg: payload.msg ?? '서버에 연결할 수 없습니다.' })
                                    setIsConnected(false)
                                    return
                                } else if (payload.code === -3012) {
                                    setMessage({ type: 'auth', msg: payload.msg ?? '서버에 연결할 수 없습니다.' })
                                    setIsConnected(false)

                                    return
                                } else if (payload.code === -3001) {
                                    Alert.alert('알림', '이미 회원가입된 사용자입니다.')
                                    setIsConnected(false)
                                    return
                                }
                                setMessage({ type: 'nickname', msg: payload.msg ?? '서버에 연결할 수 없습니다.' })
                                setIsConnected(false)
                                return
                            }
                        }

                        Alert.alert('알림', '가입되었습니다.',[
                            {
                                text: '확인',
                                onPress: () => { 
                                    setIsConnected(false)
                                    navigation.navigate('ResultRegister', { nickname : user.nickname, type: socialType }) 
                                }
                            }
                        ])
                    },
                }
            ],
        )
    }

    // 뒤로가기 (로그인 페이지로 이동)
    const goLoginPage = (): void => {
        Alert.alert(
            '알림',
            '정말 취소하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async (): Promise<void> => { 
                        navigation.popToTop()
                    },
                }
            ],
        )
    }

    const onPressSendMessage = async () => {
        if (isConnected) return
        if (user.phone === '') {
            setMessage({ type: 'phone', msg: '휴대전화번호를 입력해주세요.' })
            return
        } else if (user.phone.search(/\s/) > 0 || !/^(010)[0-9]{4}[0-9]{4}$/.test(user.phone)) {
            setMessage({ type: 'phone', msg: '유효하지 않은 휴대전화번호입니다.' })
            return 
        }

       
        setIsConnected(true)
        const payload: Payload = await sendMessage(user.phone, 1)
        setTimer(true)
        setMin(3)
        setSec(0)
        setIsConnected(false)

        if (payload.code !== 1000 ) {
            setMessage({ type: 'phone', msg: payload.msg ?? '서버와 연결할 수 없습니다.'})
            setTimer(false)
            return
        }
    }

    return (
        <KeyboardAvoidingView style={ styles.wrapper } behavior='height' keyboardVerticalOffset={ 80 }>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <View style={ styles.bar }>
                <View style={ styles.gauge }></View>
            </View>
            <ScrollView showsVerticalScrollIndicator={ false } ref={ scrollViewRef }>
                <View style={ styles.container }>
                    <View style={ styles.rowContainer }>
                        <Text style={[ styles.boldText, { fontSize: 13, color: '#fd780f' }]}>2</Text>
                        <Text style={[ styles.regularText, { fontSize: 13 }]}> / 3</Text>
                    </View>

                    <Text style={ styles.semiBoldText }>정보입력</Text>

                    { socialType === 'normal' &&
                        <View style={{ marginBottom: 30 }}>
                            <Text style={[ styles.boldText, { marginBottom: 15 }]}>계정 정보 입력</Text>

                            <View style={ styles.rowContainer }>
                                <TextInput style={[ styles.input, isFocused.ref === idRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'}]} 
                                    placeholder="아이디 입력" placeholderTextColor="#aaaaaa" ref={ idRef } returnKeyType="next" autoCapitalize='none' 
                                    onFocus={ () =>  handleFocus(idRef) } onBlur={ () => handleBlur(idRef) }
                                    onChangeText={ createChangeTextHadler('userID') } onSubmitEditing={ () => passwordRef.current && passwordRef.current.focus() }/>
                                <Pressable style={ styles.checkBtn } onPress={ idDuplicateCheck }>
                                    <Text style={[ styles.regularText, { fontSize: 15, color: '#ffffff'}]}>중복 확인</Text>
                                </Pressable>
                            </View>
                            { message.type === 'id' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={{ marginBottom: 24 }}></View> }
                            
                            <View style={ styles.rowContainer }>
                                <TextInput style={[ styles.input, isFocused.ref === passwordRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                                    placeholder="비밀번호 입력" placeholderTextColor="#aaaaaa" ref={ passwordRef } returnKeyType="next" autoCapitalize='none' secureTextEntry  
                                    onFocus={ () => handleFocus(passwordRef) } onBlur={ () => handleBlur(passwordRef)} textContentType="oneTimeCode"
                                    onChangeText={ createChangeTextHadler('password') } onSubmitEditing={ () => passwordCheckRef.current && passwordCheckRef.current.focus() } />
                            </View>
                            { message.type === 'password' ? <Text style={[ styles.message, { marginBottom: 9 }]}>{ message.msg }</Text> : <View style={{ marginBottom: 9 }}></View> }

                            <View style={ styles.rowContainer }>
                                <TextInput style={[ styles.input, isFocused.ref === passwordCheckRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                                    placeholder="비밀번호 확인 입력​" placeholderTextColor="#aaaaaa" ref={ passwordCheckRef } returnKeyType="next" autoCapitalize='none' secureTextEntry  
                                    onFocus={ () => handleFocus(passwordCheckRef) } onBlur={ () => handleBlur(passwordCheckRef)} textContentType="oneTimeCode"
                                    onChangeText={ createChangeTextHadler('passwordCheck') } onSubmitEditing={ () => nameRef.current && nameRef.current.focus() } />
                            </View>
                            { message.type === 'passwordCheck' ? <Text style={ styles.message }>{ message.msg }</Text> : <></> }

                        </View>
                    }

                    <View style={{ marginBottom: 27 }}>
                        <Text style={[ styles.boldText, { marginBottom: 15 }]}>회원가입 정보 입력​</Text>

                        { !isReviewServer &&
                            <>
                                { (user.realName !== '' && socialType === 'normal') ? 
                                    <Text style={[ styles.regularText, { marginLeft: 10, marginVertical: 24 } ]}>{ user.realName }</Text> 
                                    :
                                    (
                                    <>
                                        <View style={ styles.rowContainer }>
                                            <TextInput style={[ styles.input, isFocused.ref === nameRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                                                placeholder="이름 입력​" placeholderTextColor="#aaaaaa" ref={ nameRef } returnKeyType="next" autoCapitalize='none' 
                                                onFocus={ () => handleFocus(nameRef) } onBlur={ () => handleBlur(nameRef)}
                                                onChangeText={ createChangeTextHadler('realName') } onSubmitEditing={ () => {
                                                    emailRef.current && emailRef.current.focus() 
                                                }} />
                                        </View>
                                        { message.type === 'name' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={{ marginBottom: 24 }}></View> }
                                    </>
                                )}
                                
                                <View style={ styles.rowContainer }>
                                    <TextInput style={[ styles.input, isFocused.ref === emailRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                                        placeholder="이메일 입력​" placeholderTextColor="#aaaaaa" ref={ emailRef } returnKeyType="next" autoCapitalize='none' 
                                        onFocus={ () => handleFocus(emailRef) } onBlur={ () => handleBlur(emailRef)}
                                        onChangeText={ createChangeTextHadler('email') } onSubmitEditing={ () => {
                                            phoneRef.current && phoneRef.current.focus() 
                                        }} />
                                </View>
                                { message.type === 'email' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={ socialType !== 'normal' && { marginBottom: 24 }}></View> }
                            </>
                        }

                        { (user.phone !== '' && socialType === 'normal') ? (
                            <Text style={[ styles.regularText, { marginLeft: 10, marginVertical: 24 } ]}>{ user.phone }</Text> 
                            ) : (
                            <>
                                <View style={ styles.rowContainer }>
                                    <TextInput style={[ styles.input, (isFocused.ref === phoneRef && isFocused.isFocused) ? { borderBottomColor: '#cccccc'} : { borderBottomColor: '#cccccc'}]}                             
                                        ref={ phoneRef } placeholder=" - 를 제외한 휴대전화번호 입력"  placeholderTextColor="#aaaaaa" returnKeyType="next" autoCapitalize='none'
                                        onChangeText={ createChangeTextHadler('phone') } keyboardType="decimal-pad"
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

                                { message.type === 'phone' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={{ marginBottom: 24 }}></View> }

                                <View style={ styles.rowContainer }>
                                    <TextInput style={[ styles.input, (isFocused.ref === authNumRef && isFocused.isFocused) ? { borderBottomColor: '#cccccc'} : { borderBottomColor: '#cccccc'}]} 
                                        ref={ authNumRef } placeholder=" 인증번호 입력" placeholderTextColor="#aaaaaa" returnKeyType="done" autoCapitalize='none' 
                                        onChangeText={(code: string): void => setAuthCode(code)} keyboardType="decimal-pad"
                                        onFocus={ () => handleFocus(authNumRef) } onBlur={ () => handleBlur(authNumRef)}
                                        onSubmitEditing={ Keyboard.dismiss } 
                                    />

                                    { timer ? <Text style={ styles.timer }>{ min } : { sec }</Text> : <></> }
                                </View>

                                { message.type === 'auth' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={{ marginBottom: 24 }}></View> }
                            </> 
                        )}

                        <View style={ styles.rowContainer }>
                            <TextInput style={[ styles.input, isFocused.ref === nicknameRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                                placeholder="닉네임 설정​​" placeholderTextColor="#aaaaaa" ref={ phoneRef } returnKeyType="done" autoCapitalize='none' 
                                onFocus={ () => {  }} onBlur={ () => handleBlur(nicknameRef)}
                                onChangeText={ createChangeTextHadler('nickname') } />
                            <Pressable style={ styles.checkBtn } onPress={ nicknameDuplicateCheck }>
                                <Text style={[ styles.regularText, { fontSize: 15, color: '#ffffff'}]}>중복 확인</Text>
                            </Pressable>
                        </View>
                        { message.type === 'nickname' ? <Text style={[ styles.message, { marginBottom: 0 }]}>{ message.msg }</Text> : <></> }
                    </View>

                    <Text style={[ styles.regularText, { color: '#949494' }]}>스크린골프 주로 치는 지역​</Text>
                    <View style={ styles.dropdown }>
                        <Pressable style={[ styles.rowContainer, { borderBottomWidth: 1, borderBottomColor: '#cccccc' }]} onPress={ () => setOpenDropdown(prev => !prev)}>
                            <Text style={[ styles.regularText, { flex: 1, paddingVertical: 13, paddingHorizontal: 10 }]}>{ user.location }</Text>
                            { openDropdown ? <UpArrow /> : <DownArrow /> }
                        </Pressable>

                        { openDropdown && 
                            <View style={ styles.dropdownMenu }>
                                <ScrollView style={{ height: 225 }}>
                                    { locationList.map((item: string, index: number) => {
                                        const selectLocation = () => {
                                            setUser({ ...user, location: item })
                                            setOpenDropdown(false)
                                        }

                                        return (
                                            <Pressable key={ index } onPress={ selectLocation }>
                                                <Text style={[ styles.regularText, { paddingVertical: 13, paddingHorizontal: 10 }]}>{ item }</Text>
                                            </Pressable>
                                        )
                                    })}
                                </ScrollView>    
                            </View>
                        }                    
                    </View>

                    <View style={ styles.btnContainer }>
                        <Pressable style={ styles.button } onPress={ goLoginPage }>
                            <Text style={[ styles.boldText, { paddingVertical: 16 }]}>취소</Text>
                        </Pressable>
                        <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ onPressRegister }>
                            <Text style={[ styles.boldText, { paddingVertical: 16, color: '#ffffff' }]}>다음</Text>
                        </Pressable>
                    </View>
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
    bar: {
        height: 2,

        backgroundColor: '#cccccc'
    },
    gauge: {
        width: Dimensions.get('window').width,
        height: 2,

        backgroundColor: '#fd780f'
    },
    container: {
        paddingVertical: 30,
        marginHorizontal: 15
    },
    rowContainer: {
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
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
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
    checkBtn: {
        position: 'absolute',
        right: 0,

        padding: 6,

        borderRadius: 3,

        backgroundColor: '#121619'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 60,
        marginBottom: 40
    },
    button: {
        alignItems: 'center',

        width: (Dimensions.get('window').width - 36) / 2,

        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    message: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginLeft: 6,

        color: '#c50f0b'
    },
    dropdown: {
        marginTop: 9
    },
    dropdownMenu: {
        marginTop: 5,

        backgroundColor: '#ffffff',

        ...Platform.select({
            ios: {
                shadowColor: '#121619',
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 5,
            }
        })
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
})

export default Register