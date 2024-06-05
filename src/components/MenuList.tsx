
import { useNavigation } from "@react-navigation/native"
import { ListProps } from "../screens/screens/mypage/ModifyProfile"
import { Pressable, Platform, Text, View, StyleSheet } from "react-native"
import { MainTabNavigationProp, MainTabScreenName, RootStackNavigationProp, RootStackScreenName, ShopStackNavigationProp, ShopStackScreenName } from "../types/stackTypes"

//
import RightArrow from "../assets/imgs/my/arrow_right_gray.svg"

interface MenuListProps {
    listItem: ListProps[]
}

// 메뉴 리스트
const MenuList = ({ listItem }: MenuListProps): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()

    const list = listItem.map((item: ListProps, index: number): JSX.Element => {
        const onPress = () => {
            navigation.push(item.screen as RootStackScreenName)
        }

        return  (
            <Pressable key={ index } style={({ pressed }) => [ styles.menuList, index !== 0 && { borderTopWidth: 1, borderTopColor: '#eeeeee'}, 
                Platform.OS === 'ios' && pressed && { backgroundColor: '#efefef' }]} android_ripple={{ color: '#ededed' }} onPress={ onPress }>
                <Text style={ styles.menuText } key={ index }>{ item.title }</Text>
                <RightArrow />
            </Pressable>
        )
    })

    return (
        <View style={ styles.wrapper }> 
            { list }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#ffffff'
    },
    menuList: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 15,
    },
    menuText: {
        flex: 1,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 19,

        color: '#121619'
    },
})

export default MenuList