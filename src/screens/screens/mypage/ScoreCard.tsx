import { Alert, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { UserInfo } from "../../../slices/auth"
import { useUserInfo } from "../../../hooks/useUsers"
import { useRecord, useRecords } from "../../../hooks/useRecords"
import { Record } from "../../../slices/record"
import { CcInfo, Payload, PositionInfo } from "../../../types/apiTypes"
import { useScoreCardVideo, useThumbnailList, useVideos } from "../../../hooks/useVideos"
import { Thumbnail } from "../../../slices/video"

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


// svg
import Play from "../../../assets/imgs/swing/play.svg"
import FastImage from "react-native-fast-image"
import Loading from "../../../components/Loading"

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
    const { getScoreCardVideo } = useVideos()

    const [recordIndex, setRecordIndex] = useState<number>(0)
    const [recordArr, setRecordArr] = useState<Record>()
    const [myPositionArr, setMyPositionArr] = useState<PositionInfo[]>([])
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isFolded, setIsFolded] = useState<boolean[]>([false])

    const [year, setYear] = useState<string>('')
    const [month, setmonth] = useState<string>('')
    const [date, setdate] = useState<string>('')

    const mapSizeX = Dimensions.get('window').width - 30
    const mapSizeY = (Dimensions.get('window').width - 30) * 441 / 281

    useEffect(() => {
        if (myRecord.ccArr) {
            for (let i = 0; i < myRecord.ccArr.length; i++) {
                if (myRecord.ccArr[i].roomId === roomId) {
                    setYear(myRecord.parcount[i].date.slice(0, 4))
                    setmonth(myRecord.parcount[i].date.slice(4, 6))
                    setdate(myRecord.parcount[i].date.slice(6, 8))
                    setRecordIndex(i)
                    getScoreCard()
                    getVideoList()
                    return
                }
            }
        }

    }, [roomId])

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

            setMyPositionArr(posArr)
            for (let i = 0; i < payload.record.ccArr.length; i++) {
                setIsFolded(prevState => [...prevState, true])    
            }
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
        const a = myRecord.ccArr[recordIndex].courseName.split('(')[1]
        const coruseName = a.split(')')[0]

        return (myRecord.ccArr[recordIndex].ccName + '-' + coruseName) ?? ''
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
                { recordArr && recordArr.ccArr.length > 0 &&
                    <>
                        <View style={ styles.ccInfoContainer }>
                            <View style={ styles.rowContainer }>
                                <Text style={[ styles.infoText, { flex: 1 }]}>{ year }.{ month }.{ date }</Text>

                                <View style={ styles.rowContainer }>
                                    <Text style={ styles.infoText }>stroke</Text>
                                    <View style={ styles.bar }></View>
                                    <Text style={ styles.infoText }>{ myRecord.inArr[recordIndex].userCount }인</Text>
                                </View>                    
                            </View>

                            <Text style={ styles.ccText }>{ getCcName() }</Text>
                            
                            <View style={[ styles.rowContainer, { paddingBottom: 66 }]}>
                                <View style={[ styles.rowContainer, { flex: 1}]}>
                                    <Location style={ styles.location } />
                                    <Text style={ styles.infoText }>{ myRecord.inArr[0].shopName }</Text>
                                </View>
                                <Share />
                            </View>
                        </View>

                        { recordArr.ccArr.map((item: CcInfo, index: number) => {
                            const parArr: [string, number][] = Object.entries(recordArr.parcount[index]).filter(([key]) => key.includes('hole'))
                            const shotArr: [string, number][] = Object.entries(recordArr.shotcount[index]).filter(([key]) => key.includes('hole'))
                            const puttArr: [string, number][] = Object.entries(recordArr.puttcount[index]).filter(([key]) => key.startsWith('hole'))

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

                            return (
                                <View style={ styles.scoreCardContainer } key={ index }>
                                    {/* my scorecard */}
                                    <View>
                                        <View style={[ styles.nicknameComtainer, index === 0 && { marginTop: 7 }]}>
                                            <Pressable style={[ styles.rowContainer, { flex: 1 }]}>
                                                
                                                <View style={ styles.emptyImg }>
                                                    <EmptyImg width={ 36 } height={ 36 } />
                                                </View>
                                                <Text style={ styles.nicknameText }>{ recordArr.inArr[index].nick }</Text>
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
                                                            <Text style={ styles.scoreText }>36</Text>
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
                                                                <Text style={ styles.scoreText }>36</Text>
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
                                </View>
                            )
                        })}
                        

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

                        { videoList && videoList.thumbnail.length > 0 &&
                            <>
                                <Text style={ styles.boldText }>나의 스윙</Text>
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
                        
                        {/* { myPositionArr && myPositionArr.length > 0 &&
                            <View>
                                <Text style={[ styles.boldText]}>홀 공략 기록​</Text>
                                <View style={{ width: mapSizeX, height: mapSizeY, marginHorizontal: 15, backgroundColor: 'red' }}>
                                    <Image style={{ width: '100%', height: mapSizeY }} 
                                        source={ require('../../../assets/imgs/course/muan_east_a_1.png')} 
                                        // source={{ 
                                        //     uri: imageUri,
                                        //     priority: FastImage.priority.normal,
                                        //     cache: FastImage.cacheControl.immutable 
                                        // }} 
                                        resizeMode="contain"
                                    />
                                    { myPositionArr.map((item: PositionInfo, index: number) => {
                                        const getX = () => {
                                            const newPointX = item.stMiniX - 1024
                                            // console.log(newPointX + 'asdf')
                                            if (newPointX < 0) {

                                            }
                                            return (newPointX ) * mapSizeX / 2048
                                        }

                                        const getY = () => {
                                            const newPointY = item.stMiniY - 880
                                            // console.log(item.stMiniY )
                                            // console.log( (newPointY ) * mapSizeY / 4096)

                                            return (newPointY ) * mapSizeY / 4096
                                        }

                                        if (item.holeNumber === 1) {
                                            return (
                                                <View style={{ position: 'absolute', top: 0, left: 0 }} key={ index }>
                                                    <View style={[ styles.circle, { left: (item.stMiniX - 280) * mapSizeX / 1488 - 4, top: (item.stMiniY - 880) * mapSizeY / 2337 - 4 } ]}></View>
                                                    <View style={[ styles.circle, { left: (item.edMiniX - 280) * mapSizeX / 1488 - 4 , top: (item.edMiniY - 880) * mapSizeY / 2337 - 4 }, { backgroundColor: 'blue'} ]}></View>
                                                </View>
                                            )
                                        }
                                    })}
                                    
                                </View>
                                <View style={{ marginHorizontal: 15, marginTop: 30 }}>
                                    <Image style={{ width: mapSizeX, height: mapSizeY }} 
                                        source={ require('../../../assets/imgs/course/testmuan.png')} 
                                        // source={{ 
                                        //     uri: imageUri,
                                        //     priority: FastImage.priority.normal,
                                        //     cache: FastImage.cacheControl.immutable 
                                        // }} 
                                        resizeMode="contain"
                                    />
                                    { myPositionArr.map((item: PositionInfo, index: number) => {

                                        if (item.holeNumber === 1) {
                                            return (
                                                <View style={{ position: 'absolute', top: 0, left: 0 }} key={ index }>
                                                    <View style={[ styles.circle, { left: item.stMiniX * mapSizeX / 2048, top: item.stMiniY* mapSizeY / 4096} ]}></View>
                                                    <View style={[ styles.circle, { left: item.edMiniX  * mapSizeX / 2048 , top: item.edMiniY * mapSizeY / 4096 }, { backgroundColor: 'blue'} ]}></View>
                                                </View>
                                            )
                                        }
                                    })}
                                    
                                </View>
                            </View>
                        } */}
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
    regularText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#ffffff'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginLeft: 15,
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
    emptyImg: {
        width: 36,
        height: 36,

        marginRight: 6,

        borderRadius: 20,

        backgroundColor: '#f1f3f8'
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
    circle: {
        width: 8,
        height: 8,

        position: 'absolute',

        borderRadius: 30,
        backgroundColor: 'red'
    }
})

export default ScoreCard