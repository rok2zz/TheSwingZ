import { Dimensions, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useEffect } from "react";
import { Payload } from "../../../types/apiTypes";
import { useApi, useYoutubeVideo } from "../../../hooks/useApi";
import { YoutubeVideo } from "../../../slices/api";

// svg
import Logo from "../../../assets/imgs/brand/logo_white.svg"
import ThumbnailLogo from "../../../assets/imgs/brand/logo_empty.svg"

const ZTV = (): JSX.Element => {
    const youtubeLink = 'https://www.youtube.com/@TheSwingZ'

    const { getYoutubeVideo } = useApi()
    const videoItems = useYoutubeVideo()

    useEffect(() => {
        const getVideoItems = async () => {
            try {
                const payload: Payload = await getYoutubeVideo()    
            } catch (error) {
                console.error('Error fetching videos:', error)
            }
        }
  
        getVideoItems()
    }, [])

    const openYoutubeApp = (link: string) => {    
        Linking.openURL(link).catch((err) => console.error('An error occurred', err));
    }
      
    return (
        <View style={ styles.wrapper }>
            <View style={ styles.channelInfo }>
                <View style={ styles.profileImg }>
                    <Logo />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={[ styles.title, { marginBottom: 3 }]}>더스윙제트</Text>
                    <Text style={ styles.title }>유튜브 채널</Text>

                    <Text style={ styles.linkText } onPress={ () =>  openYoutubeApp(youtubeLink) }>{ youtubeLink }</Text>
                </View>
            </View>
            <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false }>
                <View style={{ paddingBottom: 300, marginBottom: -200 }}>
                    { videoItems.length > 0 ? 
                        (videoItems.map((item: YoutubeVideo, index: number) => {
                            const getDate = (dateString: string) => {
                                const targetDate = new Date(dateString)
                                const today: Date = new Date()

                                // 오늘 날짜와 대상 날짜 사이의 밀리초 차이 계산
                                const timeDiff = today.getTime() - targetDate.getTime()
                            
                                // 밀리초를 일로 변환하여 날짜 차이 계산
                                const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
                                const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60))
                                const minDiff = Math.floor(timeDiff / (1000 * 60))
                                const second = Math.floor(timeDiff / (1000))
                            
                                if (daysDiff >= 1) {
                                    return `${daysDiff}일 전`
                                } else if (hoursDiff >= 1) {
                                    return `${hoursDiff}시간 전`
                                } else if (minDiff >= 1) {
                                    return `${minDiff}분 전`
                                } else {
                                    return `${second}초 전`
                                }
                            }

                            const cutString = (val: string): string => {
                                if (val.length > 28) return val.substring(0, 28) + ".."
                                return val
                            }

                            return (
                                <Pressable style={ styles.videoContainer } key={ index } onPress={ () => openYoutubeApp(`https://www.youtube.com/watch?v=${ item.id }`) }>
                                    <Text style={ styles.infoText }>조회수 { item.view }회 · { getDate(item.publishTime ?? '') }</Text>
                                    <View style={ styles.rowContainer }>
                                        <Text style={ styles.videoTitle }>{ cutString(item.title ?? '') }</Text>
                                        { item.thumbnails ? 
                                            <Image style={ styles.thumbnail } source={{ uri: item.thumbnails }} /> 
                                                : (
                                            <View style={ styles.emptyThumbnail }>
                                                <ThumbnailLogo />
                                            </View>
                                        )}
                                            
                                    </View>
                                </Pressable>
                        )
                        })) : (
                            <View style={ styles.emptyContainer }>
                                <Text style={ styles.emptyText }>Loading..</Text>
                            </View>
                        )
                    }
                </View>
                

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727'
    },
    channelInfo: {
        flexDirection: 'row',

        marginTop: 24,
        marginBottom: 30,
        marginHorizontal: 15
    },
    profileImg: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 96,
        height: 96,

        marginRight: 24,

        borderRadius: 50,

        backgroundColor: '#fd780f'
    },
    title: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        marginBottom: 9,

        color: '#ffffff'
    },
    linkText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        textDecorationLine: 'underline',

        color: '#949494'
    },
    container: {
        height: Dimensions.get('window').height - 50,
        
        paddingTop: 30,

        backgroundColor: '#f3f3f3'
    },
    videoContainer: {
        marginHorizontal: 15,
        paddingVertical: 18,
        paddingHorizontal: 15,
        marginBottom: 9,

        borderRadius: 3,

        backgroundColor: '#ffffff'
    },
    infoText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        color: '#949494'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    videoTitle: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginRight: 25,

        color: '#121619'
    },
    thumbnail: {
        width: 85,
        height: 48,

        borderRadius: 3
    },
    emptyContainer: {
        alignItems: 'center',

        paddingTop: 100
    },
    emptyText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    emptyThumbnail: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 85,
        height: 48,

        borderRadius: 3,

        backgroundColor: '#f3f3f3'
    }
})

export default ZTV