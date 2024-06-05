import { Platform, StyleSheet, Text } from "react-native"
import { View } from "react-native"
import { Stat, Record } from "../slices/record"
import { useRecords } from "../hooks/useRecords"
import { useEffect, useState } from "react"
import { CcInfo, DtStat } from "../types/apiTypes"
import Svg, { Circle, Defs, Line, LinearGradient, Rect, Stop } from "react-native-svg"
import { Dimensions } from "react-native"

// svg
import Triangle from "../assets/imgs/my/triangle.svg"
import BlackTriangle from "../assets/imgs/my/triangle_black.svg"


interface Props {
    type: number,
    record: Record,
    stat: Stat
}

const Chart = ({ type, record, stat }: Props): JSX.Element => {
    const colorType = type ?? 0

    const { getParSave, getAvgPutts, getGreen, getFair } = useRecords()
    const count = stat.dtStat.length ?? 5
    const [bestRecordIndex, setBestRecordIndex] = useState<number>(0)

    const [strokeColor, setStrokeColor] = useState<string>('')
    const [backgroundColor, setBackgroundColor] = useState<string>('')

    useEffect(() => {
        getBestIndex()
        switch (colorType) {
            case 0:
                setStrokeColor('#fd780f')
                setBackgroundColor('#ee1617')
                break
            case 1:
                setStrokeColor('#2a71ff')
                setBackgroundColor('#2a71ff')
                break
            case 2:
                setStrokeColor('#FFD037')
                setBackgroundColor('#FFD037')
                break
            case 3:
                setStrokeColor('#009746')
                setBackgroundColor('#009746')
                break
            case 4:
                setStrokeColor('#0025B5')
                setBackgroundColor('#0025B5')
                break
            case 5:
                setStrokeColor('#E9573F')
                setBackgroundColor('#E9573F')
                break
        }
    }, [type])

    

    const getBestIndex = () => {
        switch (colorType) {
            case 0: {
                let bestShot: number = Number(stat.dtStat[0]?.totCnt ?? 0)
                setBestRecordIndex(0)
                for (let i = count - 1; i >= 0; i--) {
                    if (bestShot > Number(stat.dtStat[i]?.totCnt ?? 0)) {
                        bestShot =  Number(stat.dtStat[i]?.totCnt ?? 0)

                        setBestRecordIndex(count - i - 1)
                    }
                }
                break
            }
            case 1: {
                let bestShot: number = Number(stat.dtStat[0]?.avgTeeDist ?? 0)
                setBestRecordIndex(0)
                for (let i = count - 1; i >= 0; i--) {
                    if (bestShot < Number(stat.dtStat[i]?.avgTeeDist ?? 0)) {
                        bestShot =  Number(stat.dtStat[i]?.avgTeeDist ?? 0)
                        setBestRecordIndex(count - i - 1)
                    }
                }
                break
            }
            case 2: {
                let bestShot: number = getParSave(record, 0)
                setBestRecordIndex(0)
                for (let i = count - 1; i >= 0; i--) {
                    if (bestShot < getParSave(record, i)) {
                        bestShot = getParSave(record, i)
                        setBestRecordIndex(count - i - 1)
                    }
                }
                break
            }
            case 3: {
                let bestShot: number = getGreen(record, 0)
                setBestRecordIndex(0)
                for (let i = count - 1; i >= 0; i--) {
                    if (bestShot < getGreen(record, i)) {
                        bestShot = getGreen(record, i)
                        setBestRecordIndex(count - i - 1)
                    }
                }
                break
            }
            case 4: {
                let bestShot: number = getFair(record, 0)
                setBestRecordIndex(0)
                console.log(getFair(record, 0))

                for (let i = count - 1; i >= 0; i--) {
                    if (bestShot < getFair(record, i)) {
                        bestShot = getFair(record, i)
                        setBestRecordIndex(count - i - 1)
                    }
                }
                break
            }
            case 5: {
                let bestShot: number = getAvgPutts(record, 0)
                setBestRecordIndex(0)
                for (let i = count - 1; i >= 0; i--) {
                    if (bestShot > getAvgPutts(record, i)) {
                        bestShot = getAvgPutts(record, i)
                        setBestRecordIndex(count - i - 1)
                    }
                }
            }
        }
    }

    return (
        <View style={ styles.wrapper }>
            <View style={ styles.rowContainer }>
                { stat.dtStat.length > 0 && stat.dtStat.map((item: DtStat, index: number) => {
                    const reverseIndex = count - index - 1
                    const getRecordValue = (i: number): number => {
                        switch (colorType) {
                            case 0:
                                return Number(stat.dtStat[i]?.totCnt ?? 0)
                            case 1:
                                return Number(stat.dtStat[i]?.avgTeeDist ?? 0)
                            case 2:
                                return getParSave(record, i)
                            case 3:
                                return getGreen(record, i)
                            case 4:
                                return getFair(record, i)
                            case 5:
                                return getAvgPutts(record, i)
                        }
                        return 0
                    }

                    const getValue = (i: number): number => {
                        switch (colorType) {
                            case 0:
                                return getShotsValue(i)
                            case 1:
                                return getDistanceValue(i)
                            case 2:
                                return getParSaveValue(i)
                            case 3:
                                return getGreenValue(i)
                            case 4:
                                return getFairValue(i)
                            case 5:
                                return getPuttsValue(i)
                        }
                        return 0
                    }
                
                    const getShotsValue = (i: number): number => {
                        const value = Number(stat.dtStat[i]?.totCnt ?? 0)
                        
                        if (value <= 65) return 50
                        if (value >= 150) return 190
                
                        return ((value - 65) / 85) * 140 + 50
                    } 
                
                    const getDistanceValue = (i: number): number => {
                        const value = Number(stat.dtStat[i]?.avgTeeDist ?? 0)
                        if (value >= 300) return 50
                        if (value <= 0) return 190
                
                        return (1 - value / 300) * 140 + 50
                    }
                
                    const getParSaveValue = (i: number): number => {
                        const value = getParSave(record, i)
                        
                        if (value >= 100) return 50
                        if (value <= 0) return 190
                
                        return (1 - value / 100) * 140 + 50
                    }
                    
                    const getGreenValue = (i: number): number => {
                        const value = getGreen(record, i)

                        if (value >= 100) return 50
                        if (value <= 0) return 190
                
                        return (1 - value / 100) * 140 + 50
                    }
                    
                    const getFairValue = (i: number): number => {
                        const value = getFair(record, i)
                        if (value >= 100) return 50
                        if (value <= 0) return 190
                
                        return (1 - value / 100) * 140 + 50
                    }

                    const getPuttsValue = (i: number): number => {
                        const value = getAvgPutts(record, i)
                        
                        if (value <= 1) return 50
                        if (value >= 4) return 190
        
                        return ((value - 1) / 3) * 140 + 50
                    }

                    if (index >= count || !item) return

                    return (
                        <View key={ index }>
                            { record && stat &&
                                <View style={{ alignItems: 'center' }} key={ index }>
                                    <View style={[ styles.block, { transform: [{ translateX: (Dimensions.get('window').width - 50) / (2 * count)}] }]}>
                                        <Svg style={{ paddingTop: 10 }} height="200" width={ (Dimensions.get('window').width - 40) / count } >
                                            <Defs>
                                                <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                    <Stop offset="0%" stopColor="rgba(253, 120, 15, 0.6)" />
                                                    <Stop offset="100%" stopColor="rgba(253, 120, 15, 0)" />
                                                </LinearGradient>
                                            </Defs>
                                            <Line
                                                x1={ 0 } 
                                                x2={ 0 } 
                                                y1={ 40 }
                                                y2={ 200 }
                                                stroke='#949494'
                                                strokeWidth={ 1 }
                                                strokeOpacity='1'
                                                strokeDasharray="3, 3"
                                            />

                                            { index < count - 1 && 
                                                <Line
                                                    x1={ 0 } 
                                                    x2={ (Dimensions.get('window').width - 50) / (2 * count) * 2 + 2} 
                                                    y1={ getValue(reverseIndex) }
                                                    y2={ getValue(reverseIndex - 1) }
                                                    stroke={ strokeColor }
                                                    strokeWidth={ 2 }
                                                    strokeOpacity='1'
                                                />
                                            }
                                        </Svg>
                                    </View>
                                    <Svg style={[ styles.circleSvg, { left: 0 }]}>
                                        <View style={[ styles.chartValue, { left: (Dimensions.get('window').width - 40) / (2 * count) - 28, top: getValue(reverseIndex) - 50 }, index === bestRecordIndex && { backgroundColor: '#121619' }]}>
                                            <Text style={[ styles.valueText, index === bestRecordIndex && { color: '#ffffff'}]}>{ getRecordValue(reverseIndex) }</Text>
                                            { index === bestRecordIndex ? <BlackTriangle style={{ transform: [{ translateY: 6 }]}} /> : <Triangle style={{ transform: [{ translateY: 6 }]}} /> }
                                        </View>
                                        <Circle cx={ (Dimensions.get('window').width - 40) / (2 * count) } cy={ getValue(reverseIndex) } r="6" fill={ strokeColor } fillOpacity={ 1 } />   
                                        { index !== bestRecordIndex && <Circle cx={ (Dimensions.get('window').width - 40) / (2 * count) } cy={ getValue(reverseIndex) } r="4" fill="#ffffff" fillOpacity={ 1 } /> }
                                        { index === bestRecordIndex && <Circle cx={ (Dimensions.get('window').width - 40) / (2 * count) } cy={ getValue(reverseIndex) } r="10" fill={ strokeColor } fillOpacity={ 0.2 } /> }
                                    </Svg>
                                    
                                    <Text style={ styles.dateText }>{ record.parcount[reverseIndex]?.date.slice(4, 6) }.{record.parcount[reverseIndex]?.date.slice(6, 8) }</Text>
                                </View>
                            }
                        </View>
                    )
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'ffffff'
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 14
    },
    block: {
    },
    dateText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 6,

        color: '#949494'
    },
    circleSvg: {
        alignItems: 'center',

        width: '100%',
        height: 200,

        position: 'absolute'
    },
    chartValue: {
        width: 55,
        height: 28,

        alignItems: 'center',
        justifyContent: 'center',

        position: 'absolute',
        
        borderRadius: 3,

        backgroundColor: '#ffffff',

        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 0.2,
            },
            android: {
                elevation: 5,
            }
        })
    },
    valueText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',



        color: '#121619'
    }

})

export default Chart