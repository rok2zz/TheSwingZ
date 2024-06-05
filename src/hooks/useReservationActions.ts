import { useDispatch } from "react-redux";
import { bindActionCreators } from 'redux'
import { useMemo } from "react";
import { saveReservationSetting, saveIsOpen, clearReservation, saveRevList, saveShopList, saveMyRevList, setIsFavorite } from "../slices/reservation";

export const useReservationActions = () => {
    const dispatch = useDispatch()

    return useMemo(() => bindActionCreators({ saveReservationSetting, saveShopList, saveRevList, saveMyRevList, saveIsOpen, clearReservation, setIsFavorite }, dispatch), [ dispatch ]) 
}