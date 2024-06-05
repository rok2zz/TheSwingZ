import { View, Image, StyleSheet } from "react-native"

interface Props {
    step: number
}

function RegisterIcons({ step }: Props): JSX.Element {
    const progress = step

    return (
        <View style={ styles.iconContainer }>
            { progress >= 1 ? 
                <Image style={ styles.icon } source={ require('../../assets/imgs/terms_on.png') } /> 
                : <Image style={ styles.icon } source={ require('../../assets/imgs/terms_off.png') } /> 
            }
            { progress >= 2 ? (
                <>
                    <Image style={ styles.step } source={ require('../../assets/imgs/step_on.png') } />
                    <Image style={ styles.icon } source={ require('../../assets/imgs/auth_on.png') } />
                </>
            ) : ( 
                <>
                    <Image style={ styles.step } source={ require('../../assets/imgs/step_off.png') } />
                    <Image style={ styles.icon } source={ require('../../assets/imgs/auth_off.png') } /> 
                </>
            )}
            { progress >= 3 ? (
                <>
                    <Image style={ styles.step } source={ require('../../assets/imgs/step_on.png') } />
                    <Image style={ styles.icon } source={ require('../../assets/imgs/register_on.png') } />
                </>
            ) : ( 
                <>
                    <Image style={ styles.step } source={ require('../../assets/imgs/step_off.png') } />
                    <Image style={ styles.icon } source={ require('../../assets/imgs/register_off.png') } /> 
                </>
            )}
            { progress >= 4 ? (
                <>
                    <Image style={ styles.step } source={ require('../../assets/imgs/step_on.png') } />
                    <Image style={ styles.icon } source={ require('../../assets/imgs/complete_on.png') } />
                </>
            ) : ( 
                <>
                    <Image style={ styles.step } source={ require('../../assets/imgs/step_off.png') } />
                    <Image style={ styles.icon } source={ require('../../assets/imgs/complete_off.png') } /> 
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        marginVertical: 40
    },
    icon: {
        width: 50,
        height: 50
    },
    step: {
        width: 10,
        height: 10
    }
})
export default RegisterIcons