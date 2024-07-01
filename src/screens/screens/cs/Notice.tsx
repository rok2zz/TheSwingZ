import { Alert, NativeScrollEvent, NativeSyntheticEvent, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native"
import { useEffect, useState } from "react"
import { useBoard } from "../../../hooks/useBoard"
import { NoticeList, Payload } from "../../../types/apiTypes"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"

// svg
import Arrow from "../../../assets/imgs/board/arrow_right.svg"
import Loading from "../../../components/Loading"


const Notice = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getNoticeList } = useBoard()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    
    const [offset, setOffset] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [noticeList, setNoticeList] = useState<NoticeList[]>()

    useEffect(() => {
        if (offset === 0) {
            getNotice()
        }
    }, [])

    // get notice list
    const getNotice = async () => {
        if (isConnected || (total > 0 && offset >= total)) return

        setIsConnected(true)
        const payload: Payload = await getNoticeList('', offset, 10, 0)

        if (payload.code !== 1000) {
            Alert.alert('알림', payload.msg ?? '서버에 연결할 수 없습니다.')
            setTimeout(() => {
                setIsConnected(false)
            }, 1000)
            return
        }

        // add notice list
        if (noticeList && noticeList?.length > 0 && payload.noticeList?.list) {
            let list: NoticeList[] = noticeList
            list = list.concat(payload.noticeList?.list)
            setOffset(list.length)
            setNoticeList(list)
            setIsConnected(false)
            return
        }

        setOffset(prev => prev + 10)
        setTotal(payload.noticeList?.total ?? 0)
        setNoticeList(payload?.noticeList?.list)
        setTimeout(() => {
            setIsConnected(false)
        }, 500)
    } 

    // add notice list when scrolling end or refresh
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isConnected || isScrolled) return

        setIsScrolled(true)
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height + 100 && !isScrolled) {
            console.log('asdfsdafdda')
            getNotice()
        } else if (contentOffset.y < -100 && !isScrolled) { // refresh
            setTotal(0)
            setOffset(0)
            setNoticeList([])
            if (offset === 0) {
                getNotice()
            }
        }
        setIsScrolled(false)
    }

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

    return (
        <>
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View>  }
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false } onScroll={ handleScroll } scrollEventThrottle={ 180 }>
                { noticeList &&  noticeList.length > 0 &&
                    <View style={ styles.container }>
                        { noticeList?.map((item: NoticeList, index: number) => {

                            return (
                                <Pressable style={ styles.notice } key={ index } onPress={ () => navigation.navigate('NoticeDetail', { id: item.id })}>
                                    <View style={ styles.rowContainer }>
                                        <View style={{ flex: 1, marginRight: 24 }}>
                                            <Text style={ styles.regularText }>{ item.title }</Text>
                                            <Text style={[ styles.regularText, { fontSize: 13, marginTop: 9, color: '#949494' }]}>{ formatDate(item.createdAt) }</Text>
                                        </View>
                                        <Arrow />
                                    </View>
                                </Pressable>
                            )
                        })}
                    </View>
                }
            </ScrollView>
        </>
       
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        marginHorizontal: 15,
        marginTop: 12
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    notice: {
        paddingVertical: 18,

        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    }
})

export default Notice