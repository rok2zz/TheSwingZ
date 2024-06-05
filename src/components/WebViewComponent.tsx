// import React, { useEffect, useRef, useState } from 'react';
// import { BackHandler, StyleSheet } from 'react-native';
// import WebView, { WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
// import { RootStackNavigationProp } from '../types/stackTypes';
// import { useNavigation } from '@react-navigation/native';

// interface Props {
//     uri: string
// }

// function WebViewComponent({ uri }: Props): JSX.Element  {
//     const navigation = useNavigation<RootStackNavigationProp>()
//     const webView = useRef<WebView>(null)
//     const [isCanGoBack, setIsCanGoBack] = useState(false)
//     const scrollNavigation = useNavigation<any>()

//     //하드웨어 뒤로가기를 웹뷰 뒤로가기로 변경
//     const onPressHardwareBackButton = (): boolean => {
//         if (webView.current && isCanGoBack) {
//             webView.current.goBack()
//             return true
//         } else {
//             return false
//         }
//     }

//     useEffect(() => {
//         BackHandler.addEventListener('hardwareBackPress', onPressHardwareBackButton)
        
//         return () => {
//             BackHandler.removeEventListener('hardwareBackPress', onPressHardwareBackButton)
//         }
//     }, [isCanGoBack])

//     const handleWebViewNavigation = (navState: WebViewNavigation): void => {
//         setIsCanGoBack(navState.canGoBack)
//     }

//     // 웹뷰에서 보내주는 메세지 수신
//     const handleMessage = (event: WebViewMessageEvent) => {
//         const messageData: { type: string, data: string } = JSON.parse(event.nativeEvent.data)
//         const screenName = messageData.type 
//         const params = { uri: messageData.data }

//         navigation.push(screenName as ScreenName, params)
//     }

//     // 웹뷰 스크롤시 상단 탭의 스크롤 비활성화
//     const handleScroll = (event: any) => {
//         const { contentOffset } = event.nativeEvent
    
//         if (contentOffset.x !== 0) {
//             console.log('false 로 변경')

//             scrollNavigation.setOptions({ swipeEnabled: false })
//         } else {

//             // scrollNavigation.setOptions({ swipeEnabled: true })
//         }
//     }

//     return (
//         <WebView
//             ref={ webView }
//             source={{ uri: uri }}
//             onNavigationStateChange={ handleWebViewNavigation }
//             style={{ flex: 1 }}
//             onMessage={ handleMessage }
//             onScroll={(event) => {
//                 handleScroll(event)
//             }}
//             scrollEnabled={ true }
//         />
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     }
// })

// export default WebViewComponent
