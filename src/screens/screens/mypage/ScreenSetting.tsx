import { useEffect, useState } from "react"
import { Alert, Animated, Dimensions, Easing, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { Payload } from "../../../types/apiTypes"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { SettingOption, UserSetting } from "../../../slices/auth"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"

import DownArrow from "../../../assets/imgs/common/arrow_setting.svg"
import Close from "../../../assets/imgs/swing/close.svg"

interface ToggleProps {
    config: UserSetting[],
    index: number,
    setConfig: React.Dispatch<React.SetStateAction<UserSetting[]>>
}

interface ListProps {
    config: UserSetting,
    index: number,
}

// list with toggle component
const Toggle = ({ config, index, setConfig }: ToggleProps): JSX.Element => {
    const [enabled, setEnabled] = useState<boolean>(config[index].codeValue === 'TRUE' ? true : false)
    const [toggleAniValue, setToggleAniValue] = useState(new Animated.Value(0))

    const toggleSwitch = (): void => { 
        setEnabled(previousState => !previousState)   
    }

    useEffect(() => {
        Animated.timing(toggleAniValue, {
          toValue: enabled ? 1 : 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start()

        let list = config
        list[index].codeValue = enabled ? 'TRUE' : 'FALSE'
        setConfig(list)
    }, [enabled])

    const color: string = enabled ? '#fd780f' : '#b4b4b4'

    const moveSwitchToggle = toggleAniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 18]
    })
    
    return (
        <View style={ styles.rowContainer }>
            <Text style={ styles.boldText }>{ config[index].codeName }</Text>
            <Pressable style={[ styles.toggleContainer, { backgroundColor: color } ]} onPress={ toggleSwitch }>
                <Animated.View style={[ styles.toggleWheel, { transform: [{ translateX: moveSwitchToggle }]}]}></Animated.View>
            </Pressable>
        </View>
    )
}

