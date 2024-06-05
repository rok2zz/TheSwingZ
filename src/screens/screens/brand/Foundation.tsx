import { Dimensions, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

// svg
import Logo from "../../../assets/imgs/brand/logo_foundation.svg"

const Foundation = (): JSX.Element => {
    const numbers: number[] = [0, 1, 2, 3, 4, 5, 6]
    const step: string[] = ['상담신청', '방문상담', '상권설정', '현장실사', '가맹계약', '인테리어', '사전 마케팅', '장비설치', '점주교육', '오픈준비', '사업개시', '본사지원']
    const openWebpage = () => {
        const url = 'https://www.theswingz-biz.com/'
        Linking.openURL(url)
    }

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={ styles.container }>
                <Text style={ styles.logoText }>우리가 기다린 단 하나의 필드</Text>
                <Logo />

                <View style={ styles.card }>
                    <View style={ styles.cardTop }>
                        <Text style={ styles.cardTitle }>반값창업 파격혜택</Text>
                    </View>
                    <View style={ styles.cardBottom }>
                        <Text style={[ styles.boldText, { fontSize: 20 }]}>시스템 설치 비용</Text>

                        <View style={ styles.cardBox }>
                            <Text style={[ styles.regularText, { textDecorationLine: 'line-through', color: '#949494' }]}>43,000,000원</Text>
                            <Text style={[ styles.boldText, { fontSize: 28, marginVertical: 6, color: '#fd780f' }]}>23,000,000원</Text>
                            <Text style={ styles.regularText }>(1룸/1타석 시스템 기준)</Text>
                        </View>
                    </View>
                </View>
                <View style={[ styles.card, { marginTop: 12 }]}>
                    <View style={ styles.cardTop }>
                        <Text style={ styles.cardTitle }>반값창업 스페셜 특전</Text>
                    </View>
                    <View style={ styles.cardBottom }>
                        <Text style={[ styles.boldText, { marginBottom: 6 }]}>선착순 가맹시,</Text>
                        <Text style={[ styles.boldText, { fontSize: 20 }]}>1년간 매월 로열티 반값 적용</Text>

                        <View style={ styles.cardBox }>
                            <Text style={[ styles.regularText, { textDecorationLine: 'line-through', color: '#949494' }]}>룸 당 250,000원</Text>
                            <Text style={[ styles.boldText, { fontSize: 28, marginVertical: 6, color: '#fd780f' }]}>125,000원</Text>
                            <Text style={[ styles.boldText, { fontSize: 20, marginBottom: 6 }]}>총 7,500,000원 할인</Text>
                            <Text style={ styles.regularText }>(룸5개, 첫 1년 기준)</Text>
                        </View>
                    </View>
                </View>

                <Text style={[ styles.regularText, { marginTop: 12, color: '#949494' }]}>※ 사전예약 30호점 기준입니다.</Text>

                <View style={ styles.blankContainer }></View>

                <View style={ styles.titleContainer }>
                    <Text style={[ styles.boldText, { color: '#ffffff' }]}>더스윙제트 </Text>
                    <Text style={[ styles.boldText, { color: '#fd780f' }]}>기대수익</Text>
                </View>

                <View style={ styles.circleContainer }>
                    <View style={ styles.bigCircle }>
                        <Text style={[ styles.regularText, { fontSize: 16, marginBottom: 3, color: '#ffffff' }]}>게임매출</Text>
                        <Text style={[ styles.boldText, { fontSize: 18, color: '#ffffff' }]}>42,000,000원</Text>
                    </View>
                    <View style={ styles.smallCircle }>
                        <Text style={[ styles.regularText, { fontSize: 16, marginBottom: 3 }]}>F&B</Text>
                        <Text style={ styles.boldText }>11,760,000원</Text>
                    </View>
                </View>

                <View style={ styles.salesContainer }>
                    <Text style={[ styles.regularText, { fontSize: 16, color: '#949494' }]}>게임 매출</Text>
                    <Text style={[ styles.regularText, { fontSize: 16, color: '#ffffff' }]}>42,000,000원</Text>
                </View>
                <View style={ styles.salesContainer }>
                    <Text style={[ styles.regularText, { fontSize: 16, color: '#949494' }]}>F&B 매출</Text>
                    <Text style={[ styles.regularText, { fontSize: 16, color: '#ffffff' }]}>11,760,000원</Text>
                </View>

                <View style={ styles.line }></View>

                <View style={ styles.salesContainer }>
                    <Text style={[ styles.regularText, { fontSize: 16, color: '#949494' }]}>월 예상 매출</Text>
                    <Text style={[ styles.boldText, { fontSize: 20, color: '#ffffff' }]}> 53,760,000원</Text>
                </View>

                <View style={[ styles.miniCircle, { marginTop: 18 }]}></View>
                <View style={ styles.miniCircle }></View>
                <View style={[ styles.miniCircle, { marginBottom: 18 }]}></View>

                <Text style={[ styles.boldText, { fontSize: 28, color: '#ffffff' }]}>월 순수익</Text>
                <Text style={[ styles.boldText, { fontSize: 28, color: '#fd780f' }]}>23,566,000원</Text>

                <Text style={[ styles.regularText, { marginTop: 12, color: '#949494' }]}>※ 5개 룸 가동율 70% 기준입니다.</Text>

            </View>

            <View style={ styles.orangeContainer }>
                <View style={[ styles.titleContainer, { marginBottom: 24 }]}>
                    <Text style={[ styles.boldText, { color: '#ffffff' }]}>더스윙제트 </Text>
                    <Text style={[ styles.boldText, { color: '#fd780f' }]}>창업절차</Text>
                </View>
                <View>
                    { step.map((item: string, index: number) => {
                        return (
                            <View style={ styles.rowContainer } key={ index }>
                                <View style={ styles.whiteCircle }></View>
                                { index < 11 && 
                                    <View style={ styles.circleRepeat }>
                                        { numbers.map((item: number, index: number) => {
                                            return (
                                                <View style={ styles.miniWhiteCircle } key={ index }></View>
                                            )
                                        })}
                                    </View>
                                }
                                { index < 9 ? 
                                    <Text style={[ styles.regularText, { width: 60, fontSize: 13, marginRight: 15 }]}>STEP 0{ index + 1 }</Text> 
                                    :
                                    <Text style={[ styles.regularText, { width: 60, fontSize: 13, marginRight: 15 }]}>STEP { index + 1 }</Text>
                                }
                                
                                <Text style={[ styles.boldText, { fontSize: 18, color: '#ffffff' }]}>{ item }</Text>
                            </View>
                        )
                    }) }
                </View>

                <Pressable style={ styles.button } onPress={ openWebpage }>
                    <Text style={ styles.btnText }>가맹점 문의</Text>
                </Pressable>
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
        alignItems: 'center',

        marginHorizontal: 15,
        marginTop: 36,
        marginBottom: 48
    },
    logoText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 15,

        color: '#ffffff'
    },
    card: {
        width: '100%',
        
        marginTop: 42,
    },
    cardTop: {
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,

        backgroundColor: '#fd780f'
    },
    cardTitle: {
        textAlign: 'center',
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 18,

        color: '#ffffff'
    },
    cardBottom: {
        padding: 24,
        paddingBottom: 30,

        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,

        backgroundColor: '#ffffff'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    cardBox: {
        alignItems: 'flex-end',

        marginTop: 30
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    blankContainer: {
        width: Dimensions.get('window').width,
        height: 1,

        marginVertical: 36,
        
        backgroundColor: '#121619'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingVertical: 5, 
        paddingHorizontal: 22, 
        marginBottom: 30,

        borderRadius: 30,
        
        backgroundColor: '#121619'
    },
    circleContainer: {
        width: Dimensions.get('window').width - 60,

        marginBottom: 24
    },
    bigCircle: {
        width: (Dimensions.get('window').width - 60) * 74 / 100,
        height: (Dimensions.get('window').width - 60) * 74 / 100,

        alignItems: 'center',
        justifyContent: 'center',
        
        borderRadius: 300,

        backgroundColor: '#fd780f'
    },
    smallCircle: {
        width: (Dimensions.get('window').width - 60) * 4 / 10,
        height: (Dimensions.get('window').width - 60) * 4 / 10,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        right: 0,
        bottom: 0,
        
        borderRadius: 300,

        backgroundColor: '#ffffff'
    },
    salesContainer: {
        width: Dimensions.get('window').width - 60,

        flexDirection: 'row',
        justifyContent: 'space-between',
        
        marginBottom: 6
    },
    line: {
        width: '100%',
        height: 1,

        marginVertical: 12,

        backgroundColor: '#fd780f'
    },
    miniCircle: {
        width: 3,
        height: 3,

        marginTop: 6,

        borderRadius: 50,

        backgroundColor: '#fd780f'
    },
    orangeContainer: {
        alignItems: 'center',

        paddingTop: 48,
        paddingBottom: 200,
        marginBottom: -140,

        backgroundColor: '#fd780f'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 23,
        marginLeft: 15,
    },
    whiteCircle: {
        width: 6,
        height: 6,

        marginRight: 6,

        borderRadius: 20,

        backgroundColor: '#ffffff'
    },
    circleRepeat: {
        position: 'absolute',
        top: 17,
        left: 2
    },
    miniWhiteCircle: {
        width: 2,
        height: 2,

        marginBottom: 3,

        borderRadius: 10,

        backgroundColor: '#ffffff'
    },
    button: {
        width: Dimensions.get('window').width - 30,
        alignItems: 'center',

        marginTop: 25,
        marginHorizontal: 15,

        borderRadius: 3,

        backgroundColor: '#ffffff'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 13,

        color: '#121619'
    }
})

export default Foundation