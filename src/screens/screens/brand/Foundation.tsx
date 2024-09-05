import { Dimensions, StyleSheet, Text, View } from "react-native"

// svg
import WebView from "react-native-webview"

const Foundation = (): JSX.Element => {

    return (
        <View style={ styles.wrapper }>
            <View style={{ width: '100%', height: '100%' }}>
                <WebView
                    style={ styles.container }
                    originWhitelist={['*']}
                    source={{ uri: 'https://theswing-z.com/app_franchisee.html' }}
                /> 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#272727'
    },
    container: {
        width: '100%', 

        backgroundColor: 'rgba(0, 0, 0, 0)'
    }
 
})

export default Foundation