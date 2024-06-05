import { RouteProp } from "@react-navigation/native"
import { ScrollView, StyleSheet } from "react-native"
import { RootStackParamList } from "../../../types/stackTypes"

interface Props {
    route: RouteProp<RootStackParamList, 'ResultWithdrawal'>
}

const ResultWithdrawal = ({ route }: Props): JSX.Element => {
    const success = route.params.success ?? true
    const reason = route.params.reason ?? ''


    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    }
})

export default ResultWithdrawal