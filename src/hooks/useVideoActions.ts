import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux'
import { useMemo } from "react";
import { removeSwingVideo, saveSwingVideo, saveThumbnailList, saveVideoList, clearVideo, saveScoreCardVideo, removeScoreCardVideo, saveIsCached } from "../slices/video";

export const useVideoActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => bindActionCreators({ saveVideoList, saveThumbnailList, saveSwingVideo, removeSwingVideo, clearVideo, saveScoreCardVideo, removeScoreCardVideo, saveIsCached }, dispatch), [ dispatch ]) 
}