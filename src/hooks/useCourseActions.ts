import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux'
import { useMemo } from "react";
import { saveCourseImage, saveCourseInfo, saveCourseThumbnail } from "../slices/course";

export const useCourseActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => bindActionCreators({ saveCourseImage, saveCourseThumbnail, saveCourseInfo }, dispatch), [ dispatch ]) 
}