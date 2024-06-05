import { useNavigation } from "@react-navigation/native"
import React, { useRef } from "react"
import { Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import YouTube from "react-native-youtube"
import WebView from "react-native-webview"

const API_KEY = 'AIzaSyC6KBmCuiFtckeiUhe-qzF3zmHTb8ZVlbg'

const BrandFilm = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const videoRef = useRef<any>(null)

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={ styles.container }>
                <View style={ styles.videoContainer }>
                    { Platform.OS === 'android' ?
                        <WebView
                            source={{ uri: 'https://www.youtube.com/embed/1U1EZVab19Q' }}
                            allowsInlineMediaPlayback={true}
                            mediaPlaybackRequiresUserAction={false}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                        /> 
                        : 
                        <YouTube
                            videoId="1U1EZVab19Q"
                            apiKey={ API_KEY }
                            play={true}
                            fullscreen={false}
                            loop={false}
                            onReady={(e) => console.log('onReady')}
                            onError={(e) => console.log('onError: ', e.error)}
                            style={{ width: '100%', height: '100%' }}
                        />
                    }
                </View>
            </View>

            <View style={ styles.blankContainer }></View>

            <View style={ styles.container }>
                <Text style={[ styles.regularText, { marginBottom: 9, color: '#949494' }]}>모델</Text>
                <Text style={[ styles.regularText, { marginBottom: 0 }]}>박결 프로, 박진이 프로</Text>

                <Text style={[ styles.regularText, { marginTop: 30, marginBottom: 9, color: '#949494' }]}>시놉시스 - The SwingZ_4Z System</Text>

                <View style={ styles.rowContainer }>
                    <View style={{ marginRight: 58 }}>
                        <Text style={ styles.boldText }>Z-GRAPHIC™</Text>
                        <Text style={ styles.regularText }>극한의 비주얼</Text>
                        <Text style={[ styles.regularText, { marginBottom: 30 }]}>언리얼엔진5</Text>

                        <Text style={ styles.boldText }>Z-PATH™</Text>
                        <Text style={ styles.regularText }>극한의 정밀성</Text>
                        <Text style={ styles.regularText }>2,000f/S 분석 센서</Text>
                    </View>

                    <View>
                        <Text style={ styles.boldText }>Z-SOUND™</Text>
                        <Text style={ styles.regularText }>극한의 몰입감</Text>
                        <Text style={[ styles.regularText, { marginBottom: 30 }]}>5.1ch 사운드</Text>

                        <Text style={ styles.boldText }>Z-GROUND™</Text>
                        <Text style={ styles.regularText }>극한의 필드체감</Text>
                        <Text style={ styles.regularText }>3분할 플레이트</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727'
    },
    container: {
        marginTop: 24, 
        marginHorizontal: 15
    },
    videoContainer: {
        width: Dimensions.get('window').width - 30,
        height: (Dimensions.get('window').width - 30) * 61 / 100,
    },
    video: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

        borderRadius: 3,
    },
    rowContainer: {
        flexDirection: 'row'
    },
    blankContainer: {
        height: 6,

        marginTop: 30,

        backgroundColor: '#707070'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 6,

        color: '#ffffff'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 6,

        color: '#fd780f'
    }
})

export default BrandFilm