const ScreenSetting = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getSettingValue, createSettingValue, setSettingValue } = useUsers()
    const userInfo = useUserInfo()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [userConfig, setUserConfig] = useState<UserSetting[]>([])
    const [optionList, setOptionList] = useState<SettingOption[]>([])
    const [openSelectModal, setOpenSelectModal] = useState<boolean>(false)
    const [configIndex, setConfigIndex] = useState<number>(0)
    const [position] = useState(new Animated.Value(0))

    useEffect(() => {
        getUserConfig()
    }, [])

    // open select container
    useEffect(() => {
        Animated.timing(position, {
            toValue: openSelectModal ? 1 : 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [openSelectModal])

    const getUserConfig = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getSettingValue(userInfo.uid)
        if (payload.code !== 1000) {
            const createPayload: Payload = await createSettingValue(userInfo.uid)
            if (createPayload.code !== 1000) {
                return
            }
            getUserConfig()            
            return
        }

        if (payload.configList && payload.optionList) {
            const list = payload.configList.filter(obj => obj.groupCode !== 'A')
            setUserConfig(list)   
            setOptionList(payload.optionList)
        }
        setIsConnected(false)
    } 

    const changeScreenSetting = async () => {
        if (isConnected) return

        Alert.alert(
            '알림',
            '저장 하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { return },
                    style: 'cancel',
                },{
                    text: '저장', 
                    onPress: async (): Promise<void> => {
                        setIsConnected(true)
                        const payload: Payload = await setSettingValue(userInfo.uid, userConfig)
                        setIsConnected(false)
                        if (payload.code !== 1000) {
                            return
                        }

                        if (payload.configList) {
                            const list = payload.configList.filter(obj => obj.groupCode !== 'A')
                            setUserConfig(list)   
                        }

                        Alert.alert('알림', '저장되었습니다.')
                    },
                }
            ],
        )
    }

    // list component
    const List = ({ config, index }: ListProps): JSX.Element => {
        const openSelectModal = () => {
            setOpenSelectModal(true)
            setConfigIndex(index)
        }
        const getValue = () => {
            for (let i = 0; i < optionList.length; i++) {
                if (optionList[i].codeId === config.codeId && optionList[i].optionValue === config.codeValue) {
                    return optionList[i].optionName
                }
            }
        }

        return (
            <Pressable style={[ styles.listItem, styles.rowContainer, { paddingVertical: 18 }, index === 11 && { borderBottomWidth : 0 }]} onPress={ openSelectModal }>
                <Text style={ styles.boldText }>{ config.codeName }</Text>
                <Text style={[ styles.regularText, { marginRight: 15, color: '#fd780f' }]}>{ getValue() }</Text>
                <DownArrow />
            </Pressable>
        )
    }

    return (
        <View style={ styles.wrapper }>
            <ScrollView showsVerticalScrollIndicator={ false }> 
                <View style={ styles.infoContainer }>
                    <Text style={ styles.regularText }>스크린골프 개별 설정을 관리합니다.</Text>
                </View>

                { userConfig.length > 0 && optionList.length > 0 &&
                    <View style={ styles.container }>
                        { userConfig.map((item: UserSetting, index: number) => {
                            if (index > 11) return

                            let isToggle = false
                            if (item.codeId === 'P0006' || item.codeId === 'P0007' || item.codeId === 'P0009' || item.codeId === 'P0012') {
                                isToggle = true
                            }

                            return (
                                <View key={ index }>
                                    { isToggle ? (
                                        <View style={[ styles.listItem, index === 11 && { borderBottomWidth : 0 }]}>
                                            <Toggle config={ userConfig } index={ index } setConfig={ setUserConfig } /> 
                                        </View>
                                        ) : (
                                        <List config={ item } index={ index } /> 
                                    )}
                                </View>
                            )
                        })}
                    </View>
                }

                <View style={[ styles.rowContainer, { marginHorizontal: 15, marginVertical: 48 }]}>
                    <Pressable style={[ styles.button, { marginRight: 9 }]} onPress={ () => navigation.goBack() }>
                    <Text style={[ styles.boldText, { fontSize: 18 }]}>취소</Text>

                    </Pressable>
                    <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ changeScreenSetting }>
                        <Text style={[ styles.boldText, { fontSize: 18, color: '#ffffff' }]}>저장</Text>
                    </Pressable>
                </View>
            </ScrollView>

            { openSelectModal && optionList.length > 0 &&
                <View style={ styles.selectContainer }>
                    <Pressable style={ styles.background } onPress={ () => { setOpenSelectModal(false), setConfigIndex(0) } }></Pressable>
                    <Animated.View style={[ styles.selectBox, 
                        { transform: [{
                            translateY: position.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Dimensions.get('window').height, 0], 
                            })
                        }]}]}>
                        <View style={[ styles.rowContainer, { marginBottom: 30 } ]}>
                            <Text style={ styles.semiBoldText }>{ userConfig[configIndex].codeName }</Text>
                            <Pressable onPress={ () => { setOpenSelectModal(false), setConfigIndex(0) }}>
                                <Close />
                            </Pressable>
                        </View>

                        { optionList.map((item: SettingOption, optionIndex: number) => {
                            const setScreenSetting = (isRight: number) => { // Is right, plus 1 index
                                let list = userConfig
                                list[configIndex].codeValue = optionList[optionIndex + isRight].optionValue
                                setUserConfig(list)
                                setOpenSelectModal(false)
                            }
                            
                            
                            if (item.codeId === userConfig[configIndex].codeId) {
                                if (Number(item.optionNo) % 2 === 0 && Number(item.optionNo) > 0) return
                                    
                                return (
                                    <View style={[ styles.rowContainer, { width: '100%', justifyContent: 'space-between', marginBottom: 9 }]} key={ optionIndex }>
                                        <View style={[ styles.rowContainer, { width: '100%', justifyContent: 'space-between', marginBottom: 9 }]}>
                                            <Pressable style={[ styles.selectBtn, userConfig[configIndex].codeValue === item.optionValue && { borderWidth: 0, backgroundColor: '#fd780f' }]}  onPress={ () => setScreenSetting(0) }>
                                                <Text style={[ styles.filterText, userConfig[configIndex].codeValue === item.optionValue && { color: '#ffffff' }]}>{ item.optionName }</Text>
                                            </Pressable>
                                            { optionList[optionIndex + 1].codeId === item.codeId &&
                                                <Pressable style={[ styles.selectBtn, userConfig[configIndex].codeValue === optionList[optionIndex + 1].optionValue && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setScreenSetting(1) }>
                                                    <Text style={[ styles.filterText, userConfig[configIndex].codeValue === optionList[optionIndex + 1].optionValue && { color: '#ffffff' }]}>{ optionList[optionIndex + 1].optionName }</Text>
                                                </Pressable>
                                            }
                                        </View>
                                    </View>
                                )
                            }
                        })}
                    </Animated.View>
                </View>
            }
        </View>        
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#f3f3f3'
    },
    container: {
        marginHorizontal: 15,
        marginTop: 3,
        paddingHorizontal: 15,

        backgroundColor: '#ffffff'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiBoldText: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        marginLeft: 18,

        color: '#121619'
    },
    boldText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    infoContainer: {
        padding: 15,

        backgroundColor: '#ececec'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    listItem: {
        paddingVertical: 15,
        
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    toggleContainer: {
        width: 44,
        height: 24,

        paddingLeft: 3,
        
        borderRadius: 15,
        justifyContent: 'center',
    },
    toggleWheel: {
        width: 20,
        height: 20,

        borderRadius: 12.5,
        backgroundColor: 'white'
    },
    button: {
        width: (Dimensions.get('window').width - 30) / 2 - 9,
        alignItems: 'center',

        paddingVertical: 16,

        borderRadius: 6,
        borderColor: '#cccccc',
        borderWidth: 1,

        backgroundColor: '#ffffff'
    },
    selectContainer: {
        height: Dimensions.get('window').height,

        position: 'absolute',
        bottom: 0,
        
        zIndex: 1
    },
    selectBox: {
        alignItems: 'center',

        width: Dimensions.get('window').width,
        
        position: 'absolute',
        bottom: 0,

        paddingVertical: 24,
        paddingHorizontal: 15,

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        backgroundColor: '#ffffff'
    },
    selectBtn: {
        width: (Dimensions.get('window').width - 39) / 2,

        paddingVertical: 13,
        paddingLeft: 15,

        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#cccccc'
    },
    filterText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    background: {
        width: Dimensions.get('window').width,
        height: '100%',

        position: 'absolute',
        top: 0,

        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    }
})

export default ScreenSetting