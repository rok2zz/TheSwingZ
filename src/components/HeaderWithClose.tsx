import { useNavigation } from "@react-navigation/native"
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp } from "../types/stackTypes"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"

//svg
import LeftArrow from "../assets/imgs/common/chevron_left.svg"
import WhiteArrow from "../assets/imgs/common/chevron_left_white.svg"
import Close from "../assets/imgs/swing/close.svg"


interface Props {
    title: string,
    type: number,
    isFocused: boolean
    before: string,
}

const Header = ({ title, type, isFocused, before }: Props ): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()

    const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff')
    const [fontColor, setFontColor] = useState<string>('#121619')

    useEffect(() => {
        switch (type) {
            case 0:
                setBackgroundColor('#ffffff')
                setFontColor('#121619')
                break
            case 1:
                setBackgroundColor('#272727')
                setFontColor('#ffffff')
                break
            case 2:
                setBackgroundColor('#ef7617')
                setFontColor('#ffffff')
                break
            case 3:
                setBackgroundColor('#000000')
                setFontColor('#ffffff')
                break
            case 4:
                setBackgroundColor('#f3f3f3')
                setFontColor('#121619')
                break
            case 5:
                setBackgroundColor('#1b212b')
                setFontColor('#ffffff')
        }
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(backgroundColor)   
        }
    }, [isFocused])

    const onPress = () => {
        if (before === 'ScoreCard') {
            navigation.navigate('MainTab' as any, { screen: 'MyZ' })
            return
        } 

        navigation.navigate('MainTab' as any, { screen: 'Main' })
    }

    return (
        <SafeAreaView style={{ backgroundColor: backgroundColor }} edges={['top']}>
            { isFocused && <StatusBar backgroundColor={ backgroundColor } /> }
            <View style={ styles.container }>
                <Pressable style={ styles.button } onPress={ () => navigation.goBack() }>
                    { type === 0 || type === 4 ? <LeftArrow /> : <WhiteArrow /> }
                </Pressable>
                <Text style={[ styles.title, { color: fontColor }]}>{ title }</Text>

                <Pressable style={{ marginRight: 15 }} onPress={ onPress }>
                    <Close  />
                </Pressable>
            </View>
        </SafeAreaView>
                
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        padding: 18,
    },
    title: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 19,
        marginRight: 36,
        marginLeft: 15,
    },
    manageBtn: {
        marginRight: 15
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    }
})

export default Header