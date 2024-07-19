import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { useBoard } from "../../../hooks/useBoard"
import { FAQList, Payload } from "../../../types/apiTypes"

import Loading from "../../../components/Loading"
import Search from "../../../assets/imgs/main/search.svg"
import Flag from "../../../assets/imgs/store/flag.svg"
import ArrowUp from "../../../assets/imgs/store/arrow_up.svg"
import ArrowDown from "../../../assets/imgs/store/arrow_down.svg"


const FAQ = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getFAQList } = useBoard()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    
    const [type, setType] = useState<number>(0)
    const [offset, setOffset] = useState<number>(0)
    const [faqList, setFaqList] = useState<FAQList[]>([])
    const [searchText, setSearchText] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [empty, setEmpty] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState<boolean[]>([])

    const typeList = ['전체', '스크린골프', '앱 이용', '회원정보']

    useEffect(() => {
        if (faqList.length === 0) {
            getFAQ()
        }
    }, [type])

    useEffect(() => {
        search()
    }, [type])

    // get faq list
    const getFAQ = async () => {
        if (isConnected) return
        const faqType = type == 0 ? null : type - 1
        setIsConnected(true)
        const payload: Payload = await getFAQList('', faqType)
        if (payload.code !== 1000) {
            Alert.alert('알림', payload.msg ?? '서버에 연결할 수 없습니다.')
            setTimeout(() => {
                setIsConnected(false)
            }, 1000)
            return
        }

        if (payload.faqList?.list) {
            setOffset(prev => prev + 10)
            setFaqList(payload?.faqList?.list)
            setIsOpen(Array(payload.faqList.list.length).fill(false))
        }

        setTimeout(() => {
            setIsConnected(false)
        }, 1000)
    } 

    // search
    const search = () => {
        if (faqList.length === 0) return
        setSearchText(text)
        for (let i = 0; i < faqList?.length; i++) {
            if (faqList[i].title.toLowerCase().includes(text.toLowerCase()) && ((type !== 0 && (type - 1) === faqList[i].type) || type === 0)) {
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
            { faqList && faqList.length > 0 ? (
                <ScrollView showsVerticalScrollIndicator={ false }>
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
                            { faqList?.map((item: FAQList, index: number) => {
                                if (type !== 0 && (type - 1) !== item.type) return
                                if (!item.title.toLowerCase().includes(searchText.toLowerCase())) return

                                const openFAQ = () => {
                                    let list = [...isOpen]
                                    list[index] = !isOpen[index]
                                    setIsOpen(list)
                                }

                                return (
                                    <View key={ index }>
                                        <Pressable style={ styles.faq } onPress={ openFAQ }>
                                            <View style={ styles.rowContainer }>
                                                <View style={{ flex: 1, marginRight: 24 }}>
                                                    <Text style={ isOpen[index] ? [styles.boldText, { fontSize: 16, color: '#121619' }] : styles.regularText }>Q. [{ typeList[item.type + 1] }] { item.title }</Text>
                                                </View>
                                                { isOpen[index] ? <ArrowUp /> : <ArrowDown /> }
                                            </View>
                                        </Pressable>
                                        { isOpen[index] &&
                                            <View style={ styles.reply }>
                                                <View style={{ marginRight: 6 }}>
                                                    <Text style={[ styles.boldText, { fontSize: 16, color: '#fd780f' }]}>A.</Text>
                                                </View>
                                                <Text style={[ styles.regularText, { flex: 1 }]}>{ item.detail }</Text>
                                            </View>
                                        }
                                    </View>
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
                    <Text style={ styles.regularText }>등록된 FAQ가 없습니다.</Text>
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
    faq: {
        paddingVertical: 18,
        paddingHorizontal: 15,

        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    },
    reply: {
        flexDirection: 'row',

        paddingVertical: 18,
        paddingHorizontal: 15,

        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',

        backgroundColor: '#f3f3f3'
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

export default FAQ