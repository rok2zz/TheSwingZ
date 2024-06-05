import { useSelector } from "react-redux"
import { CourseImage, CourseThumnail } from "../slices/course"
import { RootState } from "../slices"
import { useCourseActions } from "./useCourseActions"
import { Body, CourseResponse, Payload } from "../types/apiTypes";
import axios from "axios";
import { useServerInfo } from "./useApi";
import { ServerInfo } from "../slices/api";

interface CourseHooks {
    getCourseThumbnail: () => Promise<Payload>,
    getCourseImage: (ccId: number, course1: number, course2: number) => Promise<Payload>,
}

export const useCourseThumbnail = (): CourseThumnail[] => {
    return useSelector((state: RootState) => state.course.courseThumbnail)
}

export const useCourseImage = (): CourseImage[] => {
    return useSelector((state: RootState) => state.course.courseImage)
}

export const useCourse = (): CourseHooks => {
    const serverInfo: ServerInfo = useServerInfo()
    const { saveCourseImage, saveCourseThumbnail } = useCourseActions()
    const appURL = serverInfo.appServer

    // get course thumbnail
    const getCourseThumbnail = async () => {
        const body: Body = {
            cls: 'Play',
            method: 'getCourseThumbnail'
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: CourseResponse = await axios.post(appURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            if (res.data.result?.urls) {
                saveCourseThumbnail(res.data.result.urls)
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    // get course Image
    const getCourseImage = async (ccId: number, course1: number, course2: number) => {
        const body: Body = {
            cls: 'Play',
            method: 'getCourseImage',
            params: [ 
                ccId,
                course1,
                course2
            ]
        }

        const jsonBody: string = JSON.stringify(body)

        try {
            const res: CourseResponse = await axios.post(appURL, jsonBody)
            if (res.data.code !== 1000) {
                const payload: Payload = {
                    code: res.data.code ?? -1,
                    msg: res.data.msg
                }

                return payload
            }

            if (res.data.result?.courses) {
                saveCourseImage(res.data.result.courses)
            }

            return { code: 1000 }
        } catch (error: any) {
            errorHandler(error)
        }

        return  { code: -1, msg: '서버에 연결할 수 없습니다.' }
    }

    return { getCourseImage, getCourseThumbnail }
}

const errorHandler = (error: any): void => {
}
