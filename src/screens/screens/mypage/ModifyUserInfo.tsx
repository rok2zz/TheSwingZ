import { Alert, Dimensions, Keyboard, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { useEffect, useRef, useState } from "react"
import { Focus, Message } from "../../../types/screenTypes"
import { UserInfo } from "../../../slices/auth"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"

// svg
import DownArrow from "../../../assets/imgs/login/arrow_down.svg"
import UpArrow from "../../../assets/imgs/login/arrow_up.svg"
import { Payload } from "../../../types/apiTypes"
import { useAuthActions } from "../../../hooks/useAuthActions"
import Loading from "../../../components/Loading"


const locationList: string[] = ['서울', '광주', '대구', '대전', '부산', '울산', '인천', '경기', '강원도', '충청북도', '충청남도', '경상북도', '경상남도', '전라북도', '전라남도', '제주']

const ModifyUserInfo = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const myProfile = useUserInfo()
    const { modifyUserInfo } = useUsers()
    const { saveUserInfo } = useAuthActions()

    const scrollViewRef = useRef<ScrollView>(null)
	const passwordRef = useRef<TextInput>(null)
    const passwordCheckRef = useRef<TextInput>(null)

    const [isFocused, setIsFocused] = useState<Focus>({ ref: passwordRef, isFocused: false })
    const [isConnected, setIsConnected] = useState<boolean>(false) 
    const [openDropdown, setOpenDropdown] = useState<boolean>(false)
    const [location, setLocation] = useState<string>(myProfile.favoriteLocate ?? '서울')
    const [userInfo, setUserInfo] = useState<UserInfo>(myProfile)
    const [password, setPassword] = useState<string>('')
    const [passwordCheck, setPasswordCheck] = useState<string>('')
    const [isLoaded, setIsLoaded] = useState<boolean>(false)
    
    const [modifiedUserInfo, setModifiedUserInfo] = useState<UserInfo>(myProfile)
    const [message, setMessage] = useState<Message>({ type: '', msg: ''})

    useEffect(() => {
        if (openDropdown) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
            }
        }
    }, [openDropdown])


    useEffect(() => {
        saveUserInfo(modifiedUserInfo)
    }, [modifiedUserInfo])

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

    const onPressCancel = () => {
        Alert.alert(
            '알림',
            '취소하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { 
                        return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: () => { 
                       navigation.navigate('ModifyProfile')
                    },
                }
            ],
        )
    }

    const onPressSave = () => {
        if (isConnected) return

        Alert.alert(
            '알림',
            '저장하시겠습니까?',
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
                        if (password !== '') {
                            if (password === '') {
                                setMessage({ type: 'password', msg: '비밀번호를 입력해주세요.' })
                                return
                            } else if (password.search(myProfile.name) > 0) {
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
                        }

                        setIsConnected(true)
                        const payload: Payload = await modifyUserInfo(password, location)
                        setIsConnected(false)
                        if (payload.code !== 1000) {
                            return
                        }

                        setModifiedUserInfo({ ...modifiedUserInfo, favoriteLocate: location })

                        navigation.navigate('ModifyProfile')
                    },
                }
            ],
        )
    }
    
    return (
        <>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false } ref={ scrollViewRef }>
                <View style={ styles.container }>
                    <View style={ styles.rowContainer }>
                        <Text style={ styles.semiBoldText }>{ myProfile.name } 님</Text>
                        <Text style={[ styles.regularText, { textDecorationLine: 'underline', color: '#949494' }]} onPress={ () => navigation.navigate('Withdrawal') }>회원탈퇴</Text>
                    </View>

                    { myProfile.category === 'NORMAL' ? (
                        <>
                            <View style={{ marginTop: 30 }}>
                                <Text style={[ styles.boldText, { marginBottom: 18 }]}>비밀번호 변경​</Text>
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
                            <View style={ styles.blank }></View>
                        </>
                    ) : (
                        <View style={{ marginBottom: 30 }}></View>
                    )}

                    <View style={{ marginBottom: 27 }}>
                        <Text style={[ styles.boldText, { marginBottom: 18 }]}>회원가입 정보 변경</Text>
                        <View style={[ styles.rowContainer, { marginBottom: 24 }]}>
                            <Text style={[ styles.regularText, { flex: 1, color: '#949494'}]}>이름</Text>
                            <Text style={ styles.regularText }>{ myProfile.realName ?? '' }</Text>
                        </View>
                        <View style={ styles.rowContainer}>
                            <Text style={[ styles.regularText, { flex: 1, color: '#949494'}]}>이메일 주소</Text>
                            <Text style={ styles.regularText }>{ myProfile.email ?? '' }</Text>
                        </View>
                    </View>

                    <Text style={[ styles.regularText, { color: '#949494' }]}>스크린골프 주로 치는 지역​</Text>
                    <View style={ styles.dropdown }>
                        <Pressable style={[ styles.rowContainer, { borderBottomWidth: 1, borderBottomColor: '#cccccc' }]} onPress={ () => setOpenDropdown(prev => !prev)}>
                            <Text style={[ styles.regularText, { flex: 1, paddingVertical: 13, paddingHorizontal: 10 }]}>{ location }</Text>
                            { openDropdown ? <UpArrow /> : <DownArrow /> }
                        </Pressable>

                        { openDropdown && 
                            <View style={ styles.dropdownMenu }>
                                <ScrollView style={{ height: 225 }}>
                                    { locationList.map((item: string, index: number) => {
                                        const selectLocation = () => {
                                            setLocation(item),
                                            setUserInfo({ ...userInfo, favoriteLocate: location })
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
                        <Pressable style={ styles.button } onPress={ onPressCancel }>
                            <Text style={[ styles.boldText, { paddingVertical: 16 }]}>취소</Text>
                        </Pressable>
                        <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ onPressSave }>
                            <Text style={[ styles.boldText, { paddingVertical: 16, color: '#ffffff' }]}>저장</Text>
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
    container: {
        marginHorizontal: 15,
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
        flex: 1,

        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
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
    message: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginLeft: 6,
        marginBottom: 24,

        color: '#c50f0b'
    },
    blank: {
        height: 6,

        marginVertical: 30,

        backgroundColor: '#f2f2f2'
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
    },
})

export default ModifyUserInfo