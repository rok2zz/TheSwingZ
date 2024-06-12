import { Alert, Animated, Dimensions, Easing, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import VideoPlayer from "react-native-video-player"
import { useEffect, useState } from "react"
import { useUserInfo } from "../../../hooks/useUsers"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Payload } from "../../../types/apiTypes"
import { useSwingVideo, useVideoList, useVideos } from "../../../hooks/useVideos"
import { useVideoActions } from "../../../hooks/useVideoActions"
import video, { Thumbnail, VideoList } from "../../../slices/video"
import FastImage from "react-native-fast-image"

// svg
import Close from "../../../assets/imgs/swing/close.svg"
import EmptyHeart from "../../../assets/imgs/swing/empty_heart.svg"
import FilledHeart from "../../../assets/imgs/swing/filled_heart.svg"
import Share from "../../../assets/imgs/swing/share.svg"
import Download from "../../../assets/imgs/swing/download.svg"
import Remove from "../../../assets/imgs/swing/remove.svg"
import Play from "../../../assets/imgs/swing/play.svg"
import EmptyImg from "../../../assets/imgs/swing/empty_img.svg"
import Checker from "../../../assets/imgs/swing/checker_white.svg"
import Loading from "../../../components/Loading"


interface Props {
    route: RouteProp<RootStackParamList, 'VideoDetail'>
}

