import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Circle, Line, Polygon } from 'react-native-svg'
import { useRecord, useRecords, useStat } from '../hooks/useRecords'
import { Stat, Record } from '../slices/record'

type Point = [number, number]

interface Props {
    record: Record,
    stat: Stat
}

const RadarChart = ({ record, stat }: Props): JSX.Element => {
    const { getRecentAvgTeeDistance, getRecentAvgPutts, getRecentAvgFair, getRecentAvgGreen, getRecentAvgParSave } = useRecords()
    const [points, setPoints] = useState<Point[]>()
   
    const degreesBetweenAxes = 360 / 5
    const viewBoxCenter = 100
    const radius = 200 * 0.35
    const pointArr: Point[] = []

    useEffect(() => {
        if (data) {
            data.forEach((item: number | undefined, index: number) => {
                if (!item) return
                const edgePoint = calculateEdgePoint(index, item / 75)
                pointArr.push(edgePoint)
            })
        }
        setPoints(pointArr)
    },[record])

    // useEffect(() => {
    //     console.log(points)
    // }, [points])


    const calculateEdgePoint = useMemo(() => {
        return (index: number, scale: number = 1): Point => {
            const degree = (index) * degreesBetweenAxes + 90
            const degreeInRadians: number = degree * (Math.PI / 180)
            const degreeInRadiansY: number = (degree + 180) * (Math.PI / 180)

            return [
                viewBoxCenter + Math.cos(degreeInRadians) * radius * scale,
                viewBoxCenter + Math.sin(degreeInRadiansY) * radius * scale,
            ]
        }
    }, [viewBoxCenter, radius, degreesBetweenAxes])

    const getDistanceValue = (): number | undefined => {
        if (stat.dtStat.length === 0) return
     
        if (getRecentAvgTeeDistance(stat) >= 250) {
                return 250 / 3
        }
    
        return getRecentAvgTeeDistance(stat) / 3
    }

    const getPuttValue = (): number | undefined => {
        if (record?.ccArr?.length === 0) return

        if (getRecentAvgPutts(record) < 1) {
            return 100
        } else if (getRecentAvgPutts(record) >= 4) {
            return 0
        }

        return (4 - getRecentAvgPutts(record)) / 3 * 100
    }

    const getFairValue = (): number | undefined => {
        if (stat.dtStat.length === 0) return

        return getRecentAvgFair(record) + 10
    }

    const getGreenValue = (): number | undefined => {
        if (stat.dtStat.length === 0) return

        return getRecentAvgGreen(record) + 10
    }

    const getParSaveValue = (): number | undefined => {
        if (stat.dtStat.length === 0) return
        return getRecentAvgParSave(record) + 10
    }

    const data: (number | undefined)[] = [
        getDistanceValue(),
        getPuttValue(),
        getFairValue(),
        getGreenValue(),
        getParSaveValue()
    ]

    
    return (
        <View style={ styles.chartContainer }>
            <View style={{ alignItems: 'center' }}>
                <Text style={[ styles.recordNum, { fontSize: 18 }]}>{ record?.ccArr?.length > 4 ? getRecentAvgTeeDistance(stat) : '--' }m</Text>
                <Text style={[ styles.recordType, { fontSize: 14 }]}>드라이버 비거리</Text>
            </View>
            <View style={ styles.rowContainer }>
                <View style={{ alignItems: 'center', transform: [{ translateY: - 20 }]}}>
                    <Text style={[ styles.recordNum, { fontSize: 18 }]}>{ record?.ccArr?.length > 4 ? getRecentAvgPutts(record) : '--' }개</Text>
                    <Text style={[ styles.recordType, { fontSize: 14 }]}>평균 퍼팅 수</Text>
                </View>
                <View>
                    <Svg style={ styles.svg }>
                        { Array.from({ length: 4 }, (_, i) => i).map((index: number) => {
                            const points = Array.from({ length: 5 }, (_, i) => {
                                const edgePoint = calculateEdgePoint(
                                    i,
                                    (index + 1) / 3,
                                )

                                return `${edgePoint[0]},${edgePoint[1]}` 
                            }).join(' ')

                            return (
                                <Polygon
                                    key={ index }
                                    points={ points }
                                    stroke='#949494'
                                    strokeWidth={ 0.5 }
                                    strokeOpacity={ 0.5 }
                                    fill='salmon'
                                    fillOpacity={ 0 }
                                />
                            )
                        })}
                        { Array.from({length: 5}, (_, i) => i).map((index: number) => (
                            <Line
                                key={ index }
                                x1={ calculateEdgePoint(index, 1.3)[0]  }
                                y1={ calculateEdgePoint(index, 1.3)[1] }
                                x2={ 100 }
                                y2={ 100 }
                                stroke='#949494'
                                strokeWidth={ 1 }
                                strokeOpacity='0.3'
                            />
                        ))}

                        { data[0] !== undefined && record?.ccArr?.length > 4 &&
                            <Polygon
                                fill='#ef7617'
                                fillOpacity={ 0.3 }
                                stroke='salmon'
                                strokeWidth={ 1 }
                                strokeOpacity={ 1 }
                                points={`${data.map((item: number | undefined, index: number) => {
                                    if (!item) return
                                    const edgePoint = calculateEdgePoint(index, item / 75)

                                    return `${edgePoint[0]},${edgePoint[1]}`
                                })}`}
                            />
                        }
                       
                        { points && record?.ccArr?.length > 4 && points.map((item: Point, index: number) => (
                            <Circle key={ index } cx={ item[0] } cy={ item[1] } r="6" fill="#ff580f" fillOpacity={ 0.38 } />
                        ))}
                        { points && record?.ccArr?.length > 4 && points.map((item: Point, index: number) => (
                            <Circle key={ index } cx={ item[0] } cy={ item[1] } r="3" fill="#ef7617" />
                        ))}
                        
                    </Svg>
                </View> 
                <View style={{ alignItems: 'center', transform: [{ translateY: - 20 }]}}>
                    <Text style={[ styles.recordNum, { fontSize: 18 }]}>{ record?.ccArr?.length > 4 ? getRecentAvgParSave(record) : '--' }%</Text>
                    <Text style={[ styles.recordType, { fontSize: 14 }]}>파 세이브율</Text>
                </View>
            </View>
            <View style={ styles.chartTextBox }>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[ styles.recordNum, { fontSize: 18 }]}>{ record?.ccArr?.length > 4 ? getRecentAvgFair(record) : '--' }%</Text>
                    <Text style={[ styles.recordType, { fontSize: 14 }]}>페어웨이 안착률</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[ styles.recordNum, { fontSize: 18 }]}>{ record?.ccArr?.length > 4 ? getRecentAvgGreen(record) : '--' }%</Text>
                    <Text style={[ styles.recordType, { fontSize: 14 }]}>그린 적중률</Text>
                </View>
            </View>

            <View style={ styles.recordUserType }>
                <View style={ styles.rowContainer }>
                    <View style={[ styles.miniCircle, { backgroundColor: '#ed9648' }]}></View>
                    <Text style={ styles.userTypeText }>나</Text>
                </View>
                <View style={ styles.rowContainer }>
                    <View style={[ styles.miniCircle, { backgroundColor: '#666666' }]}></View>
                    <Text style={ styles.userTypeText }>동급</Text>
                </View>
            </View>
            { record?.ccArr?.length <= 5 && <Text style={ styles.noRecordText }>5경기 이상 플레이하면​ 나의 기록분석 그래프를​ 확인할 수 있습니다.​</Text> }
        </View>  
    )
}

const styles = StyleSheet.create({
    svg: {
        width: 200,
        height: 200
    },
    recordType: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        color: '#949494'
    },
    recordNum: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 3,

        color: '#121619'
    },
    recordText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        transform: [{ translateY: 7 }],

        color: '#121619'
    },
    chartContainer: {
        alignItems: 'center',
        marginTop: 27,
    },
    chartTextBox: {
        width: '70%',
        
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordUserType: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginTop: 22
    },
    circle: {
        width: 6,
        height: 6,

        position: 'absolute',

        borderWidth: 2,
        borderColor: '#ff580f',
        borderRadius: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    miniCircle: {
        width: 10,
        height: 10,

        borderRadius: 15
    },
    userTypeText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        marginLeft: 4,

        color: '#949494'
    },
    noRecordText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginTop: 24,

        color: '#949494'
    },
})

export default RadarChart