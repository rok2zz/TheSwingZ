import { useEffect, useRef, useState } from "react"
import { Alert, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { RouteProp, useIsFocused, useNavigation } from "@react-navigation/native"
import { useReservationActions } from "../../../../../hooks/useReservationActions"
import { useIsOpen, useReservation, useReservationInfo, useRevList, useShopList } from "../../../../../hooks/useReservation"
import { RootStackNavigationProp, ShopStackParamList } from "../../../../../types/stackTypes"
import { ShopInfo } from "../../../../../slices/reservation"
import { Payload } from "../../../../../types/apiTypes"

import TopTabBar from "../../../../../components/tabBar/TopTabBar"
import TabHeader from "../../../../../components/TabHeader"

//svg
import Menu from "../../../../../assets/imgs/store/menu.svg"
import Map from "../../../../../assets/imgs/store/map.svg"
import Eraser from "../../../../../assets/imgs/login/eraser.svg"
import Search from "../../../../../assets/imgs/main/search.svg"
import Flag from "../../../../../assets/imgs/store/flag.svg"
import Location from "../../../../../assets/imgs/store/location.svg"
import Star from "../../../../../assets/imgs/store/star_empty_gray.svg"
import FilledStar from "../../../../../assets/imgs/store/star_fill.svg"
import { useAuthActions } from "../../../../../hooks/useAuthActions"
import { useIsTabConnected } from "../../../../../hooks/useUsers"

interface RevSet {
    index: number
    value: number[]
}

interface Props {
    route: RouteProp<ShopStackParamList, 'Reservation'>
}

const getNextHour = () => {
    const now = new Date()
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000)
    nextHour.setMinutes(0)
    nextHour.setSeconds(0)
    nextHour.setMilliseconds(0)
    return nextHour
}

