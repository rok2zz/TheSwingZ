import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthStackParamList } from "../../types/stackTypes"
import Login from "./screens/Login"
import Find from "./screens/Find"
import Header from "../../components/Header"
import Terms from "./screens/Terms"
import Register from "./screens/Register"
import ResultRegister from "./screens/ResultRegister"
import IdentifyRegister from "./screens/IdentifyRegister"
import IdentifyFind from "./screens/IdentifyFind"
import ResultFind from "./screens/ResultFind"
import ResetPW from "./screens/ResetPW"

const Stack = createNativeStackNavigator<AuthStackParamList>()

const AuthStack = (): JSX.Element => {
    return (
        <Stack.Navigator> 
            <Stack.Screen name="Login" component={ Login } options={{ headerShown: false }} />

            <Stack.Screen name="Find" component={ Find } options={{ 
                header: () => <Header title="아이디/비밀번호 찾기" type={ 0 } isFocused />
            }} />
            <Stack.Screen name="IdentifyFind" component={ IdentifyFind } options={{ 
                header: () => <Header title="아이디/비밀번호 찾기" type={ 0 } isFocused />
            }} />
            <Stack.Screen name="ResultFind" component={ ResultFind } options={{ 
                header: () => <Header title="아이디/비밀번호 찾기" type={ 0 } isFocused />
            }} />
            <Stack.Screen name="ResetPW" component={ ResetPW } options={{ 
                header: () => <Header title="아이디/비밀번호 찾기" type={ 0 } isFocused />
            }} />

            <Stack.Screen name="Terms" component={ Terms } options={{ 
                header: () => <Header title="회원가입" type={ 0 } isFocused />
            }} />
            <Stack.Screen name="IdentifyRegister" component={ IdentifyRegister } options={{ 
                header: () => <Header title="회원가입" type={ 0 } isFocused />
            }} />
            
            <Stack.Screen name="Register" component={ Register } options={{ 
                header: () => <Header title="회원가입" type={ 0 } isFocused />
            }} />
            <Stack.Screen name="ResultRegister" component={ ResultRegister } options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}



export default AuthStack