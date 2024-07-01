import { PayloadAction, Update, createSlice } from "@reduxjs/toolkit"

export interface CourseImage {
    minimapResource: string,
    courseNumber: number,
    holeNumber: number,
    par: number
}

export interface CourseInfo {
    id: number,
    ccName: string,
    cc: string,
    location: string,
    hole: number,
    course1: number,
    course2: number,
    courseName1: string,
    courseName2: string,
    courseDifficult: number,
    greenDifficult: number,
}


interface CourseState {
    courseThumbnail: CourseThumnail[],
    courseImage: CourseImage[],
    courseInfo: CourseInfo[]
}

export interface CourseThumnail {
    name: string,
    url: string
}

const initialState: CourseState = {
    courseImage: [],
    courseThumbnail: [],
    courseInfo: []
}

const courseSlice = createSlice ({
    name: 'course',
    initialState,
    reducers: {
        saveCourseThumbnail(state, action: PayloadAction<CourseThumnail[]>) {
            state.courseThumbnail = action.payload
        },
        saveCourseImage(state, action: PayloadAction<CourseImage[]>) {
            state.courseImage = action.payload
        },
        saveCourseInfo(state, action: PayloadAction<CourseInfo[]>) {
            state.courseInfo = action.payload
        }
    }
})

export default courseSlice.reducer
export const { saveCourseThumbnail, saveCourseImage, saveCourseInfo } = courseSlice.actions