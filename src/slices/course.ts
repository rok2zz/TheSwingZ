import { PayloadAction, Update, createSlice } from "@reduxjs/toolkit"

export interface CourseImage {
    minimapResource: string,
    courseNumber: number,
    holeNumber: number,
    par: number
}

interface CourseState {
    courseThumbnail: CourseThumnail[],
    courseImage: CourseImage[]
}

export interface CourseThumnail {
    name: string,
    url: string
}

const initialState: CourseState = {
    courseImage: [],
    courseThumbnail: []
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
        }
    }
})

export default courseSlice.reducer
export const { saveCourseThumbnail, saveCourseImage } = courseSlice.actions