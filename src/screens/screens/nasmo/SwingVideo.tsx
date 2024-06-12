import { Alert, Animated, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native"
import Svg, { Line } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { useCallback, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import Header from "../../../components/Header"
import { useIsCached, useVideoList, useVideos } from "../../../hooks/useVideos"
import { Payload } from "../../../types/apiTypes"
import { Thumbnail, VideoList } from "../../../slices/video"
import FastImage from "react-native-fast-image"
import { useVideoActions } from "../../../hooks/useVideoActions"
import Loading from "../../../components/Loading"

// svg
import Play from "../../../assets/imgs/swing/play.svg"
import Exclamation from "../../../assets/imgs/swing/exclamation.svg"
import Arrow from "../../../assets/imgs/swing/arrow_down.svg"
import Close from "../../../assets/imgs/swing/close.svg"
import EmptyVideo from "../../../assets/imgs/swing/icon_swing.svg"

 
const SwingVideo = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getMySwingVideoList } = useVideos()
    const { saveIsCached } = useVideoActions()
    const videoList = useVideoList()
    const isCached = useIsCached()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)

    const [openFilter, setOpenFilter] = useState<boolean>(false)
    const [club, setClub] = useState<string>('All')
    const [position] = useState(new Animated.Value(0))

    const [startIndex, setStartIndex] = useState<number>(0)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        if (!isCached) {
            getVideoList(0)
            saveIsCached(true)
        }
    }, [])

    useEffect(() => {
        setStartIndex(videoList.length)
    },[videoList]) 

    useEffect(() => {
        Animated.timing(position, {
            toValue: openFilter ? 1 : 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [openFilter])

    useEffect(() => {
        setOpenFilter(false)
    }, [club])

    const getVideoList = async (index: number) => {
        if (isConnected) return
 
        setIsConnected(true)
        const payload: Payload = await getMySwingVideoList(index, 5)

        if (payload.code !== 1000) {
            Alert.alert('알림', payload.msg ?? '서버에 연결할 수 없습니다.')
            setTimeout(() => {
                setIsConnected(false)
            }, 1000)
            return
        }

        setTimeout(() => {
            setIsConnected(false)
        }, 1000)
    }

    // 스크롤이 끝에 도달했을 때 추가 내용을 로드
    const handleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isScrolled) return
        setIsScrolled(true)
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const paddingToBottom = 20
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            getVideoList(startIndex)
        }

        setTimeout(() => {
            setIsScrolled(false)
        }, 1500)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        return `${year}.${month}.${day}`
    }

    const getSelectedClub = () => {
        if (club === 'All') {
            return '전체'
        } else if (club === 'Driver') {
            return '드라이버'
        } else if (club === 'Wood') {
            return '우드'
        } else if (club === 'Iron') {
            return '아이언'
        } else if (club === 'Wedge') {
            return '웨지'
        } else if (club === 'Putter') {
            return '퍼터'
        } else if (club === 'Utility') {
            return '유틸리티'
        } 
    }

    const onRefresh = useCallback(() => {
        if (refreshing) return

        setRefreshing(true)
        getVideoList(0)
        
        setTimeout(() => {
            setRefreshing(false)
        }, 2000)
    }, [])

    return (
        <View style={ styles.wrapper }>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View>  }
            { videoList.length === 0 ? (
                <>
                    <View style={[ styles.container, { alignItems: 'center'}]}>
                        <View style={{ marginBottom: 15, marginTop: 30 }}>
                            <EmptyVideo style={{ transform: [{ translateX: 5 }]}} />
                        </View>

                        <Text style={[ styles.regularText, { marginBottom: 3, color: '#666666'}]}>플레이별 최대 5개의</Text>
                        <Text style={[ styles.regularText, { color: '#666666'}]}>나의 스윙 영상을 기록할 수 있습니다.​</Text>

                    </View>
                    <View style={ styles.subContainer }>
                        <Exclamation style={{ marginRight: 6, marginTop: 3 }} />
                        <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>스윙영상은 스크린골프시 자동으로 저장되며, 게임당 최대 10개 저장 후 촬영일로부터 유효기간 6개월입니다.</Text>
                    </View>
                </>
                ) : (
                <ScrollView onScroll={ handleScroll } showsVerticalScrollIndicator={ false } scrollEventThrottle={ 16 }
                    refreshControl={ <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }
                >
                    <View style={ styles.filterContainer }>
                        <Pressable style={[ styles.rowContainer, { marginRight: 15 }]} onPress={ () => setOpenFilter(true)}>
                            <Text style={ styles.regularText }>{ getSelectedClub() }</Text>
                            <Arrow style={{ marginLeft: 6, marginTop: 3 }} />
                        </Pressable>
                    </View>

                    <View style={ styles.container }>
                        { videoList.map((item: VideoList, index: number) => {
                            const dashHeight = index === videoList.length - 1 ? 10 : 250
                            
                            let count = item.thumbnail.length
                            for (let i = 0; i < item.thumbnail.length; i++) {
                                if (club === 'Wedge') {
                                    if (!item.thumbnail[i].club.includes('PW') && !item.thumbnail[i].club.includes('SW') && !item.thumbnail[i].club.includes('LW') && !item.thumbnail[i].club.includes('AW')) {
                                        count--
                                    }
                                } else if (club !== 'All' && !item.thumbnail[i].club.includes(club)) {
                                    count--
                                }
                            }

                            if (count <= 0) return
                            
                            return (
                                <View key={ index }>
                                    { item.thumbnail.length !== 0 && 
                                    <View style={ styles.infoContainer }>
                                        <View style={ styles.leftContainer }>
                                            <View style={ styles.circle }></View>
                                            <Svg height="250" width={ 5 } style={ styles.line } >
                                                <Line
                                                    x1={ 2.5 } 
                                                    x2={ 2.5 } 
                                                    y1={ -5 }
                                                    y2={ dashHeight }
                                                    stroke='#cccccc'
                                                    strokeWidth={ 1 }
                                                    strokeOpacity='1'
                                                    strokeDasharray="3, 3"
                                                />
                                            </Svg>
                                        </View>
                                        <View>
                                            <Text style={ styles.regularText }>{ formatDate(item.dayAt) }</Text>
                                            <Text style={ styles.boldText }>{ item.ccName }</Text>
                                            <ScrollView style={ styles.videoContainer } horizontal showsHorizontalScrollIndicator={ false }>
                                                { item.thumbnail.map((thumbnailItem: Thumbnail, thumbnailIndex: number) => {
                                                    if (!thumbnailItem.club.includes(club) && club !== 'All' && club != 'Wedge') return
                                                    if (club === 'Wedge') {
                                                        if (thumbnailItem.club !== 'PW' && thumbnailItem.club !== 'AW' && thumbnailItem.club !== 'LW' && thumbnailItem.club !== 'SW') return
                                                    }
                                                    return (
                                                        <View key={ thumbnailIndex }>
                                                            { (thumbnailItem.url && thumbnailItem.url !== '') &&
                                                                <Pressable style={ styles.thumbnail } onPress={ () => navigation.navigate('VideoDetail', { videoInfo: item, videoIndex: index, thumbnailIndex: thumbnailIndex })}>
                                                                    <FastImage 
                                                                        style={ styles.thumbnailImg } 
                                                                        source={{ 
                                                                            uri: thumbnailItem.url,
                                                                            priority: FastImage.priority.normal,
                                                                            cache: FastImage.cacheControl.immutable 
                                                                        }} 
                                                                        resizeMode="cover" 
                                                                    />  
                                                                    <Play style={ styles.button } />
                                                                    <View style={ styles.info }>
                                                                        <Text style={[ styles.regularText, { fontSize: 14, marginBottom: 0, color: '#ffffff' }]}>{ thumbnailItem.club }</Text>
                                                                        <Text style={[ styles.boldText, { color: '#ffffff' }]}>{ thumbnailItem.distance }m</Text>
                                                                    </View>
                                                                </Pressable>
                                                            }
                                                        </View>
                                                    
                                                    )
                                                })}
                                            </ScrollView>
                                        </View>
                                    </View> 
                                    }
                                </View>
                            )
                        })}
                    </View>

                    <View style={ styles.subContainer }>
                        <Exclamation style={{ marginRight: 6, marginTop: 3 }} />
                        <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>스윙영상은 스크린골프시 자동으로 저장되며, 게임당 최대 10개 저장 후 촬영일로부터 유효기간 6개월입니다.</Text>
                    </View>
                </ScrollView>
            )}
            
            { openFilter &&
                <View style={ styles.filter }>
                    <Pressable style={ styles.background } onPress={ () => setOpenFilter(false) }></Pressable>
                    <Animated.View style={[ styles.filterBox, 
                        { transform: [{
                            translateY: position.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Dimensions.get('window').height, 0], 
                            })
                        }]}]}>
                        <View style={[ styles.rowContainer, { marginBottom: 30 } ]}>
                            <Text style={ styles.semiBoldText }>클럽 필터​</Text>
                            <Pressable onPress={ () => setOpenFilter(false) }>
                                <Close />
                            </Pressable>
                        </View>

                        <View style={[ styles.rowContainer, { width: '100%', justifyContent: 'space-between', marginBottom: 9 }]}>
                            <Pressable style={[ styles.filterBtn, club === 'All' && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('All') }>
                                <Text style={[ styles.filterText, club === 'All' && { color: '#ffffff' }]}>클럽 전체</Text>
                            </Pressable>
                            <Pressable style={[ styles.filterBtn, club === 'Driver' && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('Driver') }>
                                <Text style={[ styles.filterText, club === 'Driver' && { color: '#ffffff' }]}>드라이버</Text>
                            </Pressable>
                        </View>

                        <View style={[ styles.rowContainer, { width: '100%', justifyContent: 'space-between', marginBottom: 9 }]}>
                            <Pressable style={[ styles.filterBtn, club === 'Wood' && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('Wood') }>
                                <Text style={[ styles.filterText, club === 'Wood' && { color: '#ffffff' }]}>우드</Text>
                            </Pressable>
                            <Pressable style={[ styles.filterBtn, club === 'Iron' && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('Iron') }>
                                <Text style={[ styles.filterText, club === 'Iron' && { color: '#ffffff' }]}>아이언</Text>
                            </Pressable>
                        </View>

                        <View style={[ styles.rowContainer, { width: '100%', justifyContent: 'space-between', marginBottom: 9 }]}>
                            <Pressable style={[ styles.filterBtn, club === 'Wedge'  && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('Wedge') }>
                                <Text style={[ styles.filterText, club === 'Wedge' && { color: '#ffffff' }]}>웨지</Text>
                            </Pressable>
                            <Pressable style={[ styles.filterBtn, club === 'Putter' && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('Putter') }>
                                <Text style={[ styles.filterText, club === 'Putter' && { color: '#ffffff' }]}>퍼터</Text>
                            </Pressable>
                        </View>

                        <View style={[ styles.rowContainer, { width: '100%', justifyContent: 'space-between', marginBottom: 60 }]}>
                            <Pressable style={[ styles.filterBtn, club === 'Utility' && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setClub('Utility') }>
                                <Text style={[ styles.filterText, club === 'Utility' && { color: '#ffffff' }]}>유틸리티</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </View>
            }
        </View>
    )
} 

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 30,
        
        backgroundColor: '#f3f3f3'
    },
    filterContainer: {
        alignItems: 'flex-end',

        paddingVertical: 12,
    },
    infoContainer: {
        flexDirection: 'row',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    circle: {
        width: 5,
        height: 5,

        marginTop: 7,

        borderRadius: 50,

        backgroundColor: '#cccccc'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 6,

        color: '#121619'
    },
    semiBoldText: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-SemiBold',

        marginLeft: 30,

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    leftContainer: {
        marginRight: 12,
    },
    videoContainer: {
        marginTop: 15,
        marginRight: 15,
        marginBottom: 30
    },
    thumbnail: {
        width: 156,
        height: 161,

        marginRight: 9,

        borderRadius: 3,

        backgroundColor: 'black'
    },
    thumbnailImg: {
        width: '100%',
        height: '100%',

        borderRadius: 3
    },
    button: {
        position: 'absolute',
        top: 66.5,
        left: 64
    },
    line: {
        position: 'absolute',
        top: 0
    },
    subContainer: {
        flexDirection: 'row',

        paddingRight: 15,
        marginHorizontal: 15, 
        paddingTop: 26, 
        paddingBottom: 84
    },
    background: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        position: 'absolute',
        top: 0,

        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    filter: {
        height: Dimensions.get('window').height,

        position: 'absolute',
        top: 0,
        zIndex: 1
    },
    filterBox: {
        alignItems: 'center',

        width: Dimensions.get('window').width,
        position: 'absolute',
        bottom: 0,

        paddingTop: 24,
        paddingHorizontal: 15,

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        backgroundColor: '#ffffff'
    },
    filterBtn: {
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
    info: {
        position: 'absolute',
        left: 15,
        bottom: 15
    },
})

export default SwingVideo