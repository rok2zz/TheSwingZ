import { useEffect, useRef, useState } from "react"
import { Alert, Dimensions, Image, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp, ShopStackNavigationProp } from "../../../../../types/stackTypes"
import Header from "../../../../../components/Header"
import TopTabBar from "../../../../../components/tabBar/TopTabBar"
import { useReservation, useShopList } from "../../../../../hooks/useReservation"
import { ShopInfo } from "../../../../../slices/reservation"
import { Payload } from "../../../../../types/apiTypes"
import { PERMISSIONS, requestMultiple } from "react-native-permissions"
import { useReservationActions } from "../../../../../hooks/useReservationActions"

//svg
import Menu from "../../../../../assets/imgs/store/menu.svg"
import Map from "../../../../../assets/imgs/store/map.svg"
import Eraser from "../../../../../assets/imgs/login/eraser.svg"
import Search from "../../../../../assets/imgs/main/search.svg"
import Flag from "../../../../../assets/imgs/store/flag.svg"
import Location from "../../../../../assets/imgs/store/location.svg"
import Store from "../../../.././../assets/imgs/store/store.svg"
import Tell from "../../../.././../assets/imgs/store/tell.svg"
import Reservation from "../../../.././../assets/imgs/store/reservation.svg"
import Star from "../../../../../assets/imgs/store/star_empty_gray.svg"
import FilledStar from "../../../../../assets/imgs/store/star_fill.svg"
import { useAuthActions } from "../../../../../hooks/useAuthActions"
import { useIsTabConnected } from "../../../../../hooks/useUsers"


