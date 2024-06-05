import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Swiper from "react-native-swiper"

import Dot from "../../../assets/imgs/main/paging_dot_black.svg"
import ActiveDot from "../../../assets/imgs/main/paging_active_dot_black.svg"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useAuthActions } from "../../../hooks/useAuthActions"

const Intro = (): JSX.Element => {
    const { saveIsFirst } = useAuthActions()

    const onPress = async () => {
		await AsyncStorage.setItem('isFirst', 'false')
        saveIsFirst(false)
    }

    return (
        <SafeAreaView style={ styles.wrapper }>
            <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false } >
                <Swiper
                    style={{ height: 650 }}
                    paginationStyle={{ marginBottom: 5 }}
                    dot={ <Dot style={{ marginHorizontal: 3 }} /> }
                    activeDot={ <ActiveDot style={{ marginHorizontal: 3 }} /> }
                    loop={ true }
                    >
                    <View style={{ alignItems: 'center' }}>
                        <View style={ styles.titleContainer }>
                            <Text style={ styles.boldText }>우리가 기다린 단 하나의 필드</Text>
                            <Text style={ styles.boldText }>더스윙제트</Text>
                        </View>

                        <View style={ styles.imgContainer }>
                            <Image style={ styles.img } source={ require('../../../assets/imgs/intro/intro_1.png') } />
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={ styles.titleContainer }>
                            <Text style={ styles.boldText }>내 기록 조회 및 분석</Text>
                        </View>

                        <View style={ styles.imgContainer }>
                            <Image style={ styles.img } source={ require('../../../assets/imgs/intro/intro_2.png') } />
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={ styles.titleContainer }>
                            <Text style={ styles.boldText }>스코어카드 조회 및 공유</Text>
                        </View>

                        <View style={ styles.imgContainer }>
                            <Image style={ styles.img } source={ require('../../../assets/imgs/intro/intro_3.png') } />
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={ styles.titleContainer }>
                            <Text style={ styles.boldText }>스윙영상 기록 및 조회</Text>
                        </View>

                        <View style={ styles.imgContainer }>
                            <Image style={ styles.img } source={ require('../../../assets/imgs/intro/intro_4.png') } />
                        </View>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <View style={ styles.titleContainer }>
                            <Text style={ styles.boldText }>가슴 벅찬 필드의 생동감을</Text>
                            <Text style={ styles.boldText }>스크린에서 만나다</Text>
                        </View>

                        <View style={ styles.imgContainer }>
                            <Image style={ styles.img } source={ require('../../../assets/imgs/intro/intro_5.png') } />
                        </View>
                    </View>
                    
                </Swiper>

                <Pressable style={[ styles.button ]} onPress={ onPress }>
                    <Text style={[ styles.boldText, { fontSize: 18, color: '#ffffff' }]}>시작하기</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        
        backgroundColor: '#f3f3f3'
    },
    container: {
        flex: 1,
        
        marginTop: 54,
        marginBottom: 36,
        marginHorizontal: 15
    },
    titleContainer: {
        height: 70,

        alignItems: 'center',
        justifyContent: 'center',
        
        position: 'absolute',
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    imgContainer: {
        marginTop: 93,

        borderRadius: 24,
        borderWidth: 10,
        borderColor: '#ffffff',

        backgroundColor: '#ffffff',

        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: -3
                },
                shadowOpacity: 0.16
            },
            android: {
                elevation: 20
            }
        })
    },
    img: {
        borderRadius: 20,
    },
    button: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',

        paddingVertical: 15,
        marginTop: 10,

        borderRadius: 6,
        backgroundColor: '#fd780f'
    }
})

export default Intro