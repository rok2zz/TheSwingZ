import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Reservation from "./screens/Reservation"
import { ShopStackParamList } from "../../../../types/stackTypes"
import FindShop from "./screens/FindShop"

const Stack = createNativeStackNavigator<ShopStackParamList>()

const ShopStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Reservation' component={ Reservation } options={{ headerShown: false }} />		
            <Stack.Screen name='FindShop' component={ FindShop } options={{ headerShown: false }} />	
        </Stack.Navigator>	
    )
}

export default ShopStack