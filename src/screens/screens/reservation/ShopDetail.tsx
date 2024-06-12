import { Alert, Dimensions, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { useReservation, useShopList } from "../../../hooks/useReservation"
import { ShopInfo } from "../../../slices/reservation"
import { useReservationActions } from "../../../hooks/useReservationActions"
import { Bill, Payload } from "../../../types/apiTypes"

// svg
import Location from "../../../assets/imgs/store/location.svg"
import EmptyStar from "../../../assets/imgs/store/star_empty.svg"
import Star from "../../../assets/imgs/store/star_fill.svg"
import Loading from "../../../assets/imgs/common/loading.svg"

interface Props {
    route: RouteProp<RootStackParamList, 'ShopDetail'>
}

const ShopDetail = ({ route }: Props) => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const shopId = route.params.shopId
    const shopList = useShopList()
    const { setIsFavorite } = useReservationActions()
    const { setFavoriteShop, getShopInfo } = useReservation()
    const day = ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]
    
    const [shopInfo, setShopInfo] = useState<ShopInfo>({
        id: -1,
        title: '',
        address: '',
        latitude: '',
        longitude: '',
        favorite: '',
        shopNotice: '',
        contact: '',
        totalRoom: 0,
        openAt: '',
        closedAt: '',
        option: ''
    })
    const [bill, setBill] = useState<Bill[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        if (shopId) {
            for (let i = 0; i < shopList.length; i++) {
                if (shopList[i].id === shopId) {
                    console.log(shopList[i])
                    setShopInfo(shopList[i])
                }
            }

            getBillInfo()
        }
    }, [shopList])

    const getBillInfo = async () => {
        if (isConnected) return
        const payload: Payload = await getShopInfo(shopId)
        setIsConnected(false)
        if (payload.code !== 1000) {
            return
        }

        if (payload.bill) {
            setBill(payload.bill)
        }
    }

    const getOperataionTime = () => {
        let openHour = 'AM'
        let closeHour = 'PM'
        let open = shopInfo.openAt ?? ''
        let close = shopInfo.closedAt ?? ''

        if (open != '') {
            if (Number(open.substring(0, 2)) >= 12) {
                openHour = 'PM'
            }
        }

        if (close != '') {
            if (Number(close.substring(0, 2)) < 12) {
                closeHour = '익일 AM'
            }
        }

        return openHour + ' ' + open.substring(0, 5) + ' ~ ' + closeHour + ' ' + close.substring(0, 5)
    }

    const onPressFavorite = async () => {
        if (isConnected) return
        const favorite = shopInfo.favorite === 'F' ? 0 : 1
        
        setIsConnected(true)
        const payload: Payload = await setFavoriteShop(shopId, favorite)
        setIsFavorite({ shopId: shopId, isFavorite: shopInfo.favorite})
        setIsConnected(false)
        if (payload.code !== 1000) {
            Alert.alert('알림', '서버에 연결할 수 없습니다.')
        }
    }

    const getTurningTime = (week: string) => {
        if (bill && bill.length > 0) {
            for (let i = 0; i < bill.length; i++) {
                if (bill[i].weekYn === week) {
                    const hour = (bill[i].turningTime).substring(0, 2)
                    return  hour + '시'
                }
            }   
        }

        return ''
    }

    const getPay = (time: string, hole: number, week: string) => {
        if (bill && bill.length > 0) {
            if (time === 'after') {
                const result = bill.find(item => item.hole === hole && item.weekYn === week)
                return result?.after
            } else if (time === 'before') {
                const result = bill.find(item => item.hole === hole && item.weekYn === week)
                return result?.before
            }

            return ''
        }

        return ''
    }

    return (
        <>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
                <View style={ styles.imgContainer }>
                    <Image style={ styles.thumbnail } source={ require('../../../assets/imgs/store/store_default.jpg' )} resizeMode="cover"/>
                </View>

                <View style={ styles.container }>
                    <View style={{ marginVertical: 30 }}>
                        <Text style={[ styles.semiBoldText, { marginBottom: 9, fontSize: 24 }]}>{ shopInfo.title ?? '' }</Text>
                        <View style={ styles.rowContainer }>    
                            <Location style={{ marginRight: 3 }} />
                            <Text style={[ styles.regularText, { color: '#949494' }]}>{ shopInfo.address }</Text>
                        </View>
                        <View style={[ styles.rowContainer , { marginTop: 15 }]}>
                            <View style={ styles.options }>
                                <Text style={ styles.semiBoldText }>좌타석</Text>
                            </View>
                            <View style={ styles.options }>
                                <Text style={ styles.semiBoldText }>네트워크방</Text>
                            </View>
                            <View style={ styles.options }>
                                <Text style={ styles.semiBoldText }>특이사항</Text>
                            </View>
                        </View>
                    </View>

                    <View style={[ styles.rowContainer, { justifyContent: 'space-between' }]}>
                        <Pressable style={ styles.starContainer } onPress={ onPressFavorite }>
                            { shopInfo.favorite === 'F' ? <Star /> : <EmptyStar />}
                            
                        </Pressable>
                        <Pressable style={ styles.button } onPress={ () => Linking.openURL(`tel:${shopInfo.contact}`) }>
                            <Text style={[ styles.semiBoldText, { color: '#fd780f' }]}>전화</Text>
                        </Pressable>
                        <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => {
                            navigation.navigate('MakeReservation', { shopInfo: shopInfo })
                        } }>
                            <Text style={[ styles.semiBoldText, { color: '#ffffff' }]}>예약</Text>
                        </Pressable>
                    </View>

                    <View style={ styles.mapContainer }>
                        {/* <MapView
                            provider={ PROVIDER_GOOGLE }
                            region={{
                                latitude: Number(shopInfo.latitude),
                                longitude: Number(shopInfo.longitude),
                                latitudeDelta: 0.0012,
                                longitudeDelta: 0.0012,
                            }}
                            style={{ width: '100%', height: 375 }}
                            zoomEnabled={ false }
                            scrollEnabled={ false }
                        >
                            <Marker
                                coordinate={{
                                    latitude: Number(shopInfo.latitude),
                                    longitude: Number(shopInfo.longitude)
                                }}
                                isPreselected={ true }
                                title={ shopInfo.title }
                            >
                                <Image source={ require('../../../assets/imgs/store/map_pin.png')  } />
                            </Marker>
                        </MapView> */}
                    </View>

                    <View style={{ marginBottom: 48 }}>
                        <Text style={ styles.boldText }>영업시간</Text>

                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 18 }]}>
                            <Text style={[ styles.regularText, (day !== '일' && day !== '토') && { fontFamily: 'Pretendard-Bold' }]}>평일(월~금)</Text>
                            <Text style={[ styles.regularText, (day !== '일' && day !== '토') && { fontFamily: 'Pretendard-Bold' }]}>{ getOperataionTime() }</Text>
                        </View>
                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 24 }]}>
                            <Text style={[ styles.regularText, (day === '일' || day === '토') && { fontFamily: 'Pretendard-Bold' }]}>주말(토,일)</Text>
                            <Text style={[ styles.regularText, (day === '일' || day === '토') && { fontFamily: 'Pretendard-Bold' }]}>{ getOperataionTime() }</Text>
                        </View>
                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 24 }]}>
                            <Text style={[ styles.regularText, day === '일' && { fontFamily: 'Pretendard-Bold' }]}>공휴일</Text>
                            <Text style={[ styles.regularText, day === '일' && { fontFamily: 'Pretendard-Bold' }]}>{ getOperataionTime() }</Text>
                        </View>
                    </View>

                    <View style={{ marginBottom: 48 }}>
                        <Text style={ styles.boldText }>이용요금</Text>
                        <View style={ styles.priceContainer }>
                            <View style={[ styles.rowContainer, { backgroundColor: '#f3f3f3' }]}>
                                <View style={{ width: 50 }}></View>
                                <View style={ styles.priceBox }>
                                    <View style={ styles.priceType }>
                                        <Text style={[ styles.priceText, { paddingVertical: 9 } ]}>주중/평일</Text>
                                    </View>

                                    <View style={[ styles.rowContainer, { backgroundColor: '#fff3e9' }]}>
                                        <View style={{ width: '45%', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#cccccc' }}>
                                            <Text style={ styles.priceText }>{ getTurningTime('N') } 전</Text>
                                        </View>
                                        <View style={{ width: '55%', alignItems: 'center' }}>
                                            <Text style={ styles.priceText }>{ getTurningTime('N') } 이후</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={ styles.priceBox }>
                                    <View style={ styles.priceType }>
                                        <Text style={[ styles.priceText, { paddingVertical: 9 }]}>주말/공휴일</Text>
                                    </View> 

                                    <View style={[ styles.rowContainer, { backgroundColor: '#fff3e9' }]}>
                                        <View style={{ width: '45%', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#cccccc' }}>
                                            <Text style={ styles.priceText }>{ getTurningTime('Y') } 전</Text>
                                        </View>
                                        <View style={{ width: '55%', alignItems: 'center' }}>
                                            <Text style={ styles.priceText }>{ getTurningTime('Y') } 이후</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={[ styles.rowContainer, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#cccccc'}]}>
                                <View style={{ width: 50, alignItems: 'center' }}>
                                    <Text style={ styles.priceText }>18홀</Text>
                                </View>
                                <View style={[ styles.priceBox, styles.rowContainer ]}>
                                    <View style={{ width: '45%', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#cccccc' }}>
                                        <Text style={ styles.priceText }>{ getPay('before', 18, 'N') }</Text>
                                    </View>
                                    <View style={{ width: '55%', alignItems: 'center' }}>
                                        <Text style={ styles.priceText }>{ getPay('after', 18, 'N') }</Text>
                                    </View>
                                </View>
                                <View style={[ styles.priceBox, styles.rowContainer ]}>
                                    <View style={{ width: '45%', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#cccccc' }}>
                                        <Text style={ styles.priceText }>{ getPay('before', 18, 'Y') }</Text>
                                    </View>
                                    <View style={{ width: '55%', alignItems: 'center' }}>
                                        <Text style={ styles.priceText }>{ getPay('after', 18, 'Y') }</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[ styles.rowContainer, { borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#cccccc'}]}>
                                <View style={{ width: 50, alignItems: 'center' }}>
                                    <Text style={ styles.priceText }>9홀</Text>
                                </View>
                                <View style={[ styles.priceBox, styles.rowContainer ]}>
                                    <View style={{ width: '45%', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#cccccc' }}>
                                        <Text style={ styles.priceText }>{ getPay('before', 9, 'N') }</Text>
                                    </View>
                                    <View style={{ width: '55%', alignItems: 'center' }}>
                                        <Text style={ styles.priceText }>{ getPay('after', 9, 'N') }</Text>
                                    </View>
                                </View>
                                <View style={[ styles.priceBox, styles.rowContainer ]}>
                                    <View style={{ width: '45%', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#cccccc' }}>
                                        <Text style={ styles.priceText }>{ getPay('before', 9, 'Y') }</Text>
                                    </View>
                                    <View style={{ width: '55%', alignItems: 'center' }}>
                                        <Text style={ styles.priceText }>{ getPay('after', 9, 'Y') }</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <Text style={[ styles.regularText, { fontSize: 14, color: '#666666'}]}>* 1인당 요금입니다.</Text>
                        <View style={[ styles.rowContainer, { alignItems: 'flex-start', marginTop: 12 } ]}>
                            <Text style={[ styles.regularText, { fontSize: 14, color: '#666666'}]}>* </Text>
                            <Text style={[ styles.regularText, { fontSize: 14, color: '#666666'}]}>자세한 요금은 상이 할 수 있으니, 사전에 안내 받으시길 바랍니다.</Text>
                        </View>
                    </View>

                    <View style={{ marginBottom: 48 }}>
                        <Text style={ styles.boldText }>시설사항</Text>

                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 18 }]}>
                            <Text style={[ styles.regularText, { fontSize: 16, color: '#949494'}]}>보유시스템</Text>
                            <Text style={[ styles.boldText, { fontSize: 16 }]}>더스윙제트 { shopInfo.totalRoom }대</Text>
                        </View>
                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 18 }]}>
                            <Text style={[ styles.regularText, { fontSize: 16, color: '#949494'}]}>좌타석</Text>
                            <Text style={[ styles.boldText, { fontSize: 16 }]}>보유</Text>
                        </View>
                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 18 }]}>
                            <Text style={[ styles.regularText, { fontSize: 16, color: '#949494'}]}>주차</Text>
                            <Text style={[ styles.boldText, { fontSize: 16 }]}>가능</Text>
                        </View>
                        <View style={[ styles.rowContainer, { justifyContent: 'space-between', marginTop: 18 }]}>
                            <Text style={[ styles.regularText, { fontSize: 16, color: '#949494'}]}>룸개수</Text>
                            <Text style={[ styles.boldText, { fontSize: 16 }]}>{ shopInfo.totalRoom }개</Text>
                        </View>
                    </View>                
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        height: 253
    },
    thumbnail: {
        width: '100%',
        height: '100%'
    },
    container: {
        marginHorizontal: 15
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    options: {
        marginRight: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,

        borderRadius: 3,
        backgroundColor: '#f0f0f0'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    starContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 45,
        height: 45,

        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 3
    },
    button: {
        alignItems: 'center',

        width: (Dimensions.get('window').width - 93) / 2 ,

        paddingVertical: 13,

        borderWidth: 1,
        borderColor: '#fd780f',
        borderRadius: 3
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    priceContainer: {
        marginVertical: 18,

        borderWidth: 1,
        borderColor: '#cccccc'
    },
    blank: {
        width: 50
    },
    priceBox: {
        width: (Dimensions.get('window').width - 84) / 2,

        borderLeftWidth: 1,
        borderLeftColor: '#cccccc'
    },
    priceType: {
        alignItems: 'center',

        borderBottomWidth: 1, 
        borderBottomColor: '#cccccc' 
    },
    priceText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 12,

        color: '#121619'
    },
    mapContainer: {
        marginVertical: 30
    }
})

export default ShopDetail