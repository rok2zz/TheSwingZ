import { ActionSheetIOS, Alert, Dimensions, Image, Linking, PermissionsAndroid, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useEffect, useRef, useState } from "react"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { useRefreshToken } from "../../../hooks/useToken"
import { Payload } from "../../../types/apiTypes"
import { launchCamera, launchImageLibrary } from "react-native-image-picker"
import validate from "validate.js"
import { useAuthActions } from "../../../hooks/useAuthActions"
import { PERMISSIONS, RESULTS, check, request } from "react-native-permissions"
import FastImage from "react-native-fast-image"

import MenuList from "../../../components/MenuList"

//svg
import EmptyImg from "../../../assets/imgs/my/empty_img.svg"
import EditImg from "../../../assets/imgs/my/edit_img.svg"
import Exclamation from "../../../assets/imgs/my/Exclamation.svg"
import Loading from "../../../components/Loading"



export interface ListProps {
    title: string,
    screen: string,
    stack: string
}

const listItem: ListProps[] = [
    { 
        title: '회원정보 수정',
        screen: 'CheckPW',
        stack: 'root'
    },
    { 
        title: '알림설정​',
        screen: 'AlarmSetting',
        stack: 'root'
    },
    { 
        title: '스크린설정​',
        screen: 'ScreenSetting',
        stack: 'root'
    },
]



