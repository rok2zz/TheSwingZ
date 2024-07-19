import { Alert, NativeScrollEvent, NativeSyntheticEvent, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useEffect, useState } from "react"
import { useBoard } from "../../../hooks/useBoard"
import { NoticeList, Payload } from "../../../types/apiTypes"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"

// svg
import Arrow from "../../../assets/imgs/board/arrow_right.svg"
import Loading from "../../../components/Loading"
import Search from "../../../assets/imgs/main/search.svg"
import Flag from "../../../assets/imgs/store/flag.svg"

const Notice = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getNoticeList } = useBoard()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isScrolled, setIsScrolled] = useState<boolean>(false)
    
    const [type, setType] = useState<number>(0)
    const [offset, setOffset] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const [noticeList, setNoticeList] = useState<NoticeList[]>()
    const [searchText, setSearchText] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [empty, setEmpty] = useState<boolean>(false)

    const typeList = ['전체', '서비스', '업데이트', '이벤트']

    useEffect(() => {
        getNotice(false)
    }, [type])

    useEffect(() => {
        search()
    }, [noticeList])

    // get notice list
    const getNotice = async (scroll: boolean) => {
        if (isConnected || (scroll && total > 0 && offset >= total)) return
        const noticeType = type == 0 ? null : type - 1
        setIsConnected(true)
        const payload: Payload = await getNoticeList('', offset, 10, noticeType)
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
        }, 1000)
    } 

    // add notice list when scrolling end or refresh
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (isConnected || isScrolled) return

        setIsScrolled(true)
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height + 100 && !isScrolled) {
            getNotice(true)
        } else if (contentOffset.y < -100 && !isScrolled) { // refresh
            setTotal(0)
            setOffset(0)
            setNoticeList([])
            if (offset === 0) {
                getNotice(false)
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

    // search
    const search = () => {
        if (!noticeList) return
        setSearchText(text)
        for (let i = 0; i < noticeList?.length; i++) {
            if (noticeList[i].title.toLowerCase().includes(text.toLowerCase())) {
                setEmpty(false)
                return
            }
        }
        setEmpty(true)
    }

    return (
        <View style={ styles.wrapper } >
            { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View>  }
            <View style={ styles.searchContainer }>
                <TextInput style={[ styles.input ]} 
                    placeholder={ '궁금한점을 검색해 보세요.'} placeholderTextColor="#aaaaaa" returnKeyType="done" autoCapitalize='none'
                    onChangeText={(text: string): void => { setText(text), setSearchText('') }}/>    
                <Pressable style={ styles.searchBtn } onPress={ search }>
                    <Search />  
                </Pressable>      
            </View>

            <View style={ styles.typeContainer }>
                { typeList.map((item: string, index: number) => {
                    const selectType = () => {
                        setOffset(0)
                        setType(index)
                        setNoticeList([])
                        search()
                    }

                    return (
                        <Pressable style={[ styles.typeBtn, index === type && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={ selectType } key={ index }>
                            { index === type ? 
                                <Text style={ styles.boldText }>{ item }</Text>
                                    :
                                <Text style={[ styles.regularText, { fontSize: 14 }]}>{ item }</Text>
                            }
                        </Pressable>
                    )
                })}
            </View>            
            { noticeList &&  noticeList.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={ false } onScroll={ handleScroll } scrollEventThrottle={ 180 }>
                    { empty ? (
                        <View style={ styles.emptyContainer }>
                            <View style={ styles.circle }>
                                <Flag style={{ marginLeft: 12 }} />
                            </View>
                            { searchText !== '' && <Text style={[ styles.regularText, { marginBottom: 6 }]}>'{ searchText }'</Text> }
                            <Text style={ styles.regularText }>검색결과가 없습니다.</Text>
                        </View>
                        ) : (
                        <View style={ styles.container }>
                            { noticeList?.map((item: NoticeList, index: number) => {
                                if (type !== 0 && (type - 1) !== item.type) return
                                if (!item.title.toLowerCase().includes(searchText.toLowerCase())) return

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
                    )}
                </ScrollView>
                ) : (
                <View style={ styles.emptyContainer }>
                    <View style={ styles.circle }>
                        <Flag style={{ marginLeft: 12 }} />
                    </View>
                    <Text style={ styles.regularText }>등록된 공지사항이 없습니다.</Text>
                </View>
            )}
        </View>
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
    input: {
        flex: 1,
        height: 45,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingLeft: 3,

        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',

        color: '#121619'
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
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Bold',

        color: '#ffffff'
    },
    searchContainer: {
        flexDirection: 'row',

        paddingVertical: 18,
        paddingHorizontal: 15,
        marginBottom: 24,

        backgroundColor: '#f3f3f3'
    },
    searchBtn: {
        position: 'absolute',
        right: 30,
        top: 35
    },
    typeContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginBottom: 12,
        marginHorizontal: 15
    },
    typeBtn: {
        justifyContent: 'center',
        
        height: 36,
        paddingHorizontal: 12,
        marginRight: 6,

        borderWidth: 1,
        borderColor: '#949494',
        borderRadius: 18
    },
    emptyContainer: {
        alignItems: 'center',

        marginTop: 100,
    },
    circle: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 90,
        height: 90,

        marginBottom: 20,

        borderRadius: 50,
        backgroundColor: '#4abc7f'
    }
})

export default Notice