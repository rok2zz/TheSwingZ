import { RouteProp, useNavigation } from "@react-navigation/native"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { useBoard } from "../../../hooks/useBoard"
import { useEffect, useState } from "react"
import { Inquiry, Payload } from "../../../types/apiTypes"

interface Props {
    route: RouteProp<RootStackParamList, 'InquiryDetail'>
}

const inquiryTypeList = ['스크린골프', '앱 이용문의', '회원정보', '오류/불편접수', '기타']

const InquiryDetail = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const inquiryId = route.params.id
    const { getInquiry } = useBoard()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [inquiry, setInquiry] = useState<Inquiry>()

    useEffect(() => {
        getInquiryItem()
    }, [])

    useEffect(() => {
    }, [inquiry])
    
    // format date
    const formatDate = (createdAt: string) => {
        const date = new Date(createdAt)
        const now = new Date()
        const year = date.getFullYear() 
        const month = date.getMonth()
        const day = date.getDate()
        const hour = date.getHours()
        const min = date.getMinutes()

        if (year === now.getFullYear() && month === now.getMonth() && date.getDate() === now.getDate()) {
            if (hour === now.getHours()) {
                if (min === now.getMinutes()) {
                    return '방금 전'
                }
                return now.getMinutes() - min + '분 전'
            }
            return now.getHours() - hour + '시간 전'
        }

        return year + '.' + (month < 10 ? '0' + (month + 1) : (month + 1)) + '.' + (day < 10 ? '0' + day : day)
    }

    const getInquiryItem = async () => {
        if (isConnected) return
        setIsConnected(true)
        const payload: Payload = await getInquiry(inquiryId)
        setIsConnected(false)
        if (payload.code !== 1000) {
            return
        }

        if (payload.inquiry) {
            setInquiry(payload.inquiry)
        }
    }

    return (
        <View style={ styles.wrapper }>
            { inquiry &&
                <View style={ styles.container }>
                    <View style={ styles.titleContainer }>
                        <Text style={ styles.boldText }>[{ inquiryTypeList[inquiry.detail[0].type]}] { inquiry.detail[0].title }</Text>
                        <Text style={[ styles.regularText, { fontSize: 13, marginTop: 9, marginBottom: 18, color: '#949494' }]}>{ formatDate(inquiry.detail[0].createdAt) }</Text>
                    </View>
                    <View style={ styles.contentContainer }>
                        <Text style={ styles.regularText }>{ inquiry.detail[0].detail }</Text>
                    </View>
                </View>
            }
            
            <View style={{ marginTop: 24, marginBottom :48 }}>
                <Pressable style={ styles.button } onPress={ () => navigation.goBack() }>
                    <Text style={ styles.semiBoldText }>목록으로</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        marginTop: 24,
        marginHorizontal: 15
    },
    titleContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        color: '#fd780f'
    },
    button: {
        alignItems: 'center',

        paddingVertical: 13,
        marginHorizontal: 15,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fd780f'
    },
    contentContainer: {
        marginTop: 10
    }
})

export default InquiryDetail