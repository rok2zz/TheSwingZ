import { useEffect, useRef, useState } from "react"
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"

// svg
import Check from "../../../assets/imgs/my/check.svg"
import GrayCheck from "../../../assets/imgs/my/check_gray.svg"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { Payload } from "../../../types/apiTypes"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { clearUserInfo } from "../../../slices/auth"


const reasons: string[] = ['기록 삭제 목적', '부족한 혜택', '낮은 사용 빈도, 다른 브랜드 이용', '많은 광고 메시지', '앱의 이용이 불편', '기타']

const Withdrawal = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { deleteAccount } = useUsers()
    const myProfile = useUserInfo()

    const scrollViewRef = useRef<ScrollView>(null)

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [memo, setMemo] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [agree, setAgree] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        setMemo('')

        if (selectedIndex === 5) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollToEnd({ animated: true })
            }
        }
    }, [selectedIndex])

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
                       navigation.goBack()
                    },
                }
            ],
        )
    }

    const onPressWithdraw = () => {
        if (isConnected || !agree || selectedIndex < 0) return
        Alert.alert(
            '알림',
            '정말 탈퇴하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { 
                        return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async () => { 
                        const etc = memo === '' ? '기타' : memo
                        const reason = selectedIndex === 5 ? etc : reasons[selectedIndex]
                        setIsConnected(true)
                        const payload: Payload = await deleteAccount(reason, password)
                        setIsConnected(false)
                        if (payload.code !== 1000) {
                            // wrong password
                            setMessage(payload.msg ?? '오류가 발생했습니다.')
                            return
                        }

                        Alert.alert(
                            '알림',
                            '탈퇴되었습니다.',
                            [
                                {
                                    text: '확인', 
                                    onPress: () => { 
                                    }
                                }
                            ]
                        )
                    },
                }
            ],
        )
    }

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false } ref={ scrollViewRef }>
            <View style={ styles.container }>
                <Text style={[ styles.regularText, { fontSize: 24, marginBottom: 30 }]}>신중한 결정 하셨을까요?​</Text>

                <Text style={ styles.boldText }>탈퇴 주의 사항​</Text>

                <View style={ styles.infoContainer }>
                    <View style={ styles.rowContainer }>
                        <View style={ styles.dot }></View>
                        <Text style={[ styles.boldText, { fontSize: 16, color: '#d61111' }]}>모든 정보가 삭제</Text>
                        <Text style={ styles.regularText }>됩니다.</Text>
                    </View>
                    <View style={ styles.rowContainer }>
                        <View style={ styles.dot }></View>
                        <Text style={[ styles.boldText, { fontSize: 16, color: '#d61111' }]}>데이터는 복구가 불가능</Text>
                        <Text style={ styles.regularText }>합니다.</Text>
                    </View>
                    <View style={[ styles.rowContainer, { marginBottom: 0 }]}>
                        <View style={ styles.dot }></View>
                        <Text style={[ styles.boldText, { fontSize: 16, color: '#d61111' }]}>사용중이던 아이디는 영구적으로 사용이 중지되며,</Text>
                    </View>
                    <Text style={[ styles.boldText, { fontSize: 16, marginLeft: 8, color: '#d61111' }]}>해당 아이디로 다시 가입하실 수 없습니다.</Text>
                </View>

                <Text style={ styles.boldText }>탈퇴 사유 선택​</Text>

                <View style={ styles.reasonContainer }>
                    { reasons.map((item: string, index: number) => {
                        return (
                            <Pressable style={[ styles.reason, selectedIndex === index && { borderWidth: 0, backgroundColor: '#fd780f' }]} key={ index } onPress={ () => setSelectedIndex(index) }>
                                <Text style={[ styles.boldText, { flex: 1, fontSize: 16 }, selectedIndex === index && { color: '#ffffff' }]}>{ item }</Text>
                                { selectedIndex === index && <Check /> }
                            </Pressable>
                        )
                    })}

                    { selectedIndex === 5 && 
                        <>                            
                            <TextInput style={[ styles.reason, styles.regularText, { height: 110 }]} placeholder="기타 사유를 입력해 주세요." placeholderTextColor='#aaaaaa' multiline={ true }
                                maxLength={ 150 } onChangeText={ (text: string) => setMemo(text) } numberOfLines={ 5 }
                            />
                            <Text style={[ styles.regularText, { textAlign: 'right', width: '100%', fontSize: 13, color: '#aaaaaa' }]}>{ memo.length } / 150</Text>
                        </>
                    }
                </View>
                
                <View style={[ styles.infoContainer, { marginBottom: 30 }]}>
                    <Pressable style={[ styles.rowContainer, { marginBottom: 0 }]} onPress={ () => setAgree(prev => !prev)}>
                        <View style={[ styles.circle, agree && { borderWidth: 0, backgroundColor: '#fd780f' }]}>
                            { agree ? <Check /> : <GrayCheck /> }
                        </View>
                        <Text style={[ styles.regularText, { flex: 1 }]}>안내사항을 모두 확인하였으며, 모든 내용에 동의합니다.​</Text>
                    </Pressable>
                </View>

                <TextInput style={[ styles.input, isFocus ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#cccccc'} ]} 
                    placeholder="비밀번호 입력" placeholderTextColor="#aaaaaa" returnKeyType="next" autoCapitalize='none' secureTextEntry  
                    onFocus={ () => setIsFocus(true) } onBlur={ () => setIsFocus(false) } textContentType="oneTimeCode"
                    onChangeText={ (pw: string) => setPassword(pw) } />

                <Text style={[ styles.regularText, { fontSize: 14, marginTop: 5, marginLeft: 3, color: 'red' }]}>{ message }</Text>

                <View style={ styles.btnContainer }>
                    <Pressable style={ styles.button } onPress={ onPressCancel }>
                        <Text style={ styles.boldText }>취소</Text>
                    </Pressable>
                    <Pressable style={[ styles.button, { borderWidth: 0 }, (agree && selectedIndex >= 0 ) ? { backgroundColor: '#fd780f' } : { backgroundColor: '#f1f3f8' }]} 
                        onPress={ onPressWithdraw }>
                        <Text style={[ styles.boldText, (agree && selectedIndex >= 0 ) && { color: '#ffffff' }]}>탈퇴</Text>
                    </Pressable>
                </View>
            </View>
            
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        marginHorizontal: 15,
        marginTop: 24
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    infoContainer: {
        marginTop: 18,
        marginBottom: 48,
        paddingHorizontal: 14,
        paddingVertical: 24,

        borderRadius: 3,
        backgroundColor: '#f3f3f3'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 9
    },
    dot: {
        width: 3,
        height: 3,

        marginRight: 5,

        borderRadius: 50,
        backgroundColor: '#d61111'
    },
    reasonContainer: {
        marginTop: 18,
        marginBottom: 30
    },
    reason: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 15,
        paddingVertical: 13,
        marginBottom: 9,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#cccccc'
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
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 48,
        marginBottom: 36
    },
    button: {
        alignItems: 'center',

        width: (Dimensions.get('window').width - 36) / 2,

        paddingVertical: 15,

        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#cccccc'
    }
})

export default Withdrawal