const Reservation = ({ route }: Props): JSX.Element => {
    const beforeScreen = route.params?.beforeScreen ?? ''
    const navigation = useNavigation<RootStackNavigationProp>()
    const shopList = useShopList()
    const reservationInfo = useReservationInfo()
    const revTimeList = useRevList()
    const isOpen = useIsOpen()
    const { saveIsOpen, saveReservationSetting, setIsFavorite } = useReservationActions()
    const { getShop, setFavoriteShop } = useReservation()
    const { saveIsTabConnected } = useAuthActions() 
    const isConnected = useIsTabConnected()

    const isTabFocused = useIsFocused()
    const [tabType, setTabType] = useState<number>(0)
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')

    const [sortedShop, setSortedShop] = useState<ShopInfo[]>([])
    const [searchedShop, setSearchedShop] = useState<ShopInfo[]>()

    const [reservationTime, setReservationTime] = useState<Date>(getNextHour())
	const searchRef = useRef<TextInput>(null)

    useEffect(() => {
        if (isTabFocused) {
            setReservationTime(getNextHour())
            saveReservationSetting({ date: getNextHour().toString(), people: 0 })
        }
    }, [isTabFocused])

    useEffect(() => {
        getShopInfo()
        if (new Date(reservationInfo.date).getHours() !== new Date().getHours()) {
            setReservationTime(new Date(reservationInfo.date)) 
        }
    }, [reservationInfo])

    useEffect(() => {
        if (shopList && shopList.length > 0) {
            setSortedShop(shopList)
        }
    }, [shopList])

    useEffect(() => {
        if (sortedShop) {
            onPressSearch()
        }
    }, [sortedShop])

    const getShopInfo = async () => {
        if (isConnected) return

        saveIsTabConnected(true)
        const payload: Payload = await getShop(new Date(reservationInfo.date), reservationInfo.people + 1)
        saveIsTabConnected(false)
        if (payload.code !== 1000) {
            Alert.alert('알림', '서버에 연결할 수 없습니다.')
        }
    }

    const handleTypeChange = (newType: number) => {
        setTabType(newType)
    }

    const clearTextInput = () => {
        if (searchRef.current) {
            searchRef.current.setNativeProps({ text: '' })
            setSearchText(''),
            setSearchedShop(sortedShop)
        }
    }

    const onPressSearch = () => {
        if (searchText !== '') {
            const searchIndex: number[] = []
            sortedShop.forEach((item, index) => {
                if ((item.title && item.title.toLowerCase().includes(searchText.toLowerCase())) || (item.address && item.address.toLowerCase().includes(searchText.toLowerCase()))) {
                    searchIndex.push(index)
                }
            })

            const result: ShopInfo[] = []

            if (searchIndex.length > 0) {
                for (let i = 0; i < searchIndex.length; i++) {
                    result[i] = sortedShop[searchIndex[i]]
                }
            }
            setSearchedShop(result)
            return
        }
        setSearchedShop(sortedShop)
    }

    const onPressFavorite = async (shopId: number, isFavorite: string) => {
        if (isConnected) return
        const favorite = isFavorite === 'F' ? 0 : 1
        
        saveIsTabConnected(true)
        const payload: Payload = await setFavoriteShop(shopId, favorite)
        setIsFavorite({ shopId: shopId, isFavorite: isFavorite})
        saveIsTabConnected(false)
        if (payload.code !== 1000) {
            Alert.alert('알림', '서버에 연결할 수 없습니다.')
        }
    }

    const formatTime = () => {
        const month = reservationTime.getMonth() + 1
        const date = reservationTime.getDate()
        const day = ['일', '월', '화', '수', '목', '금', '토'][reservationTime.getDay()]
        let hours = reservationTime.getHours()
        let ampm = '오전'
    
        if (hours >= 12) {
            hours -= 12
            ampm = '오후'
        }
        if (hours === 0) {
            hours = 12
        }
    
        return `${month}월 ${date}일 (${day}) ${ampm} ${hours}시`
    }

    return (
        <View style={ styles.wrapper }>
            <TabHeader title='스크린예약' type={ 4 } isFocused={ isTabFocused } before={ beforeScreen } />
            <View style={ styles.searchContainer }>
                <View style={ styles.rowContainer }>
                    {/* <Pressable style={{ alignItems: 'center' }} onPress={ () => {} } >
                        <Map />
                        <Text style={ styles.listText }>지도</Text>
                    </Pressable> */}

                    <View style={ styles.inputContainer }>
                        <TextInput style={[ styles.input, { marginBottom: 20 }, isSearchFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#121619'}]} 
                            placeholder="매장명, 주소검색" placeholderTextColor="#cccccc" ref={ searchRef } returnKeyType="next" autoCapitalize='none' onFocus={ () => setIsSearchFocused(true) } onBlur={ () => setIsSearchFocused(false) }
                            onChangeText={(text: string): void => setSearchText(text)} onSubmitEditing={ onPressSearch }/>
                        { searchText !== '' && <Eraser style={ styles.eraser } onPress={ clearTextInput } /> }
                        <Search style={ styles.searchIcon } onPress={ onPressSearch } />
                    </View>
                </View>
                
                <View style={ styles.changeContainer }>
                    <View style={[ styles.rowContainer, { flex: 1 }]}>
                        <Text style={ styles.regularText }>{ formatTime() }</Text>
                        <View style={ styles.bar }></View>
                        <Text style={ styles.regularText }>{ reservationInfo.people + 1 }명</Text>
                    </View>

                    <Pressable style={({ pressed }) => [ styles.changeBtn, Platform.OS === 'ios' && pressed && { opacity: 0.5 } ]} onPress={ () => saveIsOpen(true) } android_ripple={{ color: '#b4b4b4' }}>
                        <Text style={[ styles.regularText, { paddingHorizontal: 18, paddingVertical: 9, color: '#ffffff' }]}>변경</Text>
                    </Pressable>
                </View>
            </View>
            <TopTabBar type={ tabType } typeChange={ handleTypeChange } tab1="주변 매장" tab2="즐겨찾기 매장" />
            
            <ScrollView  showsVerticalScrollIndicator={ false }>
                <View style={ styles.listContainer }>
                    { (searchedShop && searchedShop.length > 0) && searchedShop.map((item: ShopInfo, index: number) => {
                        if (isConnected) return
                        if (item.id === 13) return
                        const available: boolean[] = [true, true, true, true, true, true]
                        const revSet: Set<RevSet> = new Set([])
                        
                        let reason = ''

                        const getShopTime = () => {
                            const openTime= item.openAt.split(':')
                            const open = new Date()
                            open.setDate(reservationTime.getDate())
                            open.setHours(parseInt(openTime[0], 10))
                            open.setMinutes(parseInt(openTime[1], 10))
    
                            const closeTime= item.closedAt.split(':')
                            const close = new Date()
                            const closeHour = parseInt(closeTime[0], 10)
                            const closeMin = parseInt(closeTime[1], 10)
                            close.setDate(reservationTime.getDate())
                            close.setHours(closeHour)
                            close.setMinutes(closeMin)
    
                            const revClose = new Date(reservationTime.getTime())
                            revClose.setHours(revClose.getHours() + reservationInfo.people + 1)
    
                            if (close < open) { 
                                close.setDate(close.getDate() + 1)                                    
                            }
    
                            if (open > reservationTime) {
                                for (let i = 0; i < 6; i++) {
                                    available[i] = false
                                }
                            } else if (close < revClose) {
                                for (let i = 0; i < 6; i++) {
                                    available[i] = false
                                }
                            } else if (closeHour === revClose.getHours()) {
                                if (closeMin >= 0 && closeMin < 10) {
                                    for (let i = 0; i < 6; i++) {
                                        available[i] = false
                                    }
                                } else if (closeMin >= 10 && closeMin < 20) {
                                    for (let i = 1; i < 6; i++) {
                                        available[i] = false
                                    }
                                } else if (closeMin >= 20 && closeMin < 30) {
                                    for (let i = 2; i < 6; i++) {
                                        available[i] = false
                                    }
                                } else if (closeMin >= 30 && closeMin < 40) {
                                    for (let i = 3; i < 6; i++) {
                                        available[i] = false
                                    }
                                } else if (closeMin >= 40 && closeMin < 50) {
                                    for (let i = 4; i < 6; i++) {
                                        available[i] = false
                                    }
                                } else if (closeMin >= 50 && closeMin <=60) {
                                    for (let i = 5; i < 6; i++) {
                                        available[i] = false
                                    }
                                }
                            }

                            if (available.every(value => value === false)) {
                                reason = 'time'
                            }
                        }


                        const favoriteShops = shopList.filter(shop => shop.favorite !== null && shop.favorite.toLowerCase() === 'f')
                        const favoriteExist = favoriteShops.length > 0 ? true : false

                        const addRevTime = () => {
                            if (searchedShop && searchedShop.length > 0 && revTimeList && revTimeList.length > 0) {
                                let setIndex = 0
                                for (let i = 0; i < revTimeList.length; i++) {
                                    if (item.id === revTimeList[i].shopId) {
                                        const beginDate = new Date(revTimeList[i].beginAt)
                                        const endDate = new Date(revTimeList[i].endAt)
                                        const begin = beginDate.getFullYear() * 100000000 + (beginDate.getMonth() + 1) * 1000000 + beginDate.getDate() * 10000 + beginDate.getHours() * 100 + beginDate.getMinutes()
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
                        }

                        const compareRevTime = () => {
                            for (let i = 0; i < 6; i++) {
                                const selectedValue = reservationTime.getFullYear() * 100000000 + (reservationTime.getMonth() + 1) * 1000000 + reservationTime.getDate() * 10000 + reservationTime.getHours() * 100 + i * 10
                                
                                const getDuplicatedCount = (): number => {
                                    let count = 0
                                    revSet.forEach(set => {
                                        count += set.value.reduce((acc, num) => {
                                            return acc + (num === selectedValue ? 1 : 0)
                                        }, 0)
                                    })
                                    return count
                                }

                                if (getDuplicatedCount() >= item.totalRoom) {
                                    available[i] = false
                                }

                                if (available.every(value => value === false)) {
                                    reason = 'rev'
                                }
                            }
                        }

                        getShopTime()
                        addRevTime()
                        compareRevTime()
                        return (
                            <View key={ index }> 
                                { tabType === 0 ? (
                                    <>
                                        { available.every(value => value === false) && <View style={ styles.disableBackground }></View> }
                                        <Pressable style={ styles.favoriteBtn } onPress={ () => onPressFavorite(item.id, item.favorite) }>    
                                            { item.favorite === 'F' ? (
                                                <FilledStar width={12} height={12} />
                                            ) : (
                                                <Star width={12} height={12} />
                                            ) }
                                        </Pressable>
                                        <View style={[ styles.storeContainer, index === 0 && { borderTopWidth: 0 }]}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View style={ styles.imgContainer }>
                                                    <Image style={ styles.img } source={ require('../../../../../assets/imgs/store/store_default.jpg' )} />
                                                    { available.every(value => value === false) && 
                                                        <View style={[ styles.disableInfo, reason === 'time' && { backgroundColor: '#f0f0f0' }, reason === 'rev' && { backgroundColor: '#fae9eb' }]}>
                                                            { reason === 'time' ?
                                                                <Text style={[ styles.semiboldText, { color: '#333333' }]}>영업준비중</Text>
                                                                    :
                                                                <Text style={[ styles.semiboldText, { color: '#d61111' }]}>​예약불가능</Text>
                                                            }
                                                        </View>
                                                    }
                                                </View>

                                                <View>
                                                    <Text style={ styles.nameText }>{ item.title }</Text>
                                                    <Text style={ styles.addressText }>{ item.address }</Text>
                                                    {/* <View style={ styles.rowContainer }>
                                                        <Location style={{ marginRight: 3 }} />
                                                        <Text style={ styles.distanceText }>999m</Text>
                                                    </View> */}
                                                </View>
                                            </View>

                                            <ScrollView style={ styles.infoRow } horizontal showsHorizontalScrollIndicator={ false }>
                                                { Array.from({ length: 6 - Number((reservationTime.getMinutes() / 10).toFixed(0)) }, (_, i) => i).map((timeIndex: number) => {
                                                    
                                                    const getHour = () => {
                                                        if (reservationTime.getHours() < 10) {
                                                            return '0' + reservationTime.getHours()
                                                        }
                                                        return reservationTime.getHours()
                                                    }

                                                    const makeReservation = () => {
                                                        if (!available[timeIndex]) return
                                                        reservationTime.setMinutes(reservationTime.getMinutes() + timeIndex * 10)
                                                        saveReservationSetting({ date: reservationTime.toString(), people: reservationInfo.people })
                                                        navigation.navigate('MakeReservation', { shopInfo: item })
                                                    }

                                                    

                                                    return (
                                                        <Pressable style={[ styles.timeBtn, !available[timeIndex] && { borderWidth: 1, borderColor: '#cccccc', backgroundColor: '#f2f2f2' }]} onPress={ makeReservation } key={ timeIndex }>
                                                            <Text style={[ styles.btnText, !available[timeIndex] && { color: '#121619' } ]}>{ getHour() }:{ Number((reservationTime.getMinutes() / 10).toFixed(0)) + timeIndex }0 ~</Text>
                                                        </Pressable>
                                                    )
                                                })}
                                            </ScrollView>
                                        </View>
                                    </>
                                    ) : (
                                    <>
                                        { favoriteExist ? (
                                            <>
                                                { item.favorite === 'F' &&
                                                    <>
                                                        { available.every(value => value === false) && <View style={ styles.disableBackground }></View> }
                                                        <Pressable style={ styles.favoriteBtn } onPress={ () => onPressFavorite(item.id, item.favorite) }>    
                                                            { item.favorite === 'F' ? (
                                                                <FilledStar width={12} height={12} />
                                                            ) : (
                                                                <Star width={12} height={12} />
                                                            ) }
                                                        </Pressable>
                                                        <View style={[ styles.storeContainer, index === 0 && { borderTopWidth: 0 }]}>
                                                            <View style={{ flexDirection: 'row' }}>
                                                                <View style={ styles.imgContainer }>
                                                                    <Image style={ styles.img } source={ require('../../../../../assets/imgs/store/store_default.jpg' )} />
                                                                    { available.every(value => value === false) && 
                                                                        <View style={[ styles.disableInfo, reason === 'time' && { backgroundColor: '#f0f0f0' }, reason === 'rev' && { backgroundColor: '#fae9eb' }]}>
                                                                            { reason === 'time' ?
                                                                                <Text style={[ styles.semiboldText, { color: '#333333' }]}>영업준비중</Text>
                                                                                    :
                                                                                <Text style={[ styles.semiboldText, { color: '#d61111' }]}>​예약불가능</Text>
                                                                            }
                                                                        </View>
                                                                    }
                                                                </View>

                                                                <View>
                                                                    <Text style={ styles.nameText }>{ item.title }</Text>
                                                                    <Text style={ styles.addressText }>{ item.address }</Text>
                                                                    {/* <View style={ styles.rowContainer }>
                                                                        <Location style={{ marginRight: 3 }} />
                                                                        <Text style={ styles.distanceText }>999m</Text>
                                                                    </View> */}
                                                                </View>
                                                            </View>

                                                            <ScrollView style={ styles.infoRow } horizontal showsHorizontalScrollIndicator={ false }>
                                                                { Array.from({ length: 6 - Number((reservationTime.getMinutes() / 10).toFixed(0)) }, (_, i) => i).map((timeIndex: number) => {
                                                                    const getHour = () => {
                                                                        if (reservationTime.getHours() < 10) {
                                                                            return '0' + reservationTime.getHours()
                                                                        }
                                                                        return reservationTime.getHours()
                                                                    }

                                                                    const makeReservation = () => {
                                                                        if (!available[timeIndex]) return
                                                                        reservationTime.setMinutes(reservationTime.getMinutes() + timeIndex * 10)
                                                                        saveReservationSetting({ date: reservationTime.toString(), people: reservationInfo.people })
                                                                        navigation.navigate('MakeReservation', { shopInfo: item })
                                                                    }

                                                                    
                                                                    return (
                                                                        <Pressable style={[ styles.timeBtn, !available[timeIndex] && { borderWidth: 1, borderColor: '#cccccc', backgroundColor: '#f2f2f2' }]} onPress={ makeReservation } key={ timeIndex }>
                                                                            <Text style={[ styles.btnText, !available[timeIndex] && { color: '#121619' } ]}>{ getHour() }:{ Number((reservationTime.getMinutes() / 10).toFixed(0)) + timeIndex }0 ~</Text>
                                                                        </Pressable>
                                                                    )
                                                                })}
                                                            </ScrollView>
                                                        </View>
                                                    </>
                                                }
                                            </>
                                            ) : (
                                            <>
                                                { index === 0 &&
                                                <View style={{ alignItems: 'center' }}>
                                                    <View style={ styles.nonFavorite }>
                                                        <Flag style={{ transform: [{ translateX: 5 }]}} />
                                                    </View>
    
                                                    <Text>즐겨찾기 매장이 없습니다.</Text>
                                                </View>
                                                }
                                            </>
                                        )}
                                    </>
                                )}
                            </View>
                        )
                    })}
                </View>
            </ScrollView>

            { isOpen && 
                <Pressable style={ styles.changeWrapper } onPress={ () => saveIsOpen(false) }></Pressable>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    searchContainer: {
        backgroundColor: '#f3f3f3'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 45,

        paddingHorizontal: 10,
        marginLeft: 17,
        marginRight: 15,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        borderBottomWidth: 1,

        color: '#121619'
	},
    eraser: {
        position: 'absolute',
        right: 57,
        top: 13,
    },
    searchIcon: {
        position: 'absolute',
        right: 15,
        top: 13,
    },
    listText: {
        includeFontPadding: false,
        fontSize: 10,
        fontFamily: 'Pretendard-Reglar',

        marginTop: 3,

        color: '#121619'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiboldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,

        marginBottom: 12,
    },
    bar: {
        width: 1,
        height: 16,

        marginHorizontal: 6,


        backgroundColor: '#cccccc'
    },
    changeBtn: {
        borderRadius: 3,

        backgroundColor: '#fd780f'
    },
    nonFavorite: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,

        marginTop: 90,
        marginBottom: 16,

        borderRadius: 50,

        backgroundColor: '#4abc7f'
    },
    nonFavoriteText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    changeWrapper: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        position: 'absolute',

        backgroundColor: '#000000',
        opacity: 0.5,
    },
    listContainer: {
        marginHorizontal: 15,
        marginBottom: 138,
        marginTop: 6
    },
    storeContainer: {
        paddingVertical: 24,

        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 115,
        height: 78,

        marginRight: 15,

        borderRadius: 3
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 3
    },
    disableBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,

        backgroundColor: 'rgba(240, 240, 240, 0.3)',

        zIndex: 2
    },
    disableInfo: {
        width: 74,

        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 6,
        paddingVertical: 4,

        borderRadius: 3
    },
    favoriteBtn: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 18,
        height: 18,
        position: 'absolute',
        top: 27,
        left: 94,

        borderRadius: 30,
        backgroundColor: '#ffffff',

        zIndex: 5
    },
    nameText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-SemiBold',

        marginBottom: 6,

        color: '#121619'
    },
    addressText: {
        width: Dimensions.get('window').width * 6 / 10,
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 15,

        color: '#666666'
    },
    distanceText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#949494'
    },
    infoRow: {
        flexDirection: 'row',

        marginTop: 18,
    },
    timeBtn: {
        marginRight: 9,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        paddingHorizontal: 15,
        paddingVertical: 13,

        color: '#121619'
    }
})

export default Reservation