const VideoDetail = ({ route }: Props): JSX.Element => {
    const videoInfo: VideoList = route.params?.videoInfo
    const videoIndex: number = route.params?.videoIndex ?? 0
    const thumbnailIndex: number = route.params?.thumbnailIndex ?? 0
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getSwingVideo, deleteSwingVideo } = useVideos()
    const { removeSwingVideo, clearVideo } = useVideoActions()
    const userInfo = useUserInfo()
    const swingVideo = useSwingVideo()
    const videoList = useVideoList()

    const [aniValue, setAniValue] = useState(new Animated.Value(0))
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [like, setLike] = useState<boolean>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const [profileImg, setProfileImg] = useState<string>('')
    const [videoUri, setVideoUri] = useState<string>('')
    const color: string = isOpen ? '#fd780f' : '#b4b4b4'

    useEffect(() => {
        getProfileImg()
        getVideo()
    }, [])

    useEffect(() => {
        getVideo()
    }, [thumbnailIndex])

    useEffect(() => {
        setVideoUri(swingVideo.url)
    }, [swingVideo])

    useEffect(() => {
        Animated.timing(aniValue, {
          toValue: isOpen ? 1 : 0,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start()
    }, [isOpen])

    const moveSwitchToggle = aniValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 28]
    })

    const getProfileImg = async () => {
        if (userInfo.profileImg)  {
            setProfileImg(userInfo.profileImg ?? '')
        }
    }

    const getVideo = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getSwingVideo(videoInfo.thumbnail[thumbnailIndex].id)
        if (payload.code !== 1000) {
            Alert.alert('알림', 
                payload.msg ?? '서버에 연결할 수 없습니다.',
                [
                    {
                        text: '확인', 
                        onPress: () => { 
                            navigation.goBack()
                        }
                    }
                ]
            )
            setTimeout(() => {
                setIsConnected(false)
            }, 1000)

            return
        }

        setTimeout(() => {
            setIsConnected(false)
        }, 1000)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        return `${year}.${month}.${day}`
    }

    const onPressDeleteVideo = async () => {
        if (isConnected) return

        Alert.alert(
            '알림',
            '삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { 
                        return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async (): Promise<void> => { 
                        setIsConnected(true)
                        const payload: Payload = await deleteSwingVideo(videoInfo.thumbnail[thumbnailIndex].id)
                        if (payload.code !== 1000) {
                            Alert.alert('알림', payload.msg ?? '서버에 연결할 수 없습니다.')
                            setTimeout(() => {
                                setIsConnected(false)
                            }, 1000)
                
                            return
                        }
                
                        Alert.alert('알림', '삭제되었습니다.',[
                            {
                                text: '확인',
                                onPress: () => { 
                                    setIsConnected(false)
                                    if (videoList.length === 1 && videoInfo.thumbnail.length === 1) {
                                        clearVideo()
                                        navigation.goBack()
                                        return
                                    }
                                    removeSwingVideo({ videoIndex: videoIndex, thumbnailIndex: thumbnailIndex })
                                    navigation.goBack()
                                }
                            }
                        ])
                    },
                }
            ],
        )
    }

    return (
        <SafeAreaView style={ styles.wrapper }>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <View style={ styles.header }>
                <Text style={ styles.semiBoldText }>마이 스윙폼 상세보기​</Text>
                <Pressable onPress={ () => navigation.goBack() } >
                    <Close style={{ marginRight: 15 }}/>
                </Pressable>
            </View>
            <ScrollView showsVerticalScrollIndicator={ false }>
                { videoUri === '' ? 
                    <>
                    </>
                    :
                    <VideoPlayer 
                        video={{ uri: videoUri }}
                        defaultMuted={ true }
                        videoWidth={ Dimensions.get('window').width }
                        videoHeight={ Dimensions.get('window').width * 3 / 4 }
                        thumbnail={{ uri: videoInfo.thumbnail[thumbnailIndex].url }}
                        endThumbnail={{ uri: videoInfo.thumbnail[thumbnailIndex].url }}
                    />
                }
               

                <View style={ styles.btnContainer }>
                    {/* <Pressable style={{ flex: 1 }} onPress={ () => setLike(prev => !prev) }>
                        { like ? <FilledHeart  /> : <EmptyHeart />}
                    </Pressable>

                    { isOpen ? <Text style={[ styles.regularText, { marginRight: 6, fontSize: 14 }]}>ON</Text> : <Text style={[ styles.regularText, { marginRight: 6, fontSize: 14 }]}>OFF</Text> } 
                    <Pressable style={[ styles.toggleContainer, { backgroundColor: color }]} onPress={ () => setIsOpen(prev => !prev)}>
                        <Animated.View style={[ styles.toggleWheel, { transform: [{ translateX: moveSwitchToggle }]}]}></Animated.View>
                    </Pressable>        
                    <Share style={{ marginRight: 24 }} />
                    <Download style={{ marginRight: 24 }} /> */}
                    <Pressable onPress={ onPressDeleteVideo }>
                        <Remove />
                    </Pressable>
                </View>

                <View style={ styles.blank }></View>

                <View style={ styles.infoContainer }>
                    <View style={[ styles.rowContainer, { marginBottom: 18 }]}>
                        <View style={[ styles.rowContainer, { flex: 1 }]}>
                            { profileImg === '' || !profileImg ? 
                                <View style={[ styles.profileImg, { alignItems: 'center', justifyContent: 'center', backgroundColor: 'skyblue' }]}>
                                    <EmptyImg width={ 40 } height={ 40 } /> 
                                </View>
                                : 
                                <FastImage 
                                    style={ styles.profileImg } 
                                    source={{ 
                                        uri: profileImg,
                                        priority: FastImage.priority.normal,
                                        cache: FastImage.cacheControl.immutable 
                                    }} 
                                />
                            }
                            
                            <Text style={ styles.boldText }>{ userInfo.nick }</Text>
                        </View>
                        <Text style={[ styles.regularText, { color: '#666666' }]}>{ formatDate(videoInfo.dayAt) }​</Text>
                    </View>

                    <View style={[ styles.rowContainer, { marginBottom: 15}]}>
                        <Text style={[ styles.regularText, { flex: 1, color: '#666666' }]}>코스​</Text>
                        <Text style={ styles.regularText }>{ videoInfo.ccName }</Text>
                    </View>
                    <View style={[ styles.rowContainer, { marginBottom: 15}]}>
                        <Text style={[ styles.regularText, { flex: 1, color: '#666666' }]}>홀 정보</Text>
                        <Text style={ styles.regularText }>{ videoInfo.thumbnail[thumbnailIndex].holeNumber }</Text>
                    </View>
                    <View style={ styles.rowContainer }>
                        <Text style={[ styles.regularText, { flex: 1, color: '#666666' }]}>클럽 정보</Text>
                        <Text style={ styles.regularText }>{ videoInfo.thumbnail[thumbnailIndex].club }</Text>
                    </View>
                </View>

                <ScrollView style={ styles.videoContainer } horizontal showsHorizontalScrollIndicator={ false }>
                    { videoInfo.thumbnail.map((item: Thumbnail, index: number) => {

                        return (
                            <View key={ index }>
                                { (item.url && item.url !== '') && 
                                    <Pressable style={ styles.thumbnail } onPress={ () => navigation.navigate('VideoDetail', { videoInfo: videoInfo, videoIndex: videoIndex, thumbnailIndex: index })}>
                                        <FastImage 
                                            style={ styles.thumbnailImg } 
                                            source={{ 
                                                uri: item.url,
                                                priority: FastImage.priority.normal,
                                                cache: FastImage.cacheControl.immutable 
                                            }} 
                                            resizeMode="cover" 
                                        />  
                                        { index === thumbnailIndex && 
                                            <View style={ styles.selected }>
                                                <Checker />
                                            </View> 
                                        }
                                        <Play width={ 24 } height={ 24 } style={ styles.button } />
                                        <View style={ styles.swingInfo }>
                                            <Text style={[ styles.regularText, { fontSize: 12, color: '#ffffff' }]}>{ item.club }</Text>
                                            <Text style={[ styles.regularText, { fontSize: 12, color: '#ffffff' }]}>{ item.distance }m</Text>
                                        </View>
                                    </Pressable>
                                }
                            </View>
                            
                        )
                    })}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 19,
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

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
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center' ,

        marginHorizontal: 15,
        paddingVertical: 15
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    toggleContainer: {
        width: 60,
        height: 32,

        paddingLeft: 3,
        marginRight: 28,
        
        borderRadius: 15,
        justifyContent: 'center',
    },
    toggleWheel: {
        width: 25,
        height: 25,

        borderRadius: 12.5,
        backgroundColor: 'white'
    },
    blank: {
        height: 6,

        backgroundColor: '#f2f2f2'
    },
    infoContainer: {
        paddingTop: 14,
        paddingHorizontal: 18,
        paddingBottom: 22,
        marginTop: 24,
        marginBottom: 12,
        marginHorizontal: 15,

        backgroundColor: '#f2f2f2'
    },
    profileImg: {
        width: 48,
        height: 48,

        marginRight: 12,

        borderRadius: 50
    },
    videoContainer: {
        marginTop: 15,
        marginHorizontal: 15,
        marginBottom: 30
    },
    thumbnail: {
        width: 90,
        height: 90,

        marginRight: 3,

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
        top: 25,
        left: 33
    },
    swingInfo: {
        position: 'absolute',
        bottom: 5,
        left: 5
    },
    selected: {
        width: 18,
        height: 18,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        top: 0,
        right: 0,

        borderRadius: 3,
        backgroundColor: '#007a4e'
    }
})

export default VideoDetail