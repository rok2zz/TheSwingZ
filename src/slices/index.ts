import { combineReducers } from 'redux'
import auth from "./auth"
import record from './record'
import api from './api'
import reservation from './reservation'
import video from './video'
import course from './course'

const rootReducer = combineReducers ({
    auth,
    api,
    record,
    video,
    reservation,
    course
})

export type RootState = ReturnType<typeof rootReducer>

declare module 'react-redux' {
    interface DefaultRootState extends RootState {} //선언시 useSelector 에서 타입 자동 추론
}

export default rootReducer