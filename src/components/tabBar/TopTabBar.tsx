import { useEffect, useState } from "react"
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from "react-native"

interface Props {
    type: number,
    typeChange(type: number): void,
    tab1: string,
    tab2: string
}

const TopTabBar = ({ type, typeChange, tab1, tab2 }: Props): JSX.Element => {
    const [indicatorPosition] = useState(new Animated.Value(0))

    useEffect(() => {
        typeChange(type)

        Animated.spring(indicatorPosition, {
            toValue: type,
            useNativeDriver: false
        }).start()
    }, [type])

    return (
        <View style={ styles.wrapper }>
            <View style={ styles.container }>
                <Pressable style={ styles.button } onPress={ () => typeChange(0) }>
                    <Text style={ type === 0 ? styles.selectedText : styles.text }>{ tab1 }</Text>
                </Pressable>
                <Pressable style={ styles.button } onPress={ () => typeChange(1) }>
                    <Text style={ type === 1 ? styles.selectedText : styles.text }>{ tab2 }</Text>
                </Pressable>
            </View>
            <Animated.View style={[ styles.indicator, 
                { transform: [{
                    translateX: indicatorPosition.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Dimensions.get('window').width / 2], 
                    })
                }, {
                    translateY: 1
                }
                ]}]}>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        borderTopStartRadius: 6,
        borderTopEndRadius: 6,

        borderBottomWidth: 1,
        borderColor: '#cccccc',

        backgroundColor: '#ffffff'
    },
    container: {
        flexDirection: 'row',
        
        paddingTop: 6
    },
    button: {
        flex: 1,

        alignItems: 'center'
    },
    text: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 15,

        color: '#949494'
    },
    selectedText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 15,

        color: '#121619'
    },
    indicator: {
        width: Dimensions.get('window').width / 2,
        height: 3,
        
        backgroundColor: '#fd780f'
    }
})

export default TopTabBar