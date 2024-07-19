import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, BackHandler, Dimensions, Image, Platform, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, ToastAndroid, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RouteProp, useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native"
import { useRecentAvgRecord, useRecentAvgStat, useRecord, useRecords, useStat } from "../../../hooks/useRecords"
import { Stat } from "../../../slices/record"
import { UserInfo } from "../../../slices/auth"
import { Record } from "../../../slices/record"
import { useIsMainLoaded, useUserInfo } from "../../../hooks/useUsers"
import { CcInfo, Payload } from "../../../types/apiTypes"
import { MainTabNavigationProp, MainTabParamList, RootStackNavigationProp } from "../../../types/stackTypes"
import { useRecordActions } from "../../../hooks/useRecordActions"
import { useMyRevList, useReservation } from "../../../hooks/useReservation"
import { ReservationInfo } from "../../../slices/reservation"
import Swiper from "react-native-swiper"
import { useVideoList, useVideos } from "../../../hooks/useVideos"
import { Thumbnail } from "../../../slices/video"
import FastImage from "react-native-fast-image"
import { useAccessToken } from "../../../hooks/useToken"
import { useAuthActions } from "../../../hooks/useAuthActions"
import { useCourse } from "../../../hooks/useCourse"

import RadarChart from "../../../components/RadarChart"

//svg
import Logo from "../../../assets/imgs/common/logo_w.svg"
import Score from "../../../assets/imgs/main/icon_score.svg"
import Search from "../../../assets/imgs/main/icon_search.svg"
import Course from "../../../assets/imgs/main/icon_course.svg"
import ZTV from "../../../assets/imgs/main/icon_tv.svg"
import Customer from "../../../assets/imgs/main/icon_customer.svg"
import Arrow from "../../../assets/imgs/main/right_arrow.svg"
import RightChevron from "../../../assets/imgs/common/arrow_right.svg"
import MapPin from "../../../assets/imgs/main/icon_map_pin.svg"
import Dot from "../../../assets/imgs/main/paging_dot.svg"
import ActiveDot from "../../../assets/imgs/main/paging_active_dot.svg"
import BlackDot from "../../../assets/imgs/main/paging_dot_black.svg"
import BlackActiveDot from "../../../assets/imgs/main/paging_active_dot_black.svg"
import DottedLine from "../../../assets/imgs/main/line_dotted.svg"
import Flag from "../../../assets/imgs/main/flag.svg"
import EmptyVideo from "../../../assets/imgs/main/video_empty.svg"
import BrandLogo from "../../../assets/imgs/brand/logo.svg"
import Play from "../../../assets/imgs/swing/play.svg"

interface Props {
    route: RouteProp<MainTabParamList, 'Main'>
}

