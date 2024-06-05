import { useEffect, useRef } from "react"
import { Animated, Dimensions, Easing, Image, StyleSheet, View } from "react-native"

const Loading = (): JSX.Element => {
    const rotateAnimation = useRef(new Animated.Value(0)).current

    useEffect(() => {
        const halfDuration = 400
    
        const animate = () => {
            rotateAnimation.setValue(0)
            Animated.sequence([
                Animated.timing(rotateAnimation, {
                    toValue: -90,
                    duration: halfDuration / 2,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnimation, {
                toValue: -180,
                duration: halfDuration,
                easing: Easing.linear,
                useNativeDriver: true,
                }),
                Animated.timing(rotateAnimation, {
                    toValue: -270,
                    duration: halfDuration,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnimation, {
                toValue: -360,
                duration: halfDuration / 2,
                easing: Easing.linear,
                useNativeDriver: true,
                }),
            ]).start(() => animate())
        }
    
        animate()
    }, [])

      const rotateInterpolate = rotateAnimation.interpolate({
        inputRange: [-360, 0],
        outputRange: ['-360deg', '0deg'],
      })
      
    return (
        <View style={ styles.container }>
            <Animated.View style={[styles.circle, { transform: [{ rotate: rotateInterpolate }]}]}>
                <Image style={ styles.loading } source={ require('../assets/imgs/common/loading_circle.png')} />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    circle: {
        width: 50,
        height: 50,

        borderRadius: 50,
    },
    loading: {
        width: 50,
        height: 50
    }
})

export default Loading