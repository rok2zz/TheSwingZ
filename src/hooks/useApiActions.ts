import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux'
import { useMemo } from "react";
import { clearApi, saveServerInfo, saveYoutubeVideo } from "../slices/api";

export const useApiActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => bindActionCreators({ saveServerInfo, saveYoutubeVideo, clearApi }, dispatch), [ dispatch ]) 
}