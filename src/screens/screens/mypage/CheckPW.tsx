import { useEffect, useRef, useState } from "react"
import { Dimensions, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { Payload } from "../../../types/apiTypes"

//svg
import Eraser from "../../../assets/imgs/login/eraser.svg"
import Loading from "../../../components/Loading"


const CheckPW = (): JSX.Element => {
    const { checkPW } = useUsers()
    const navigation = useNavigation<RootStackNavigationProp>()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [message, setMessage] = useState<string>('')
	const passwordRef = useRef<TextInput>(null)

    // clear pw text
    const clearPwTextInput = () => {
        if (passwordRef.current) {
            passwordRef.current.setNativeProps({ text: '' })
            setPassword('')
        }
    }

    const onpressCheckPW = async (): Promise<void> => {
        if (isConnected) return

        if (password === '') {
            setMessage('비밀번호를 입력하여 주세요.')
            return
        } 

        setMessage('')
        setIsConnected(true)

        const payload: Payload = await checkPW(password)

        // 실패시 오류메시지 가져와서 보여줌
        if (payload.code !== 1000) { 
            setMessage(payload.msg ?? '오류가 발생했습니다.')
            setIsConnected(false)
            return
        }

        setIsConnected(false)
        navigation.push('ModifyUserInfo')
    }
    
    return (
        <KeyboardAvoidingView style={ styles.wrapper }>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }

            <View style={ styles.container }>
                <Text style={ styles.text }>회원님의 정보를 보호하기 위해​</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[ styles.text, { fontFamily: 'Pretendard-SemiBold' }]}>비밀번호를 다시 입력</Text>
                    <Text style={ styles.text }>합니다.</Text>
                </View>
                
                <View style={ styles.inputContainer }>
                    <TextInput style={[ styles.input, isFocused ? { borderBottomColor: '#121619'} : { borderBottomColor: '#cccccc' }]} secureTextEntry
                        placeholder="비밀번호 입력" placeholderTextColor="#aaaaaa" ref={ passwordRef } returnKeyType="done" autoCapitalize='none' onFocus={ () => setIsFocused(true) } onBlur={ () => setIsFocused(false)}
                        onChangeText={(pw: string): void => setPassword(pw)} onSubmitEditing={ () => {} } />
                    <Eraser style={ styles.eraser } onPress={ clearPwTextInput } />
                </View>

                <Text style={ styles.message }>{ message }</Text>

            </View>

            <View style={ styles.btnContainer }>
                <Pressable style={({ pressed }) => [ styles.btn, { marginRight: 9 }, Platform.OS === 'ios' && pressed && { opacity: 0.5 }]} onPress={ () => navigation.goBack() } 
                    android_ripple={{ color: '#b4b4b4' }}>
                    <Text style={[ styles.btnText, { color: '#121619' }]}>취소</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [ styles.btn, { borderWidth: 0 }, password !== '' ? { backgroundColor: '#fd780f' } : { backgroundColor: '#cccccc'}, Platform.OS === 'ios' && pressed && { opacity: 0.5 } ]}  
                    android_ripple={{ color: '#b4b4b4' }} onPress={ onpressCheckPW }>
                    <Text style={[ styles.btnText, password !== '' ? { color: '#ffffff' } : { color: '#666666' }]}>다음</Text>
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
        flex: 1,

        marginTop: 20,
        marginHorizontal: 15
    },
    text: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginTop: 30
    },
    input: {
        flex: 1,
        height: 45,

        paddingHorizontal: 5,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        borderBottomWidth: 1,

        color: '#121619'
    },
    eraser: {
        position: 'absolute',
        right: 0,

        zIndex: 1
    },
    btnContainer: {
        flexDirection: 'row',

        marginHorizontal: 15,
        marginBottom: 36
    },
    btn: {
        width: (Dimensions.get('window').width - 39) / 2,

        paddingVertical: 15,

        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#cccccc'
    },
    btnText: {
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',
    },
    message: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginLeft: 8,

        color: '#fd780f'
    }
})

export default CheckPW