import { useEffect, useState } from "react"
import { NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import Loading from "../../../components/Loading"
import TopTabBar from "../../../components/tabBar/TopTabBar"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import HeaderWithClose from "../../../components/HeaderWithClose"
import { CompetitionDetailResult, CompetitionRankResult, Payload, UserProfileImgs } from "../../../types/apiTypes"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import FastImage from "react-native-fast-image"

import EmptyImg from "../../../assets/imgs/my/empty_img.svg"
import { useCompetition } from "../../../hooks/useCompetition"
import { RevSet } from "../../../types/screenTypes"

interface Props {
    route: RouteProp<RootStackParamList, 'CompetitionDetail'>
}
const CompetitionDetail = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const id = route.params.id ?? 0
    const beforeScreen = route.params.before ?? 'Main'
    const userInfo = useUserInfo()
    const { getCompetitionDetail, getCompetitionRank } = useCompetition()
    const { getProfileImages } = useUsers()
    
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    const [type, setType] = useState<number>(0)
    const [rankType, setRankType] = useState<string>('A')
    const [courseType, setCourseType] = useState<string>('R')
    const [profileImgs, setProfileImgs] = useState<string>('')

    const [compDetail, setCompDetail] = useState<CompetitionDetailResult[]>([])
    const [compStatus, setCompStatus] = useState<number>(0) // 0 : playing, 1 : before open, 2 : end
    const [topFive, setTopFive] = useState<number>(5)
    const [myRank, setMyRank] = useState<CompetitionRankResult[]>([])
    const [rankArr, setRankArr] = useState<CompetitionRankResult[]>([])
    const [pageIndex, setPageIndex] = useState<number>(0)
    const [duplicatedRank, setDuplicatedRank] = useState(new Set())
    const [duplicatedCourseRank, setDuplicatedCourseRank] = useState(new Set())

    useEffect(() => {
        getProfileImg()
        getDetail()

        if (beforeScreen === 'ScoreCard') {
            setType(1)
        }
    }, [])

    useEffect(() => {
        getRank()
    }, [rankType, courseType])

    useEffect(() => {
        if (compDetail && compDetail.length > 0) {
            const now = new Date()
            const stDate = new Date(compDetail[0].stDate)
            const edDate = new Date(compDetail[0].edDate)
            edDate.setHours(23)
            edDate.setMinutes(59)
    
            if (now < stDate) {
                setCompStatus(1)
            } else if (now > edDate) {
                setCompStatus(2)
            }
        }
    }, [compDetail])

    useEffect(() => {
        if (rankArr && rankArr.length > 0) {
            setPageIndex(rankArr.length )
        }
    }, [rankArr])

    // useEffect(() => {
    //     if (rankArr && rankArr.length >  0) {
    //         const set: Set<number> = new Set([])
    //         const courseSet: Set<number> = new Set([])

    //         for (let i = 0; i < rankArr.length; i++) {
    //             set.add(rankArr[i].ranking)
    //             if (courseType !== 'R') {
    //                 courseSet.add(rankArr[i].ccRank)
    //             }
    //         }
    //         setDuplicatedRank(set)
    //         setDuplicatedCourseRank(courseSet)
    //     }
    // }, [rankArr])
    
    // change top menu
    const handleTypeChange = (newType: number) => {
        setType(newType)
    }

    // get competition detail
    const getDetail = async () => {
        if (isConnected) return
        setIsConnected(true)
        const payload: Payload = await getCompetitionDetail(id)
        setIsConnected(false)
        if (payload.code !== 1000) return
        if (payload.compDetail) {
            setCompDetail(payload.compDetail)
        }
    }

    // get ranking
    const getRank = async () => {
        if (isConnected) return
        setIsConnected(true)
        const payload: Payload = await getCompetitionRank(courseType, rankType, id, pageIndex)
        setIsConnected(false)
        if (payload.code !== 1000) return

        

        if (payload.rankArr) {
            if (pageIndex > 0) {
                let arr = [...rankArr, ...payload.rankArr]

                setRankArr(arr)
                return
            }
            setRankArr(payload.rankArr)
        }
        if (payload.myRankArr) { 
            setMyRank(payload.myRankArr)
        }
    }
    
    const getProfileImg = async () => {
        if (isConnected) return
        const payload: Payload = await getProfileImages([userInfo.uid]) 
        setIsConnected(false)
        if (payload.code !== 1000) {
            return
        }

        if (payload.userProfileImgs) {
            setProfileImgs(payload.userProfileImgs[0].url)
        }
        
    }

    const getCompType = () => {
        switch (compDetail[0].compType) {
            case 'H':
                return '본사'                 
            case 'S':
                return '매장'
            case 'U':
                return '유저'
            case 'E':
                return '기타'                           
        }
    }

    // format date
    const getTimeRemaining = () => {
        const now = new Date()
        const edDate = new Date(compDetail[0].edDate)
        edDate.setHours(23)
        edDate.setMinutes(59)

        if (compStatus === 2) return
        const nowYear = now.getFullYear()
        const nowMonth = now.getMonth()
        const nowDay = now.getDate()
        const nowHour = now.getHours()
        const nowMin = now.getMinutes()

        if(compStatus === 0) { 
            const date = new Date(edDate)
            const year = date.getFullYear() 
            const month = date.getMonth()
            const day = date.getDate()

            if (year === nowYear) {
                if (month === nowMonth) {
                    if (day === nowDay) {
                        // if (hour === nowHour) {
                        //     if (min === nowMin) {
                        //         return '곧 시작'
                        //     }
                        //     return nowMin - min + '분 남음'
                        // }
                        // return hour - nowHour + '시간 남음'
                        return '오늘 종료'
                    }
                    return day - nowDay + '일 남음'
                }
                
                return month - nowMonth + '달 남음'
            }

        } else if(compStatus === 1) {
            const date = new Date(compDetail[0].stDate)
            const year = date.getFullYear() 
            const month = date.getMonth()
            const day = date.getDate()
            const hour = date.getHours()
            const min = date.getMinutes()

            if (year === nowYear) {
                if (month === nowMonth) {
                    if (day === nowDay) {
                        if (hour === nowHour) {
                            if (min === nowMin) {
                                return '곧 시작'
                            }
                            return nowMin - min + '분 전'
                        }
                        return nowHour - hour + '시간 전'
                    }
                    return nowDay - day + '일 전'
                }
                
                return nowMonth - month + '달 전'
            }
        }
    } 

    const formatDate = () => {
        const stDate = new Date(compDetail[0].stDate)
        const edDate = new Date(compDetail[0].edDate)
        edDate.setHours(23)
        edDate.setMinutes(59)

        const day = ['일', '월', '화', '수', '목', '금', '토']
        const stMonth = (stDate.getMonth() + 1) < 10 ? '0' + (stDate.getMonth() + 1) : (stDate.getMonth() + 1)
        const edMonth = (edDate.getMonth() + 1) < 10 ? '0' + (edDate.getMonth() + 1) : (edDate.getMonth() + 1)
        const stDay = (stDate.getDate()) < 10 ? '0' + (stDate.getDate()) : (stDate.getDate())
        const edDay = (edDate.getDate()) < 10 ? '0' + (edDate.getDate()) : (edDate.getDate())

        return `${stDate.getFullYear().toString()}.${stMonth}.${stDay}(${day[stDate.getDay()]}) ~`  +
                `${edDate.getFullYear().toString()}.${edMonth}.${edDay}(${day[edDate.getDay()]})`
    }

    // 스크롤이 끝에 도달했을 때 추가 내용을 로드
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isScrolled) return
        setIsScrolled(true)

        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        const paddingToBottom = 20
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            getRank()
        } 

        setTimeout(() => {
            setIsScrolled(false)
        }, 1500)
    }


    const Information = (): JSX.Element => {
        return (
            <>
                <View style={[ styles.rowContainer, { alignItems: 'center', marginTop: 26 }]}>
                    <View style={[ styles.rowContainer, { flex: 1, alignItems: 'center' }]}>
                        { compStatus === 0 &&
                            <View style={ styles.status }>
                                <Text style={ styles.semiBoldText }>진행중</Text>
                            </View>
                        }
                        { compStatus === 1 &&
                            <View style={[ styles.status, { backgroundColor: '#e9ffe9'} ]}>
                                <Text style={[ styles.semiBoldText, { color: '#007a4e' }]}>진행예정</Text>
                            </View>
                        }
                        { compStatus === 2 && 
                            <View style={[ styles.status, { backgroundColor: '#f0f0f0'} ]}>
                                <Text style={[ styles.semiBoldText, { color: '#333333' }]}>종료됨</Text>
                            </View>
                        }
                        <Text style={[ styles.regularText, { fontSize: 14 }, compStatus === 0 ? { color: '#e20500' } : { color: '#009746' }]}>{ getTimeRemaining() }</Text>
                    </View>
                    <Text style={ styles.extraLightText }>{ getCompType() }대회</Text>
                </View>

                <Text style={[ styles.boldText, { marginTop: 10 }]}>{ compDetail[0].compName }</Text>

                { type === 1 && <Text style={[ styles.regularText, { fontSize: 13, marginTop: 8 }]}>{ formatDate() }</Text> }
                <View style={[ styles.rowContainer, styles.underLine, { marginTop: 8, paddingBottom: 19 }]}>
                    <Text style={[ styles.regularText, { fontSize: 14, color: '#fd780f' }]}>{ compDetail[0].totRounds ?? 0 }</Text>
                    <Text style={[ styles.regularText, { fontSize: 14, color: '#999999' }]}> 라운드 진행</Text>
                    <View style={ styles.bar }></View>
                    <Text style={[ styles.regularText, { fontSize: 14, color: '#fd780f' }]}>{ compDetail[0].totUserCnt ?? 0 }</Text>
                    <Text style={[ styles.regularText, { fontSize: 14, color: '#999999' }]}> 명 참여</Text>
                </View>
            </>
        )
    }

    return (
        <View style= { styles.wrapper }>
            <HeaderWithClose title='대회 상세' type={ 0 } isFocused before={ beforeScreen } />
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View>  }
            <TopTabBar type={ type } typeChange={ handleTypeChange } tab1='대회 정보' tab2='랭킹' />

            {/* my ranking on bottom */}
            { myRank && type === 1 && myRank.length === 1 && ((courseType === 'R' && myRank[0].ranking) || (courseType === 'A' && myRank[0].ccRank) || 
                (courseType === 'B' && myRank[0].ccRank) || (courseType === 'C' && myRank[0].ccRank)) &&
                <View style={ styles.myRankContainer }> 
                    <View style={ styles.myRank }>
                        <View style={[ styles.rowContainer, { flex: 1 }]}>
                            <Text style={[ styles.boldText, { fontSize: 14, marginRight: 24 }]}>{ courseType === 'R' ? myRank[0].ranking : myRank[0].ccRank }</Text>
                            <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>{ myRank[0].nick }</Text>
                        </View>
                        { courseType === 'R' && <Text style={[ styles.boldText, { fontSize: 14 }]}>{ rankType === 'A' ? myRank[0].totScore ?? 0 : myRank[0].totRounds ?? 0 }</Text> }
                        { courseType === 'A' && <Text style={[ styles.boldText, { fontSize: 14 }]}>{ rankType === 'A' ? myRank[0].ccScore ?? 0 : myRank[0].totRounds ?? 0 }</Text> }
                        { courseType === 'B' && <Text style={[ styles.boldText, { fontSize: 14 }]}>{ rankType === 'A' ? myRank[0].ccScore  ?? 0: myRank[0].totRounds ?? 0 }</Text> }
                        { courseType === 'C' && <Text style={[ styles.boldText, { fontSize: 14 }]}>{ rankType === 'A' ? myRank[0].ccScore ?? 0 : myRank[0].totRounds ?? 0 }</Text> }
                    </View>
                </View>
            }    

            { compDetail && compDetail.length > 0 &&
                <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false } onScroll={ handleScroll } scrollEventThrottle={ 180 }>
                    <Information />
               
                    { type === 0 ? (
                        <>
                            <View style={[ styles.underLine, { marginTop: 14, marginBottom: 10 }]}>
                                <View style={[ styles.rowContainer, { marginBottom: 16 }]}>
                                    <Text style={ styles.regularText }>참여매장</Text>
                                    <Text style={[ styles.regularText, { marginLeft: 12, color: '#121619' }]}>{ compDetail[0].shopName ?? '' }</Text>
                                </View>
                                <View style={[ styles.rowContainer, { marginBottom: 16 }]}>
                                    <Text style={ styles.regularText }>대회설명</Text>
                                    <Text style={[ styles.regularText, { marginLeft: 12, color: '#121619' }]}>{ compDetail[0].compExplan ?? '' }</Text>
                                </View>
                                <View style={[ styles.rowContainer, { marginBottom: 16 }]}>
                                    <Text style={ styles.regularText }>대회기간</Text>
                                    <Text style={[ styles.regularText, { marginLeft: 12, color: '#121619' }]}>{ formatDate() }</Text>
                                </View>
                                <View style={[ styles.rowContainer, { marginBottom: 16 }]}>
                                    <Text style={ styles.regularText }>코스</Text>
                                    <Text style={[ styles.regularText, { marginRight: 12, color: '#ffffff' }]}>코스</Text>
                                    <View>
                                        { compDetail[0].ccName1 &&
                                            <View style={[ styles.rowContainer ]}>
                                                <Text style={[ styles.boldText, { fontSize: 16, marginRight: 10 }]}>A코스</Text>
                                                <Text style={[ styles.regularText, { color: '#121619' }]}>{ compDetail[0].ccName1 }</Text>
                                            </View>
                                        }
                                        { compDetail[0].ccName2 &&
                                            <View style={[ styles.rowContainer ]}>
                                                <Text style={[ styles.boldText, { fontSize: 16, marginRight: 11.5 }]}>B코스</Text>
                                                <Text style={[ styles.regularText, { color: '#121619' }]}>{ compDetail[0].ccName2 }</Text>
                                            </View>
                                        }
                                        { compDetail[0].ccName3 &&
                                            <View style={[ styles.rowContainer ]}>
                                                <Text style={[ styles.boldText, { fontSize: 16, marginRight: 10 }]}>C코스</Text>
                                                <Text style={[ styles.regularText, { color: '#121619' }]}>{ compDetail[0].ccName3 }</Text>
                                            </View>
                                        }                                        
                                    </View>
                                </View>
                            </View>

                            { (() => {
                                const getDifficulty = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Easy':
                                                return '루키'
                                            case 'Normal':
                                                return '아마추어'
                                            case 'Pro':
                                                return '프로'
                                            case 'Master':
                                                return '투어'
                                        }

                                        return item
                                    }

                                    return ''
                                }

                                const getWindCondition = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Weakless':
                                                return '매우 약하게'
                                            case 'Weak':
                                                return '약하기'
                                            case 'Normal':
                                                return '보통'
                                            case 'Strong':
                                                return '강하게'
                                        }

                                        return item
                                    }
   
                                    return ''
                                }

                                const getGreenCondition = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Normal':
                                                return '보통(2.4m)'
                                            case 'Little_Fast':
                                                return '약간 빠름(2.6m)'
                                            case 'Fast':
                                                return '빠름(2.8m)'
                                            case 'Very_Fast':
                                                return '매우 빠름(3.1m)'
                                        }
                                       
                                        return item
                                    }

                                    return ''
                                }

                                const getGreenHardness = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Normal':
                                                return '보통'
                                            case 'Hard':
                                                return '단단함'
                                        }

                                        return item
                                    }

                                    return ''
                                }

                                const getGreenLocation = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Right':
                                                return '오른쪽'
                                            case 'Left':
                                                return '왼쪽'
                                            case 'Random':
                                                return '랜덤'
                                        }

                                        return item
                                    }                                
                                    return ''
                                }

                                const getPinLocation = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Middle':
                                                return '중앙'
                                            case 'Right':
                                                return '오른쪽'
                                            case 'Back':
                                                return '뒤쪽'
                                            case 'Left':
                                                return '왼쪽'
                                            case 'Random':
                                                return '랜덤'
                                        }
                                       
                                        return item
                                    }                                
                                    return ''
                                }

                                const getTeeLocation = (item: string) => {
                                    if (item) {
                                        switch (item) {
                                            case 'Red':
                                                return '레드'
                                            case 'Yellow':
                                                return '옐로우'
                                            case 'White':
                                                return '화이트'
                                            case 'Blue':
                                                return '블루'
                                            case 'Black':
                                                return '블랙'
                                        }

                                        return item
                                    }                                
                                    return ''
                                }


                                return (
                                    <View style={[ styles.underLine, { marginTop: 26, marginBottom: 16 }]}>
                                        <Text style={[ styles.boldText, { marginBottom: 16 }]}>경기조건</Text>

                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>난이도</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getDifficulty(compDetail[0].difficult1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>컨시드</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ compDetail[0].concede1 }m</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>멀리건</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ compDetail[0].mulligan1 }회</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>바람 상태</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getWindCondition(compDetail[0].windCondition1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>그린 상태</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getGreenCondition(compDetail[0].greenCondition1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>그린 경도</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getGreenHardness(compDetail[0].greenHardness1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>그린 위치</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getGreenLocation(compDetail[0].greenLocation1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>핀 위치</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getPinLocation(compDetail[0].pinLocation1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>티 위치</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ getTeeLocation(compDetail[0].teeBox1) }</Text>
                                        </View>
                                        <View style={ styles.rowContainer }>
                                            <Text style={[ styles.regularText, { flex: 1, marginBottom: 16 }]}>캐디 사용</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>{ compDetail[0].caddieYn1 === 'Y' ? '사용' : '없음' }</Text>
                                        </View>             
                                    </View>
                                )
                            })()}
                            
                            

                            <View style={{ marginTop: 26, marginBottom: 50 }}>
                                <Text style={[ styles.boldText, { marginBottom: 16 }]}>대회 요강</Text>
                                <Text style={ styles.regularText }>{ compDetail[0].compDetail }</Text>
                            </View>

                            <Pressable style={ styles.button } onPress={ () => navigation.navigate('Competition') }>
                                <Text style={ styles.boldText }>목록으로</Text>
                            </Pressable>
                        </>
                        ) : (
                        <>  
                            { myRank && myRank.length === 0 ? ( // play x
                                <View style={[ styles.underLine, { alignItems: 'center', paddingVertical: 36 }]}>
                                    <Text style={[ styles.regularText, { fontSize: 14, color: '#999999' }]}>나의 참가 기록이 없습니다.</Text>
                                </View>
                                ) : (
                                <View style={[ styles.underLine, { paddingVertical: 13 }]}>
                                    <View style={ styles.recordCard }>
                                        <View style={[ styles.rowContainer, { flex: 1, alignItems: 'center' }]}>
                                            <Text style={[ styles.boldText ]}>{ myRank[0].ranking ? myRank[0].ranking : '-' }</Text>
                                            <Text style={ styles.boldText }>위</Text>

                                            <View style={ styles.imgContainer }>
                                                { profileImgs === '' ?
                                                    <EmptyImg />
                                                    :
                                                    <FastImage 
                                                        style={ styles.img } 
                                                        source={{ 
                                                            uri: profileImgs,
                                                            priority: FastImage.priority.normal,
                                                            cache: FastImage.cacheControl.immutable 
                                                        }} 
                                                        resizeMode="cover"
                                                    />
                                                }
                                            </View>
                                            <Text style={ styles.boldText }>{ userInfo.nick }</Text>
                                        </View>
                                        <Text style={ styles.boldText }>{ myRank[0].totScore ? myRank[0].totScore : '-' }</Text>
                                    </View>
                                    { myRank && !myRank[0].ranking &&
                                        <View style={{ alignItems: 'center', marginTop: 14}}>
                                            <Text style={[ styles.regularText, { fontSize: 14, color: '#e20500' }]}>모든 코스 완주 후 순위가 집계됩니다.</Text>
                                        </View>
                                    }
                                </View>
                            )}

                            { rankArr && rankArr.length === 0 ? ( // 
                                <>
                                </>
                                ) : (
                                <View style={{ marginBottom: 100 }}>                
                                    <View style={[ styles.rowContainer, { alignItems: 'center', marginTop: 16 }]}>
                                        <Text style={[ styles.boldText, { flex: 1, fontSize: 14 }]}>스트로크</Text>
                                        <View style={[ styles.rowContainer, { alignItems: 'center' }]}>
                                            <Pressable onPress={ () => setRankType('A' ) }>
                                                <Text style={[ styles.regularText, { color: '#999999' }, rankType === 'A' && { fontFamily: 'Pretendard-SemiBold', color: '#999999' }]}>스코어순</Text>
                                            </Pressable>
                                            <View style={ styles.bar }>
                                                <Text>l</Text>
                                            </View>
                                            <Pressable onPress={ () => setRankType('D') }>
                                                <Text style={[ styles.regularText, { color: '#999999' }, rankType === 'D' && { fontFamily: 'Pretendard-SemiBold', color: '#999999' } ]}>라운드순</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                    { compDetail[0].ccId2 &&
                                        <View style={[ styles.rowContainer, { marginTop: 13 }]}>
                                            <Pressable style={[ styles.courseBtn, courseType === 'R' && { borderColor: '#fd780f', backgroundColor: '#fd780f' }]} onPress={ () => { setPageIndex(0), setCourseType('R') }}>
                                                <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }, courseType === 'R' && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>합산</Text>
                                            </Pressable>
                                            <Pressable style={[ styles.courseBtn, courseType === 'A' && { borderColor: '#fd780f', backgroundColor: '#fd780f' }]} onPress={ () => { setPageIndex(0), setCourseType('A') }}>
                                                <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }, courseType === 'A' && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>A코스</Text>
                                            </Pressable>
                                            <Pressable style={[ styles.courseBtn, courseType === 'B' && { borderColor: '#fd780f', backgroundColor: '#fd780f' }]} onPress={ () => { setPageIndex(0), setCourseType('B') }}>
                                                <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }, courseType === 'B' && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>B코스</Text>
                                            </Pressable>
                                            { compDetail[0].ccId3 &&
                                                <Pressable style={[ styles.courseBtn, courseType === 'C' && { borderColor: '#fd780f', backgroundColor: '#fd780f' }]} onPress={ () => { setPageIndex(0), setCourseType('C') }}>
                                                    <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }, courseType === 'C' && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>C코스</Text>
                                                </Pressable>
                                            }
                                        </View>
                                    }

                                    <View style={ styles.subContainer }>
                                        <View style={[ styles.rowContainer, { flex: 1 }]}>
                                            <Text style={[ styles.regularText, { fontSize: 14, marginRight: 21 }]}>순위</Text>
                                            <Text style={[ styles.regularText, { fontSize: 14 }]}>닉네임</Text>
                                        </View>
                                        <Text style={[ styles.regularText, { fontSize: 14 }]}>스코어</Text>
                                        { rankType === 'D' && <Text style={[ styles.regularText, { fontSize: 14, marginLeft: 20 }]}>라운드 수</Text> }
                                    </View> 

                                    { rankArr.map((item: CompetitionRankResult, index: number) => {
                                        return (
                                            <View style={[ styles.rankContainer, item.uid === myRank[0]?.uid && { backgroundColor: 'rgba(253, 120, 15, 0.15)' }]} key={ index }>
                                                <View style={[ styles.rowContainer, { flex: 1 }]}>
                                                    <Text style={[ styles.boldText, { width: 40, textAlign: 'center', fontSize: 14, marginRight: 15 }]}>{ courseType === 'R' ?  item.ranking : item.ccRank }</Text>
                                                    <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>{ item.nick }</Text>
                                                </View>
                                                <View style={ styles.rowContainer }>
                                                    <Text style={[ styles.boldText, { width: 30, textAlign: 'center', fontSize: 14 }]}>{ courseType === 'R' ? item.totScore : item.ccScore }</Text>
                                                    { rankType === 'D' && <Text style={[ styles.boldText, { width: 40, textAlign: 'center', fontSize: 14, marginLeft: 30 }]}>{ item.totRounds }</Text> }
                                                </View>
                                            </View>
                                        )
                                    })}
                                    
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    rowContainer: {
        flexDirection: 'row',
    },
    container: {
        marginHorizontal: 15,
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        color: '#fd780f'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#949494'
    },
    extraLightText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-ExtraLight',

        color: '#fd780f'
    },
    status: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginRight: 16,

        borderRadius: 3,

        backgroundColor: '#fff3e9'
    },
    bar: {
        width: 1,

        marginHorizontal: 8,

        backgroundColor: '#cccccc'
    },
    underLine: {
        borderBottomWidth: 1, 
        borderBottomColor: '#eeeeee' 
    },
    button: {
        alignItems: 'center',

        paddingVertical: 16,
        marginBottom: 50,
        
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    recordCard: {
        flexDirection: 'row',
        alignItems: 'center',
        
        paddingVertical: 12,
        paddingHorizontal: 20,

        borderRadius: 10,
        backgroundColor: '#f3f3f3'
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 36,
        height: 36,

        marginRight: 10,
        marginLeft: 14,

        borderRadius: 20,

        backgroundColor: '#dddddd'
    },
    img: {
        width: '100%',
        height: '100%',

        borderRadius: 40
    },
    courseBtn: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginRight: 6,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#949494'
    },
    subContainer: {
        flexDirection: 'row',

        marginTop: 35, 
        marginBottom: 14,
        paddingHorizontal: 8,
        paddingBottom: 14,

        borderBottomColor: '#eeeeee',
        borderBottomWidth: 1
    },
    rankContainer: {
        flexDirection: 'row',

        paddingRight: 12,
        paddingVertical: 7
    },
    myRankContainer: {
        width: '100%',

        position: 'absolute',
        bottom: 0,

        paddingVertical: 15,

        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderWidth: 1,
        borderColor: '#cccccc',
        backgroundColor: '#ffffff',

        zIndex: 1
    },
    myRank: {
        flexDirection: 'row',

        paddingVertical: 7,
        paddingLeft: 11,
        paddingRight: 15,
        marginHorizontal: 15,

        borderRadius: 5,
        backgroundColor: 'rgba(253, 120, 15, 0.15)'
    }
})

export default CompetitionDetail