const FindShop = () => {
    const navigation = useNavigation<ShopStackNavigationProp>()
    const rootNavigation = useNavigation<RootStackNavigationProp>()

    const shopList = useShopList()
    const { getShop, setFavoriteShop } = useReservation()
    const { setIsFavorite } = useReservationActions()
    const isTabFocused = useIsFocused()
    const [tabType, setTabType] = useState<number>(0)

    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')

    const [sortedShop, setSortedShop] = useState<ShopInfo[]>([])
    const [searchedShop, setSearchedShop] = useState<ShopInfo[]>()
    const { saveIsTabConnected } = useAuthActions() 
    const isConnected = useIsTabConnected()

	const searchRef = useRef<TextInput>(null)

    useEffect(() => {
        if (Platform.OS === 'ios') {
			requestMultiple([PERMISSIONS.IOS.CAMERA]).then((statuses) => {
			})
		} else if (Platform.OS === 'android') {
			requestMultiple([PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION, PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]).then((statuses) => {
                console.log('loca1', statuses[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION])
                console.log('loca2', statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION])
			})
		}
    }, [])

    useEffect(() => {
        const getShopInfo = async () => {
            saveIsTabConnected(true)
            const payload: Payload = await getShop(new Date())
            saveIsTabConnected(false)
            if (payload.code !== 1000) {
                Alert.alert('알림', '서버에 연결할 수 없습니다.')
            }
        }
        if (shopList && shopList.length === 0) {
            getShopInfo()
        }
        setSortedShop(shopList)
    }, [shopList])
    
    useEffect(() => {
        onPressSearch()
    }, [sortedShop])

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

    return (
        <View style={ styles.wrapper }>
            <Header title='매장찾기' type={ 4 } isFocused={ isTabFocused } popToTop={ true }  />
            <View style={ styles.searchContainer }>
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
            <TopTabBar type={ tabType } typeChange={ handleTypeChange } tab1="주변 매장" tab2="즐겨찾기 매장" />

            <ScrollView showsVerticalScrollIndicator={ false }>
                <View style={ styles.listContainer }>
                    { (searchedShop&& searchedShop.length > 0) && searchedShop.map((item: ShopInfo, index: number) => {
                        if (item.id === 13) return
                        const available: boolean[] = [true, true, true, true, true, true]
                        let reason = ''

                        const getShopTime = () => {
                            const now = new Date()
                            const openTime= item.openAt.split(':')
                            const open = new Date()
                            open.setDate(now.getDate())
                            open.setHours(parseInt(openTime[0], 10))
                            open.setMinutes(parseInt(openTime[1], 10))
    
                            const closeTime= item.closedAt.split(':')
                            const close = new Date()
                            const closeHour = parseInt(closeTime[0], 10)
                            const closeMin = parseInt(closeTime[1], 10)
                            close.setDate(now.getDate())
                            close.setHours(closeHour)
                            close.setMinutes(closeMin)
    
                            const revClose = new Date(now.getTime())
                            revClose.setHours(revClose.getHours() + 1)
    
                            if (close < open) { 
                                close.setDate(close.getDate() + 1)                                    
                            }
    
                            if (open > now) {
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

                        getShopTime()

                        const favoriteShops = shopList.filter(shop => shop.favorite !== null && shop.favorite.toLowerCase() === 'f')
                        const favoriteExist = favoriteShops.length > 0 ? true : false

                        const onClickRev = () => {
                            console.log('asdf:' ,available)
                            if (available.every(value => value === false)) {
                                console.log(reason)
                                if (reason === 'time') {
                                    Alert.alert('알림', '현재 해당 매장은 영업준비중입니다.')
                                    return
                                }
                            }
                    
                            rootNavigation.navigate('MakeReservation', { shopInfo: item })
                        }

                        return (
                            <View key={ index }> 
                                { tabType === 0 ? (
                                    <>
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
                                                        <View style={[ styles.disableInfo, reason === 'time' && { backgroundColor: '#f0f0f0' }, reason === 'reservation' && { backgroundColor: '#fae9eb' }]}>
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

                                            <View style={ styles.infoRow }>
                                            <Pressable style={ styles.shopBtn } onPress={ () => rootNavigation.navigate('ShopDetail', { shopId: item.id }) }>
                                                <Text style={ styles.shopBtnText }>매장정보</Text>
                                                <Store />
                                            </Pressable>
                                            <Pressable style={[ styles.shopBtn, { borderLeftWidth: 0, borderRightWidth: 0 }]} onPress={ () => Linking.openURL(`tel:${item.contact}`) }>
                                                <Text style={ styles.shopBtnText }>전화</Text>
                                                <Tell />
                                            </Pressable>
                                            <Pressable style={ styles.shopBtn } onPress={ onClickRev }>
                                                <Text style={ styles.shopBtnText }>예약</Text>
                                                <Reservation />
                                            </Pressable>
                                        </View>
                                        </View>
                                    </>
                                    ) : (
                                    <>
                                        { favoriteExist ? (
                                            <>
                                                { item.favorite === 'F' &&
                                                    <>
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
                                                                </View>

                                                                <View>
                                                                    <Text style={ styles.nameText }>{ item.title }</Text>
                                                                    <Text style={ styles.addressText }>{ item.address }</Text>
                                                                    <View style={ styles.rowContainer }>
                                                                        <Location style={{ marginRight: 3 }} />
                                                                        <Text style={ styles.distanceText }>999m</Text>
                                                                    </View>
                                                                </View>
                                                            </View>

                                                            <View style={ styles.infoRow }>
                                                                <Pressable style={ styles.shopBtn } onPress={ () => rootNavigation.navigate('ShopDetail', { shopId: item.id }) }>
                                                                    <Text style={ styles.shopBtnText }>매장정보</Text>
                                                                    <Store />
                                                                </Pressable>
                                                                <Pressable style={[ styles.shopBtn, { borderLeftWidth: 0, borderRightWidth: 0 }]} onPress={ () => Linking.openURL(`tel:${item.contact}`) }>
                                                                    <Text style={ styles.shopBtnText }>전화</Text>
                                                                    <Tell />
                                                                </Pressable>
                                                                <Pressable style={ styles.shopBtn } onPress={ () => rootNavigation.navigate('MakeReservation', { shopInfo: item }) }>
                                                                    <Text style={ styles.shopBtnText }>예약</Text>
                                                                    <Reservation />
                                                                </Pressable>
                                                            </View>
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
                    }
                        
                    )}
                </View>
            </ScrollView>
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
    map: {
        width: '100%',
        height: 375,

        position: 'absolute',
        top: 0,
        left: 0
    },
    mapContainer: {
        alignItems: 'center',

        width: Dimensions.get('window').width,
        
        marginTop: 320,
        paddingTop: 12, 
        paddingHorizontal: 15,
        marginBottom: -180,
        paddingBottom: 300,

        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30,

        backgroundColor: '#ffffff',
        
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: -1
                },
                shadowOpacity: 0.2,
            }
        })
    },
    listContainer: {
        paddingHorizontal: 15,
        marginBottom: 138,
        marginTop: 6
    },
    bar: {
        width: 60,
        height: 6,

        borderRadius: 5,
        backgroundColor: '#cccccc'
    },
    storeContainer: {
        paddingVertical: 24,

        borderTopWidth: 1,
        borderTopColor: '#eeeeee'
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 115,
        height: 78,

        marginRight: 15
    },
    img: {
        width: '100%',
        height: '100%'
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
    shopBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        width: (Dimensions.get('window').width - 30) / 3,

        paddingHorizontal: 15,
        paddingVertical: 12,

        borderWidth: 1,
        borderColor: '#cccccc'
    },
    shopBtnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
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
    disableInfo: {
        width: 74,

        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 6,
        paddingVertical: 4,

        borderRadius: 3
    },
    semiboldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
})

export default FindShop