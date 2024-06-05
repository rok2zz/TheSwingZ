import { useCallback, useEffect, useState } from "react"
import { Alert, Image, Linking, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native"
import { Payload } from "../../../types/apiTypes"
import { useMyRevList, useReservation } from "../../../hooks/useReservation"
import { ReservationInfo } from "../../../slices/reservation"
import { useReservationActions } from "../../../hooks/useReservationActions"

// svg
import Flag from "../../../assets/imgs/store/flag.svg"
import UpArrow from "../../../assets/imgs/store/arrow_up.svg"
import DownArrow from "../../../assets/imgs/store/arrow_down.svg"
import Tell from "../../../assets/imgs/store/tell.svg"
import Share from "../../../assets/imgs/store/share.svg"
import Loading from "../../../components/Loading"

const ManageReservation = () => {
    const { getMyReservation, deleteReservation } = useReservation()
    const { saveMyRevList } = useReservationActions()
    const myRevList = useMyRevList()

    const [openDetail, setOpenDetail] = useState<number[]>([])
    const [revList, setRevList] = useState<ReservationInfo[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [refreshing, setRefreshing] = useState<boolean>(false)

    useEffect(() => {
        getRevInfo()
    }, [])

    useEffect(() => {
        setRevList(myRevList)
    }, [myRevList])

    const getRevInfo = async () => {
        if (isConnected) return
        setIsConnected(true)
        const payload: Payload = await getMyReservation(null)
        if (payload.code !== 1000) {
            setIsConnected(false)
            return
        }
        setOpenDetail(Array(myRevList.length).fill(0))
        setIsConnected(false)
    }

    const setOpenIndex = (index: number) => {
        setOpenDetail(prev => {
            const newArr = [...prev]
            newArr[index] = 1 - openDetail[index]
            return newArr
        })
    }

    const cancelReseravtion = async (revId: number, index: number) => {
        if (isConnected) return

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
                        setIsConnected(true)
                        const payload: Payload = await deleteReservation(revId)
                        if (payload.code !== 1000) {
                            Alert.alert('알림','예약을 취소할 수 없습니다.')
                            setIsConnected(false)
                            return
                        }
                        const cancelArr = [...revList]

                        cancelArr[index] = { ...cancelArr[index], status: 'C' }

                        setRevList(cancelArr)
                        saveMyRevList(cancelArr)
                        
                        setIsConnected(false)
                    },
                }
            ],
        )
    }

    const onRefresh = useCallback(() => {
        if (refreshing) return
        setRefreshing(true)
        getRevInfo()

        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    return (
        <>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View>  }
            { revList && revList.length > 0 ? (
                <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }
                    refreshControl={ <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }
                >
                    { revList.map((item: ReservationInfo, index: number) => {
                        const getReservationTime = () => {
                            let beginHour = '오전'
                            let endHour = '오후'
                            let beginAt = new Date(item.beginAt)
                            let endAt = new Date(item.endAt)
                            const day = ['일', '월', '화', '수', '목', '금', '토'][beginAt.getDay()]
                            let beginMin = beginAt.getMinutes()
                            let endMin = endAt.getMinutes()
                    
                            if (beginAt.getHours() >= 12) {
                                beginHour = '오후'
                            }
                
                            if (endAt.getHours() < 12) {
                                endHour = '익일 오전'
                            }

                            return `${beginAt.getMonth() + 1}월${beginAt.getDate()}일(${day}) ${beginHour} ${beginAt.getHours()}시` +
                                    `${beginMin < 10 ? '0' + beginMin : beginMin}분~` +
                                    `${endHour} ${endAt.getHours()}시 ${endMin < 10 ? '0' + endMin : endMin}분`
                        }

                        

                        const getUserMemo = () => {
                            const arr = item.userMemo.split(',')
                            const memo = arr.filter(item => item !== '').join(' / ')

                            return memo
                        }

                        return (
                            <Pressable style={ styles.revContainer } key={ index }onPress={ () => setOpenIndex(index) } >
                                <View style={ styles.rowContainer }>
                                    <View style={[ styles.typeBox, 
                                        item.status === 'R' && { backgroundColor: '#e9ffe9'},
                                        item.status === 'A' && { backgroundColor: '#e9f4ff'},
                                        item.status === 'C' && { backgroundColor: '#f0f0f0'},
                                        item.status === 'P' && { backgroundColor: '#fff3e9'},
                                        item.status === 'S' && { backgroundColor: '#fae9eb'},
                                        item.status === 'E' && { backgroundColor: '#f0f0f0'},
                                        item.status === 'N' && { backgroundColor: '#fae9eb'},
                                    ]}>
                                        { item.status === 'R' && <Text style={[ styles.semiBoldText, { color: '#007a4e' }]}>예약대기</Text>}
                                        { item.status === 'A' && <Text style={[ styles.semiBoldText, { color: '#0025b5' }]}>예약확정</Text>}
                                        { item.status === 'C' && <Text style={[ styles.semiBoldText, { color: '#333333' }]}>예약취소</Text>}
                                        { item.status === 'P' && <Text style={[ styles.semiBoldText, { color: '#fd780f' }]}>게임진행중</Text>}
                                        { item.status === 'S' && <Text style={[ styles.semiBoldText, { color: '#d61111' }]}>게임중단</Text>}
                                        { item.status === 'E' && <Text style={[ styles.semiBoldText, { color: '#333333' }]}>게임완료</Text>}
                                        { item.status === 'N' && <Text style={[ styles.semiBoldText, { color: '#d61111' }]}>미방문</Text>}
                                        
                                    </View>
                                    <Text style={{ flex: 1 }}></Text>
                                    { (item.status === 'R' || item.status === 'A') &&
                                        <Text style={[ styles.regularText, { textDecorationLine: 'underline', color: '#fd780f'}]} onPress={ () => cancelReseravtion(item.id, index) }>예약취소</Text>
                                    }
                                </View>
                                <Text style={[ styles.regularText, { marginTop: 9, marginBottom: 6 }]}>{ getReservationTime() }</Text>
                                <Text style={ styles.boldText }>{ item.title }</Text>

                                <View style={ styles.rowContainer }>
                                    <Text style={[ styles.regularText, { flex: 1, fontSize: 14, marginTop: 9, color: '#666666' }]}>{ item.userCount }명</Text>

                                    { openDetail[index] === 0 ? <DownArrow /> : <UpArrow /> }
                                </View>

                                { openDetail[index] === 1 &&
                                    <View>
                                        { getUserMemo() !== '' &&
                                            <View style={ styles.userMemo }>
                                                <Text style={[ styles.boldText, { fontSize: 16 }]}>{ getUserMemo() }</Text>
                                            </View>
                                        }

                                        <View style={ styles.map }>
                                            {/* <MapView
                                                scrollEnabled={ false }
                                                provider={ PROVIDER_GOOGLE }
                                                initialRegion={{
                                                    latitude: Number(item.latitude),
                                                    longitude: Number(item.longitude),
                                                    latitudeDelta: 0.0012,
                                                    longitudeDelta: 0.0012,
                                                }}
                                                style={{ width: '100%', height: 146 }}
                                                zoomEnabled={ false }
                                                onTouchStart={() => true}
                                            >
                                                <Marker
                                                    coordinate={{
                                                        latitude: Number(item.latitude), longitude: Number(item.longitude)
                                                    }}
                                                    isPreselected={ true }
                                                >
                                                    <Image source={ require('../../../assets/imgs/store/map_pin.png')  } />
                                                </Marker>
                                            </MapView> */}
                                        </View>
                                        
                                        <Text style={[ styles.regularText, { marginTop: 12, marginBottom: 9 }]}>{ item.address }</Text>
                                        <Text style={ styles.regularText }>{ item.contact }</Text>

                                        <View style={ styles.btnContainer }>
                                            <Pressable style={[ styles.button, { borderRightWidth: 0 }]} onPress={ () => Linking.openURL(`tel:${item.contact}`)}>
                                                <Text style={[ styles.regularText, { flex: 1 }]}>전화</Text>
                                                <Tell />
                                            </Pressable>
                                            <Pressable style={ styles.button }>
                                                <Text style={[ styles.regularText, { flex: 1 }]}>공유</Text>
                                                <Share />
                                            </Pressable>
                                        </View>
                                    </View>
                                }
                            </Pressable>
                        )
                    })}
                </ScrollView>
                ) : (
                <View style={[ styles.wrapper, { alignItems: 'center' }]}>
                    <View style={ styles.circle }>
                        <Flag />
                    </View>

                    <Text style={ styles.regularText }>최근 6개월 내 예약정보가 없습니다.</Text>
                </View>   
            )}
        </>
       
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#f3f3f3'
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 90,
        height: 90,

        marginTop: 90,
        marginBottom: 18,

        borderRadius: 50,

        backgroundColor: '#4abc7f'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    revContainer: {
        padding: 18,
        marginHorizontal: 15,
        marginBottom: 30,

        backgroundColor: '#ffffff'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    typeBox: {
        paddingHorizontal: 6,
        paddingVertical: 4,

        borderRadius: 3
    },
    userMemo: {
        marginVertical: 12,
        padding: 15,

        backgroundColor: '#f3f3f3'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        width: '100%',

        marginTop: 24,
        
        borderRadius: 3
    },
    button: {
        flexDirection: 'row',
        width: '50%',

        paddingVertical: 12,
        paddingHorizontal: 15,

        borderWidth: 1,
        borderColor: '#cccccc'
    },
    map: {
        marginTop: 9
    }
})

export default ManageReservation