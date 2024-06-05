import { Image, StyleSheet, View } from "react-native"

const Splash = (): JSX.Element => {
    return (
        <View style={ styles.wrapper }>
            <Image style={ styles.image } source={ require('../../assets/imgs/intro/splash.png')} resizeMode="cover" />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: '#272727'
    },
    image: {
        width: '100%',
        height: '100%'
    }
})

export default Splash