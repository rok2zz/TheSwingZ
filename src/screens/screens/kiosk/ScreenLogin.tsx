import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Image, Keyboard, Linking, PermissionStatus, PermissionsAndroid, Platform, Pressable, StyleSheet, Text, TextInput, Vibration, View } from "react-native";
import { RootStackNavigationProp } from "../../../types/stackTypes";
import { useNavigation } from "@react-navigation/native";
import { Payload } from "../../../types/apiTypes";
import { useUsers } from "../../../hooks/useUsers";
import { Camera, CameraType } from "react-native-camera-kit";
import Svg, { Path } from "react-native-svg";
import { PERMISSIONS, RESULTS, check, request, requestMultiple } from "react-native-permissions";

const ScreenLogin = () => {
	const navigation = useNavigation<RootStackNavigationProp>()
	const [scannable, setScannable] = useState<boolean>(false)
	const { screenLogin } = useUsers()
	const cameraRef = useRef(null)
    const codeInputRefs = useRef<Array<TextInput | null>>(Array(5).fill(null))

    const [code, setCode] = useState<string[]>(Array(5).fill(''))
    const [isFilled, setIsFilled] = useState<boolean[]>(Array(5).fill(false))
    const [qrMode, setQrMode] = useState<boolean>(true)
    const [isGranted, setIsGranted] = useState<boolean>(false)
    const frame = useState(new Animated.Value(0))[0]

    const dimensionWidth = Dimensions.get('window').width

    useEffect(() => {
        if (Platform.OS === 'ios') {
			requestMultiple([PERMISSIONS.IOS.CAMERA]).then((statuses) => {
                if (statuses[PERMISSIONS.IOS.CAMERA] !== "granted") {
                    requestCameraPermission()
                    return
                }
                setIsGranted(true)
			})
		} else if (Platform.OS === 'android') {
			requestMultiple([PERMISSIONS.ANDROID.CAMERA]).then((statuses) => {
                if (statuses[PERMISSIONS.ANDROID.CAMERA] !== "granted") {
                    requestCameraPermission()
                    return
                }

                setIsGranted(true)
			})
		}

        setScannable(true)

        // 페이지 입장시 password 초기화
        setCode(Array(5).fill(''))
    }, [])
  
    // 다섯자리 다 입력시 authpassword에 저장 및 인증
    useEffect(() => {
        if (code.every(value => value !== '')) {
            const authPassword = code.join('')

            verifyCode(authPassword)
        }
    }, [code])

    useEffect(() => {
        Animated.timing(frame, {
            toValue: qrMode ? 0 : 1,
            duration: 500,
            useNativeDriver: false
        }).start()
    }, [qrMode])

    const requestCameraPermission = async () => {
        if (Platform.OS === 'ios') {
            const result = await check(PERMISSIONS.IOS.CAMERA)
            if (result !== RESULTS.GRANTED) {
                const requestResult = await request(PERMISSIONS.IOS.CAMERA)
                if (requestResult !== RESULTS.GRANTED) {
                    Alert.alert(
                        '카메라 권한 필요',
                        'QR코드 스캔을 위해서는 카메라 권한이 필요합니다.',
                        [   
                            {
                                text: '취소',
                                onPress: () => { return },
                                style: 'cancel',
                            },
                            {
                                text: '확인',
                                onPress: () => Linking.openSettings(),                     
                            },
                        ]
                    )
                } else if(requestResult === RESULTS.GRANTED) {
                    setIsGranted(true)
                }
            } else if(result === RESULTS.GRANTED) {
                setIsGranted(true)
            }
        } else if (Platform.OS === 'android') {
            const result = await check(PERMISSIONS.ANDROID.CAMERA)

            if (result !== RESULTS.GRANTED) {
                const requestResult = await request(PERMISSIONS.ANDROID.CAMERA)
                if (requestResult !== RESULTS.GRANTED) {
                    Alert.alert(
                        '카메라 권한 필요',
                        'QR코드 스캔을 위해서는 카메라 권한이 필요합니다.',
                        [   
                            {
                                text: '취소',
                                onPress: () => { return },
                                style: 'cancel',
                            },
                            {
                                text: '확인',
                                onPress: () => Linking.openSettings(),                     
                            },
                        ]
                    )
                } else if(requestResult === RESULTS.GRANTED) {
                    setIsGranted(true)
                }
                setIsGranted(true)
            } else if(result === RESULTS.GRANTED) {
                setIsGranted(true)
            }
        }
    }
    
    // 로그인 코드 인증
    const verifyCode = async (code: string): Promise<void> => {
        if (code.length !== 5) {
            return
        }

        const authCode: number = Number(code)
        const payload: Payload = await screenLogin(1, authCode)

        // 실패시 입력코드 초기화
        if (payload.code !== 1000) {
            setCode(Array(5).fill(''))
            setIsFilled(Array(5).fill(false))
            codeInputRefs.current[0]?.focus()
            Alert.alert('알림', '유효하지 않은 인증번호입니다.')
            
            return
        }

        // 완료
        Alert.alert('알림', '로그인되었습니다.')
        navigation.push('ResultScreenLogin')
    }


	// 인증 메소드
	const onReadCode = async (event: any): Promise<void> => {
		if (!scannable || !isGranted) return

		if (event.nativeEvent.codeStringValue) {
            try {
                Vibration.vibrate()
                setScannable(false)
    
                const code = event.nativeEvent.codeStringValue
                if (code === '') {
                    setScannable(true)
                    return
                }
                
                const payload: Payload = await screenLogin(0, code)
                // 실패
                if (payload.code !== 1000) {
                    Alert.alert(
                        '알림', 
                        '유효하지 않은 QR코드입니다.',
                        [
                            {
                                text: '확인', 
                                onPress: ()=> { 
                                    setScannable(true)
                                    return
                                },
                            }
                        ]
                    )
                    return
                }

                Alert.alert('알림', '로그인되었습니다.')
                // 완료
                navigation.navigate('ResultScreenLogin')
            } catch (e) {
                Alert.alert('알림', '유효하지 않은 QR코드입니다.')
            }
		}
	}

    const onPressBackground = () => {
        setQrMode(true)
        Keyboard.dismiss()
    } 

	return (
        <Pressable style={ styles.container } onPress={ onPressBackground }>
            { isGranted ? (
                <View style={[ styles.container, { width: '100%' }]}>
                    <Camera
                        style={ styles.scanner }
                        ref={ cameraRef }
                        cameraType={ CameraType.Back } // Front/Back(default)
                        scanBarcode={ true }
                        showFrame={ false }
                        laserColor='rgba(0, 0, 0, 0)'
                        frameColor='white'
                        onReadCode={ onReadCode }
                    />

                    <View style={ styles.qrBorder }>
                        <Animated.View style={[ styles.frame, {
                            width: frame.interpolate({
                                inputRange: [0, 1],
                                outputRange: [dimensionWidth - 80 , dimensionWidth - 200]
                            })}]}>
                            <Svg  style={ styles.svg }> 
                                <Path  // lt
                                    d="M33,3h-30V30"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth={ 6 }
                                    strokeLinecap="round" 
                                />
                            </Svg>
                        
                            <Svg  style={[ styles.svg ]}>
                                <Path  // rt
                                    d="M3,3h30V30"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth={ 6 }
                                    strokeLinecap="round" 
                                />
                            </Svg>
                        </Animated.View>
                        
                        <Animated.View style={[ styles.frame, { 
                            top: frame.interpolate({
                                inputRange: [0, 1],
                                outputRange: [dimensionWidth - 148, dimensionWidth - 288]
                            }),
                            width: frame.interpolate({
                                inputRange: [0, 1],
                                outputRange: [dimensionWidth - 80, dimensionWidth - 200]
                            })}]}>
                            <Svg style={ styles.svg }>
                                <Path  // lb
                                    d="M33,3h-30V30"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth={ 6 }
                                    strokeLinecap="round" 
                                    transform="scale(1, -1) translate(0, -36)"
                                />
                            </Svg>
                            <Svg style={ styles.svg }>
                                <Path  // rb
                                    d="M3,3h30V30"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth={ 6 }
                                    strokeLinecap="round" 
                                    transform="scale(1, -1) translate(0, -36)"
                                />
                            </Svg>
                        </Animated.View>
                    </View>

                    <View style={ styles.backgroundTop }></View>
                    <Animated.View style={[ styles.backgroundLeft, {
                        width: frame.interpolate({
                            inputRange: [0, 1],
                            outputRange: [43, 103]
                        }),
                        height: frame.interpolate({
                            inputRange: [0, 1],
                            outputRange: [dimensionWidth - 80, dimensionWidth - 222]
                    })}]}></Animated.View>
                    <Animated.View style={[ styles.backgroundRight, {
                        width: frame.interpolate({
                            inputRange: [0, 1],
                            outputRange: [43, 103]
                    }),
                        height: frame.interpolate({
                            inputRange: [0, 1],
                            outputRange: [dimensionWidth - 80, dimensionWidth - 222]
                    })}]}></Animated.View>
                    <Animated.View style={[ styles.backgroundBottom, {
                        top: frame.interpolate({
                            inputRange: [0, 1],
                            outputRange: [dimensionWidth + 8, dimensionWidth - 131]
                    })}]}></Animated.View>
                </View>
                ) : (
                    <View style={ styles.background }></View>
                )
            }

            
        
            <View style={ styles.textContainer }>
                <Text style={ styles.text }>스크린 화면에 표시된 QR코드를 촬영​</Text>
                <Text style={ styles.text }>또는 코드번호를 입력하세요.​</Text>
            </View>

            <Animated.View style={[ styles.codeContainer, { 
                top: frame.interpolate({
                    inputRange: [0, 1],
                    outputRange: [dimensionWidth + 20, dimensionWidth - 120]
                })} ]} >
                { code.map((_, index: number) => {
                    // 입력시 칸 이동, 숫자 여부 체크
                    const handlePasswordChange = (index: number, value: string) => {    
                        if (/^[0-9]*$/.test(value)) {
                            const newPassword: string[] = [...code]
                            newPassword[index] = value
                            setCode(newPassword)

                            if (index <= 4 && value !== '') {
                                setIsFilled((prevIsFilled) => {
                                    const updatedIsFilled = [...prevIsFilled]
                                    updatedIsFilled[index] = true // 원하는 값으로 변경
                                    return updatedIsFilled
                                })

                                if (index < 4 && codeInputRefs.current[index + 1]) {
                                    codeInputRefs.current[index + 1]?.focus()
                                } 

                            } else if (index >= 0 && value === '') {
                                setIsFilled((prevIsFilled) => {
                                    const updatedIsFilled = [...prevIsFilled]
                                    updatedIsFilled[index] = false // 원하는 값으로 변경
                                    return updatedIsFilled
                                })

                                if (index > 0) {
                                    codeInputRefs.current[index - 1]?.focus()
                                }
                            } 
                        } else {
                            Alert.alert('알림', '숫자만 입력해주세요.')
                        }
                    }

                    const handleDelete = (index: number) => {
                        if (index > 0) {
                            const newCode = [...code]
                            newCode[index - 1] = ''
                            setCode(newCode)
                            setIsFilled((prevIsFilled) => {
                                const updatedIsFilled = [...prevIsFilled]
                                updatedIsFilled[index - 1] = false
                                return updatedIsFilled
                            })
                            codeInputRefs.current[index - 1]?.focus();
                        } else {
                            const newCode = Array(5).fill('')
                            setCode(newCode)
                            setIsFilled(Array(5).fill(false))
                            codeInputRefs.current[0]?.focus()
                        }
                    }

                    const onFocus = () => {
                        setQrMode(false)

                        if (index > 0 && isFilled[index - 1] === false) {
                            if (codeInputRefs.current[index]) {
                                codeInputRefs.current[index - 1]?.focus()
                            } 
                        }
                    }
                    
                    return (
                        <TextInput
                            key={ index }
                            ref={ input => codeInputRefs.current[index] = input }
                            style={[ styles.codeInput, isFilled[index] && { borderColor: '#fd780f' }  ]}
                            onChangeText={ value => handlePasswordChange(index, value) }
                            onFocus={ onFocus }
                            value={ code[index] || '' }
                            maxLength={ 1 }
                            keyboardType="numeric"
                            onKeyPress={(e) => {
                                // Handle the delete key
                                if (e.nativeEvent.key === 'Backspace') {
                                    handleDelete(index)
                                }
                            }}
                        />
                    )
                })}
            </Animated.View>
        </Pressable>
	)
}

