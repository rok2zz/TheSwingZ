import { Dimensions, Platform, Pressable, StyleSheet, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import VideoPlayer from "react-native-video-player"

// svg
import Close from "../../../assets/imgs/brand/X.svg"
import Orientation from "react-native-orientation-locker"
import { useEffect } from "react"

interface Props {
    route: RouteProp<RootStackParamList, 'FilmVideo'>
}

const FilmVideo = ({ route }: Props): JSX.Element => {
    const type = route.params.type ?? 0
    const navigation = useNavigation<RootStackNavigationProp>()

    useEffect(() => {
        if (type === 0) {
            Orientation.lockToLandscape()
        }
        // 컴포넌트가 마운트될 때 가로 모드로 변경합니다.
        // 컴포넌트가 언마운트될 때 세로 모드로 변경합니다.
        return () => {
          Orientation.lockToPortrait()
        }
    }, [])
    
    return (
        <SafeAreaView style={[ styles.wrapper ]}>   
            <Pressable style={[ styles.close, Platform.OS === 'ios' && { top: 40 }]} onPress={ () => navigation.goBack() }>
                <Close />
            </Pressable>
{/*             
            { type === 0 ? (
                <VideoPlayer 
                    video={ require('../../assets/imgs/brand/brandfilm.mp4' )}
                    defaultMuted={ false }
                    videoWidth={ Dimensions.get('window').width }
                    videoHeight={ (Dimensions.get('window').width - 30) * 61 / 100 }
                    thumbnail={ require('../../assets/imgs/brand/thumbnail_brandfilm.png') }
                    endThumbnail={ require('../../assets/imgs/brand/thumbnail_brandfilm.png') }
                    fullscreen
                />
            ) : ( 
                <VideoPlayer 
                    video={ require('../../assets/imgs/brand/brandfilm.mp4' )}
                    defaultMuted={ false }
                    videoWidth={ Dimensions.get('window').width }
                    videoHeight={ (Dimensions.get('window').width - 30) * 61 / 100 }
                    thumbnail={ require('../../assets/imgs/brand/thumbnail_brandfilm.png') }
                    endThumbnail={ require('../../assets/imgs/brand/thumbnail_brandfilm.png') }
                    disableFullscreen
                    
                />
            )} */}
            
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        justifyContent: 'center',

        backgroundColor: '#000000'
    },
    close: {
        position: 'absolute',
        top: 21,
        right: 15,

        zIndex: 1
    },
})

export default FilmVideo