const ModifyProfile = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const myProfile = useUserInfo()
    const refreshToken = useRefreshToken()
    const { modifyProfile, getProfileImages, logout } = useUsers()

    const nicknameRef = useRef<TextInput>(null)

    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [nickname, setNickname] = useState<string>('')
    const [imageUri, setImageUri] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [modal, setModal] = useState<boolean>(false)

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() => {
        getProfileImg()
    }, [myProfile])

    const getProfileImg = async () => {
        if (isConnected) return
        if (myProfile.profileImg)  {
            setIsConnected(true)
            const payload: Payload = await getProfileImages([myProfile.uid])
            if (payload.code !== 1000) {
            setIsConnected(false)
                return
            }

            if (payload.userProfileImgs) {
                setImageUri(payload.userProfileImgs[0].url ?? '')
            }
            setIsConnected(false)
        }
    }

    const constraints = {
        nickname: {
            presence: true,
            format: {
                pattern: /^[가-힣a-zA-Z0-9]{2,10}$/
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
    
    // 로그아웃
    const onPressLogout = (): void => {
        Alert.alert(
            '알림',
            '로그아웃 하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { return },
                    style: 'cancel',
                },{
                    text: '로그아웃', 
                    onPress: async (): Promise<void> => {
                        if (refreshToken) {
                            setIsConnected(true)
                            const payload: Payload = await logout(refreshToken)
                            setIsConnected(false)

                        }
                    },
                }
            ],
        )
    }

    const onLaunchCamera =  async () => {
        const isCameraGranted = await requestCameraPermission()
        if (isCameraGranted) {
            launchCamera(
                {
                    mediaType: 'photo',
                }, 
                (response) => {
                    if(response.didCancel) {
                        return
                    } else if(response.errorCode) {
                        console.log("Image Error : " + response.errorCode)
                    }
    
                    if (response.assets) {
                        setImageUri(response?.assets[0].uri ?? '')
                    }
                }
            )
            setModal(false)
            return
        }

        
        setModal(false)
    }

    const onSelectImage = async () => {
        const isStorageGranted = await requestStoragePermission()

        if (isStorageGranted) {
            launchImageLibrary(
                {
                    mediaType: 'photo'
                }, 
                (response) => {
                    if(response.didCancel) {
                        return
                    } else if(response.errorCode) {
                        console.log("Image Error : " + response.errorCode)
                    }
    
                    if (response.assets) {
                        setImageUri(response?.assets[0].uri ?? '')
                    }
                }
            )
            setModal(false)
            return
        }
        
        setModal(false)
    }

    const openModal = () => {
        if (Platform.OS === 'android') {
            setModal(true)
            return
        }

        ActionSheetIOS.showActionSheetWithOptions(
            {
                title: '프로필 사진 변경',
                options: ['카메라로 촬영하기', '사진첩에서 선택하기', '기본 이미지로 설정하기', '취소'],
                cancelButtonIndex: 3
            },
            (index) => {
                if (index === 0) {
                    onLaunchCamera()
                } else if (index === 1) {
                    onSelectImage()
                } else if (index === 2) {
                    setImageUri('')
                }
            }
        )
    }

    const modify = async () => {
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
                    onPress: async (): Promise<void> => { 
                        setMessage('')

                        if (nickname === '') {
                            setNickname(myProfile.nick)
                        } 
                        if ((nickname !== '' && nickname.search(/\s/) > 0) || (nickname !== '' && !isValidNickname(nickname))){
                            setMessage('올바른 닉네임 형식이 아닙니다')
                            return 
                        } 
                        const nick = nickname === '' ? myProfile.nick : nickname
                        const isImgChanged = !(myProfile.profileImg === imageUri)

                        setIsConnected(true)
                        const payload: Payload = await modifyProfile(myProfile.nick, nick, imageUri, isImgChanged)
                        setIsConnected(false)
                        if (payload.code !== 1000) {
                            setMessage(payload.msg ?? '')
                            setImageUri(myProfile.profileImg ?? '')
                            setNickname('')
                            if (nicknameRef.current) {
                                nicknameRef.current.setNativeProps({ text: '' })
                            }             
                            return
                        }

                        if (nicknameRef.current) {
                            nicknameRef.current.setNativeProps({ text: '' })
                        }                        
                        setNickname('')

                        Alert.alert('알림', '저장되었습니다.',
                            [{
                                text: '확인', 
                                onPress: async (): Promise<void> => { 
                                    navigation.goBack()
                                }
                            }]
                        )
                    },
                }
            ],
        )
    }

    const requestCameraPermission = async (): Promise<boolean> => {
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
                                onPress: () => { return false },
                                style: 'cancel',
                            },
                            {
                                text: '확인',
                                onPress: () => {
                                    Linking.openSettings()
                                }
                            },
                        ]
                    )
                    return false
                } 
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
                                onPress: () => { return false },
                                style: 'cancel',
                            },
                            {
                                text: '확인',
                                onPress: () => {
                                    Linking.openSettings()
                                }
                            },
                        ]
                    )
                    return false
                } 
            }
        }

        return true
    }

    const requestStoragePermission = async () => {
        if (Platform.OS === 'ios') {
            const result = await check(PERMISSIONS.IOS.PHOTO_LIBRARY)
            if (result !== RESULTS.GRANTED) {
                const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
                if (requestResult !== RESULTS.GRANTED) {
                    Alert.alert(
                        '사진첩 접근 권한 필요',
                        '프로필 사진 선택을 위해 사진첩 접근 권한이 필요합니다.',
                        [   
                            {
                                text: '취소',
                                onPress: () => { return false },
                                style: 'cancel',
                            },
                            {
                                text: '확인',
                                onPress: () => {
                                    Linking.openSettings()
                                }                  
                            },
                        ]
                    )
                    return false
                } 
            } 
        } else if (Platform.OS === 'android') {
            const result = await check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
            if (result !== RESULTS.GRANTED) {
                const requestResult = (Platform.Version < 13) ? await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE) : await request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
                if (requestResult !== 'granted') {
                    Alert.alert(
                        '사진첩 접근 권한 필요',
                        '프로필 사진 선택을 위해 사진첩 접근 권한이 필요합니다.',
                        [   
                            {
                                text: '취소',
                                onPress: () => { return false },
                                style: 'cancel',
                            },
                            {
                                text: '확인',
                                onPress: () => {
                                    Linking.openSettings()
                                }                    
                            },
                        ]
                    )
                    return false
                } 
            }
        }
        return true
    }

    return (
        <>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <ScrollView style={ styles.wrapper } >
                <View style={ styles.profileContainer }>
                    <Pressable style={ styles.profileImg } onPress={ () => {} }>
                        { imageUri === '' ? 
                            <EmptyImg width={50} height={50} /> 
                            : 
                            <FastImage 
                                style={ styles.img } 
                                source={{ 
                                    uri: imageUri,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable 
                                }} 
                                resizeMode="cover"
                            />
                        }
                        <Pressable style={ styles.editImg } onPress={ openModal }>
                            <EditImg />
                        </Pressable>
                    </Pressable>
    
                    <View style={ styles.nickname }>
                        <TextInput style={[ styles.input, isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#ffffff' }]} ref={ nicknameRef }
                            placeholder={ myProfile.nick ?? '닉네임을적어주세요.'} placeholderTextColor="#aaaaaa" returnKeyType="done" autoCapitalize='none' onFocus={ () => setIsFocused(true) } onBlur={ () => setIsFocused(false)}
                            onChangeText={(nickname: string): void => setNickname(nickname)} />
                    </View>

                    <Text style={[ styles.terms, { marginTop: 9 }]}>한글 2~10자 (띄어쓰기 불가)​</Text>
                    <Text style={ styles.message }>{ message }</Text>

                    <View style={ styles.textBox }>
                        <Exclamation style={ styles.exclamation } />
                        <Text style={[ styles.terms, { color: '#949494' }]}>더스윙제트 시스템에서 플레이 라운드 하실 때 음성 지원에도 사용됩니다.</Text>
                    </View>

                    <Pressable style={ styles.saveBtn } onPress={ modify }>
                        <Text style={ styles.btnText }>저장</Text>
                    </Pressable>
                </View>

                <View style={ styles.container }>
                    <MenuList listItem={ listItem } />
                </View>

                <View style={ styles.blank }></View>

                <View style={ styles.logoutContainer }>
                    <Text style={ styles.logout } onPress={ onPressLogout }>로그아웃</Text>
                </View>
            </ScrollView>
            { modal && 
                <View style={ styles.modalContainer }>
                    <Pressable style={ styles.background } onPress={ () => setModal(false) }></Pressable>
                    <View style={ styles.modal }>
                        <Pressable style={ styles.modalBtn } onPress={ onLaunchCamera }>
                            <Text style={ styles.semiBoldText }>카메라로 촬영하기</Text>
                        </Pressable>
                        <Pressable style={ styles.modalBtn } onPress={ onSelectImage }>
                            <Text style={ styles.semiBoldText }>사진첩에서 선택하기</Text>
                        </Pressable>
                        <Pressable style={ styles.modalBtn } onPress={ () => { setImageUri(''), setModal(false) }} >
                            <Text style={ styles.semiBoldText }>기본 이미지로 설정하기</Text>
                        </Pressable>
                        <Pressable style={ styles.modalBtn } onPress={ () => setModal(false) }>
                            <Text style={ styles.semiBoldText }>취소</Text>
                        </Pressable>
                    </View>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727'
    },
    profileContainer: {
        alignItems :'center',

        paddingTop: 24,
        paddingBottom: 30,
        paddingHorizontal: 15,

        backgroundColor: '#272727'
    },
    profileImg: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 96,
        height: 96,

        marginBottom: 16,

        borderRadius: 40,

        backgroundColor: '#dddddd'
    },
    img: {
        width: '100%',
        height: '100%',

        borderRadius: 40
    },
    editImg: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 32,
        height: 32,

        position: 'absolute',
        bottom: 0, 
        right: 0,

        borderRadius: 50,
        backgroundColor: '#949494'
    },
    nickname: {
        flex: 1,
        flexDirection: 'row'
    },
    input: {
        flex: 1,
        height: 45,

        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-Regular',

        borderBottomWidth: 1,

        color: '#ffffff'
	},
    terms: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    textBox: {
        flex: 1,
        flexDirection: 'row',

        paddingHorizontal: 3,

        marginTop: 15
    },
    exclamation: {
        marginRight: 6,

        transform: [{ translateY : 2 }]
    },
    saveBtn: {
        flexDirection: 'row',

        marginTop: 24,
        
        borderWidth: 1,
        borderColor: '#fd780f'
    },
    btnText: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 13,

        color: '#fd780f'
    },
    container: {
        paddingVertical: 18,

        backgroundColor: '#ffffff'
    },
    blank: {
        height: 6,

        backgroundColor: '#f2f2f2'
    },
    logoutContainer: {
        paddingLeft: 15,
        paddingTop: 24,
        paddingBottom: 342,
        marginBottom: -300,

        backgroundColor: '#ffffff'
    },
    logout: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619',

        textDecorationLine: 'underline',
    },
    message: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginLeft: 8,

        color: '#c50f0b'
    },
    modalContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        top: 0,
        left: 0,
    },
    modal: {
        paddingHorizontal: 50,
        paddingVertical: 15,

        position: 'absolute',

        borderRadius: 12,
        backgroundColor: '#ffffff'
    },
    background: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        backgroundColor: 'rgba(0, 0, 0, 0.5)',

    },
    modalBtn: {
        alignItems : 'center',
        width: '100%'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 10,

        color: '#121619',

        zIndex: 1
    }
})

export default ModifyProfile