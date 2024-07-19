import { Animated, Dimensions, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { UserSetting } from "../../../slices/auth"
import { useCallback, useEffect, useState } from "react"
import { Payload } from "../../../types/apiTypes"

import Exclamation from "../../../assets/imgs/common/warning.svg"

interface ListProps {
    config: UserSetting
}

// list with toggle component
const Toggle = ({ config }: ListProps): JSX.Element => {
    const { setSettingValue } = useUsers()
    const userInfo = useUserInfo()

    const [enabled, setEnabled] = useState<boolean>(config.codeValue === 'Y' ? true : false)
    const [toggleAniValue] = useState(new Animated.Value(0))

    const toggleSwitch = (): void => { 
        setEnabled(!enabled)   
        config.codeValue = enabled ? 'N' : 'Y'
        changeSetting(config)
    }

    useEffect(() => {
        Animated.timing(toggleAniValue, {
            toValue: enabled ? 1 : 0,
            duration: 200,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start()

    }, [enabled])

    const color: string = enabled ? '#fd780f' : '#b4b4b4'

    const moveSwitchToggle = toggleAniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 28]
    })

    const changeSetting = async (list: UserSetting) => {

        const payload: Payload = await setSettingValue(userInfo.uid, [list]) 
        if (payload.code !== 1000) {
            return
        }
    }

    return (
        <View style={ styles.rowContainer }>
            <Text style={ styles.boldText }>{ config.codeName }</Text>
            <Pressable style={[ styles.toggleContainer, { backgroundColor: color } ]} onPress={ toggleSwitch }>
                <Animated.View style={[ styles.toggleWheel, { transform: [{ translateX: moveSwitchToggle }]}]}></Animated.View>
            </Pressable>
        </View>
    )
}

const AlarmSetting = (): JSX.Element => {
    const { getSettingValue, createSettingValue, setSettingValue } = useUsers()
    const userInfo = useUserInfo()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [userConfig, setUserConfig] = useState<UserSetting[]>([])

    useEffect(() => {
        if (userConfig.length === 0) {
            getUserConfig()
        }
    }, [])

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

        if (payload.configList) {
            const list = payload.configList.filter(obj => obj.groupCode !== 'P')
            setUserConfig(list)   
        }
        setIsConnected(false)
    } 
    
    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }> 
            <View style={{ marginLeft: 15 }}>
                <Text style={[ styles.regularText, { fontSize: 24 }]}>활동에 대한 알림을</Text>
                <Text style={[ styles.regularText, { fontSize: 24 }]}>설정합니다.</Text>
            </View>

            { userConfig && userConfig.length > 0 &&
                <View style={ styles.container }>
                    { userConfig.map((item: UserSetting, index: number) => {
                        return (
                            <View style={[ styles.listItem, index === userConfig.length - 1 && { borderBottomWidth : 0 }]} key={ index }>
                                <Toggle config={ item } /> 
                            </View>
                        )
                    })}
                </View>
            }

            <View style={ styles.blank }></View>
            <View style={ styles.subContainer }>
                <Exclamation style={{ marginRight: 5, marginTop: 2 }} />
                <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>스크린예약 진행시 필요한 정보는 알림설정 여부와 상관없이 전달됩니다.​</Text>
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
        marginTop: 30,

        backgroundColor: '#ffffff'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    boldText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    listItem: {
        paddingVertical: 18,
        
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    toggleContainer: {
        width: 60,
        height: 28,

        paddingLeft: 3,
        
        borderRadius: 15,
        justifyContent: 'center',
    },
    toggleWheel: {
        width: 24,
        height: 24,

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
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    blank: {
        height: 6,

        backgroundColor: '#f2f2f2'
    },
    subContainer: {
        flexDirection: 'row',

        marginHorizontal: 15,
        marginVertical: 24
    }
})

export default AlarmSetting