import { Alert, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { UserInfo } from "../../../slices/auth"
import { useUserInfo, useUsers } from "../../../hooks/useUsers"
import { useRecord, useRecords } from "../../../hooks/useRecords"
import { Record } from "../../../slices/record"
import { CcInfo, Count, Payload, PositionInfo, RoomInfo, UserProfileImgs } from "../../../types/apiTypes"
import { useScoreCardVideo, useThumbnailList, useVideos } from "../../../hooks/useVideos"
import { Thumbnail } from "../../../slices/video"
import { CourseImage } from "../../../slices/course"
import { useCourse, useCourseImage, useCourseInfo } from "../../../hooks/useCourse"
import { useVideoActions } from "../../../hooks/useVideoActions"
import Loading from "../../../components/Loading"
import FastImage from "react-native-fast-image"
import { Line, Svg } from "react-native-svg"
import { getFSInfo } from "react-native-fs"

// svg
import Location from "../../../assets/imgs/my/location_white.svg"
import Share from "../../../assets/imgs/my/share_white.svg"
import EmptyImg from "../../../assets/imgs/my/empty_img.svg"
import UpArrow from "../../../assets/imgs/my/arrow_up.svg"
import DownArrow from "../../../assets/imgs/my/arrow_down.svg"
import Eagle from "../../../assets/imgs/my/eagle.svg"
import Buddy from "../../../assets/imgs/my/buddy.svg"
import Bogey from "../../../assets/imgs/my/bogey.svg"
import DoubleBogey from "../../../assets/imgs/my/double_bogey.svg"
import Mulligan from "../../../assets/imgs/my/mulligan.svg"
import Play from "../../../assets/imgs/swing/play.svg"
import LeftArrow from "../../../assets/imgs/course/arrow_left.svg"
import RightArrow from "../../../assets/imgs/course/arrow_right.svg"
import Triangle from "../../../assets/imgs/my/triangle_minimap.svg"
import X from "../../../assets/imgs/my/x_minimap.svg"
import OBX from "../../../assets/imgs/my/x_ob_minimap.svg"
import Left from "../../../assets/imgs/my/triangle_left.svg"
import Right from "../../../assets/imgs/my/triangle_right.svg"
import Crown from "../../../assets/imgs/my/icon_crown.svg"
import Competition from "../../../assets/imgs/main/icon_competition.svg"

interface Props {
    route: RouteProp<RootStackParamList, 'ScoreCard'>
}

const ScoreCard = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const roomId = route.params?.roomId
    const myProfile: UserInfo = useUserInfo()
	const myRecord: Record = useRecord()

    const videoList = useScoreCardVideo()

    const { getScore } = useRecords()
    const { getProfileImages } = useUsers()
    const { getScoreCardVideo } = useVideos()
    const { getCourseImage } = useCourse()
    const minimapInfo = useCourseImage()
    const courseInfo = useCourseInfo()

    const [recordArr, setRecordArr] = useState<Record>()
    const [myPositionArr, setMyPositionArr] = useState<PositionInfo[]>([])
    const [profileImgs, setProfileImgs] = useState<UserProfileImgs[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isFolded, setIsFolded] = useState<boolean[]>([false])

    const [year, setYear] = useState<string>('')
    const [month, setmonth] = useState<string>('')
    const [date, setdate] = useState<string>('')

    const [minimapList, setMinimapList] = useState<CourseImage[]>([])
    const [sortedMinimapList, setSortedMinimapList] = useState<CourseImage[]>([])
    const [type, setType] = useState<number>(0)
    const [hole, setHole] = useState<number>(1)
    const [holeLength, setHoleLength] = useState<number>(18)

    const mapSizeX = Dimensions.get('window').width - 30
    const mapSizeY = (Dimensions.get('window').width - 30) * 441 / 281

    useEffect(() => {
        getScoreCard()
        getVideoList()
    }, [])

    useEffect(() => {
        getProfileImg()

        if (recordArr && recordArr.ccArr.length > 0) {
            getMinimapSource()
        } 
    }, [recordArr])

    useEffect(() => {
        setHole(1)
    }, [type])

    useEffect(() => {
        setMinimapList(minimapInfo)
    }, [minimapInfo])

    useEffect(() => {
        let sortedMinimap: CourseImage[] = []
    
        if (minimapList && minimapList.length > 0) {
            if (recordArr?.ccArr[0].courseOrder === 'Out') {
                for (let i = 0; i < minimapList.length; i++) {
                    if (minimapList[i].courseNumber === recordArr?.ccArr[0].firstCourse) {
                        sortedMinimap = sortedMinimap.concat(minimapList[i])
                    }
                }
        
                for (let i = 0; i < minimapList.length; i++) {
                    if (minimapList[i].courseNumber === recordArr?.ccArr[0].secondCourse) {
                        sortedMinimap = sortedMinimap.concat(minimapList[i])
                    }
                }
            } else if (recordArr?.ccArr[0].courseOrder === 'In') {
                for (let i = 0; i < minimapList.length; i++) {
                    if (minimapList[i].courseNumber === recordArr?.ccArr[0].secondCourse) {
                        sortedMinimap = sortedMinimap.concat(minimapList[i])
                    }
                }

                for (let i = 0; i < minimapList.length; i++) {
                    if (minimapList[i].courseNumber === recordArr?.ccArr[0].firstCourse) {
                        sortedMinimap = sortedMinimap.concat(minimapList[i])
                    }
                }
            }

            setSortedMinimapList(sortedMinimap)
        }
    }, [minimapList])

    const getMinimapSource = async () => {
        const payload: Payload = await getCourseImage(recordArr?.ccArr[0].ccId ?? 0, recordArr?.ccArr[0].firstCourse ?? 1, recordArr?.ccArr[0].secondCourse ?? 2)
        if (payload.code !== 1000) {
            return
        }
    }

    const getProfileImg = async () => {
        if (isConnected) return
        if (recordArr && recordArr.inArr.length > 0) {
            let uidArr: number[] = []
            for (let i = 0; i < recordArr.inArr.length; i++) {
                uidArr = uidArr.concat(recordArr.inArr[i].uid)
            }

            const payload: Payload = await getProfileImages(uidArr) 
            setIsConnected(false)
            if (payload.code !== 1000) {
                return
            }

            if (payload.userProfileImgs) {
                setProfileImgs(payload.userProfileImgs)
            }
        }
    }

    const getScoreCard = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getScore('A', myProfile.uid, roomId, null, null)
        setIsConnected(false)
        if (payload.code !== 1000) {
            Alert.alert('알림', '서버에 오류가 발생했습니다.')

            navigation.goBack()
            return
        }

        if (payload.record) {
            setRecordArr(payload.record)
            const posArr: PositionInfo[] = payload.record.positionArr.filter(item => item.uid === myProfile.uid)
            posArr.sort((a, b) => { 
                return a.holeNumber - b.holeNumber 
            })
            setYear(payload.record.parcount[0].date.slice(0, 4))
            setmonth(payload.record.parcount[0].date.slice(4, 6))
            setdate(payload.record.parcount[0].date.slice(6, 8))

            for (let i = 0; i < payload.record.ccArr.length; i++) {
                setIsFolded(prevState => [...prevState, true])    
            }

            if (payload.record.shotcount) {
                for (let i = 1; i <= 18; i++) {
                    if ((payload.record.shotcount[0] as any)[`hole${i}`] === null) {
                        setHoleLength(i)
                        break
                    }
                }
            }
            setMyPositionArr(posArr)
        }
    }

    const getVideoList = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getScoreCardVideo(roomId)
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

    const getCcName = () => {
        if (!recordArr?.ccArr[0].courseName) return ''
        
        const a = recordArr?.ccArr[0].courseName.split('(')[1] ?? ''
        const coruseName = a.split(')')[0]

        return (recordArr?.ccArr[0].ccName + '-' + coruseName) ?? ''
    }

    const getCourseName = (courseNumber: number) => {
        if (recordArr?.ccArr[0].courseOrder === 'In') {
            if (courseNumber === 2) {
                for (let i = 0; i < courseInfo.length; i++) {
                    if (courseInfo[i].id === recordArr?.ccArr[0].ccId) {
                        return courseInfo[i].courseName1
                    }
                }
            } else if (courseNumber === 1) {
                for (let i = 0; i < courseInfo.length; i++) {
                    if (courseInfo[i].id === recordArr?.ccArr[0].ccId) {
                        return courseInfo[i].courseName2
                    }
                }
            }
        }
        if (courseNumber === 1) {
            for (let i = 0; i < courseInfo.length; i++) {
                if (courseInfo[i].id === recordArr?.ccArr[0].ccId) {
                    return courseInfo[i].courseName1
                }
            }
        } else if (courseNumber === 2) {
            for (let i = 0; i < courseInfo.length; i++) {
                if (courseInfo[i].id === recordArr?.ccArr[0].ccId) {
                    return courseInfo[i].courseName2
                }
            }
        }

        return ''
    }

    const onPressLeft = () => {
        if (hole === 1) {
            setHole(9)
            return
        }
        setHole(hole - 1)
    }

    const onPressRight = () => {
        if (hole === 9) {
            setHole(1)
            return
        }
        setHole(hole + 1)
    }

    const getPar = () => {
        if (sortedMinimapList && sortedMinimapList.length > 0) {
            if (type === 1) {
                return sortedMinimapList[hole + 8].par ?? 0
            }
            return sortedMinimapList[hole - 1]. par ?? 0
        }
    }

    const getPlayMode = (item: string) => {
        switch (item) {
            case 'Stroke':
                return '스트로크'
            case 'Match':
                return '매치'
            case 'Foursome':
                return '포썸'
        }

        return ''
    }

    const getCompType = () => {
        switch (recordArr?.inArr[0].compType) {
            case 'H':
                return '본사대회'                 
            case 'S':
                return '매장대회'
            case 'U':
                return '유저대회'
            case 'E':
                return '기타대회'                           
        }

        return '대회'
    }

    const formatDate = () => {
        const stDate = new Date(recordArr?.inArr[0].compStDate ?? '')
        const edDate = new Date(recordArr?.inArr[0].compEdDate?? '')
        const day = ['일', '월', '화', '수', '목', '금', '토']
        const stMonth = (stDate.getMonth() + 1) < 10 ? '0' + (stDate.getMonth() + 1) : (stDate.getMonth() + 1)
        const edMonth = (edDate.getMonth() + 1) < 10 ? '0' + (edDate.getMonth() + 1) : (edDate.getMonth() + 1)
        const stDay = (stDate.getDate()) < 10 ? '0' + (stDate.getDate()) : (stDate.getDate())
        const edDay = (edDate.getDate()) < 10 ? '0' + (edDate.getDate()) : (edDate.getDate())

        return stDate.getFullYear().toString().slice(2, 4) + `.${stMonth}.${stDay}(${day[stDate.getDay()]}) ~`  +
                `${edDate.getFullYear().toString().slice(2, 4)}.${edMonth}.${edDay}(${day[edDate.getDay()]})`
    }

    const getProfileImgUrl = (uid: number) => {
        if (profileImgs && profileImgs.length > 0) {
            for (let j = 0; j < profileImgs.length; j++) {
                if (uid === profileImgs[j].uid) {
                    return profileImgs[j].url
                }
            }
        }
        return ''
    }

    const getMatchScore = (index: number) => {
        let matchScore: number = 0

        if (recordArr && recordArr.shotcount) {
            for (let i = 1; i <= 18; i++) {
                matchScore += (recordArr.shotcount[index] as any)[`hole${i}`]
            }
        }       
        return matchScore < 0 ? matchScore * -1 : matchScore
    }

    const getFinalScoreType = (score: number) => {
        if (score > 0) {
            return 'Up'
        } else if (score < 0) {
            return 'Dn'
        } 
        return 'A/S'
    }

    return (
        <>
            { !recordArr && 
                <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
                    <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, alignItems: 'center', justifyContent: 'center'}}>
                        <Image style={{ width: 50, height: 50 }} source={ require('../../../assets/imgs/common/loading_circle.png') } />
                    </View>
                </View> 
            }
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
                { recordArr && recordArr.inArr.length > 0 &&
                    <>
                        <View style={ styles.ccInfoContainer }>
                            <View style={ styles.rowContainer }>
                                <Text style={[ styles.infoText, { flex: 1 }]}>{ year }.{ month }.{ date }</Text>

                                <View style={ styles.rowContainer }>
                                    <Text style={ styles.infoText }>{ getPlayMode(recordArr.inArr[0].playMode ?? '') }</Text>
                                    <View style={ styles.bar }></View>
                                    <Text style={ styles.infoText }>{ recordArr.inArr[0].userCount }인</Text>
                                </View>                    
                            </View>
                            <Text style={ styles.ccText }>{ getCcName() }</Text>
                            
                            <View style={[ styles.rowContainer, recordArr.inArr[0].gameMode === 'Competition' ? { paddingBottom: 31 } : { paddingBottom: 66 }]}>
                                <View style={[ styles.rowContainer, { flex: 1}]}>
                                    <Location style={ styles.location } />
                                    <Text style={ styles.infoText }>{ recordArr.inArr[0].shopName }</Text>
                                </View>
                                {/* <Share /> */}
                            </View>

                            { recordArr.inArr[0].gameMode === 'Competition' && recordArr.inArr[0].compId && recordArr.inArr[0].compId > 0 &&
                                <Pressable style={ styles.compContainer } onPress={ () => navigation.navigate('CompetitionDetail', { id: recordArr.inArr[0].compId, before: 'ScoreCard' })}>
                                    <View style={[ styles.rowContainer, { marginBottom: 10 }]}>
                                        <View style={ styles.compCircle }>
                                            <Competition width={16} height={16} />
                                        </View>
                                        <View style={ styles.compType }>
                                            <Text style={ styles.regularText }>{ getCompType() }</Text>
                                        </View>
                                        {/* <View style={ styles.courseType }>
                                            <Text style={[ styles.regularText, { color: '#666666' }]}>Aasdf</Text>
                                        </View> */}
                                    </View>
                                    <Text style={[ styles.boldText, { marginBottom: 10 }]}>{ recordArr.inArr[0].compName ?? '' }</Text>
                                    <View style={[ styles.rowContainer, { marginBottom: 8 }]}>
                                        <Text style={[ styles.regularText, { flex: 1, fontSize: 13, color: '#949494' }]}>{ formatDate() }</Text>
                                        <Text style={ styles.extraLightText }>랭킹보기→</Text>
                                    </View>
                                </Pressable>
                            }
                        </View>

                        {/* match */}
                        { recordArr.inArr[0].playMode === 'Match' && 
                            <View style={[ styles.scoreCardContainer, { marginBottom: 48 }]}>
                                { recordArr.inArr.map((item: RoomInfo, matchIndex: number) => {         
                                    const getScoreType = () => {
                                        let matchScore: number = 0
                                        for (let i = 1; i <= 18; i++) {
                                            matchScore += (recordArr.shotcount[matchIndex] as any)[`hole${i}`]
                                        }
                                        if (matchScore > 0) {
                                            return 'Up'
                                        } else if (matchScore < 0) {
                                            return 'Dn'
                                        }

                                        return 'A/S'
                                    }

                                    return (
                                        <View style={[ styles.rowContainer, { paddingTop: 18, paddingBottom: 12, paddingHorizontal: 15 }, matchIndex === 1 && { backgroundColor: '#fbfbfb' }]} key={ matchIndex }>
                                            <View style={[ styles.rowContainer, { flex: 1 }]}>
                                                <View style={ styles.imgContainer }>
                                                        { getProfileImgUrl(item.uid) === '' ?
                                                            <EmptyImg />
                                                            :
                                                            <FastImage 
                                                                style={ styles.img } 
                                                                source={{ 
                                                                    uri: getProfileImgUrl(item.uid),
                                                                    priority: FastImage.priority.normal,
                                                                    cache: FastImage.cacheControl.immutable 
                                                                }} 
                                                                resizeMode="cover"
                                                            />
                                                        }
                                                        { matchIndex === 0 &&
                                                            <View style={ styles.crownContainer }>
                                                                <Crown />
                                                            </View>
                                                        }
                                                    </View>
                                                <View>
                                                    <Text style={[ styles.boldText, { fontSize: 10, marginBottom: 6, color: '#009746' }]}>PLAYER { matchIndex + 1 }</Text>
                                                    <Text style={[ styles.regularText, { fontSize: 16, color: '#121619' }]}>{ item.nick }</Text>
                                                </View>
                                            </View>
                                            <View style={[ styles.rowContainer, { alignItems: 'baseline' }]}>
                                                <Text style={[ styles.semiBoldText, { fontSize: 24, marginLeft: 0, color: '#121619' }]}>{ getMatchScore(matchIndex) }</Text>
                                                <Text style={[ styles.regularText, { fontSize: 16, color: '#121619' }]}>{ getScoreType() }</Text>
                                            </View>
                                        </View>
                                    )
                                })}

                                { recordArr.shotcount && recordArr.shotcount[0].hole1 && 
                                    <>
                                        <View style={ styles.scoreCard }>
                                            <View style={[ styles.scoreCardRow, { backgroundColor: '#f6f6f6' }]}>
                                                <View style={ styles.typeBox }>
                                                    <Text style={ styles.typeText }>HOLE</Text>
                                                </View>
                                                <View style={ styles.centerRow }>
                                                    { Array.from({ length: 9 }, (_, index: number) => (
                                                        <Text style={ styles.holeText } key={ index }>{ index + 1 }</Text>
                                                    ))}
                                                </View>
                                                <View style={[ styles.typeBox, { width: 40 }]}>
                                                    <Text style={ styles.typeText }>총합</Text>
                                                </View>                                
                                            </View>
                                        </View>

                                        { recordArr.shotcount.map((item: Count, matchIndex: number) => {     
                                            const shotArr: [string, number][] = Object.entries(item).filter(([key]) => key.includes('hole'))
                                            const getScoreType = (score: number) => {
                                                switch (score) {
                                                    case 1:
                                                        return 'Up'
                                                    case 0:
                                                        return 'H'
                                                    case -1:
                                                        return ''
                                                }
                                            }

                                            const getFirstMatchScore = () => {
                                                let shotCount: number = 0
                                                for (let i = 1; i <= 9; i++) {
                                                    shotCount += (item as any)[`hole${i}`]
                                                }

                                                return shotCount
                                            }
                                    
                                            return (
                                                <View style={[ styles.scoreCardRow, !recordArr.shotcount[0].hole10 && matchIndex === 1 && { borderBottomColor: '#fcbc8a' }]} key={ matchIndex }>
                                                    <View style={ styles.typeBox }>
                                                        <Text style={[ styles.typeText, { color: '#121619' }]}>{ matchIndex + 1 }P</Text>
                                                    </View>                                    
                                                    <View style={ styles.centerRow }>
                                                        { shotArr.map(([key, value]: [string, number], hole: number ) => {
                                                            if (hole > 8) return
                                                            if (value && hole < 9) {
                                                                return (
                                                                    <View style={[ styles.scoreBox, { backgroundColor: '#ffffff'} ]} key={ hole }>
                                                                        <Text style={ styles.scoreText } >{ getScoreType(value) }</Text>
                                                                    </View>
                                                                )
                                                            } else if (value === 0 && hole < 9) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={[ styles.scoreText, { color: '#949494' }]} >H</Text>
                                                                    </View>
                                                                )
                                                            } else if (value === null) {
                                                                return (
                                                                    <View style={[ styles.scoreBox, { width: (Dimensions.get('window').width - 122) / 9, backgroundColor: '#f6f6f6'} ]} key={ hole }></View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                    <View style={[ styles.typeBox, { width: 40 }]}>
                                                        <Text style={[ styles.semiBoldText, { fontSize: 11, marginLeft: 0, color: '#121619' }]}>{ getFirstMatchScore() === 0 ? '' : getFirstMatchScore() }</Text>
                                                        <Text style={[ styles.regularText, { fontSize: 11, color: '#121619' }]}>{ getFinalScoreType(getFirstMatchScore()) }</Text>
                                                    </View>                                
                                                </View>
                                            )
                                        })}                               
                                    </>
                                }

                                { recordArr.shotcount && recordArr.shotcount[0].hole10 !== null && 
                                    <>
                                        <View style={ styles.scoreCard }>
                                            <View style={[ styles.scoreCardRow, { backgroundColor: '#f6f6f6' }]}>
                                                <View style={ styles.typeBox }>
                                                    <Text style={ styles.typeText }>HOLE</Text>
                                                </View>
                                                <View style={ styles.centerRow }>
                                                    { Array.from({ length: 9 }, (_, index: number) => (
                                                        <Text style={ styles.holeText } key={ index }>{ index + 10 }</Text>
                                                    ))}
                                                </View>
                                                <View style={[ styles.typeBox, { width: 40 }]}>
                                                    <Text style={ styles.typeText }>총합</Text>
                                                </View>                                
                                            </View>
                                        </View>

                                        { recordArr.shotcount.map((item: Count, matchIndex: number) => {     
                                            const shotArr: [string, number][] = Object.entries(item).filter(([key]) => key.includes('hole'))
                                            const getScoreType = (score: number) => {
                                                switch (score) {
                                                    case 1:
                                                        return 'Up'
                                                    case 0:
                                                        return 'H'
                                                    case -1:
                                                        return ''
                                                }
                                            }

                                            const getLastMatchScore = () => {
                                                let shotCount: number = 0
                                        
                                                for (let i = 1; i <= 18; i++) {
                                                    shotCount += (item as any)[`hole${i}`]
                                                }
                                                
                                                return shotCount
                                            }

                                            return (
                                                <View style={[ styles.scoreCardRow, matchIndex === 1 && { borderBottomColor: '#fcbc8a' }]} key={ matchIndex }>
                                                    <View style={ styles.typeBox }>
                                                        <Text style={[ styles.typeText, { color: '#121619' }]}>{ matchIndex + 1 }P</Text>
                                                    </View>                                    
                                                    <View style={ styles.centerRow }>
                                                        { shotArr.map(([key, value]: [string, number], hole: number ) => {
                                                            if (hole < 9) return
                                                            if (value && hole > 8) {
                                                                return (
                                                                    <View style={[ styles.scoreBox, value !== null && { backgroundColor: '#ffffff'} ]} key={ hole }>
                                                                        <Text style={ styles.scoreText } >{ getScoreType(value)}</Text>
                                                                    </View>
                                                                )
                                                            } else if (value === 0 && hole > 8) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={[ styles.scoreText, { color: '#949494' }]} >H</Text>
                                                                    </View>
                                                                )
                                                            } else if (value === null) {
                                                                return (
                                                                    <View style={[ styles.scoreBox, { width: (Dimensions.get('window').width - 122) / 9, backgroundColor: '#f6f6f6' } ]} key={ hole }></View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                    <View style={[ styles.typeBox, { width: 40 }]}>
                                                        <Text style={[ styles.semiBoldText, { fontSize: 11, marginLeft: 0, color: '#121619' }]}>{ getLastMatchScore() === 0 ? '' : (getLastMatchScore() < 0 ? getLastMatchScore() * -1 : getLastMatchScore()) }</Text>
                                                        <Text style={[ styles.regularText, { fontSize: 11, color: '#121619' }]}>{ getFinalScoreType(getLastMatchScore()) }</Text>
                                                    </View>                                     
                                                </View>
                                            )
                                        })}    
                                    </>
                                }

                                <View style={ styles.resultContainer }>
                                    { getMatchScore(0) === getMatchScore(1) ? (
                                        <View style={[ styles.rowContainer ]}>
                                            <Text style={[ styles.boldText, { fontSize: 14, marginBottom: 0 }]}>무승부</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>로 게임종료</Text>
                                        </View>
                                    ) : (
                                        <View style={[ styles.rowContainer ]}>
                                            <Text style={[ styles.boldText, { fontSize: 14, marginBottom: 0 }]}>{ getMatchScore(0) > getMatchScore(1) ? recordArr.inArr[0].nick : recordArr.inArr[1].nick }</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>님이 </Text>
                                            <Text style={[ styles.boldText, { fontSize: 14, marginBottom: 0 }]}>{ getMatchScore(0) > getMatchScore(1) ? getMatchScore(0) : getMatchScore(1) }Up</Text>
                                            <Text style={[ styles.regularText, { color: '#121619' }]}>으로 승리</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        }

                        {/* stroke */}
                        { recordArr.inArr[0].playMode === 'Stroke' && recordArr.inArr.map((item: RoomInfo, index: number) => {
                            const parArr: [string, number][] = Object.entries(recordArr.parcount[index]).filter(([key]) => key.includes('hole'))
                            const shotArr: [string, number][] = Object.entries(recordArr.shotcount[index]).filter(([key]) => key.includes('hole'))
                            const puttArr: [string, number][] = Object.entries(recordArr.puttcount[index]).filter(([key]) => key.startsWith('hole'))

                            const getParSum = (hole: number) => {
                                let sum = 0
                                for (let i = hole + 1; i <= hole + 9; i++) {
                                    sum += (recordArr.parcount[index] as any)[`hole${i}`]
                                }

                                return sum
                            }

                            const getFirstShotCount = () => {
                                let shotCount: number = 0
                                for (let i = 1; i <= 9; i++) {
                                    shotCount += (recordArr.shotcount[index] as any)[`hole${i}`]
                                }

                                return shotCount
                            } 
                        
                            const getFirstPuttCount = () => {
                                let puttCount: number = 0

                                for (let i = 1; i <= 9; i++) {
                                    puttCount += (recordArr.puttcount[index] as any)[`hole${i}`]
                                }       
                                
                        
                                return puttCount
                            }
                        
                            const getLastPuttCount = () => {
                                let puttCount: number = 0
                        
                                for (let i = 10; i <= 18; i++) {
                                    puttCount += (recordArr.puttcount[index] as any)[`hole${i}`]
                                }        
                                
                        
                                return puttCount
                            }
                        
                            const getLastShotCount = () => {
                                let shotCount: number = 0
                        
                                for (let i = 10; i <= 18; i++) {
                                    shotCount += (recordArr.shotcount[index] as any)[`hole${i}`]
                                }
                                
                                return shotCount
                            }
                            
                            // score  par: 0, buddy: 1, eagle: 2, bogey: -1 double bogey: -2
                            const getScoreType = (hole: number, shot: number) => {
                                let type = 0
                                const par = (recordArr.parcount[index] as any)[`hole${ hole + 1 }`]

                                const result = par - shot
                                if (result > 1) {
                                    type = 2
                                } else if (result === 1) {
                                    type = 1
                                } else if (result === -1) {
                                    type = -1
                                } else if (result < -1) {
                                    type = -2
                                }

                                return type
                            }

                        
                            // if (recordArr && recordArr.inArr[0].playMode === 'Match') {
                            //     return (
                            //         <View style={ styles.scoreCardContainer } key={ index }>
                            //             <Text>asdf</Text>
                            //         </View>
                            //     )
                            // }

                            return (
                                <View style={ styles.scoreCardContainer } key={ index }>
                                    {/* my scorecard */}
                                    <View style={[ styles.nicknameComtainer, index === 0 && { marginTop: 7 }]}>
                                        <Pressable style={[ styles.rowContainer, { flex: 1 }]}>
                                            <View style={ styles.imgContainer }>
                                                { getProfileImgUrl(item.uid) === '' ?
                                                    <EmptyImg width={20} height={20} />
                                                    :
                                                    <FastImage 
                                                        style={ styles.img } 
                                                        source={{ 
                                                            uri: getProfileImgUrl(item.uid),
                                                            priority: FastImage.priority.normal,
                                                            cache: FastImage.cacheControl.immutable 
                                                        }} 
                                                        resizeMode="cover"
                                                    />
                                                }
                                            </View>
                                            <Text style={ styles.nicknameText }>{ item.nick ?? '' }</Text>
                                        </Pressable>

                                        <Pressable style={ styles.rowContainer } onPress={ () => { setIsFolded(prevState => {
                                            const isFolded = [...prevState]
                                            isFolded[index] = !isFolded[index]
                                            return isFolded
                                        })}}>
                                            <Text style={ styles.totalShotText }>{ getFirstShotCount() + getLastShotCount() }</Text>
                                            { !isFolded[index] && <UpArrow style={{ marginLeft: 12 }} /> }
                                            { isFolded[index] && <DownArrow style={{ marginLeft: 12 }} />}
                                        </Pressable>
                                    </View>

                                    { !isFolded[index] &&
                                        <>
                                            <View style={[ styles.scoreCard, !recordArr.shotcount[index].hole10 && { marginBottom: 18, borderBottomWidth: 1 }]}>
                                                <View style={[ styles.scoreCardRow, { backgroundColor: '#f6f6f6' }]}>
                                                    <View style={ styles.typeBox }>
                                                        <Text style={ styles.typeText }>HOLE</Text>
                                                    </View>
                                                    <View style={ styles.centerRow }>
                                                        { Array.from({ length: 9 }, (_, index: number) => (
                                                            <Text style={ styles.holeText } key={ index }>{ index + 1 }</Text>
                                                        ))}
                                                    </View>
                                                    <View style={[ styles.typeBox, { width: 40 }]}>
                                                        <Text style={ styles.typeText }>총합</Text>
                                                    </View>                                
                                                </View>

                                                <View style={ styles.scoreCardRow }>
                                                    <View style={ styles.typeBox }>
                                                        <Text style={[ styles.typeText, { color: '#121619' }]}>PAR</Text>
                                                    </View>
                                                    <View style={ styles.centerRow }>
                                                        { parArr.map(([key, value]: [string, number], hole: number ) => {
                                                            if (value && hole < 9) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={ styles.scoreText } >{`${ value }`}</Text>
                                                                    </View>
                                                                )
                                                            } else if (value === 0 && hole < 9) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={ styles.scoreText } >0</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                    <View style={[ styles.typeBox, { width: 40 }]}>
                                                        <Text style={ styles.scoreText }>{ getParSum(0) }</Text>
                                                    </View>                               
                                                </View>

                                                <View style={ styles.scoreCardRow }>
                                                    <View style={ styles.typeBox }>
                                                        <Text style={[ styles.typeText, { color: '#121619' }]}>SCORE</Text>
                                                    </View>                                    
                                                    <View style={[ styles.centerRow, { backgroundColor: '#f3f3f3' }]}>
                                                        { shotArr.map(([key, value]: [string, number], hole: number ) => {
                                                            if (value && hole < 9) {
                                                                return (
                                                                    <View style={[ styles.scoreBox ,getScoreType(hole, value) > 0 && { backgroundColor: '#FFDABE' }, 
                                                                        getScoreType(hole, value) < 0 && { backgroundColor: '#E0F7ED' },
                                                                    ]} key={ hole }>
                                                                        <Text style={ styles.scoreText } >{`${ value }`}</Text>
                                                                        
                                                                        { getScoreType(hole, value) > 1 && <View style={ styles.smallCircle } ></View> }
                                                                        { getScoreType(hole, value) >= 1 && <View style={ styles.bigCircle } ></View> }
                                                                        { getScoreType(hole, value) <= -1 && <View style={ styles.bigSquare } ></View> }
                                                                        { getScoreType(hole, value) < -1 && <View style={ styles.smallSquare }></View> }
                                                                        { (recordArr.mulliganArr[index] as any)[`hole${hole + 1}`] === 'Y' && <Mulligan style={ styles.mulligan } /> }
                                                                    </View>
                                                                )
                                                            } else if (value === 0 && hole > 8) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={ styles.scoreText } >0</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                    </View>
                                                    <View style={[ styles.typeBox, { width: 40 }]}>
                                                        <Text style={ styles.scoreText }>{ getFirstShotCount() }</Text>
                                                    </View>                                
                                                </View>
                                                <View style={ styles.scoreCardRow }>
                                                    <View style={ styles.typeBox }>
                                                        <Text style={[ styles.typeText, { color: '#121619' }]}>PUTT</Text>
                                                    </View>                                    
                                                    <View style={ styles.centerRow }>
                                                        { puttArr.map(([key, value]: [string, number], hole: number ) => {
                                                            if (value && hole < 9) {
                                                                return (
                                                                    <View  key={ hole }>
                                                                        <Text style={ styles.scoreText } >{`${ value }`}</Text>
                                                                    </View>
                                                                )
                                                            } else if (value === 0 && hole < 9) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={ styles.scoreText } >0</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })} 
                                                    </View>
                                                    <View style={[ styles.typeBox, { width: 40 }]}>
                                                        <Text style={ styles.scoreText }>{ getFirstPuttCount() }</Text>
                                                    </View>                                
                                                </View>
                                            </View>

                                            { recordArr.shotcount[index].hole10 && 
                                                <View style={[ styles.scoreCard, { marginBottom: 18, borderBottomWidth: 1 }]}>
                                                    <View style={[ styles.scoreCardRow, { backgroundColor: '#f6f6f6' }]}>
                                                        <View style={ styles.typeBox }>
                                                            <Text style={ styles.typeText }>HOLE</Text>
                                                        </View>
                                                        <View style={ styles.centerRow }>
                                                            { Array.from({ length: 9 }, (_, index: number) => (
                                                                <Text style={ styles.holeText } key={ index }>{ index + 10 }</Text>
                                                            ))}
                                                        </View>
                                                        <View style={[ styles.typeBox, { width: 40 }]}>
                                                            <Text style={ styles.typeText }>총합</Text>
                                                        </View>                                
                                                    </View>

                                                    <View style={ styles.scoreCardRow }>
                                                        <View style={ styles.typeBox }>
                                                            <Text style={[ styles.typeText, { color: '#121619' }]}>PAR</Text>
                                                        </View>
                                                        <View style={ styles.centerRow }>
                                                            { parArr.map(([key, value]: [string, number], hole: number ) => {
                                                                if (value && hole > 8) {
                                                                    return (
                                                                        <View key={ hole }>
                                                                            <Text style={ styles.scoreText } >{`${ value }`}</Text>
                                                                        </View>
                                                                    )
                                                                } else if (value === 0 && hole > 8) {
                                                                    return (
                                                                        <View key={ hole }>
                                                                            <Text style={ styles.scoreText } >0</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            })}
                                                        </View>
                                                        <View style={[ styles.typeBox, { width: 40 }]}>
                                                            <Text style={ styles.scoreText }>{ getParSum(9) }</Text>
                                                        </View>                               
                                                    </View>

                                                    <View style={ styles.scoreCardRow }>
                                                        <View style={ styles.typeBox }>
                                                            <Text style={[ styles.typeText, { color: '#121619' }]}>SCORE</Text>
                                                        </View>                                    
                                                        <View style={[ styles.centerRow, { backgroundColor: '#f3f3f3' }]}>
                                                        { shotArr.map(([key, value]: [string, number], hole: number ) => {
                                                            if (value && hole > 8) {
                                                                return (
                                                                    <View style={[ styles.scoreBox ,getScoreType(hole, value) > 0 && { backgroundColor: '#FFDABE' }, 
                                                                        getScoreType(hole, value) < 0 && { backgroundColor: '#E0F7ED' },
                                                                    ]} key={ hole }>
                                                                        <Text style={ styles.scoreText } >{`${ value }`}</Text>
                                                                        { getScoreType(hole, value) > 1 && <View style={ styles.smallCircle } ></View> }
                                                                        { getScoreType(hole, value) >= 1 && <View style={ styles.bigCircle } ></View> }
                                                                        { getScoreType(hole, value) <= -1 && <View style={ styles.bigSquare } ></View> }
                                                                        { getScoreType(hole, value) < -1 && <View style={ styles.smallSquare }></View> }
                                                                        { (recordArr.mulliganArr[index] as any)[`hole${hole + 1}`] === 'Y' && <Mulligan style={ styles.mulligan } /> }
                                                                    </View>
                                                                )
                                                            } else if (value === 0 && hole > 8) {
                                                                return (
                                                                    <View key={ hole }>
                                                                        <Text style={ styles.scoreText } >0</Text>
                                                                    </View>
                                                                )
                                                            }
                                                        })}
                                                        </View>
                                                        <View style={[ styles.typeBox, { width: 40 }]}>
                                                            <Text style={ styles.scoreText }>{ getLastShotCount() }</Text>
                                                        </View>                                
                                                    </View>
                                                    <View style={ styles.scoreCardRow }>
                                                        <View style={ styles.typeBox }>
                                                            <Text style={[ styles.typeText, { color: '#121619' }]}>PUTT</Text>
                                                        </View>                                    
                                                        <View style={ styles.centerRow }>
                                                            { puttArr.map(([key, value]: [string, number], hole: number ) => {
                                                                if (value && hole > 8) {
                                                                    return (
                                                                        <View key={ hole }>
                                                                            <Text style={ styles.scoreText } >{`${ value }`}</Text>
                                                                        </View>
                                                                    )
                                                                } else if (value === 0 && hole > 8) {
                                                                    return (
                                                                        <View key={ hole }>
                                                                            <Text style={ styles.scoreText } >0</Text>
                                                                        </View>
                                                                    )
                                                                }
                                                            })} 
                                                        </View>
                                                        <View style={[ styles.typeBox, { width: 40 }]}>
                                                            <Text style={ styles.scoreText }>{ getLastPuttCount() }</Text>
                                                        </View>                                
                                                    </View>
                                                </View>
                                            }
                                            
                                        </>
                                    }
                                </View>
                            )
                        })}
                        
                        { recordArr.inArr[0].playMode !== 'Match' &&
                            <View style={ styles.container }>
                                <View style={[ styles.rowContainer, { justifyContent: 'space-between' }]}>
                                    <View style={ styles.rowContainer }>
                                        <Eagle />
                                        <Text style={ styles.scoreTypeText }>이글이상</Text>
                                    </View>
                                    <View style={ styles.rowContainer }>
                                        <Buddy />
                                        <Text style={ styles.scoreTypeText }>버디</Text>
                                    </View>
                                    <View style={ styles.rowContainer }>
                                        <Bogey />
                                        <Text style={ styles.scoreTypeText }>보기</Text>
                                    </View>
                                    <View style={ styles.rowContainer }>
                                        <DoubleBogey />
                                        <Text style={ styles.scoreTypeText }>더블보기 이상</Text>
                                    </View>
                                    <View style={ styles.rowContainer }>
                                        <Mulligan />
                                        <Text style={ styles.scoreTypeText }>멀리건</Text>
                                    </View>
                                </View>
                            </View>
                        }

                        { videoList && videoList.thumbnail.length > 0 &&
                            <>
                                <Text style={[ styles.boldText, { marginLeft: 15 }]}>마이 스윙폼</Text>
                                <ScrollView style={{ marginHorizontal: 15, marginBottom: 48 }}  horizontal showsHorizontalScrollIndicator={ false }>
                                    { videoList.thumbnail.map((item: Thumbnail, index: number) => {
                                        return (
                                            <Pressable style={ styles.thumbnail } key={ index } onPress={ () => navigation.navigate('VideoDetail', { videoInfo: videoList, videoIndex: 0, thumbnailIndex: index })}>
                                                <FastImage 
                                                    style={ styles.thumbnailImg } 
                                                    source={{ 
                                                        uri: item.url,
                                                        priority: FastImage.priority.normal,
                                                        cache: FastImage.cacheControl.immutable 
                                                    }} 
                                                    resizeMode="cover" 
                                                />  
                                                <Play style={ styles.playBtn } 
                                                />  
                                                <View style={ styles.info }>
                                                    <Text style={ styles.regularText }>{ item.club }</Text>
                                                    <Text style={[ styles.boldText, { marginBottom: 0, marginLeft: 0, color: '#ffffff' }]}>{ item.distance }m</Text>
                                                </View>
                                            </Pressable>
                                        )
                                    })}
                                </ScrollView>
                            </>
                        }
                        
                        { myPositionArr && myPositionArr.length > 0 && sortedMinimapList && sortedMinimapList.length > 0 && 
                            <View style={ styles.mapContainer }>
                                <Text style={[ styles.boldText]}>홀 공략 기록​</Text>
                                <View style={[ styles.rowContainer, { marginBottom: 15 }]}>
                                    <Pressable style={[ styles.minimapType, type === 0 && { borderWidth: 0, backgroundColor: '#fd780f'}]} onPress={ () => setType(0)} >
                                        <Text style={[ styles.regularText, { fontSize: 16, marginBottom: 0, color: '#666666' }, type === 0 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>{ getCourseName(1) }</Text>
                                    </Pressable>
                                    { recordArr.shotcount[0].hole10 !== null &&
                                        <Pressable style={[ styles.minimapType, type === 1 && { borderWidth: 0, backgroundColor: '#fd780f'}] } onPress={ () => setType(1)} >
                                            <Text style={[ styles.regularText, { fontSize: 16, marginBottom: 0, color: '#666666' }, type === 1 && { fontFamily: 'Pretendard-Bold', color: '#ffffff' }]}>{ getCourseName(2) }</Text>
                                        </Pressable>
                                    }
                                    
                                </View>
                                <View style={[ styles.minimapInfo, { width: mapSizeX, height: mapSizeY }]}>
                                    <View style={ styles.mapInfo }>
                                        <Text style={ styles.holeInfoText }>{ hole } Hole</Text>
                                        <View style={ styles.holeInfoBlank }></View>
                                        <Text style={ styles.holeInfoText }>PAR { getPar() }</Text>
                                    </View>
                                    { type === 0 ? (
                                        <FastImage 
                                            style={ styles.thumbnailImg }                   
                                            source={{ 
                                                uri: sortedMinimapList[hole - 1].minimapResource,
                                                priority: FastImage.priority.normal,
                                                cache: FastImage.cacheControl.immutable 
                                            }} 
                                            resizeMode="cover"
                                        />
                                        ) : (
                                        <FastImage 
                                            style={ styles.thumbnailImg }                   
                                            source={{ 
                                                uri: sortedMinimapList[hole + 8].minimapResource ?? '',
                                                priority: FastImage.priority.normal,
                                                cache: FastImage.cacheControl.immutable 
                                            }} 
                                            resizeMode="cover"
                                        />
                                    )}
                                    <Pressable style={[ styles.arrow, { left: 15 }]} onPress={ onPressLeft }>
                                        <LeftArrow />
                                    </Pressable>
                                    <Pressable style={[ styles.arrow, { right: 15 }]} onPress={ onPressRight }>
                                        <RightArrow />
                                    </Pressable>
                                    { myPositionArr.map((item: PositionInfo, index: number) => {
                                        const startX = (item.stMiniX - 280) * mapSizeX / 1488 - 4
                                        const startY = (item.stMiniY - 880) * mapSizeY / 2337 - 4
                                        const endX = (item.edMiniX - 280) * mapSizeX / 1488 - 4
                                        const endY = (item.edMiniY - 880) * mapSizeY / 2337 - 4
                                        const isLeft = (endX - startX) > 0 ? false : true
                                        const dx = endX - startX
                                        const dy = endY - startY
                                        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
                                        const isHazard = (item.landPlace === 'Hazard' || item.landPlace === 'Road') ? true : false
                                        let isResqued = false

                                        if (index > 0) {
                                            isResqued = myPositionArr[index - 1].landPlace === 'Hazard' || myPositionArr[index - 1].landPlace === 'Road'
                                        }

                                        const getDistance = () => {
                                            if (item.totalDistance) {
                                                return item.totalDistance.toFixed(1) ?? 0
                                            }
                                        }

                                        const getShotCount = () => {
                                            if (item.shotCount === 1) return '1st'
                                            if (item.shotCount === 2) return '2nd'
                                            if (item.shotCount === 3) return '3rd'

                                            return item.shotCount + 'th'
                                        }

                                        if (type === 0 && item.holeNumber === hole) {
                                            return (
                                                <View style={ styles.positionContainer } key={ index }>
                                                    { item.landPlace === 'OB' ? (
                                                        <Svg height="100%" width="100%">
                                                             <Line
                                                                x1={startX}
                                                                y1={startY}
                                                                x2={endX}
                                                                y2={endY}
                                                                stroke="#ffff00"
                                                                strokeWidth="2"
                                                            />
                                                            <View style={[ styles.circle, { left: startX - 4, top: startY - 4, backgroundColor: '#ffff00' }]}>
                                                                <View style={ styles.miniCircle }></View>
                                                            </View>
                                                            <View style={[{ position: 'absolute', left: endX, top: endY, transform: [{ rotate: `${angle + 90}deg`}]}]}>
                                                                <OBX style={{ position: 'absolute', left: -4, top: -4 }}  />
                                                            </View>                                                       
                                                        </Svg>
                                                    ) : (
                                                        <Svg height="100%" width="100%">
                                                             <Line
                                                                x1={startX}
                                                                y1={startY}
                                                                x2={endX}
                                                                y2={endY}
                                                                stroke={ isHazard ? '#e20500' : 'blue' }
                                                                strokeWidth="2"
                                                            />
                                                            { isResqued ? (
                                                                <View style={[{ position: 'absolute', left: startX, top: startY, transform: [{ rotate: `${angle + 90}deg`}]}]}>
                                                                    <Triangle style={[{ position: 'absolute', left: -5, top: -5 }]} />  
                                                                </View>
                                                                ) : (
                                                                <View style={[ styles.circle, { left: startX - 4, top: startY - 4 }]}>
                                                                    <View style={ styles.miniCircle }></View>
                                                                </View>
                                                            )}

                                                            { isHazard ? (
                                                                <View style={[{ position: 'absolute', left: endX, top: endY, transform: [{ rotate: `${angle + 90}deg`}]}]}>
                                                                    <X style={{ position: 'absolute', left: -4, top: -4 }}  />
                                                                </View>
                                                                ) : (
                                                                <>
                                                                    <View style={[ styles.circle, { left: endX - 4, top: endY - 4 }]}>
                                                                        <View style={ styles.miniCircle }></View>
                                                                    </View>
                                                                   
                                                                </>
                                                            )}
                                                        </Svg>
                                                    )}
                                                    { isLeft ? (
                                                        <View style={[ styles.positionBox, { right: Dimensions.get('window').width - endX - 25, top: endY - 12.5 }]}>
                                                            <View style={ styles.positionInfo }>
                                                                <Text style={[ styles.regularText, { fontSize: 12, color: '#949494' }]}>{ getShotCount() }</Text>
                                                                <Text style={ styles.semiBoldText }>{ getDistance() }m</Text>
                                                            </View>
                                                            <Left />
                                                        </View>   
                                                        ) : (
                                                        <>
                                                            <View style={[ styles.positionBox, { left: endX + 5, top: endY - 12.5 }]}>
                                                                <Right />
                                                                <View style={ styles.positionInfo }>
                                                                    <Text style={[ styles.regularText, { fontSize: 12, color: '#949494' }]}>{ getShotCount() }</Text>
                                                                    <Text style={ styles.semiBoldText }>{ getDistance() }m</Text>
                                                                </View>
                                                            </View>   
                                                        </>
                                                    )}
                                                </View>
                                            )
                                        } else if (type === 1 && item.holeNumber === hole + 9) {
                                            return (
                                                <View style={ styles.positionContainer } key={ index }>
                                                    { item.landPlace === 'OB' ? (
                                                        <Svg height="100%" width="100%">
                                                             <Line
                                                                x1={startX}
                                                                y1={startY}
                                                                x2={endX}
                                                                y2={endY}
                                                                stroke="#ffff00"
                                                                strokeWidth="2"
                                                            />
                                                            <View style={[ styles.circle, { left: startX - 4, top: startY - 4, backgroundColor: '#ffff00' }]}>
                                                                <View style={ styles.miniCircle }></View>
                                                            </View>
                                                            <View style={[{ position: 'absolute', left: endX, top: endY, transform: [{ rotate: `${angle + 90}deg`}]}]}>
                                                                <OBX style={{ position: 'absolute', left: -4, top: -4 }}  />
                                                            </View>                                                       
                                                        </Svg>
                                                    ) : (
                                                        <Svg height="100%" width="100%">
                                                             <Line
                                                                x1={startX}
                                                                y1={startY}
                                                                x2={endX}
                                                                y2={endY}
                                                                stroke={ isHazard ? '#e20500' : 'blue' }
                                                                strokeWidth="2"
                                                            />
                                                            { isResqued ? (
                                                                <View style={[{ position: 'absolute', left: startX, top: startY, transform: [{ rotate: `${angle + 90}deg`}]}]}>
                                                                    <Triangle style={[{ position: 'absolute', left: -5, top: -5 }]} />  
                                                                </View>
                                                                ) : (
                                                                <View style={[ styles.circle, { left: startX - 4, top: startY - 4 }]}>
                                                                    <View style={ styles.miniCircle }></View>
                                                                </View>
                                                            )}

                                                            { isHazard ? (
                                                                <View style={[{ position: 'absolute', left: endX, top: endY, transform: [{ rotate: `${angle + 90}deg`}]}]}>
                                                                    <X style={{ position: 'absolute', left: -4, top: -4 }}  />
                                                                </View>
                                                                ) : (
                                                                <View style={[ styles.circle, { left: endX - 4, top: endY - 4 }]}>
                                                                    <View style={ styles.miniCircle }></View>
                                                                </View>
                                                            )}
                                                        </Svg>
                                                    )}
                                                    { isLeft ? (
                                                        <View style={[ styles.positionBox, { right: Dimensions.get('window').width - endX - 25, top: endY - 12.5 }]}>
                                                            <View style={ styles.positionInfo }>
                                                                <Text style={[ styles.regularText, { fontSize: 12, color: '#949494' }]}>{ getShotCount() }</Text>
                                                                <Text style={ styles.semiBoldText }>{ getDistance() }m</Text>
                                                            </View>
                                                            <Left />
                                                        </View>   
                                                        ) : (
                                                        <>
                                                            <View style={[ styles.positionBox, { left: endX + 5, top: endY - 12.5 }]}>
                                                                <Right />
                                                                <View style={ styles.positionInfo }>
                                                                    <Text style={[ styles.regularText, { fontSize: 12, color: '#949494' }]}>{ getShotCount() }</Text>
                                                                    <Text style={ styles.semiBoldText }>{ getDistance() }m</Text>
                                                                </View>
                                                            </View>   
                                                        </>
                                                    )}
                                                </View>
                                            )
                                        }
                                    })}
                                </View>
                            </View>
                        }
                    </>
                }
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#f3f3f3'
    },
    ccInfoContainer: {
        paddingTop: 224,
        marginTop: -200,
        paddingHorizontal: 15,

        backgroundColor: '#ef7617'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    infoText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    ccText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        marginTop: 15,
        marginBottom: 24,

        color: '#ffffff'
    },
    extraLightText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-ExtraLight',

        color: '#fd780f'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        marginLeft: 3,

        color: '#ffffff'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 18,

        color: '#121619'
    },
    bar: {
        width: 1,
        height: 16,

        marginHorizontal: 6,

        backgroundColor: '#ffffff'
    },
    location: {
        marginRight: 3,

        transform: [{ translateY: 1 }]
    },
    scoreCardContainer: {
        marginHorizontal: 15,

        transform: [{ translateY: -15 }],

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
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 36,
        height: 36,

        marginRight: 6,

        borderRadius: 20,

        backgroundColor: '#dddddd'
    },
    img: {
        width: '100%',
        height: '100%',

        borderRadius: 40
    },
    crownContainer: {
        alignItems :'center',
        justifyContent: 'center',

        position: 'absolute',
        top: 0,
        left: 0,

        width: 14,
        height: 14,

        borderRadius: 30,

        backgroundColor: '#ffd037'
    },
    nicknameComtainer: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 15 ,
    },
    nicknameText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    totalShotText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 15,

        color: '#121619'
    },
    container: {
        marginHorizontal: 15,
        paddingBottom: 48
    },
    scoreTypeText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginLeft: 3,

        color: '#121619'
    },
    scoreCard: {
        borderTopWidth: 1,
        borderColor: '#fcbc8a'
    },
    scoreCardRow: {
        flexDirection: 'row',
        alignItems: 'center',


        borderBottomWidth: 1,
        borderColor: '#eeeeee'
    },
    centerRow: {
        height: (Dimensions.get('window').width - 122) / 9,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eeeeee'
    },
    typeBox: {
        flexDirection: 'row',

        width: 52,
        height: (Dimensions.get('window').width - 122) / 9,

        justifyContent: 'center',
        alignItems: 'center' 
    },
    typeText: {
        includeFontPadding: false,
        fontSize: 11,
        fontFamily: 'Pretendard-Regular',

        color: '#666666'
    },
    holeText: {        
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 11,
        fontFamily: 'Pretendard-Regular',

        width: (Dimensions.get('window').width - 122) / 9,

        color: '#666666'
    },
    scoreBox: {
        height: (Dimensions.get('window').width - 122) / 9,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#f3f3f3'
    },
    scoreText: {
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 11,
        fontFamily: 'Pretendard-SemiBold',

        width: (Dimensions.get('window').width - 122) / 9,

        color: '#121619'
    },
    smallCircle: {
        width: (Dimensions.get('window').width - 122) / 9 - 8,
        height: (Dimensions.get('window').width - 122) / 9 - 8,

        position: 'absolute',

        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fd780f',

        zIndex: -1,
    },
    bigCircle: {
        width: (Dimensions.get('window').width - 122) / 9 - 4,
        height: (Dimensions.get('window').width - 122) / 9 - 4,

        position: 'absolute',

        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fd780f',

        zIndex: -1,
    },
    smallSquare: {
        width: (Dimensions.get('window').width - 122) / 9 - 8,
        height: (Dimensions.get('window').width - 122) / 9 - 8,

        position: 'absolute',


        borderWidth: 1,
        borderColor: '#009746',

        zIndex: -1,
    },
    bigSquare: {
        width: (Dimensions.get('window').width - 122) / 9 - 4,
        height: (Dimensions.get('window').width - 122) / 9 - 4,

        position: 'absolute',


        borderWidth: 1,
        borderColor: '#009746',

        zIndex: -1,
    },
    mulligan: {
        position: 'absolute',
        top: -2,
        right: 2
    },
    thumbnail: {
        width: 156,
        height: 161,

        marginRight: 6,
        
        backgroundColor: '#121619'
    },
    thumbnailImg: {
        width: '100%',
        height: '100%'
    },
    playBtn: {
        position: 'absolute',
        top: 66.5,
        left: 64
    },
    info: {
        position: 'absolute',
        left: 15,
        bottom: 15,
    },
    line1: {
        position: 'absolute',
        width: 10,
        height: 2,
        backgroundColor: '#e20500',
        transform: [{ rotate: '45deg' }],
    },
        line2: {
        position: 'absolute',
        width: 10,
        height: 2,
        backgroundColor: '#e20500',
        transform: [{ rotate: '-45deg' }],
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 8,
        height: 8,

        position: 'absolute',

        borderRadius: 30,
        backgroundColor: 'blue'
    },
    miniCircle: {
        width: 4,
        height: 4,

        borderRadius: 30,
        backgroundColor: '#ffffff'
    },
    mapContainer: {
        paddingBottom: 50,
        marginHorizontal: 15
    },
    minimapInfo: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    minimapType: {
        alignItems: 'center',

        paddingVertical: 9,
        paddingHorizontal: 18,
        marginRight: 6, 

        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#949494'
    },
    arrow: {
        position: 'absolute',

        zIndex: 1
    },
    holeInfoText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#ffffff'
    },
    holeInfoBlank: {
        width: 1,
        height: 21,

        marginHorizontal: 9,

        backgroundColor: '#ffffff'
    },
    mapInfo: {
        flexDirection: 'row',
        alignItems: 'center',

        position: 'absolute',
        top: 26,

        zIndex: 1
    },
    positionContainer: {
        width: '100%',
        height: '100%',

        position: 'absolute',
        top: 0,
        left: 0,

        overflow: 'hidden'
    },
    positionBox: {
        flexDirection: 'row',   
        alignItems: 'center',

        position: 'absolute'
    },
    positionInfo: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 3,
        paddingHorizontal: 6,

        borderRadius: 3,
        backgroundColor: '#121619'
    },
    compContainer: {
        paddingVertical: 16,
        paddingHorizontal: 13,
        marginBottom: 30,

        backgroundColor: '#ffffff'
    },
    compCircle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 26,
        height: 26,

        marginRight: 5,

        borderRadius: 30,
        backgroundColor: '#ffd037'
    },
    compType: {
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginRight: 5,

        borderWidth: 1,
        borderColor: '#949494',
        borderRadius: 18,
        backgroundColor: '#949494'
    },
    courseType: {
        paddingVertical: 5,
        paddingHorizontal: 12,

        borderWidth: 1,
        borderRadius: 18,
        borderColor: '#949494'
    } ,
    resultContainer: {
        alignItems: 'center',

        marginVertical: 15,
    }
})

export default ScoreCard