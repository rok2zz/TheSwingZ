import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import MenuList from "../../../components/MenuList"
import { ListProps } from "../../screens/mypage/ModifyProfile"

//svg
import RightArrow from "../../../assets/imgs/my/arrow_right_gray.svg"
import { useIsFocused, useNavigation } from "@react-navigation/native"
import { MainTabNavigationProp, ShopStackNavigationProp } from "../../../types/stackTypes"
import { useShopList } from "../../../hooks/useReservation"
import { version } from "../../RootStack"

const myPageList: ListProps[] = [
    {
        title: '회원정보 수정',
        screen: 'CheckPW',
        stack: 'root'
    },
    {
        title: '닉네임 수정',
        screen: 'ModifyProfile',
        stack: 'root'
    },
    // {
    //     title: '간편로그인 관리',
    //     screen: '',
    //     stack: 'root'
    // },
    // {
    //     title: '알림설정',
    //     screen: '',
    //     stack: 'root'
    // },
]

const reservationList: ListProps[] = [
    {
        title: '예약현황 및 관리',
        screen: 'ManageReservation',
        stack: 'root'
    },
    {
        title: '코스소개',
        screen: 'Course',
        stack: 'root'
    }
]

const recordList: ListProps[] = [
    {
        title: '마이 스윙폼 영상',
        screen: 'SwingVideo',
        stack: 'root'
    },
//     {
//         title: '라운드설정',
//         screen: '',
//         stack: 'root'
//     },
//     {
//         title: '스크린설정',
//         screen: '',
//         stack: 'root'
//     }
]

const brandList: ListProps[] = [
    {
        title: '브랜드소개',
        screen: 'Brand',
        stack: 'root'
    },
    {
        title: '브랜드필름',
        screen: 'BrandFilm',
        stack: 'root'
    },
    {
        title: '더스윙제트TV',
        screen: 'ZTV',
        stack: 'root'
    }
]

const serviceList: ListProps[] = [
    // {
    //     title: '공지사항',
    //     screen: 'Notice',
    //     stack: 'root'
    // },
    // {
    //     title: 'FAQ',
    //     screen: 'FAQ',
    //     stack: 'root'
    // },
    // {
    //     title: '1:1문의',
    //     screen: 'Inquiry',
    //     stack: 'root'
    // },
    {
        title: '창업안내',
        screen: 'Foundation',
        stack: 'root'
    },
    {
        title: '이용약관',
        screen: 'TermsOfUse',
        stack: 'root'
    },
    {
        title: '개인정보처리방침',
        screen: 'PrivacyPolicy',
        stack: 'root'
    }
]

const Etc = (): JSX.Element => {
    const navigation = useNavigation<MainTabNavigationProp>()
    const shopNavigation = useNavigation<ShopStackNavigationProp>()
    const isTabFocused = useIsFocused()
    const shopList = useShopList()

    const navigateReservation = () => {
        if (shopList && shopList.length > 0) {
            shopNavigation.navigate('Reservation', { beforeScreen: 'Etc' }) 
            return
        }
        navigation.navigate('ShopStack')
    }
    return (
        <SafeAreaView style={ styles.wrapper }>
            { isTabFocused && <StatusBar backgroundColor='#f3f3f3' /> }
            <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false }>
                <Text style={[ styles.title, { marginTop: 34 }]}>마이페이지</Text>
                <MenuList listItem={ myPageList } />

                <Text style={[ styles.title, { marginTop: 34 }]}>스크린예약</Text>
                <View style={ styles.menuContainer }>
                    <Pressable style={({ pressed }) => [ styles.menuList, { borderBottomWidth: 1, borderBottomColor: '#eeeeee'}, 
                        Platform.OS === 'ios' && pressed && { backgroundColor: '#efefef' }]} android_ripple={{ color: '#ededed' }} 
                        onPress={ navigateReservation }>
                        <Text style={ styles.menuText }>스크린예약</Text>
                        <RightArrow />
                    </Pressable>
                    <MenuList listItem={ reservationList } />
                </View>

                <Text style={[ styles.title, { marginTop: 34 }]}>스크린골프</Text>
                <View style={ styles.menuContainer }>
                    <Pressable style={({ pressed }) => [ styles.menuList, { borderBottomWidth: 1, borderBottomColor: '#eeeeee'}, 
                        Platform.OS === 'ios' && pressed && { backgroundColor: '#efefef' }]} android_ripple={{ color: '#ededed' }} 
                        onPress={ () => navigation.navigate('MyZ', { type: 0, beforeScreen: 'Etc' }) }>
                        <Text style={ styles.menuText }>내기록</Text>
                        <RightArrow />
                    </Pressable>
                    <Pressable style={({ pressed }) => [ styles.menuList, { borderBottomWidth: 1, borderBottomColor: '#eeeeee'}, 
                        Platform.OS === 'ios' && pressed && { backgroundColor: '#efefef' }]} android_ripple={{ color: '#ededed' }} 
                        onPress={ () => navigation.navigate('MyZ', { type: 1, beforeScreen: 'Etc' }) }>
                        <Text style={ styles.menuText }>기록분석</Text>
                        <RightArrow />
                    </Pressable>
                    <MenuList listItem={ recordList } />
                </View>

                <Text style={[ styles.title, { marginTop: 34 }]}>더스윙제트</Text>
                <MenuList listItem={ brandList } />

                <Text style={[ styles.title, { marginTop: 34 }]}>고객센터</Text>
                <MenuList listItem={ serviceList } />

                <Text style={ styles.versionText }>버전정보 { version }</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#f3f3f3',
    },
    container: {
        marginHorizontal: 15
    },
    title: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginTop: 48,
        marginBottom: 18,

        color: '#121619'
    },
    listContainer: {
        paddingHorizontal: 15,

        backgroundColor: '#ffffff'
    },
    menuContainer: {
        backgroundColor: '#ffffff'
    },
    menuList: {
        flexDirection: 'row',
        alignItems: 'center',

        marginHorizontal: 15,
    },
    menuText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 19,

        color: '#121619'
    },
    versionText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 24,
        paddingBottom: 300,
        marginBottom: -118,

        color: '#121619'
    }
})

export default Etc