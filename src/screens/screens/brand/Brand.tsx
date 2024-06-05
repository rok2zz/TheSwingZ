import { Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import WebView from "react-native-webview"
//svg
import Logo from "../../../assets/imgs/brand/logo_orange.svg"
import LeftQuotation from "../../../assets/imgs/brand/quotation_left.svg"
import RightQuotation from "../../../assets/imgs/brand/quotation_right.svg"
import Pointer from "../../../assets/imgs/brand/pointer_down.svg"
import Zgraphic from "../../../assets/imgs/brand/Z_graphic.svg"
import Zground from "../../../assets/imgs/brand/Z_ground.svg"
import Zsound from "../../../assets/imgs/brand/Z_sound.svg"
import Zpath from "../../../assets/imgs/brand/Z_path.svg"
import Zlounge from "../../../assets/imgs/brand/Z_lounge.svg"
import Slash from "../../../assets/imgs/brand/slash.svg"
import YouTube from "react-native-youtube"


const API_KEY = 'AIzaSyC6KBmCuiFtckeiUhe-qzF3zmHTb8ZVlbg'

const Brand = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()

    const videoWidth = Dimensions.get('window').width - 30
    const videoHeight = videoWidth * 456 / 345

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={ styles.container }>
                <>
                    <Text style={ styles. logoText }>우리가 기다린 단 하나의 필드​</Text>
                    <Logo />    
                    <View style={ styles.imgContainer }>
                        <Image style={ styles.img } source={ require('../../../assets/imgs/brand/brand_1.jpg')} resizeMode="cover" />
                    </View>

                    <LeftQuotation style={{ marginBottom: 9 }} />
                    <Text style={ styles.boldText }>극한의 기술력으로</Text>
                    <Text style={ styles.boldText }>실제 필드 환경을 그대로 구현한</Text>
                    <Text style={ styles.boldText }>스크린 골프</Text>
                    <RightQuotation style={{ marginTop: 6, marginBottom: 18 }} />

                    <Text style={ styles.regularText }>스크린 골프 트렌드를 더 확장시키기 위해</Text>
                    <Text style={ styles.regularText }>지속적인 업그레이드와 최상의 시뮬레이터를</Text>
                    <Text style={ styles.regularText }>개발하여 수많은 골프 유저에게 </Text>
                    <Text style={ styles.regularText }>더스윙제트를 제공합니다.</Text>
                </>

                {/* Zgraphic */}
                <>
                    <Pointer style={{ marginTop: 24 }} />
                    <View style={[ styles.container, { marginTop: 0 }]}>
                        <View style={[ styles.skewedRectangle, { height: 360 }]}></View>

                        <View style={[ styles.videoContainer, { width: videoWidth, height: videoHeight, justifyContent: 'center', alignItems: 'center' }]}>
                            { Platform.OS === 'android' ?
                                <WebView
                                    source={{ uri: 'https://www.youtube.com/embed/OEhxGLfZiU4' }}
                                    style={{ width: videoWidth, height: videoHeight }}
                                    allowsInlineMediaPlayback={true}
                                    mediaPlaybackRequiresUserAction={false}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                /> 
                                : 
                                <YouTube
                                    videoId="OEhxGLfZiU4"
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

                    <Zgraphic style={[ styles.svg, { marginTop: 310 }]} />
                    <Text style={ styles.boldText }>언리얼 엔진으로 구현한</Text>
                    <Text style={[ styles.boldText, { marginBottom: 12, color: '#fd780f' }]}>4K 그래픽</Text>
                    <Slash />

                    <View style={ styles.textBox }>
                        <Text style={ styles.regularText }>필드 위 바위 하나의 위치까지 100% 동일한</Text>
                        <Text style={ styles.regularText }>리얼 필드 수준의 그래픽을 제공합니다.</Text>
                    </View>
                    <Text style={ styles.regularText }>실제 라운딩에서조차 느끼지 못했던 생동감을</Text>
                    <Text style={ styles.regularText }>더스윙제트 스크린을 통해 경험할 수 있습니다.</Text>
                </>
                
                {/* Zground */}
                <>
                    <View style={[ styles.container, { marginTop: 30 }]}>
                        <View style={ styles.skewedRectangle }></View>

                        <Image style={ styles.absoluteImg } source={ require('../../../assets/imgs/brand/brand_2.jpg')} />
                    </View>

                    <Zground style={ styles.svg } />
                    <Text style={ styles.boldText }>실제 필드 감각을 그대로, </Text>
                    <View style={ styles.rowContainer }>
                        <Text style={ styles.boldText }>더스윙제트</Text>
                        <Text style={[ styles.boldText, { marginLeft: 3, color: '#fd780f' }]}>플레이트 시스템</Text>
                    </View>
                    <Slash />
                    <View style={ styles.textBox }>
                        <Text style={ styles.regularText }>마치 필드에 서 있는 것과 같이 체감할 수 있는</Text>
                        <Text style={ styles.regularText }>더스윙제트 플레이트 시스템</Text>
                    </View>
                    <Text style={ styles.regularText }>수십종의 소재 분석과 테스트를 거쳐</Text>
                    <Text style={ styles.regularText }>가장 안정적이면서 이상적인 플레이트 시스템을</Text>
                    <Text style={ styles.regularText }>완성했습니다.</Text>
                </>

                {/* Zsound */}
                <>
                    <Image style={[ styles.relativeImg, { marginTop: 96 }]} source={ require('../../../assets/imgs/brand/brand_3.jpg')} />

                    <Zsound style={[ styles.svg, { marginTop: 39 }]} />
                    <View style={ styles.rowContainer }>
                        <Text style={ styles.boldText }>극한의</Text>
                        <Text style={[ styles.boldText, { marginHorizontal: 3, color: '#fd780f' }]}>5.1ch 서라운드</Text>
                        <Text style={ styles.boldText }>시스템</Text>
                    </View>
                    <Slash />
                    <View style={ styles.textBox }>
                        <Text style={ styles.regularText }>필드의 현장 사운드를 전달하는,</Text>
                        <Text style={ styles.regularText }>극한의 5.1ch 서라운드 시스템으로</Text>
                        <Text style={ styles.regularText }>살아있는 필드를 느낄 수 있습니다.</Text>
                    </View>
                </>

                {/* Zpath */}
                <>
                    <View style={[ styles.container, { marginTop: 18 }]}>
                        <View style={ styles.skewedRectangle }></View>

                        <Image style={ styles.absoluteImg } source={ require('../../../assets/imgs/brand/brand_4.jpg')} />
                    </View>

                    <Zpath style={ styles.svg } />
                    <View style={ styles.rowContainer }>
                        <Text style={ styles.boldText }>극한의</Text>
                        <Text style={[ styles.boldText, { marginHorizontal: 3, color: '#fd780f' }]}>초정밀 센서</Text>
                        <Text style={ styles.boldText }>시스템</Text>
                    </View>
                    <Slash />
                    <View style={ styles.textBox }>
                        <Text style={ styles.regularText }>초당 2,000f/s으로 분석하여</Text>
                        <Text style={ styles.regularText }>볼의 움직임을 실제 필드와 동일하게 구현하는</Text>
                        <Text style={ styles.regularText }>초정밀 센서 시스템으로 필드 라운딩</Text>
                        <Text style={ styles.regularText }>동일한 수준의 움직임을 보여줍니다.</Text>
                    </View>
                </>

                {/* Zlounge */}
                <>
                    <Image style={[ styles.relativeImg, { marginTop: 96 }]} source={ require('../../../assets/imgs/brand/brand_5.jpg')} />

                    <Zlounge style={[ styles.svg, { marginTop: 39 }]} />
                    <View style={ styles.rowContainer }>
                        <Text style={ styles.boldText }>PREMIUM</Text>
                        <Text style={[ styles.boldText, { marginHorizontal: 3, color: '#fd780f' }]}>F&B</Text>
                        <Text style={ styles.boldText }>SERVICE</Text>
                    </View>
                    <Slash />
                    <View style={[ styles.textBox, { marginBottom: 0 }]}>
                        <Text style={ styles.regularText }>Z-LOUNGE는 도심 속의 CC에 온 듯한 느낌을</Text>
                        <Text style={ styles.regularText }>받을 수 있도록 프리미엄 인테리어와</Text>
                        <Text style={ styles.regularText }>쾌적한 공간으로 구성되었습니다.</Text>
                    </View>

                    <Image style={{ width: Dimensions.get('window').width, marginVertical: 30 }} source={ require('../../../assets/imgs/brand/brand_6.jpg') } />
                    <Image source={ require('../../../assets/imgs/brand/brand_7.png') } />
                    <View style={[ styles.textBox, { marginTop: 39, marginBottom: 0 }]}>
                        <Text style={ styles.regularText }>F&B까지 함께 즐길 수 있는 Z-LOUNGE는</Text>
                        <Text style={ styles.regularText }>간편하고 표준화 된 매뉴얼로</Text>
                        <Text style={ styles.regularText }>신속한 음식 제공이 가능함과 동시에</Text>
                        <Text style={ styles.regularText }>맛의 품질도 놓치지 않습니다.</Text>
                    </View>
                </>

                <>
                    <Image style={{ marginTop: 90 }} source={ require('../../../assets/imgs/brand/brand_8.png') } />

                    <View style={[ styles.textBox, { marginTop: 24, marginBottom: 60 }]}>
                        <Text style={[ styles.boldText, { fontSize: 18 }]}>더스윙제트는 리얼 필드와 같은 몰입감을 주는</Text>
                        <Text style={[ styles.boldText, { fontSize: 18 }]}>Z-SYSTEM을 통해 차별화된 스크린 골프의</Text>
                        <Text style={[ styles.boldText, { fontSize: 18 }]}>즐거움을 선사하겠습니다.</Text>
                    </View>

                    <Pressable style={ styles.button } onPress={ () => navigation.push('Foundation')}>
                        <Text style={ styles.btnText }>가맹점 문의</Text>
                    </Pressable>
                </>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: Dimensions.get('window').width,
        flex: 1,

        backgroundColor: '#1b212b'
    },
    container: {
        width: '100%',
        alignItems: 'center',

        marginTop: 24
    },
    logoText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 12,

        color: '#ffffff'
    },
    imgContainer: {
        width: Dimensions.get('window').width + 25,
        height: 452,
    },
    img: {
        width: '100%',
        height: '100%'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 3,

        color: '#ffffff'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 3,

        color: '#949494'
    },
    skewedRectangle: {
        width: Dimensions.get('window').width * 2,
        height: 330,

        transform: [
            { skewY: '-20deg' }, // Y축 방향으로 -45도만큼 기울임 (아래로)
            { translateX: -100 },
            { translateY: 80 }, // Y축 방향으로 100만큼 이동하여 사각형을 원래 위치로
        ],

        backgroundColor: '#fd780d',
    },
    svg: { 
        marginTop: 180,

        marginBottom: 9
    },
    textBox: {
        alignItems: 'center',

        marginVertical: 12
    },
    videoContainer: {
        position: 'absolute',
        top: 66,

        marginHorizontal: 15,

        borderRadius: 12
    },
    video: {
        borderRadius: 12,
    },
    absoluteImg: {
        width: Dimensions.get('window').width - 30,
        height: 390,

        position: 'absolute',
        top: 66,
        left: 0,

        marginHorizontal: 15,

        borderRadius: 12
    },
    rowContainer: {
        flexDirection: 'row',

        marginBottom: 12
    },
    relativeImg: {
        width: Dimensions.get('window').width - 30,
        height: 390,

        marginHorizontal: 15,

        borderRadius: 12
    },
    button: {  
        alignItems: 'center',
        width: Dimensions.get('window').width - 30,

        marginBottom: 60,

        borderWidth: 1,
        borderRadius: 3,
        borderColor: '#fd780f'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 13,

        color: '#fd780f'
    }
})

export default Brand
