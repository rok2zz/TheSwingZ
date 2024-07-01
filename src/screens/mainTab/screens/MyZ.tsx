import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Image, NativeScrollEvent, NativeSyntheticEvent, Platform, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { RouteProp, useIsFocused, useNavigation } from "@react-navigation/native"
import { useRecentAvgRecord, useRecentAvgStat, useRecord, useRecords, useStat } from "../../../hooks/useRecords"
import { Stat } from "../../../slices/record"
import { UserInfo } from "../../../slices/auth"
import { Record } from "../../../slices/record"
import { useIsTabConnected, useUserInfo, useUsers } from "../../../hooks/useUsers"
import { Count, Payload } from "../../../types/apiTypes"
import { MainTabParamList, RootStackNavigationProp } from "../../../types/stackTypes"
import { useRecordActions } from "../../../hooks/useRecordActions"
import { useVideoActions } from "../../../hooks/useVideoActions"
import { useAuthActions } from "../../../hooks/useAuthActions"
import FastImage from "react-native-fast-image"

import RadarChart from "../../../components/RadarChart"
import Chart from "../../../components/Chart"
import TabHeader from "../../../components/TabHeader"
import TopTabBar from "../../../components/tabBar/TopTabBar"

//svg
import EmptyImg from "../../../assets/imgs/my/empty_img.svg"
import EditImg from "../../../assets/imgs/my/edit_img.svg"
import Flag from "../../../assets/imgs/main/flag.svg"

interface Props {
    route: RouteProp<MainTabParamList, 'MyZ'>
}

