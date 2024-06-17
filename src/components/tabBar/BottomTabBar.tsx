import { Animated, Dimensions, Image, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { BottomTabBarProps } from "@react-navigation/bottom-tabs"
import { Fragment, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../types/stackTypes"
import { useIsOpen } from "../../hooks/useReservation"
import ChangeReservation from "./ChangeReservation"
import { useIsTabConnected } from "../../hooks/useUsers"
import { Shadow } from "react-native-shadow-2"

//svg
import FocusedReservation from "../../assets/imgs/common/icon_reservation_on.svg"
import Reservation from "../../assets/imgs/common/icon_reservation.svg"
import MyPage from "../../assets/imgs/common/icon_my.svg"
import FocusedMyPage from "../../assets/imgs/common/icon_my_on.svg"
import Etc from "../../assets/imgs/common/icon_menu.svg"
import FocusedEtc from "../../assets/imgs/common/icon_menu_on.svg"
import QR from "../../assets/imgs/common/icon_qr.svg"
import Loading from "../Loading"


const BottomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps): JSX.Element => {    
    const rootNavigation = useNavigation<RootStackNavigationProp>()
    const isOpen = useIsOpen()
    const [position] = useState(new Animated.Value(0))
    const isTabConnected = useIsTabConnected()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [height, setHeight] = useState<number>(0)

    useEffect(() => {
        if (isOpen) {
            Animated.timing(position, {
                toValue: isOpen ? 1 : 0,
                duration: 500,
                useNativeDriver: true
            }).start()

            setTimeout(() => {
                setHeight(500)
            }, 600)

            return
        }
        setHeight(0)

        Animated.timing(position, {
            toValue: isOpen ? 1 : 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [isOpen])

    useEffect(() => {
        setIsConnected(isTabConnected)
    }, [isTabConnected])


    return (
        <View style={[ styles.wrapper, height !== 0 && { height: height }]}>
            { state.routes.map((route: any , index: number) => {
                let isFocused = state.index === index
        
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true
                    })

        
                    if (!isFocused && !event.defaultPrevented) {
                        if (route.name === 'ShopStack') {
                            navigation.reset({ routes: [{ name: route.name }]})
                            return
                        }
                        
                        navigation.navigate(route.name)
                    }
                }
                
                return (
                    <Fragment key = { index } >
                        { index < 2 && 
                            <Shadow 
                                style = {[ styles.leftContainer, index === 0 ? { borderTopLeftRadius: 20, borderRightWidth: 0 } : { borderTopRightRadius: 20, borderLeftWidth: 0 }]}
                                offset={[0, 0]}
                                startColor="#ffffff"
                                endColor="#f4f4f4"
                                distance={3}
                                corners={{ topStart: true, topEnd: true, bottomStart: false, bottomEnd: false }}
                                sides={{ top: true, bottom: false, start: false, end: false }}
                            >
                                <Pressable onPress = { onPress }>
                                    <View style = {{ alignItems: 'center' }}>
                                        { index === 0 && 
                                            <>
                                                { isFocused ? (
                                                    <Image style={{ marginBottom: 4 }} source={ require('../../assets/imgs/common/home_on.png')} />
                                                ) : (
                                                    <Image style={{ marginBottom: 4 }} source={ require('../../assets/imgs/common/home_off.png')} />
                                                )}
                                            </>
                                        }   
                                        { index === 1 && 
                                            <>
                                                { isFocused ? (
                                                    <FocusedReservation style={{ marginBottom: 4 }} width={ 32 } height={ 32 } /> 
                                                ) : (
                                                    <Reservation style={{ marginBottom: 4 }} width={ 32 } height={ 32 } /> 
                                                )}
                                            </>
                                        }    
                                        { index === 0 && <Text style={[ styles.text, isFocused && { fontFamily: 'Pretendard-Bold', color: '#fd780f' } ]}>홈</Text> }
                                        { index === 1 && <Text style={[ styles.text, isFocused && { fontFamily: 'Pretendard-Bold', color: '#fd780f' } ]}>예약하기</Text> }
                                    </View>
                                </Pressable>
                            </Shadow>    
                            
                        }
                        { index === 1 && <View style={ styles.blankContainer }></View> }
                        { index === 1 && <View style={ Platform.OS === 'android' && styles.eraser }></View> }
                        
                        { index > 1 &&
                            <Shadow 
                                style = {[ styles.rightContainer, index === 2 ? { borderTopLeftRadius: 20, borderRightWidth: 0 } : { borderTopRightRadius: 20, borderLeftWidth: 0  }]}
                                offset={[0, 0]}
                                startColor="#ffffff"
                                endColor="#f4f4f4"
                                distance={3}
                                corners={{ topStart: true, topEnd: true, bottomStart: false, bottomEnd: false }}
                                sides={{ top: true, bottom: false, start: false, end: false }}    
                            >
                                <Pressable onPress = { onPress }>
                                    <View style = {{ alignItems: 'center' }}>
                                        { index === 2 && 
                                            <>
                                                { isFocused ? (
                                                    <FocusedMyPage style={{ marginBottom: 4 }} width={ 32 } height={ 32 } /> 
                                                ) : (
                                                    <MyPage style={{ marginBottom: 4 }} width={ 32 } height={ 32 } /> 
                                                )} 
                                            </>
                                        }   
                                        { index === 3 && 
                                            <>
                                                { isFocused ? (
                                                    <FocusedEtc style={{ marginBottom: 4 }} width={ 32 } height={ 32 } /> 
                                                ) : (
                                                    <Etc style={{ marginBottom: 4 }} width={ 32 } height={ 32 } /> 
                                                )}
                                            </>
                                        }   
                                        { index === 2 && <Text style={[ styles.text, isFocused && { fontFamily: 'Pretendard-Bold', color: '#fd780f' } ]}>마이Z</Text> }
                                        { index === 3 && <Text style={[ styles.text, isFocused && { fontFamily: 'Pretendard-Bold', color: '#fd780f' } ]}>더보기</Text> }
                                    </View>
                                </Pressable>
                            </Shadow>    
                        }
                    </Fragment>
                )
            })}

            {/* qr and screen login */}
            <View style={styles.qrBtnContainer}>
                <Pressable style={styles.qrBtn} onPress={ () => rootNavigation.push('ScreenLogin') }>
                    <QR />
                </Pressable>
            </View>

            { isOpen &&
                <Animated.View style={[ styles.reservation, 
                    { transform: [{
                        translateY: position.interpolate({
                            inputRange: [0, 1],
                            outputRange: [Dimensions.get('window').height, 0], 
                        })
                    }]}]}>
                    <ChangeReservation />
                </Animated.View>
            }

            { isConnected && <View style={ styles.connect }><Loading /></View> }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {        
        flexDirection: 'row',

        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    text: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#cccccc'
    },
    qrBtnContainer: {
        width: 82,
        height: 82,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        bottom: 29,
        left: (Dimensions.get('window').width - 82 ) / 2,

        borderRadius: 50,

        backgroundColor: '#ffffff',

        zIndex: 1,

        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 0.1,
            },
            android: {
                elevation: 3,
            }
        })
    },
    qrBtn: {
        width: 74,
        height: 74,

        alignItems: 'center',
        justifyContent: 'center',

        borderRadius: 50,

        backgroundColor: '#1b1f21'
    },
    leftContainer: {
        width: (Dimensions.get('window').width - 82) / 4,
        flexDirection: 'row',
        justifyContent: 'center',

        paddingVertical: 14,
    },
    rightContainer: {
        width: (Dimensions.get('window').width - 82) / 4,
        flexDirection: 'row',
        justifyContent: 'center',

        paddingVertical: 14,
    },
    blankContainer: {
        width: 82,

        marginTop: 20,

        backgroundColor: '#ffffff'
    },
    eraser: {
        width: 100,
        height: 65,

        position: 'absolute',
        bottom: -1,
        left: Dimensions.get('window').width / 2 - 50,

        backgroundColor: '#ffffff',

        zIndex: 1
    },
    reservation: {

        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 1,
    }, 
    connect: {
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height, 

        position: 'absolute', 
        bottom: 0, 
        left: 0, 

        zIndex: 5 
    }
})

export default BottomTabBar