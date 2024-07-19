import { Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import TopTabBar from "../../../components/tabBar/TopTabBar"
import { useEffect, useRef, useState } from "react"
import Header from "../../../components/Header"
import { Focus, Message } from "../../../types/screenTypes"
import { useUserInfo } from "../../../hooks/useUsers"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { useBoard } from "../../../hooks/useBoard"
import { InquiryList, Payload } from "../../../types/apiTypes"

// svg
import Arrow from "../../../assets/imgs/board/arrow_down.svg"
import RightArrow from "../../../assets/imgs/board/arrow_right.svg"
import Close from "../../../assets/imgs/board/close.svg"
import Checker from "../../../assets/imgs/board/check.svg"
import EmptyAlarm from "../../../assets/imgs/board/alarm_empty.svg"
import FillAlarm from "../../../assets/imgs/board/alarm_fill.svg"
import Flag from "../../../assets/imgs/store/flag.svg"


const Inquiry = () => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const userInfo = useUserInfo()
    const { makeInquiry, getInquiryList } = useBoard()

    const inquiryTypeRef = useRef<TextInput>(null)
    const subjectRef = useRef<TextInput>(null)
    const contentRef = useRef<TextInput>(null)

    const [position] = useState(new Animated.Value(0))
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [type, setType] = useState<number>(0)
    const [inquiryType, setInquiryType] = useState<number>(-1)
    const [subject, setSubject] = useState<string>('')
    const [content, setContent] = useState<string>('')
    const [files, setFiles] = useState<string[]>([])
    const [alarm, setAlarm] = useState<boolean>(false)
    const [message, setMessage] = useState<Message>({ type: '', msg: '' })
    const [isFocused, setIsFocused] = useState<Focus>({ ref: inquiryTypeRef, isFocused: false })

    const [inquiryList, setInquiryList] = useState<InquiryList[]>([])

    const headerList = ['1:1문의', '나의 문의내역']
    const inquiryTypeList = ['홈페이지 이용문의', '스크린골프', '예약문의', '제휴문의', '광고문의']

    useEffect(() => {
        getInquiry()  
    }, [])

    // modal animation
    useEffect(() => {
        Animated.timing(position, {
            toValue: openModal ? 1 : 0,
            duration: 500,
            useNativeDriver: true
        }).start()
    }, [openModal])

    // change top menu
    const handleTypeChange = (newType: number) => {
        setType(newType)
    }

    // focus
    const handleFocus = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: true
        })
    }

    // focus out
    const handleBlur = (ref: React.RefObject<TextInput>) => {
        setIsFocused({
            ref: ref,
            isFocused: false
        })
    }

    // make inquiry
    const onPressMakeInquiry = async () => {
        const payload: Payload = await makeInquiry(subject, content, type, files)
    }

    // get inquiry list
    const getInquiry = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getInquiryList()
        setIsConnected(false)
        if (payload.code !== 1000) {
            return
        }

        if (payload.inquiryList && payload.inquiryList.list) {
            setInquiryList(payload.inquiryList.list)
        }
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
        <View style={ styles.wrapper }>
            {/* header */}
            <Header title={ headerList[type] } type={ 0 } isFocused />
            {/* tabbar */}
            <TopTabBar type={ type } typeChange={ handleTypeChange } tab1={ headerList[0] } tab2={ headerList[1] } />
            { type === 0 ? (
                <>
                    <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false }>
                        <View style={{ marginHorizontal: 15 }}>
                            {/* inquiry type */}
                            <Pressable style={[ styles.subjectContainer, isFocused.ref === inquiryTypeRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#aaaaaa'}, message.type === 'inquiryType' && { borderBottomColor: '#d61111' }]}
                                onPress={ () => { setIsFocused({ ref: inquiryTypeRef, isFocused: true }), setOpenModal(true) }}>
                                { inquiryType === -1 ? 
                                    <Text style={[ styles.regularText, { flex: 1, paddingVertical: 12, color: '#aaaaaa' }]}>문의유형을 선택해주세요.</Text>
                                    :
                                    <Text style={[ styles.regularText, { flex: 1, paddingVertical: 12 }]}>{ inquiryTypeList[inquiryType] }</Text>
                                }
                                <Arrow />
                            </Pressable>
                            {/* error message */}
                            { message.type === 'inquiryType' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={{ marginBottom: 30 }}></View> }

                            {/* subject */}
                            <View style={ styles.inputContainer }>
                                <TextInput style={[ styles.input, styles.regularText, isFocused.ref === subjectRef && isFocused.isFocused ? { borderBottomColor: '#fd780f'} : { borderBottomColor: '#aaaaaa'}, message.type === 'subject' && { borderBottomColor: '#d61111' }]} 
                                    placeholder="제목을 입력해주세요." placeholderTextColor="#aaaaaa" ref={ subjectRef } returnKeyType="next" autoCapitalize='none' onFocus={ () => { handleFocus(subjectRef), setMessage({ type: '', msg: '' })}} onBlur={ () => handleBlur(subjectRef)}
                                    onChangeText={(subject: string): void => setSubject(subject)} onSubmitEditing={() => contentRef.current && contentRef.current.focus() }/>
                            </View>
                            {/* error message */}
                            { message.type === 'subject' ? <Text style={ styles.message }>{ message.msg }</Text> : <View style={{ marginBottom: 30 }}></View> }

                            {/* content */}  
                            <View style={ styles.inputContainer }>
                                <TextInput style={[ styles.reason, styles.regularText, isFocused.ref === contentRef && isFocused.isFocused ? { borderColor: '#fd780f'} : { borderColor: '#aaaaaa'}, message.type === 'subject' && { borderBottomColor: '#d61111' }]} 
                                    placeholder="기타 사유를 입력해 주세요." placeholderTextColor='#aaaaaa' ref={ contentRef } onFocus={ () => { handleFocus(contentRef), setMessage({ type: '', msg: '' })}} onBlur={ () => handleBlur(contentRef)}
                                    multiline={ true } maxLength={ 1000 } onChangeText={ (content: string) => setContent(content) } numberOfLines={ 5 } />
                            </View>
                            {/* error message */}
                            { message.type === 'content' ? 
                                <Text style={ styles.message }>{ message.msg }</Text> 
                                : 
                                <Text style={[ styles.regularText, { textAlign: 'right', width: '100%', fontSize: 13, marginTop: 6, color: '#aaaaaa' }]}>{ content.length } / 1,000byte</Text> 
                            }

                            {/* user info */}
                            <View style={{ marginVertical: 30 }}>
                                <View style={[ styles.infoContainer, { marginBottom: 9 }]}>
                                    <Text style={ styles.boldText }>{ userInfo.phone ?? '' }</Text>
                                </View>
                                <View style={ styles.infoContainer }>
                                    <Text style={ styles.boldText }>{ userInfo.email ?? '등록된 이메일이 없습니다.' }</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={[ styles.regularText, { textDecorationLine: 'underline' }]} onPress={ () => navigation.navigate('ModifyUserInfo') }>정보변경하기</Text>
                                </View>
                            </View>
                        </View>
                        
                        <View style={ styles.blank }></View>

                        <View style={{ marginHorizontal: 15 }}>
                            <Pressable style={ styles.rowContainer } onPress={ () => setAlarm(prev => !prev) }>
                                { alarm ? <FillAlarm /> : <EmptyAlarm /> }
                                <Text style={[ styles.regularText, { marginLeft: 12 }]}>문자(알림톡)/이메일 답변 받기</Text>
                            </Pressable>
                        </View>

                        <Pressable style={ styles.button }>
                            <Text style={[ styles.boldText, { fontSize: 18, color: '#ffffff' }]}>확인</Text>
                        </Pressable>
                    </ScrollView>

                    {/* type select modal */}
                    { openModal &&
                        <Animated.View style={[ styles.modalAnimation, 
                            { transform: [{
                                translateY: position.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [Dimensions.get('window').height, 0], 
                                })
                            }]}]}>
                                <View style={ styles.modal }>
                                    <View style={[ styles.rowContainer, { paddingHorizontal: 15, marginTop: 24, marginBottom: 30 }]}>
                                        <Text style={ styles.semiboldText }>문의 유형</Text>
                                        <Pressable onPress={ () => setOpenModal(false) }>
                                            <Close />
                                        </Pressable>
                                    </View>

                                    { inquiryTypeList.map((item: string, index: number) => {
                                        return (
                                            <Pressable style={[ styles.rowContainer, index === inquiryType && { backgroundColor: '#fff3e9'} ]} onPress={ () => { setInquiryType(index), setMessage({ type: '', msg: '' }), setOpenModal(false) }} key={ index }>
                                                <Text style={[ styles.boldText, { flex: 1, marginLeft: 15, marginVertical: 18 } ]}>{ item }</Text>
                                                { index === inquiryType && <Checker style={{ marginRight: 15 }} /> }
                                            </Pressable>
                                        )
                                    })}
                                </View>
                        </Animated.View>
                    }

                    { openModal && 
                        <Pressable style={ styles.modalBackground } onPress={ () => setOpenModal(false )}></Pressable>
                    }
                </>
                ) : (
                <>
                    { inquiryList.length === 0 ? (
                        <View style={ styles.emptyContainer }>
                            <View style={ styles.circle }>
                                <Flag style={{ marginLeft: 12 }} />
                            </View>
                            <Text style={ styles.regularText }>등록된 문의 내용이 없습니다.</Text>
                        </View>
                    ) : (
                        <View style={{ marginHorizontal: 15 }}>
                            { inquiryList.map((item: InquiryList, index: number) => {
                                console.log(item.type)
                                return (
                                    <Pressable style={ styles.inquiry } key={ index } onPress={ () => navigation.navigate('InquiryDetail', { id: item.id })}>
                                        <View style={ styles.rowContainer }>
                                            <View style={{ flex: 1, marginRight: 24 }}>
                                                <Text style={ styles.regularText }>[{ inquiryTypeList[item.type] }] { item.title }</Text>
                                                <View style={[ styles.rowContainer, { marginTop: 9 }]}>
                                                    <Text style={[ styles.regularText, { fontSize: 13, color: '#949494' }]}>{ formatDate(item.createdAt) }</Text>
                                                    <Text style={[ styles.regularText, { fontSize: 13, marginLeft: 9 }, item.status === 'W' ? { color: '#d61111' } : { color: '#2a71ff' }]}>
                                                        { item.status === 'W' ? '답변대기' : '답변완료' }
                                                    </Text>
                                                </View>
                                            </View>
                                            <RightArrow />
                                        </View>
                                    </Pressable>
                                )
                            })}
                        </View>
                    )}
                </>
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
        marginTop: 30
    },
    inputContainer: {
        flexDirection: 'row',
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    semiboldText: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-SemiBold',

        marginLeft: 18,

        color: '#121619'
    },
    infoContainer: {
        paddingHorizontal: 10,
        paddingVertical: 13,
        marginBottom: 12,

        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',

        backgroundColor: '#f2f2f2'
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    subjectContainer: {
        flexDirection: 'row', 
        alignItems: 'center',

        paddingHorizontal: 10,
        borderBottomWidth: 1
    },
    input: {
        width: '100%',
        height: 45,

        paddingHorizontal: 10,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        borderBottomWidth: 1
	},
    message: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,
        marginBottom: 9,
        marginLeft: 8,

        color: '#d61111'
    },
    reason: {
        width: '100%',
        height: 145,

        alignItems: 'center',

        paddingHorizontal: 15,
        paddingVertical: 13,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    modalAnimation: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 1,
    }, 
    modal: {
        flex: 1,
        width: Dimensions.get('window').width,

        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 24,

        backgroundColor: '#ffffff'
    },
    modalBackground: {
        flex: 1,
        width: '100%',
        height: '100%',

        position: 'absolute',
        left: 0,
        top: 0,

        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    blank: {
        height: 6,

        marginBottom: 30,

        backgroundColor: '#f2f2f2'
    },
    button: {
        alignItems: 'center',

        marginHorizontal: 15,
        marginTop: 60,
        marginBottom: 36,
        paddingVertical: 15,

        borderRadius: 6,
        backgroundColor: '#fd780f'
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
    },
    inquiry: {
        paddingVertical: 18,

        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee'
    }
})

export default Inquiry