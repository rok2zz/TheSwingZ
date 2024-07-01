import { StyleSheet, Text, View } from "react-native"
import { useState } from "react"

const FAQ = () => {
    const [isConnected, setIsConnected] = useState<boolean>()

    const getFAQ = async () => {

    } 

    return (
        <View style={ styles.wrapper }>


        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },

})

export default FAQ