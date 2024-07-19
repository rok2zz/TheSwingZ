import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { useBoard } from "../../../hooks/useBoard"
import { RouteProp, useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { useEffect, useState } from "react"
import { NoticeResult, Payload } from "../../../types/apiTypes"
import AsyncStorage from "@react-native-async-storage/async-storage"
import WebView from "react-native-webview"

interface Props {
    route: RouteProp<RootStackParamList, 'NoticeDetail'>
}

const NoticeDetail = ({ route }: Props) => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const id = route.params.id ?? 0
    const { getNotice } = useBoard()

    const [notice, setNotice] = useState<NoticeResult>()
    const [isViewed, setIsViewed] = useState<number>(-1)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        checkIsViewed()
    }, [])

    useEffect(() => {
        if (isViewed !== -1) {
            getNoticeDetail()
        }
    }, [isViewed])

    const checkIsViewed = async () => {
        const viewed = await AsyncStorage.getItem(`${id}isViewed`)
        if (!viewed) {
            await AsyncStorage.setItem(`${id}isViewed`, JSON.stringify(new Date()))
            setIsViewed(0)
            return
        }

        if (viewed) {
            const time = new Date(JSON.parse(viewed))
            const now = new Date()

            if ((now.getTime() - time.getTime()) > 1000 * 60 * 60 * 24) {
                await AsyncStorage.removeItem(`${id}isViewed`)
                setIsViewed(0)
                return
            }

            setIsViewed(1)
        }
    }

    const getNoticeDetail = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getNotice(id, isViewed)
        if (payload.code !== 1000) {
            return
        }

        setNotice(payload?.noticeResult)
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
    const htmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-size: 45pt;
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head/>
            <body>
                ${notice?.detail.detail}
            </body>
        </html>
    `

    const injectedCSS = `
        body::-webkit-scrollbar {
            display: none;
        }
        body {
            -ms-overflow-style: none;  /* Internet Explorer 10+ */
            scrollbar-width: none;  /* Firefox */
        }
    `;

    const injectedJavaScript = `
        const style = document.createElement('style');
        style.innerHTML = \`${injectedCSS}\`;
        document.head.appendChild(style);
        window.ReactNativeWebView.postMessage(document.body.scrollHeight);
    `

    return (
        <View style={ styles.wrapper }>
            { notice ? (
                <>
                    <View style={ styles.container }>
                        <Text style={ styles.boldText }>{ notice.detail.title }</Text>
                        <Text style={[ styles.regularText, { fontSize: 13, marginTop: 9, marginBottom: 18, color: '#949494' }]}>{ formatDate(notice.detail.createdAt) }</Text>
                    </View>
                    <View style={[ styles.detailContainer, { width: '100%', height: Dimensions.get('window').height - 320 }]}>
                        <WebView
                            injectedJavaScript={injectedJavaScript}
                            originWhitelist={['*']}
                            source={{ html: htmlContent }}
                            scrol
                        />  
                    </View>
                </>
            ) : (
                <View style={ styles.container }>
                    <Text style={ styles.boldText }>등록된 공지사항이 없습니다.</Text>
                </View>
            )}
            
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
        marginHorizontal: 15,

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
    detailContainer: {
        marginHorizontal: 15,
    },
    button: {
        alignItems: 'center',

        paddingVertical: 13,
        marginHorizontal: 15,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#fd780f'
    }
})

export default NoticeDetail