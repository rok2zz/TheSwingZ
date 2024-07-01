import { Alert, Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp, RootStackParamList, ShopStackNavigationProp } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { useUserInfo } from "../../../hooks/useUsers"
import { useEffect, useState } from "react"
import ChangeReservation from "../../../components/tabBar/ChangeReservation"
import { useIsOpen, useReservation, useReservationInfo, useRevList } from "../../../hooks/useReservation"
import { useReservationActions } from "../../../hooks/useReservationActions"
import { Payload } from "../../../types/apiTypes"

// svg
import Check from "../../../assets/imgs/login/check_terms.svg"
import GrayCheck from "../../../assets/imgs/login/check_terms_gray.svg"
import Loading from "../../../components/Loading"
import { ReservationTime } from "../../../slices/reservation"
import { RevSet } from "../../../types/screenTypes"

interface Props {
    route: RouteProp<RootStackParamList, 'MakeReservation'>
}

const MakeReservation = ({ route }: Props) => {
    const shopInfo = route.params?.shopInfo

    const navigation = useNavigation<RootStackNavigationProp>()
    const shopNavigation = useNavigation<ShopStackNavigationProp>()
    const userInfo = useUserInfo()
    const revInfo = useReservationInfo()
    const revTimeList = useRevList()
    const isOpen = useIsOpen()
    const { saveIsOpen, saveReservationSetting } = useReservationActions()
    const { registReservation, getMyReservation } = useReservation()

    const [indicatorPosition] = useState(new Animated.Value(0))
    const [isConnected, setIsConnected] = useState<boolean>()
    const [revTime, setRevTime] = useState<Date>(new Date())
    const [gameMode, setGameMode] = useState<string>('S')
    const [selectedHole, setSelectedHole] = useState<number>(18)

    const [isLeft, setIsLeft] = useState<boolean>(false)
    const [linkedRoom, setLinkedRoom] = useState<boolean>(false)
    const [twoRoom, setTwoRoom] = useState<boolean>(false)
    const [twoGame, setTwoGame] = useState<boolean>(false)
    const [isAvailable, setIsAvailable] = useState<boolean[]>([true, true, true, true, true, true])

    const revSet: Set<RevSet> = new Set([])

    useEffect(() => {
        if (!shopInfo || !revInfo) {
            Alert.alert('알림', '서버에 연결할 수 없습니다.',[
                {
                    text: '확인',
                    onPress: () => { 
                        shopNavigation.goBack()
                    }
                }
            ])
        }

    }, [])

    useEffect(() => {
        if (revInfo) {
            setRevTime(new Date(revInfo.date))
        }
    }, [revInfo])

    useEffect(() => {
        if (revTime && revTimeList && revTimeList.length > 0) {
            getAvailableTime()
        }
    }, [revTime])
    
    useEffect(() => {
        Animated.timing(indicatorPosition, {
            toValue: isOpen ? 1 : 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [isOpen])

    const getAvailableTime = () => {
        const available: boolean[] = [true, true, true, true, true, true]
        const openTime= shopInfo.openedAt.split(':')
        const open = new Date()
        open.setDate(revTime.getDate())
        open.setHours(parseInt(openTime[0], 10))
        open.setMinutes(parseInt(openTime[1], 10))

        const closeTime= shopInfo.closedAt.split(':')
        const close = new Date()
        const closeHour = parseInt(closeTime[0], 10)
        const closeMin = parseInt(closeTime[1], 10)
        close.setDate(revTime.getDate())
        close.setHours(closeHour)
        close.setMinutes(closeMin)
        close.setSeconds(0)
        close.setMilliseconds(0)

        const revClose = new Date(revTime.getTime())
        revClose.setHours(revClose.getHours() + revInfo.people + 1)
        revClose.setSeconds(0)
        revClose.setMilliseconds(0)

        if (close < open) { 
            close.setDate(close.getDate() + 1)                                    
        }

        if (open > revTime) {
            for (let i = 0; i < 6; i++) {
                available[i] = false
            }
        } else if (close < revClose) {
            for (let i = 0; i < 6; i++) {
                available[i] = false
            }
        } else if (closeHour === revClose.getHours()) {
            if (closeMin > 0 && closeMin < 10) {
                for (let i = 0; i < 6; i++) {
                    available[i] = false
                }
            } else if (closeMin >= 0 && closeMin < 20) {
                for (let i = 1; i < 6; i++) {
                    available[i] = false
                }
            } else if (closeMin >= 0 && closeMin < 30) {
                for (let i = 2; i < 6; i++) {
                    available[i] = false
                }
            } else if (closeMin >= 0 && closeMin < 40) {
                for (let i = 3; i < 6; i++) {
                    available[i] = false
                }
            } else if (closeMin >= 0 && closeMin < 50) {
                for (let i = 4; i < 6; i++) {
                    available[i] = false
                }
            } else if (closeMin >= 0 && closeMin <= 60) {
                for (let i = 5; i < 6; i++) {
                    available[i] = false
                }
            }
        }

        // add shop rev list
        if (shopInfo) {
            let setIndex = 0
            for (let i = 0; i < revTimeList.length; i++) {
                if (shopInfo.id === revTimeList[i].shopId) {
                    const beginDate = new Date(revTimeList[i].beginAt)
                    const endDate = new Date(revTimeList[i].endAt)
                    const begin = beginDate.getFullYear() * 100000000 + (beginDate.getMonth() + 1) * 1000000 + beginDate.getDate() * 10000 + (beginDate.getHours() - revInfo.people - 1) * 100 + beginDate.getMinutes() + 10
                    const end = endDate.getFullYear() * 100000000 + (endDate.getMonth() + 1) * 1000000 + endDate.getDate() * 10000 + endDate.getHours() * 100 + endDate.getMinutes()
                   
                    let setValue: number[] = []

                    setValue = setValue.concat(begin)
                    let beginValue = begin

                    while (beginValue < end) {
                        if (beginValue % 100 === 60) {
                            beginValue += 40
                        } else {
                            beginValue += 10
                        }
                        setValue = setValue.concat(beginValue)
                    }

                    revSet.add({ index: setIndex, value: setValue })
                    setIndex++
                }
            }
        }

        // compare rev time
        if (available.every(value => value === false)) return
        for (let i = Number((revTime.getMinutes() / 10).toFixed(0)); i < 6; i++) {
            let selectedValue = revTime.getFullYear() * 100000000 + (revTime.getMonth() + 1) * 1000000 + revTime.getDate() * 10000 + revTime.getHours() * 100 + i * 10

            const getDuplicatedCount = (): number => {
                let count = 0

                revSet.forEach(set => {
                    count += set.value.reduce((acc, num) => {
                        return acc + (num === selectedValue ? 1 : 0)
                    }, 0)
                })

                return count
            }

            if (getDuplicatedCount() >= shopInfo.totalRoom) {
                available[i] = false
            } 
        }

        setIsAvailable(available)
    }

    const formatTime = (time: Date) => {
        const month = time.getMonth() + 1
        const date = time.getDate()
        const day = ['일', '월', '화', '수', '목', '금', '토'][time.getDay()]
        let hours = time.getHours()
        let min = time.getMinutes()
        let ampm = '오전'
    
        if (hours >= 12) {
            hours -= 12
            ampm = '오후'
        }
        if (hours === 0) {
            hours = 12
        }
    
        return `${month}월 ${date}일 (${day}) ${ampm} ${hours}시 ${min < 10 ? '0' + min : min}분~`
    }

    // make reseravtion
    const reserve = async () => {
        if (isConnected) return
        Alert.alert(
            '알림',
            '예약하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async (): Promise<void> => { 
                        setIsConnected(true)
                        const payload: Payload = await registReservation(13, revInfo, userInfo.realName, userInfo.phone, gameMode, selectedHole, isLeft, linkedRoom, twoRoom, twoGame)
                        if (payload.code !== 1000) {
                            setIsConnected(false)
                            Alert.alert('알림','예약을 할 수 없습니다.')
                            return
                        }

                        const revPayload: Payload = await getMyReservation(null)
                        if (revPayload.code !== 1000) {
                            return
                        }
                        setIsConnected(false)
                        
                        const revId = payload.revId ?? -1

                        navigation.navigate('ResultReservation', { shopInfo: shopInfo, revInfo: revInfo, revId: revId })
                    },
                }
            ],
        )
    }

    return (
        <>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }

            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
                <View style={ styles.shopContainer }>
                    <View style={{ flex: 1, marginTop: 4 }}>
                        <Text style={ styles.semiBoldText }>{ shopInfo.title }</Text>
                        <Text style={[ styles.regularText, { fontSize: 20 }]}>예약 하시겠습니까?</Text>
                    </View>
                    <View style={ styles.imgContainer }>
                        <Image style={ styles.img } source={ require('../../../assets/imgs/store/store_default.jpg')} />
                    </View>
                </View>

                <View style={ styles.container }>
                    <View style={{ marginTop: 30 }}>
                        <Text style={[ styles.boldText, { fontSize: 18, marginBottom: 18, color: '#121619' }]}>예약자 정보</Text>
                        <Text style={[ styles.regularText, { marginBottom: 10, color: '#949494' }]}>예약자</Text>
                        <Text style={[ styles.regularText, { marginBottom: 30, }]}>{ userInfo.name }</Text>
                        <Text style={[ styles.regularText, { marginBottom: 10, color: '#949494' }]}>연락처</Text>
                        <Text style={ styles.regularText }>{ userInfo.phone }</Text>
                    </View>

                    <View style={{ marginTop: 48 }}>
                        <View style={[ styles.rowContainer, { marginBottom: 18 }]}>
                            <Text style={[ styles.boldText, { flex: 1, fontSize: 18, color: '#121619' }]}>예약일시 및 인원​</Text>
                            <Text style={[ styles.regularText, { textDecorationLine: 'underline',  color: '#fd780f'}]} onPress={ () => saveIsOpen(true) }>변경</Text>                        
                        </View>
                        <View style={[ styles.rowContainer, { marginBottom: 24 }]}>
                            <Text style={[ styles.regularText, { flex: 1, fontSize: 18, color: '#949494' }]}>예약일시​</Text>
                            <Text style={ styles.regularText } onPress={ () => saveIsOpen(true) }>{ formatTime(new Date(revInfo.date)) }</Text>                        
                        </View>
                        <View style={[ styles.rowContainer, { marginBottom: 24 }]}>
                            <Text style={[ styles.regularText, { flex: 1, fontSize: 18, color: '#949494' }]}>인원​</Text>
                            <Text style={ styles.regularText } onPress={ () => saveIsOpen(true) }>{ revInfo.people + 1 }명</Text>                        
                        </View>
                    </View>

                    <ScrollView style={ styles.infoRow } horizontal showsHorizontalScrollIndicator={ false }>
                        { Array.from({ length: 6 }, (_, i) => i).map((timeIndex: number) => {
                            const getHour = () => {
                                if (revTime.getHours() < 10) {
                                    return '0' + revTime.getHours()
                                }
                                return revTime.getHours()
                            }

                            const changeTime = () => {
                                if (!isAvailable[timeIndex]) return
                                const selectedDate = revTime.setMinutes(timeIndex * 10)
                                setRevTime(new Date(selectedDate))
                                saveReservationSetting({ date: revTime.toString(), people: revInfo.people })
                            }
                            return (
                                <View key={ timeIndex }>
                                    { !isAvailable[timeIndex] ? (
                                        <Pressable style={[ styles.timeBtn, !isAvailable[timeIndex] && { borderWidth: 1, borderColor: '#cccccc', backgroundColor: '#f2f2f2' }]} onPress={ changeTime } key={ timeIndex }>
                                            <Text style={[ styles.btnText, !isAvailable[timeIndex] && { color: '#121619' } ]}>{ getHour() }:{ timeIndex }0 ~</Text>
                                        </Pressable>
                                    ) : (
                                        <Pressable style={[ styles.timeBtn, revTime.getMinutes() === (timeIndex) * 10 && { borderColor: '#fd780f', backgroundColor: '#fd780f' }]} onPress={ changeTime }>
                                            <Text style={[ styles.btnText, revTime.getMinutes() === (timeIndex) * 10 && { color: '#ffffff' }]}>{ getHour() }:{ timeIndex }0 ~</Text>
                                        </Pressable>
                                    )}
                                     
                                    
                                </View> 
                            )
                        })}
                    </ScrollView>

                    <View style={{ alignItems: 'flex-start', marginTop: 48 }}>
                        <Text style={[ styles.boldText, { fontSize: 18, color: '#121619' }]}>요청사항</Text>
                        <Pressable style={[ styles.rowContainer, { marginTop: 18, paddingRight: 50 }]} onPress={ () => setIsLeft(prev => !prev) }>
                            { isLeft ? (
                                <View style={ styles.filledCircle }>
                                    <Check width={ 16 } height={ 16 } />
                                </View>
                                    ) : (
                                <View style={ styles.circle }>
                                    <GrayCheck />
                                </View>
                            )}
                            <Text style={ styles.regularText }>좌타석</Text>
                        </Pressable>

                        <Pressable style={[ styles.rowContainer, { marginTop: 24, paddingRight: 50 }]} onPress={ () => setLinkedRoom(prev => !prev) }>
                            { linkedRoom ? (
                                <View style={ styles.filledCircle }>
                                    <Check width={ 16 } height={ 16 } />
                                </View>
                                    ) : (
                                <View style={ styles.circle }>
                                    <GrayCheck />
                                </View>
                            )}
                            <Text style={ styles.regularText }>연결된 방​</Text>
                        </Pressable>

                        <Pressable style={[ styles.rowContainer, { marginTop: 24, paddingRight: 50 }]} onPress={ () => setTwoRoom(prev => !prev) }>
                            { twoRoom ? (
                                <View style={ styles.filledCircle }>
                                    <Check width={ 16 } height={ 16 } />
                                </View>
                                    ) : (
                                <View style={ styles.circle }>
                                    <GrayCheck />
                                </View>
                            )}
                            <Text style={ styles.regularText }>방2개로 예약​</Text>
                        </Pressable>

                        <Pressable style={[ styles.rowContainer, { marginTop: 24, paddingRight: 50 }]} onPress={ () => setTwoGame(prev => !prev) }>
                            { twoGame ? (
                                <View style={ styles.filledCircle }>
                                    <Check width={ 16 } height={ 16 } />
                                </View>
                                    ) : (
                                <View style={ styles.circle }>
                                    <GrayCheck />
                                </View>
                            )}
                            <Text style={ styles.regularText }>2게임 연속 예약​​</Text>
                        </Pressable>
                    </View>

                    <Pressable style={ styles.button } onPress={ reserve }>
                        <Text style={ styles.revBtnText }>예약신청</Text>
                    </Pressable>
                </View>

                { isOpen && 
                    <Pressable style={ styles.background } onPress={ () => saveIsOpen(false) }></Pressable>
                }

                
            </ScrollView>
            { isOpen &&
                <Animated.View style={[ styles.reservation, 
                    { transform: [{
                        translateY: indicatorPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [Dimensions.get('window').height, 0], 
                        })
                    }]}]}>
                    <ChangeReservation />
                </Animated.View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#f3f3f3'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#ffffff'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    shopContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 24,
        marginHorizontal: 15
    },
    imgContainer: {
        width: 90,
        height: 60,

        borderRadius: 3
    },
    img: {
        width: '100%',
        height: '100%'
    },
    container: {
        paddingBottom: 200,
        marginBottom: -150,
        paddingHorizontal: 15,

        backgroundColor: '#ffffff'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    background: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 0,

        backgroundColor: '#121619',
        opacity: 0.5,

        zIndex: 1
    },
    reservation: {
        position: 'absolute',
        bottom: 0,
        zIndex: 2
    },
    infoRow: {
        flexDirection: 'row',

        marginTop: 24,
    },
    timeBtn: {
        marginRight: 9,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#949494',
        backgroundColor: '#ffffff'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        paddingHorizontal: 15,
        paddingVertical: 13,

        color: '#121619'
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
    filledCircle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 30,
        height: 30,

        marginRight: 12,

        borderRadius: 50,

        backgroundColor: '#fd780f'
    },
    button: {
        alignItems: 'center',

        marginTop: 75,

        borderRadius: 6,
        backgroundColor: '#fd780f'
    },
    revBtnText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 15,

        color: '#ffffff'
    }
})

export default MakeReservation