const Main = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<MainTabNavigationProp>()
    const rootNavigation = useNavigation<RootStackNavigationProp>()
    const deepLink = route.params?.screen
    const isFocused = useIsFocused()
    const { getScore, getStat, getRecentAvgShots, getRecentAvgTeeDistance, getRecentAvgPutts } = useRecords()
    const { getMySwingVideoList } = useVideos()
    const { getMyReservation } = useReservation()
    const { getCourseInfo } = useCourse()
    const { saveIsTabConnected, saveIsMainLoaded } = useAuthActions() 
    const isMainLoaded = useIsMainLoaded()

    const { saveRecord, saveRecentAvgRecord, saveStat, saveRecentAvgStat } = useRecordActions()
    const accessToken = useAccessToken()
    const record: Record = useRecord()
	const stat: Stat = useStat()
    const recentAvgRecord: Record = useRecentAvgRecord()
    const recentAvgStat: Stat = useRecentAvgStat()
	const userInfo: UserInfo = useUserInfo()

    const [profileImg, setProfileImg] = useState<string>('')

    const myRevList = useMyRevList()
    const myVideoList = useVideoList()
    const [revList, setRevList] = useState<ReservationInfo[]>([])

    const [avgRecord, setAvgRecord] = useState<Record>()
    const [avgStat, setAvgStat] = useState<Stat>()
    const [allRecord, setAllRecord] = useState<Record>()
    const [allStat, setAllStat] = useState<Stat>()

    const backPressedTimeRef = useRef(0)
    const [topBanner, setTopBanner] = useState<string>('highlight banner')
    const [banner, setBanner] = useState<string>('event banner')

    const [refreshing, setRefreshing] = useState(false)


    // 뒤로가기 두번시 앱 종료
    useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				const currentTime = Date.now()
				const timeDiff = currentTime - backPressedTimeRef.current

				if (timeDiff < 2000) {
					BackHandler.exitApp()
				} else {
					backPressedTimeRef.current = currentTime
					ToastAndroid.show('뒤로가기 버튼을 한번 더 누르면 종료됩니다.', ToastAndroid.SHORT)
				}

				return true
			}

			BackHandler.addEventListener('hardwareBackPress', onBackPress)

			return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
		}, [])
	)

	// 홈 접근시 기록 호출
	useEffect(() => {
        if (userInfo.uid !== 0) {
            if (!avgRecord && !isMainLoaded) {
                saveIsTabConnected(true)
                getMyRecentRecord()
                setTimeout(()=> {
                    saveIsTabConnected(false)
                }, 1500)
            }
            if (!avgStat && !isMainLoaded) {
                saveIsTabConnected(true)
                getMyRecentStat()
                setTimeout(()=> {
                    saveIsTabConnected(false)
                }, 1500)
            }
            if (!allRecord && !isMainLoaded) {
                saveIsTabConnected(true)
                getMyRecord()
                setTimeout(()=> {
                    saveIsTabConnected(false)
                }, 1500)
            }
            if (!allStat && !isMainLoaded) {
                saveIsTabConnected(true)
                getMyStat()
                setTimeout(()=> {
                    saveIsTabConnected(false)
                }, 1500)
            }
            if (accessToken && !isMainLoaded) {
                saveIsTabConnected(true)
                getRevInfo()
                getVideoList()
                getCourseList()
                setTimeout(()=> {
                    saveIsTabConnected(false)
                }, 1500)
            }
            setProfileImg(userInfo.profileImg ?? '')

            saveIsMainLoaded(true)
        }
	}, [userInfo])

    useEffect(() => {
        if (isMainLoaded) {
            setAllRecord(record)
        }
    }, [record])

    useEffect(() => {
        if (isMainLoaded) {
            setAllStat(stat)
        }
    }, [stat])

    useEffect(() => {
        if (isMainLoaded) {
            setAvgRecord(recentAvgRecord)
        }
    }, [recentAvgRecord])

    useEffect(() => {
        if (isMainLoaded) {
            setAvgStat(recentAvgStat)
        }
    }, [recentAvgStat])

    useEffect(() => {
        let list: ReservationInfo[] = []
        let now = new Date()
        for (let i = 0; i < myRevList.length; i++) {
            if (new Date(myRevList[i].beginAt) >= now) {
                if (myRevList[i].status === 'R' || myRevList[i].status === 'A') {
                    list = list.concat(myRevList[i])
                }
            }
        }

        const sortedList = list.sort((a, b) => {
            const dateA = new Date(a.beginAt)
            const dateB = new Date(b.beginAt)

            return dateA.getTime() - dateB.getTime()
        })
        setRevList(sortedList)
    }, [myRevList])

    useEffect(() => {
        handleDeepLink(deepLink ?? '')
    }, [route])

    const handleDeepLink = (url: string) => {
		if (url) {
			const route = url.replace(/.*?:\/\//g, '') // "yourdomain.com/path/to/content"
			const [path, ...params] = route.split('#')

            if (path === 'myz') {
				const [type, beforeScreen] = params
				navigation.navigate('MainTab' as any, { screen: 'MyZ', params: { type: parseInt(type, 10), beforeScreen: beforeScreen }})
			} else if (path === 'scorecard') {
                const [roomId] = params
				rootNavigation.navigate('ScoreCard',{ roomId: Number(roomId) })
            } else if (path === 'managereservation') {
				rootNavigation.navigate('ManageReservation')
			} 
		}
	}

    // get recent 5 game's record in 18hole game
    const getMyRecentRecord = async (): Promise<void> => {
        const payload: Payload = await getScore('S', userInfo.uid, null, 5, 0)

        if (payload.code !== 1000) return
        if (payload.record) {
            saveRecentAvgRecord(payload.record)
        }
    }

    // get record 
    const getMyRecord = async (): Promise<void> => {
        const payload: Payload = await getScore('A', userInfo.uid, null, 5, 0)
        if (payload.code !== 1000) return

        if (payload.record) {
            saveRecord(payload.record)
        }
    }

    // get recent 5 game's stat in 18hole game
    const getMyRecentStat = async (): Promise<void> => {
        const payload: Payload = await getStat('S', userInfo.uid, null, 5, 0)
        if (payload.code !== 1000) return

        if (payload.stat) {
            saveRecentAvgStat(payload.stat)
        }
    }

    // get stat
    const getMyStat = async (): Promise<void> => {
        const payload: Payload = await getStat('A', userInfo.uid, null, 5, 0)

        if (payload.code !== 1000) return
        if (payload.stat) {
            saveStat(payload.stat)
        }
    }

    // get reservation
    const getRevInfo = async () => {
        const payload: Payload = await getMyReservation(null)
        if (payload.code !== 1000) {
            return
        }
    }

    const getVideoList = async () => {
        const payload: Payload = await getMySwingVideoList(0, 5)
        if (payload.code !== 1000) {
            Alert.alert('알림', payload.msg ?? '서버에 연결할 수 없습니다.')

            return
        }
    }

    const getCourseList = async () => {
        const payload: Payload = await getCourseInfo()
        if (payload.code !== 1000) {
            Alert.alert('알림', payload.msg ?? '서버에 연결할 수 없습니다.')

            return
        }
    }

    const onRefresh = useCallback(() => {
        if (refreshing) return

        saveIsTabConnected(true)
        saveIsMainLoaded(false)
        setRefreshing(true)
        getMyRecentRecord()
        getMyRecentStat()
        getMyRecord()
        getMyStat()
        getRevInfo()
        getVideoList()

        setTimeout(() => {
            setRefreshing(false)
            saveIsTabConnected(false)
            saveIsMainLoaded(true)
        }, 2000)
    }, [])

    return (
        <SafeAreaView style={ styles.wrapper }>
            { isFocused && <StatusBar backgroundColor='#272727' />}
            <ScrollView showsVerticalScrollIndicator={ false } refreshControl={ <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } /> }>
                <FastImage 
                    style={{ width: 0, height: 0 }}
                    source={{
                        uri: profileImg,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable
                    }}      
                />
                <View style={ styles.background }>
                    <Image style={[ styles.circle, topBanner !== '' && { top: 70 }]} source={ require('../../../assets/imgs/main/main_bg_round.png') } resizeMode="cover"/>
                    <View style={ styles.skewedRectangle }></View>
                </View> 

                <View style={ styles.container }>                                                                                                                   
                    {/* top banner */}
                    {/* { topBanner != '' && 
                        <View style={ styles.topBanner }>
                            <Text style={ styles.topBannerText }>{ topBanner }</Text>
                            <Close style={ styles.close } width={ 10 } height={ 10 } onPress={ () => {} }/>
                        </View> 
                    } */}
                    
                    {/* header */}
                    <View style={ styles.header }>
                        <View style={{ flex: 1 }}>
                            <Text style={[ styles.helloText, { marginBottom: 3 }]}>{ userInfo.nick }님</Text>
                            <Text style={ styles.helloText }>안녕하세요.</Text>
                        </View>
                        <Logo width={ 110 } height={ 21 } />
                    </View>

                    {/* menu */}
                    <View style={ styles.menuContainer }>
                        <Pressable style={ styles.menuIndex } onPress={ () => navigation.navigate('MyZ', { type: 0, beforeScreen: 'Main' }) } >
                            <Score />
                            <Text style={ styles.menuText }>스코어카드</Text>
                        </Pressable>
                        <Pressable style={ styles.menuIndex } onPress={ () => navigation.navigate('ShopStack' as any, { screen: 'FindShop' }) }>
                            <Search />
                            <Text style={ styles.menuText }>매장찾기</Text>
                        </Pressable>
                        <Pressable style={ styles.menuIndex } onPress={ () => rootNavigation.navigate('Course') }>
                            <Course />
                            <Text style={ styles.menuText }>코스소개</Text>
                        </Pressable>
                        <Pressable style={ styles.menuIndex } onPress={ () => rootNavigation.navigate('ZTV') }>
                            <ZTV />   
                            <Text style={ styles.menuText }>제트TV</Text>
                        </Pressable>
                        <Pressable style={[ styles.menuIndex, { transform: [{ translateY: 1 }]}]} onPress={ () => rootNavigation.navigate('Foundation') }>
                            <Customer style={{ marginBottom: 3 }} />   
                            <Text style={ styles.menuText }>창업안내</Text>
                        </Pressable>
                    </View>
                    {/* banner */}
                    { banner !== '' && 
                        <View>

                        </View>
                    }

                    {/* reservation */}
                    { revList && revList.length > 0 &&
                        <View style={ styles.reservationContainer }>
                            <View style={[ styles.rowContainer, { alignItems: 'flex-end' } ]}>
                                <View style={[ styles.rowContainer, { flex: 1, alignItems: 'flex-end'  }]}>
                                    <Text style={ styles.boldText }>예약현황</Text>
                                    <Text style={ styles.regularText }>(</Text>
                                    <Text style={[ styles.boldText, { fontSize: 16, color: '#fd780f' }]}>{ revList.length }</Text>
                                    <Text style={ styles.regularText }>건)</Text>
                                </View>
                                <Pressable style={ styles.rowContainer } onPress={ () => rootNavigation.navigate('ManageReservation')}>
                                    <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>자세히 보기</Text>
                                    <Arrow />
                                </Pressable>
                            </View>

                            <Swiper
                                style={{ height: 130 }}
                                paginationStyle={{ marginBottom: 0 }}
                                dot={ <Dot style={{ marginHorizontal: 3 }} /> }
                                activeDot={ <ActiveDot style={{ marginHorizontal: 3 }} /> }
                                loop={ true }
                                >
                                { revList.map((item: ReservationInfo, index: number ) => {
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

                                    if (index < 5) {
                                        return (
                                            <View style={ styles.reservationInfo } key={ index }>
                                                <Image style={ styles.reseravtionImg } source={ require('../../../assets/imgs/store/store_default.jpg')} resizeMode="cover"/>
                                                <View style={ styles.reservationCover }></View>
                                                <View style={ styles.info }>
                                                    <Text style={[ styles.regularText, { fontSize: 14, color: '#ffffff' }]}>{ getReservationTime() }</Text>
                                                    <View style={[ styles.rowContainer, { marginTop: 7 }]}>
                                                        <Text style={[ styles.boldText, { color: '#ffffff' }]}>{ item.title }</Text>
                                                        <View style={[ styles.typeBox, 
                                                            item.status === 'R' && { backgroundColor: '#007a4e'},
                                                            item.status === 'A' && { backgroundColor: '#0025b5'},
                                                        ]}>
                                                            { item.status === 'R' && <Text style={ styles.semiBoldText }>예약대기</Text>}
                                                            { item.status === 'A' && <Text style={ styles.semiBoldText }>예약확정</Text>}
                                                            
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }
                                })}
                               
                            </Swiper>

                        </View>
                    }

                    {/* record */}
                    <View style={ styles.recordContainer }>
                        <Text style={ styles.title }>기록분석</Text>

                        {/* recent game */}
                        <View>
                            { allRecord?.ccArr?.length === 0 ? (
                                // no record
                                <>
                                    <View style={ styles.blankCard }>
                                        <Flag style={{ marginBottom: 10 }} width={ 48 } height={ 48 } />
                                        <Text style={[ styles.blankCardText, { marginBottom: 3 }]}>최근 경기 기록​</Text>
                                        <Text style={ styles.blankCardText }>플레이 기록이 아직 없습니다.​</Text>
                                    </View>

                                    <DottedLine style={[ styles.dottedLine, { marginTop: 24 }]}/>

                                    <View style={ styles.recentRecord }>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1 }]}>최근 5경기</Text>
                                        </View>
                                    </View>
                                </>
                                ) : (
                                <>
                                    {/* recent scorecard */}
                                    <View style={ styles.rowContainer }>
                                        <Text style={[ styles.regularText, { flex: 1 }]}>최근 경기</Text>
                                        <Pressable style={ styles.rowContainer } onPress={ () => navigation.navigate('MyZ', { type: 0, beforeScreen: 'Main' }) }>
                                            <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>더보기</Text>
                                            <Arrow />
                                        </Pressable>
                                    </View>

                                    { allStat && allRecord &&
                                        <Swiper 
                                            style={{ height: 170 }}
                                            paginationStyle={{ marginBottom: -50 }}
                                            dot={ <BlackDot style={{ marginHorizontal: 3 }} /> }
                                            activeDot={ <BlackActiveDot style={{ marginHorizontal: 3 }} /> }
                                            loop={ true }
                                        >
                                            { allRecord?.ccArr?.map((item: CcInfo, index: number) => {
                                                if (index > 5) return

                                                const month = allRecord?.parcount[index]?.date.slice(4, 6)
                                                const date = allRecord?.parcount[index]?.date.slice(6, 8) 

                                                const getCcName = () => {
                                                    if (record.ccArr && record.ccArr[index].courseName) {
                                                        if (!record.ccArr[index].courseName.includes('(')) {
                                                             return record.ccArr[index].courseName
                                                        }
                                                        const a = record.ccArr[index].courseName.split('(')[1]
                                                        const coruseName = a.split(')')[0]
                                                        if ((record.ccArr[index].ccName + '-' + coruseName).length > 14) {
                                                            return (record.ccArr[index].ccName + '-' + coruseName).substring(0, 14) + '..'
                                                        }

                                                       return (record.ccArr[index].ccName + '-' + coruseName) ?? ''
                                                    }
                                                    return ''
                                                }

                                                return (
                                                    <View style={ styles.recentCard } key={ index }>
                                                        <View style={ styles.orangeCard }>
                                                            <Text style={ styles.orangeCardDate }>{ month }.{ date }</Text>
                                                            <View style={[ styles.rowContainer, { alignItems: 'flex-end', marginVertical: 6 }]}>
                                                                <Text style={ styles.orangeCardHit }>{ allStat?.dtStat[index]?.totCnt }</Text>
                                                                <Text style={ styles.orangeCardText }>타</Text>
                                                            </View>
                                                            <View style={ styles.rowContainer }>
                                                                <MapPin />
                                                                <Text style={ styles.orangeCardLocation }>{ getCcName() }</Text>
                                                            </View>
                                                        </View>
                                                        <View style={ styles.blackCard }>
                                                            <Pressable style={{ alignItems: 'center' }} onPress={ () => rootNavigation.push('ScoreCard', { roomId: item.roomId })}>
                                                                <Score />
                                                                <Text style={ styles.menuText }>스코어카드</Text>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                )
                                            })}
                                            
                                        </Swiper>
                                    }
                                    

                                    <DottedLine style={ styles.dottedLine }/>

                                    <View style={ styles.recentRecord }>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1 }]}>최근 { avgStat?.dtStat.length }경기</Text>
                                            <Pressable style={ styles.rowContainer } onPress={ () => navigation.navigate('MyZ', { type: 1, beforeScreen: 'Main' }) }>
                                                <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>더보기</Text>
                                                <Arrow />
                                            </Pressable>
                                        </View>

                                        {/* summary */}
                                        <View style={ styles.recordSummary }>
                                            <View style={ styles.recordBox }>
                                                <Text style={ styles.recordType }>타수</Text>
                                                <View style={ styles.rowContainer }>
                                                    <Text style={ styles.recordNum }>{ (avgStat?.dtStat && avgStat?.dtStat?.length < 5) ? '--' : getRecentAvgShots(recentAvgStat) }</Text>
                                                    <Text style={ styles.recordText }>타</Text>
                                                </View>
                                            </View>
                                            <View style={[ styles.recordBox, styles.borderHorizontal ]}>
                                                <Text style={ styles.recordType }>비거리</Text>
                                                <View style={ styles.rowContainer }>
                                                    <Text style={ styles.recordNum }>{ (avgStat?.dtStat && avgStat?.dtStat?.length < 5) ? '--' : getRecentAvgTeeDistance(recentAvgStat) }</Text>
                                                    <Text style={ styles.recordText }>m</Text>
                                                </View>
                                            </View>
                                            <View style={ styles.recordBox }>
                                                <Text style={ styles.recordType }>평균 퍼팅 수</Text>
                                                <View style={ styles.rowContainer }>
                                                    <Text style={ styles.recordNum }>{ getRecentAvgPutts(recentAvgRecord) }</Text>
                                                    <Text style={ styles.recordText }>개</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )}
                            {/* pentagon */
                            <RadarChart record={ recentAvgRecord } stat={ recentAvgStat } /> }
                            
                        </View>
                    </View>
                </View>

                {/* etc contents */}
                <View style={ styles.contentsContainer }>
                    {/* swing video */}
                    <View style={ styles.rowContainer }>
                        <Text style={ styles.title }>마이 스윙폼</Text>
                        <Pressable style={ styles.rowContainer } onPress={ () => rootNavigation.navigate('SwingVideo') }>
                            <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>더보기</Text>
                            <Arrow />
                        </Pressable>
                    </View>

                    { myVideoList && myVideoList.length > 0 ? (
                        <ScrollView style={ styles.videoContainer } horizontal showsHorizontalScrollIndicator={ false }>
                            { myVideoList[0].thumbnail.map((thumbnailItem: Thumbnail, thumbnailIndex: number) => {
                                return (
                                    <View key={ thumbnailIndex }>
                                        { (thumbnailItem.url && thumbnailItem.url !== '') &&
                                            <Pressable style={ styles.thumbnail } onPress={ () => rootNavigation.navigate('VideoDetail', { videoInfo: myVideoList[0], videoIndex: 0, thumbnailIndex: thumbnailIndex })}>
                                                <Image style={ styles.thumbnailImg } source={{ uri: thumbnailItem.url }} resizeMode="cover" /> 
                                                <Play style={ styles.button } />
                                                <View style={ styles.swingInfo }>
                                                    <Text style={[ styles.regularText, { fontSize: 14, marginBottom: 0, color: '#ffffff' }]}>{ thumbnailItem.club }</Text>
                                                    <Text style={[ styles.boldText, { color: '#ffffff' }]}>{ thumbnailItem.distance }m</Text>
                                                </View>
                                            </Pressable>
                                        }
                                    </View>
                                )
                            })}
                        </ScrollView>
                            ) : (
                        <View style={ styles.emptyVideo }>
                            <EmptyVideo style={{ marginBottom: 15 }} width={ 48 } height={ 48 } />
                            <Text style={[ styles.blankCardText, { marginBottom: 3 }]}>플레이별 최대 5개의​</Text>
                            <Text style={ styles.blankCardText }>나의 스윙폼 영상을 기록할 수 있습니다.​</Text>
                        </View>                         
                    )}
                    
                    
                    <Text style={ styles.title }>스크린예약</Text>

                    <Pressable style={[ styles.rowContainer, { backgroundColor: '#f3f3f3' }]} onPress={ () => navigation.navigate('ShopStack' as any, { screen: 'Reservation' }) }>
                        <Text style={ styles.reservationText }>예약 가능한 매장을 찾아볼까요?</Text>
                        <RightChevron style={{ paddingRight: 18 }} />
                    </Pressable>

                    <Text style={[ styles.title, { marginTop: 48 }]}>브랜드 스토리</Text>
                    
                    <Pressable style={ styles.brandStory } onPress={ () => rootNavigation.push('Brand') }>
                        <Image style={ styles.img } source={ require('../../../assets/imgs/brand/brand_film_1.jpg')} resizeMode="cover" />
                        <View style={ styles.mask }></View>

                        <View style={ styles.brandSub }>
                            <Text style={ styles.brandExtraBold }>THE SWINGZ</Text>
                            <Text style={[ styles.brandExtraBold, { marginBottom: 8 }]}>BRAND STORY</Text>
                            <Text style={ styles.brandRegluar }>더스윙제트는 무엇이 다를까?</Text>
                        </View>
                    </Pressable>
                    
                    <Text style={[ styles.title, { marginTop: 48 }]}>창업 센터</Text>
                    <Pressable style={ styles.founded } onPress={ () => rootNavigation.push('Foundation') }>
                        <Image style={ styles.img } source={ require('../../../assets/imgs/brand/brand_film_2.jpg')} resizeMode="cover" />
                        <View style={[ styles.mask, { height: 180 }]}></View>

                        <BrandLogo style={ styles.brandLogo } />

                        <View style={ styles.brandSub }>
                            <Text style={[ styles.brandExtraBold, { marginBottom: 8 }]}>상담부터 오픈까지 창업지원</Text>
                            <Text style={ styles.brandRegluar }>우리가 기다린 단 하나의 필드</Text>
                        </View>
                    </Pressable>
                    
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727',
    },
    background: {
        position: 'absolute',
        top: 0,

        backgroundColor: '#272727',
        zIndex: 1,
    },
    circle: {
        width: Dimensions.get('window').width,
        height: 372,
    },
    skewedRectangle: {
        textAlign: 'center',
        width: Dimensions.get('window').width * 2,
        height: 307,

        transform: [
            { skewY: '-30deg' }, // Y축 방향으로 -45도만큼 기울임 (아래로)
            { translateX: -100 },
            { translateY: 150 }, // Y축 방향으로 100만큼 이동하여 사각형을 원래 위치로
        ],

        backgroundColor: '#fd780d',
    },
    container: {
        paddingHorizontal: 15,

        zIndex: 2
    },
    topBanner: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 24,

        backgroundColor: '#f3f3f3'
    },
    topBannerText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 13,
        marginLeft: 15
    },
    close: {
        marginRight: 15
    },
    header: {
        flexDirection: 'row',

        marginTop: 34,
        marginBottom: 60
    },
    helloText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-ExtraLight',

        color: '#ffffff'
    },
    menuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        paddingHorizontal: 16,
        paddingVertical: 20,
        marginBottom:18,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#ffffff',

        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    },
    menuIndex: {
        alignItems: 'center'
    },
    menuText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginTop: 12,

        color: '#ffffff'
    },
    reservationContainer: {
        marginBottom: 18,
        paddingHorizontal: 18,
        paddingTop: 24,
        paddingBottom: 20,

        backgroundColor: '#ffffff'
    },
    reservationInfo: {
        height: 110,

        marginTop: 15,

        borderRadius: 3,
        backgroundColor: 'red'
    },
    reservationCover: {
        width: '100%',
        height: 110,

        position: 'absolute',
        top: 0,
        left: 0,

        backgroundColor: 'rgba(0, 0, 0, 0.5)',

        zIndex: 1
    },
    reseravtionImg: {
        width: '100%',
        height: '100%',

        borderRadius: 3,
    },
    info: {
        width: '100%',
        position: 'absolute',
        top: 15,
        left: 15,
        
        zIndex: 2
    },
    typeBox: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginLeft: 6,

        borderRadius: 3
    },
    recordContainer: {
        paddingVertical: 24,
        paddingHorizontal: 18,

        backgroundColor: '#ffffff',

        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 5,
                    height: 5
                },
                shadowOpacity: 0.16
            },
            android: {
                elevation: 20
            }
        })
    },
    title: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 15,

        color: '#121619'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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

        color: '#ffffff'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    recentCard: {
        flexDirection: 'row',

        marginTop: 12,
    },
    blankCard: {
        alignItems: 'center',

        paddingVertical: 24,

        backgroundColor: '#f2f2f2'
    },
    orangeCard: {
        width: '65%',
        paddingVertical: 23,
        paddingLeft: 18,

        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,

        backgroundColor: '#fd780f'
    },
    blackCard: {
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: 23,
        paddingHorizontal: 18,

        borderTopRightRadius: 3,
        borderBottomRightRadius: 3,

        backgroundColor: '#272727'
    },
    blankCardText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#666666'
    },
    orangeCardDate: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    orangeCardHit: {
        includeFontPadding: false,
        fontSize: 48,
        fontFamily: 'Pretendard-ExtraBold',

        color: '#ffffff'
    },
    orangeCardText: {
        includeFontPadding: false,
        fontSize: 28,
        fontFamily: 'Pretendard-ExtraLight',

        transform: [{ translateY: -7 }],

        color: '#ffffff'
    },
    orangeCardLocation: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginLeft: 3.5,

        color: '#ffffff'
    },
    dottedLine: {
        marginTop: 60,
        marginBottom: 24,

        transform: [{ translateX: -18 }]
    },
    recentRecord: {
    },
    recordSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 24
    },
    recordBox: {
        alignItems: 'center',
        width: '33%'
    },
    borderHorizontal: {
        borderLeftWidth: 1,
        borderRightWidth: 1,

        borderColor: '#dddddd'
    },
    recordType: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        color: '#949494'
    },
    recordNum: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 3,

        color: '#121619'
    },
    recordText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        transform: [{ translateY: 7 }],

        color: '#121619'
    },
    recordUserType: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 22
    },
    contentsContainer: {
        marginTop: -350,
        paddingVertical: 400,
        marginBottom: -210,
        paddingHorizontal: 15,

        backgroundColor: '#ffffff',
    },
    reservationText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',
        
        paddingLeft: 18,
        paddingVertical: 20,

        color: '#121619'
    },
    emptyVideo: {
        alignItems: 'center',

        paddingVertical: 28,
        marginBottom: 48,

        backgroundColor: '#f2f2f2'
    },
    brandStory: {
        alignItems: 'center',
        justifyContent: 'center',

        width: Dimensions.get('window').width - 30,
        height: 330,
    },
    img: {
        width: '100%',
        height: '100%'
    },
    mask: {
        width: '100%',
        height: 330,

        position: 'absolute',
        top: 0,

        opacity: 0.5,

        backgroundColor: '#141414'
    },
    brandSub: {
        position: 'absolute',
        right: 18,
        bottom: 30
    },
    brandExtraBold: {
        textAlign: 'right',

        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-ExtraBold',

        marginBottom: 4,

        color: '#ffffff'
    },
    brandRegluar: {
        textAlign: 'right',

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    founded: {
        height: 180
    },
    brandLogo: {
        position: 'absolute',
        top: 24,
        right: 18
    },
    videoContainer: {
        marginTop: 15,
        marginBottom: 30
    },
    thumbnail: {
        width: 156,
        height: 161,

        marginRight: 5,

        borderRadius: 3,

        backgroundColor: 'black'
    },
    thumbnailImg: {
        width: '100%',
        height: '100%',

        borderRadius: 3
    },
    swingInfo: {
        position: 'absolute',
        left: 15,
        bottom: 15
    },
    button: {
        position: 'absolute',
        top: 64,
        left: 65
    },
})

export default Main