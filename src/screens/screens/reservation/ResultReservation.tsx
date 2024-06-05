import { Alert, Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp, RootStackParamList, ShopStackNavigationProp } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { useEffect } from "react"
import { Payload } from "../../../types/apiTypes"
import { useReservation } from "../../../hooks/useReservation"

// svg
import Checker from "../../../assets/imgs/store/check_result.svg"
import Exclamation from "../../../assets/imgs/store/exclmation.svg"
import Calendar from "../../../assets/imgs/store/icon_calendar.svg"
import Clock from "../../../assets/imgs/store/icon_clock.svg"
import People from "../../../assets/imgs/store/icon_people.svg"


interface Props {
    route: RouteProp<RootStackParamList, 'ResultReservation'>
}

const ResultReservation = ({ route }: Props) => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const shopNavigation = useNavigation<ShopStackNavigationProp>()

    const shopInfo = route.params?.shopInfo
    const revInfo = route.params?.revInfo
    const revId = route.params?.revId

    const { deleteReservation } = useReservation()

    useEffect(() => {
        if (!shopInfo || !revInfo || !revId) {
            Alert.alert(
                '알림',
                '오류가 발생했습니다.',
                [
                    {
                        text: '확인', 
                        onPress: () => {
                            navigation.goBack()
                        },
                    }
                ],
            )
        }
    }, [])

    const formatDate = () => {
        const month = new Date(revInfo.date).getMonth() + 1
        const date = new Date(revInfo.date).getDate()
        const day = ['일', '월', '화', '수', '목', '금', '토'][new Date(revInfo.date).getDay()]
    
        return `${month}월${date}일(${day})`
    }

    const formatTime = () => {
        let hours = new Date(revInfo.date).getHours()
        let min = new Date(revInfo.date).getMinutes()
        let ampm = '오전'
    
        if (hours >= 12) {
            hours -= 12
            ampm = '오후'
        }
        if (hours === 0) {
            hours = 12
        }
    
        return `${ampm} ${hours}:${min < 10 ? '0' + min : min}`
    }

    const cancelReservation = async () => {
        Alert.alert(
            '알림',
            '정말 취소하시겠습니까?',
            [
                {
                    text: '취소',
                    onPress: () => { return },
                    style: 'cancel',
                },{
                    text: '확인', 
                    onPress: async (): Promise<void> => { 
                        const payload: Payload = await deleteReservation(revId)

                        shopNavigation.navigate('ShopStack' as any, { screen: 'Reservation' })
                    },
                }
            ],
        )
    }

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={ styles.container }>
                <View style={ styles.circle }>
                    <Checker />
                </View>

                <View style={[ styles.rowContainer, { marginBottom: 9 }]}>
                    <Text style={ styles.semiBoldText }>예약이 신청</Text>                    
                    <Text style={[ styles.regularText, { fontSize: 24 }]}>되었습니다.​</Text>
                </View>

                <View style={ styles.rowContainer }>
                    <Exclamation style={{ marginRight: 3 }} />
                    <Text style={ styles.regularText }>가맹점에서 예약정보를 확인 후 예약이 확정됩니다​.</Text>
                </View>

                <View style={ styles.infoContainer }>
                    <Text style={ styles.boldText }>{ shopInfo.title }</Text>
                    <Text style={[ styles.regularText, { fontSize: 14, marginTop: 6 }]}>{ shopInfo.address }</Text>

                    <View style={[ styles.rowContainer, { marginTop: 24 }]}>
                        <View style={ styles.infoBox }>
                            <Calendar style={{ marginBottom: 15 }} />
                            <Text style={ styles.regularText }>{ formatDate() }</Text>
                        </View>
                        <View style={[ styles.infoBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#cccccc' }]}>
                            <Clock style={{ marginBottom: 15 }} />
                            <Text style={ styles.regularText }>{ formatTime() }</Text>
                        </View>
                        <View style={ styles.infoBox }>
                            <People style={{ marginBottom: 15 }} />
                            <Text style={ styles.regularText }>{ revInfo.people + 1 }명</Text>
                        </View>
                    </View>
                </View>

                <View style={{ width: '100%', marginTop: 24 }}>
                    <Text style={[ styles.regularText, { marginBottom: 9 }]}>예약매너문화에 동참해주세요!​</Text>
                    <Text style={[ styles.regularText, { fontSize: 14, marginBottom: 3, color: '#666666' }]}>당일취소 및 노쇼는 매장뿐 아니라 다른 고객님에게도</Text>
                    <Text style={[ styles.regularText, { fontSize: 14, color: '#666666' }]}>피해가 되며 패널티가 있을 수 있습니다.​</Text>
                </View>

                <View style={[ styles.btnContainer, Platform.OS === 'ios' && { marginTop: 70 }]}>
                    <Pressable style={ styles.button } onPress={ cancelReservation }>
                        <Text style={ styles.btnText }>예약신청 취소​</Text>                       
                    </Pressable>
                    <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ () => navigation.push('MainTab')}>
                        <Text style={[ styles.btnText, { color: '#ffffff' }]}>홈으로 가기</Text>                       
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        alignItems: 'center',

        marginHorizontal: 15,
    },
    circle: {
        marginVertical: 24,

    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        color: '#121619'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    infoContainer: {
        alignItems: 'center',

        width: '100%',

        marginTop: 28,
        paddingVertical: 24,

        backgroundColor: '#f9f9f9'
    },
    infoBox: {
        alignItems: 'center',
        justifyContent: 'space-between',

        width: (Dimensions.get('window').width - 70) / 3
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        width: '100%',

        marginTop: 148,
        marginBottom: 36,
    },
    button: {
        alignItems: 'center',
        width: (Dimensions.get('window').width - 39) / 2,

        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 16,

        color: '#121619'
    }
})

export default ResultReservation