const MyZ = ({ route }: Props): JSX.Element => {
    const routeType = route.params?.type
    const beforeScreen = route.params?.beforeScreen ?? ''
    const navigation = useNavigation<RootStackNavigationProp>()
    const myProfile: UserInfo = useUserInfo()
    const record: Record = useRecord()
	const stat: Stat = useStat()
    const recentAvgRecord: Record = useRecentAvgRecord()
    const recentAvgStat: Stat = useRecentAvgStat()
    const { removeScoreCardVideo } = useVideoActions()
    const { getProfileImages } = useUsers()
    const { getScore, getStat, getRecentAvgShots, getRecentAvgTeeDistance, getRecentAvgPutts, getRecentAvgFair, getRecentAvgGreen, getRecentAvgParSave } = useRecords()
    const isTabFocused = useIsFocused()
    const { saveIsTabConnected } = useAuthActions() 
    const { saveRecord, saveRecentAvgRecord, saveStat, saveRecentAvgStat } = useRecordActions()
        
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [startIndex, setStartIndex] = useState<number>(0)
    const [imageUri, setImageUri] = useState<string>('')

    const [type, setType] = useState<number>(0)
    const [chartType, setChartType] = useState<number>(0)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        setType(routeType ?? 0)

        if (record.ccArr && record.ccArr.length < 5) {
            const newStartIndex = startIndex + record.ccArr.length
            setStartIndex(newStartIndex)
            return
        }
        setStartIndex(5)
	}, [routeType])

    useEffect(() => {
        setStartIndex(record.ccArr && record.ccArr.length ? record.ccArr.length : 0)
    }, [record])

    useEffect(() => {
        setImageUri('')
        getProfileImg()
    }, [myProfile])

    useEffect(() => {
        removeScoreCardVideo()
    }, [isTabFocused])

    const getProfileImg = async () => {
        if (isConnected) return
        if (myProfile.profileImg)  {
            setIsConnected(true)
            const payload: Payload = await getProfileImages([myProfile.uid])
            if (payload.code !== 1000) {
            setIsConnected(false)
                return
            }

            if (payload.userProfileImgs) {
                setImageUri(payload.userProfileImgs[0].url ?? '')
            }
            setIsConnected(false)
        }
    }

    const handleTypeChange = (newType: number) => {
        setType(newType)
    }

    const getMoreRecord = () => {
        if (isConnected) return

        const getMyRecord = async (): Promise<void> => {
            const payload: Payload = await getScore('A', myProfile.uid, null, 5, startIndex)
            if (payload.code !== 1000) return
            if (payload.record) {
                saveRecord(payload.record)
                setStartIndex(payload.record.ccArr ? payload.record.ccArr.length : 0)
            }
        }
    
        const getMyStat = async (): Promise<void> => {
            const payload: Payload = await getStat('A', myProfile.uid, null, 5, startIndex)

            if (payload.code !== 1000) return

            if (payload.stat) {
                saveStat(payload.stat)
            }
        }

        saveIsTabConnected(true)
        if (record.ccArr && record.ccArr.length === startIndex && startIndex < parseInt(record.totCount ?? '0')) {
            getMyRecord()
            getMyStat()
        }

        setTimeout(() => {
            saveIsTabConnected(false)
        }, 2000)
    }   
    
    // 스크롤이 끝에 도달했을 때 추가 내용을 로드
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isScrolled) return
        setIsScrolled(true)

        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const paddingToBottom = 20
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            getMoreRecord()
        } else if (contentOffset.y < 0 && !isScrolled) { // refresh
            onRefresh()
        }

        setTimeout(() => {
            setIsScrolled(false)
        }, 1500)
    }

    const cutString = (val: string): string => {
        if (!val) return ''

        if (val.length > 20) return val.substring(0, 20) + ".."
        return val
    }

    const getHandicap = () => {
        if (stat.handicap !== '-' && stat.handicap) {
            if (Number(stat.handicap) > 0) {
                return '+' + Number(stat.handicap).toFixed(1) 
            } 
            return Number(stat.handicap).toFixed(1)
        } 
            
        return '-'
    }

    const onRefresh = useCallback(() => {
        saveIsTabConnected(true)
        getMyRecentRecord()
        getMyRecentStat()
        getMyRecord()
        getMyStat()

        setTimeout(() => {
            saveIsTabConnected(false)
        }, 2000)
    }, [])

    const getMyRecentRecord = async (): Promise<void> => {
        const payload: Payload = await getScore('S', myProfile.uid, null, 5, 0)

        if (payload.code !== 1000) return
        if (payload.record) {
            saveRecentAvgRecord(payload.record)
        }
    }

    const getMyRecord = async (): Promise<void> => {
        const payload: Payload = await getScore('A', myProfile.uid, null, 5, 0)
        if (payload.code !== 1000) return

        if (payload.record) {
            saveRecord(payload.record)
        }
    }

    const getMyRecentStat = async (): Promise<void> => {
        const payload: Payload = await getStat('S', myProfile.uid, null, 5, 0)
        if (payload.code !== 1000) return

        if (payload.stat) {
            saveRecentAvgStat(payload.stat)
        }
    }

    const getMyStat = async (): Promise<void> => {
        const payload: Payload = await getStat('A', myProfile.uid, null, 5, 0)

        if (payload.code !== 1000) return
        if (payload.stat) {
            saveStat(payload.stat)
        }
    }

    return (
        <>
            <TabHeader title='마이Z' type={ 1 } isFocused={ isTabFocused } before={ beforeScreen } />
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false } onScroll={ handleScroll } scrollEventThrottle={ 180 }>
                <View style={ styles.profileContainer }>
                    {/* userinfo */}
                    <View style={ styles.profile }>
                        <Pressable style={ styles.profileImg }>
                        { imageUri === '' ? 
                            <EmptyImg /> 
                            : 
                            <FastImage 
                                style={ styles.img } 
                                source={{ 
                                    uri: imageUri,
                                    priority: FastImage.priority.normal,
                                    cache: FastImage.cacheControl.immutable 
                                }} 
                                resizeMode="cover"
                            />
                        }
                        <Pressable style={ styles.editImg } onPress={ () => navigation.navigate('ModifyProfile') }>
                                <EditImg />
                            </Pressable>
                        </Pressable>

                        <View style={ styles.profileInfo }>
                            <Text style={ styles.nickname } onPress={ () => navigation.navigate('ModifyProfile') }>{ myProfile.nick ?? 'nickname' }</Text>
                            {/* <View style={ styles.settingContainer }>
                                <Pressable style={ styles.settingBox } onPress={ ()=> {} }>
                                    <Text style={ styles.settingText }>스크린설정</Text>
                                </Pressable>
                            </View> */}
                        </View>
                    </View>

                    {/* summary */}
                    <View style={ styles.summaryContainer }>
                        <View style={ styles.summary }>
                            <View style={ styles.summaryBox }>
                                <Text style={ styles.summaryType }>완료된 라운드</Text>
                                <View style={[ styles.rowContainer, { alignItems: 'flex-end' }]}>
                                    <Text style={ styles.summaryNum }>{ recentAvgStat.fullRndCnt ?? 0 }</Text>
                                    <Text style={[ styles.summaryType, { transform: [{ translateY: 3 }], color: '#fd780f' }]}>회</Text>
                                </View>
                            </View>
                            <View style={ styles.summaryBox }>
                                <Text style={ styles.summaryType }>5경기 평균</Text>
                                <View style={[ styles.rowContainer, { alignItems: 'flex-end' }]}>
                                    <Text style={ styles.summaryNum }>{ recentAvgStat.dtStat && recentAvgStat.dtStat.length < 5 ? '-' : getRecentAvgShots(recentAvgStat) }</Text>
                                    <Text style={[ styles.summaryType, { transform: [{ translateY: 3 }], color: '#fd780f' }]}>타</Text>
                                </View>
                            </View>
                            <View style={ styles.summaryBox }>
                                <Text style={ styles.summaryType }>핸디캡</Text>
                                <View style={ styles.rowContainer }>
                                    <Text style={ styles.summaryNum }>{ getHandicap() }</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* tabbar */}
                <View style={ styles.tabBarContainer }>
                    <TopTabBar type={ type } typeChange={ handleTypeChange } tab1="내 기록" tab2="기록분석" />
                </View>

                {/* { type === 0 && 
                    <View style={ styles.sortContainer }>  
                        { selectSort && 
                            <View>
                                    
                            </View>
                        } 
                        <Pressable style={ styles.sortBox } onPress={ () => {} }>
                            { sort === 0 && <Text style={ styles.sortText }>최신순</Text> }
                            { sort === 1 && <Text style={ styles.sortText }>코스명</Text> }
                            { sort === 2 && <Text style={ styles.sortText }>베스트타수</Text> }
                            <DownArrow style={{ marginLeft: 6 }} width={ 12 } height={ 12 } />
                        </Pressable>
                    </View>
                } */}

                {/* record */}
                { type === 0 && 
                    <View style={ styles.recordContainer }>
                        { record.ccArr && record.ccArr.length === 0 ?  (
                            <View style={[ styles.recordCard, { alignItems: 'center', marginBottom: 100 }]}>
                                <Flag style={{ marginBottom: 10 }} width={ 48 } height={ 48 } />
                                <Text style={[ styles.blankCardText, { marginBottom: 3 }]}>최근 경기 기록​</Text>
                                <Text style={ styles.blankCardText }>플레이 기록이 아직 없습니다.​</Text>
                            </View>
                        ) : (
                            <>
                                { record.parcount && record.parcount.map((item: Count, index: number) => {
                                    let totalShotCount: number = 0	
                                    const month = (item.date ?? '').slice(4, 6)
                                    const date = (item.date ?? '').slice(6, 8)

                                    if (record.shotcount) {
                                        for (let i = 1; i <= 18; i++) {
                                            totalShotCount += (record.shotcount[index] as any)[`hole${i}`]
                                        }
                                    }

                                    const goScoreCard = () => {
                                        if (record.ccArr) {
                                            const roomId = record.ccArr[index].roomId ?? 0
                                            navigation.push('ScoreCard', { roomId: roomId })
                                        }
                                    }

                                    const getCcName = () => {
                                        if (record.ccArr) {
                                           const a =  record.ccArr[index].courseName.split('(')[1]
                                           const coruseName = a.split(')')[0]

                                           return (record.ccArr[index].ccName + '-' + coruseName) ?? ''
                                        }
                                        return ''
                                    }

                                    return (
                                        <Pressable style={ styles.recordCard } key={ index } onPress={ goScoreCard }>
                                            <Text style={ styles.infoText }>{ month }.{ date }</Text>
                                            <Text style={ styles.ccText }>{ cutString(getCcName()) } </Text>
                                            <View style={[ styles.rowContainer, { alignItems: 'flex-end' }]}>
                                                <Text style={ styles.shotText }>{ totalShotCount }</Text>

                                                <View style={ styles.rowContainer }>
                                                    <Text style={ styles.infoText }>stroke</Text>
                                                    <View style={ styles.bar }></View>
                                                    <Text style={ styles.infoText }>{ record.inArr && record.inArr[index].userCount }인</Text>
                                                </View>
                                            </View>
                                        </Pressable>
                                    )
                                })}
                            </>
                        )}
                    </View>
                }

                {/* analyze */}
                { type === 1 &&
                    <View style={ styles.container }>
                        <Text style={ styles.title }>비교분석</Text>
                        <Text style={ styles.text }>최근 5경기 기준으로 산정됩니다.​</Text>

                        {/* pentagon */}
                        <View style={[ styles.chartContainer, { paddingTop: 0 }]}>
                            <RadarChart record={ recentAvgRecord } stat={ recentAvgStat } />
                        </View>        

                        {/* graph */}
                        { recentAvgStat.dtStat && recentAvgStat.dtStat.length > 4 && 
                            <View style={ styles.chartContainer }>
                                {/* select type */}
                                <ScrollView style={ styles.chartTypeContainer } horizontal={ true } showsHorizontalScrollIndicator={ false }>
                                    <Pressable style={[ styles.chrtTypeBtn, chartType === 0 && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => setChartType(0) }>
                                        <Text style={[ styles.chartTypeText, chartType === 0 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>타수</Text>
                                    </Pressable>
                                    <Pressable style={[ styles.chrtTypeBtn, chartType === 1 && { borderWidth: 0, backgroundColor: '#2a71ff' }]} onPress={ () => setChartType(1) }>
                                        <Text style={[ styles.chartTypeText, chartType === 1 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>드라이버 비거리</Text>
                                    </Pressable>
                                    <Pressable style={[ styles.chrtTypeBtn, chartType === 2 && { borderWidth: 0, backgroundColor: '#ffd037' }]} onPress={ () => setChartType(2) }>
                                        <Text style={[ styles.chartTypeText, chartType === 2 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>파 세이브율</Text>
                                    </Pressable>
                                    <Pressable style={[ styles.chrtTypeBtn, chartType === 3 && { borderWidth: 0, backgroundColor: '#007A4E' }]} onPress={ () => setChartType(3) }>
                                        <Text style={[ styles.chartTypeText, chartType === 3 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>그린 적중률</Text>
                                    </Pressable>
                                    <Pressable style={[ styles.chrtTypeBtn, chartType === 4 && { borderWidth: 0, backgroundColor: '#0025B5' }]} onPress={ () => setChartType(4) }>
                                        <Text style={[ styles.chartTypeText, chartType === 4 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>페어웨이 안착률</Text>
                                    </Pressable>
                                    <Pressable style={[ styles.chrtTypeBtn, chartType === 5 && { borderWidth: 0, backgroundColor: '#E9573F' }]} onPress={ () => setChartType(5) }>
                                        <Text style={[ styles.chartTypeText, chartType === 5 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>퍼팅 수</Text>
                                    </Pressable>
                                </ScrollView>

                                {/* average */}
                                <View style={ styles.rowContainer }>
                                    <Text style={ styles.chartAvgText }>평균</Text>
                                    { chartType === 0 && 
                                        <>
                                            <Text style={ styles.chartAvgNum }>{ getRecentAvgShots(recentAvgStat) }</Text>
                                            <Text style={ styles.chartAvgText }>타</Text> 
                                        </>
                                    }
                                    { chartType === 1 && 
                                        <>
                                            <Text style={ styles.chartAvgNum }>{ getRecentAvgTeeDistance(recentAvgStat) }</Text>
                                            <Text style={ styles.chartAvgText }>m</Text> 
                                        </>
                                    }
                                    { chartType === 2 && 
                                        <>
                                            <Text style={ styles.chartAvgNum }>{ getRecentAvgParSave(recentAvgRecord) }</Text>
                                            <Text style={ styles.chartAvgText }>%</Text> 
                                        </>
                                    }
                                    { chartType === 3 && 
                                        <>
                                            <Text style={ styles.chartAvgNum }>{ getRecentAvgGreen(recentAvgRecord) }</Text>
                                            <Text style={ styles.chartAvgText }>%</Text> 
                                        </>
                                    }
                                    { chartType === 4 && 
                                        <>
                                            <Text style={ styles.chartAvgNum }>{ getRecentAvgFair(recentAvgRecord) }</Text>
                                            <Text style={ styles.chartAvgText }>%</Text> 
                                        </>
                                    }
                                    { chartType === 5 && 
                                        <>
                                            <Text style={ styles.chartAvgNum }>{ getRecentAvgPutts(recentAvgRecord) }</Text>
                                            <Text style={ styles.chartAvgText }>개</Text> 
                                        </>
                                    }
                                </View>
                                <Chart type={ chartType } record={ recentAvgRecord } stat={ recentAvgStat } />
                            </View>
                        }   
                    </View>
                }

            </ScrollView>   
        </>
        
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'      
    },
    profileContainer: {
        marginTop: 24,
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingLeft: 36
    },
    profileImg: {
        width: 96,
        height: 96,

        borderRadius: 40,

        backgroundColor: '#f1f3f8'
    },
    img: {
        width: '100%',
        height: '100%',

        borderRadius: 40
    },
    editImg: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 32,
        height: 32,

        position: 'absolute',
        bottom: 0, 
        right: 0,

        borderRadius: 50,
        backgroundColor: '#949494'
    },
    profileInfo: {
        justifyContent: 'space-between',

        marginLeft: 24,
    },
    nickname: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        marginBottom: 12,

        color: '#ffffff'
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    settingBox: {
        backgroundColor: '#121619'
    },
    settingText: {
        includeFontPadding: false,
        fontSize: 15,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 9,
        paddingHorizontal: 6,

        color: '#ffffff'
    },
    summaryContainer: {        
        marginTop: 16,
        marginHorizontal: 47,
        paddingTop: 18,
        paddingBottom: 24,

        borderTopWidth: 1,
        borderColor: '#121619'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    summaryBox: {
        width: '33%',
        alignItems: 'center'
    },
    summaryType: {
        includeFontPadding: false,
        fontSize: 15,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 6,

        color: '#949494',
    },
    summaryNum: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        color: '#fd780f'
    },
    tabBarContainer: {
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    container: {
        paddingTop: 30,
        paddingBottom: 300,
        marginBottom: -150,
        paddingHorizontal: 15,

        backgroundColor: '#f3f3f3',
    },
    blankCard: {
        alignItems: 'center',

        paddingVertical: 24,

        backgroundColor: '#f2f2f2'
    },
    blankCardText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#666666'
    },
    title: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 6,

        color: '#121619'
    },
    text: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#949494'
    },
    chartContainer: {
        alignItems: 'center',

        paddingVertical: 24,
        marginTop: 27,

        borderRadius: 3,

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
                elevation: 5
            }
        })
    },
    chartTextBox: {
        width: '70%',
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginTop: 15
    },
    recordUserType: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 22
    },
    miniCircle: {
        width: 10,
        height: 10,

        borderRadius: 15
    },
    userTypeText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginLeft: 4,

        color: '#949494'
    },
    noRecordText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 24,
        marginHorizontal: 15,

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
    recordType: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        color: '#949494'
    },
    chartTypeContainer: {
        flexDirection: 'row',
        
        marginLeft: 15,
        marginBottom: 30
    },
    chrtTypeBtn: {
        marginRight: 6,

        borderRadius: 18,
        borderColor: '#949494',
        borderWidth: 1
    },
    chartTypeText: { 
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 9,
        paddingHorizontal: 18,

        color: '#666666'
    },
    chartAvgNum: {
        includeFontPadding: false,
        fontSize: 40,
        fontFamily: 'Pretendard-Bold',

        marginLeft: 6,
        marginRight: 3,

        color: '#121619'
    },
    chartAvgText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 9,

        color: '#1e1f23'
    },
    recordContainer: {
        paddingTop: 30,
        paddingHorizontal: 15,
        paddingBottom: 500,
        marginBottom: -200,

        backgroundColor: '#f3f3f3'
    },
    recordCard: {
        padding: 24,
        marginBottom: 9,

        borderRadius: 3,

        backgroundColor: '#ffffff',

        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 5,
            }
        })
    },
    infoText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 6,

        color: '#666666'
    },
    ccText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 15,

        color: '#121619'
    },
    shotText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 42,
        fontFamily: 'Pretendard-Regular',
        
        color: '#fd780f'
    },
    bar: {
        width: 1,
        height: 16,

        marginHorizontal: 6,

        transform: [{ translateY: -2 }],

        backgroundColor: '#cccccc'
    }
})

export default MyZ