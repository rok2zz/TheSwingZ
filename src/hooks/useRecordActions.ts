import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux'
import { useMemo } from "react";
import { saveRecentAvgRecord, saveRecord, saveRecentAvgStat, saveStat, clearRecord } from "../slices/record";

export const useRecordActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => bindActionCreators({ saveRecentAvgRecord, saveRecord, saveRecentAvgStat, saveStat, clearRecord }, dispatch), [ dispatch ]) 
}