const styles = StyleSheet.create({
	container: {
        flex: 1,
		alignItems: 'center',
	},
	scanner: { 
		width: '100%',
		flex: 1
	},
	textContainer: {
		position: 'absolute',
        left: 15,
        top: 24
	},
	text: {
        includeFontPadding: false,
		fontSize: 20,
        fontFamily: 'Pretendard-Regular',

		color: '#ffffff'
	},
    qrBorder: {
        alignItems: 'center',

        position: 'absolute',
        top: 88,

        zIndex: 1,

    },
    svg: {
        width: 36,
    },
    frame: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        height: 36,
    },
	backgroundTop: {
		width: '100%',
        height: 91,
		
		position: 'absolute',

		backgroundColor: 'rgba(0, 0, 0, 0.8)'
	},
	backgroundLeft: {	
		position: 'absolute',
		top: 91,
		left: 0,

		backgroundColor: 'rgba(0, 0, 0, 0.8)',
	},
	backgroundRight: {
		position: 'absolute',
		top: 91,
		right: 0,

		backgroundColor: 'rgba(0, 0, 0, 0.8)'
	},
	backgroundBottom: {
		width: '100%',
        height: '100%',

		position: 'absolute',

		backgroundColor: 'rgba(0, 0, 0, 0.8)'
	},
    background: {
        width: '100%',
        height: '100%',

        position: 'absolute',
		top: 0,
		right: 0,

		backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',

        position: 'absolute',
        
        marginVertical: 24,
        paddingHorizontal: 35,
    },
    codeInput: {
        width: 54,
        height: 60,

        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 34,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 10,

        color: '#ffffff',

        marginHorizontal: 4,
        
        borderWidth: 2,
        borderColor: '#ffffff'
    }
})

export default ScreenLogin