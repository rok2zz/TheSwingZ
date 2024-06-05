import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackNavigationProp, RootStackParamList } from "../../../types/stackTypes"
import { RouteProp, useNavigation } from "@react-navigation/native"
import TopTabBar from "../../../components/tabBar/TopTabBar"
import { useEffect, useState } from "react"
import { CourseInfo } from "./courseInfo"
import { ImageSource } from "react-native-vector-icons/Icon"
import { useCourse, useCourseImage } from "../../../hooks/useCourse"
import { Payload } from "../../../types/apiTypes"
import FastImage from "react-native-fast-image"

import Loading from "../../../components/Loading"

//svg
import EmptyStar from "../../../assets/imgs/course/star_empty.svg"
import FilledStar from "../../../assets/imgs/course/star_fill.svg"
import HalfStar from "../../../assets/imgs/course/star_half.svg"
import LeftArrow from "../../../assets/imgs/course/arrow_left.svg"
import RightArrow from "../../../assets/imgs/course/arrow_right.svg"
import { CourseImage } from "../../../slices/course"

interface Props {
    route: RouteProp<RootStackParamList, 'CourseDetail'>
}

const CourseDetail = ({ route }: Props): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const course: CourseInfo = route.params.course
    const thumbnail = route.params.thumbnail
    const { getCourseImage } = useCourse()
    const courseInfo = useCourseImage()

    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const [minimapList, setMinimapList] = useState<CourseImage[]>([])
    const [type, setType] = useState<number>(0)
    const [hole, setHole] = useState<number>(1)
    const mapWidth = Dimensions.get('window').width
    const mapHeight = mapWidth * 540 / 370

    useEffect(() => {
        getMinimapSource()
    }, [course])

    useEffect(() => {
        setHole(1)
    }, [type])

    useEffect(() => {
        setMinimapList(courseInfo)
    }, [courseInfo])

    const getMinimapSource = async () => {
        const payload: Payload = await getCourseImage(course.id, course.course1, course.course2)

        if (payload.code !== 1000) {
            return
        }

        setIsLoaded(true)
    }

    const cutString = (val: string): string => {
        if (val.length > 22) return val.substring(0, 22) + ".."
        return val
    }

    const handleTypeChange = (newType: number) => {
        setType(newType)
    }

    const onPressLeft = () => {
        if (hole === 1) {
            setHole(9)
            return
        }
        setHole(hole - 1)
    }

    const onPressRight = () => {
        if (hole === 9) {
            setHole(1)
            return
        }
        setHole(hole + 1)
    }

    const getPar = () => {
        if (minimapList && minimapList.length > 0) {
            if (type === 1) {
                return minimapList[hole + 8].par ?? 0
            }
            return minimapList[hole - 1]. par ?? 0
        }
    }

    return (
        <>
            { !isLoaded && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
                <View style={ styles.thumbnailContainer }>
                    <Image style={[ styles.thumbnail, { position: 'absolute', top: 0, left: 0 }]} source={ require('../../../assets/imgs/course/course_detail.png') } resizeMode="cover" />
                    { thumbnail !== '' &&
                        <FastImage 
                            style={ styles.thumbnail }                   
                            source={{ 
                                uri: thumbnail,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable 
                            }} 
                            resizeMode="cover"
                        />
                    }
                </View>

                <View style={ styles.container }>
                    <Text style={ styles.title }>{ cutString(course.ccName) }</Text>

                    <View style={ styles.courseRow }>
                        <Text style={ styles.infoText }>코스정보</Text>
                        <Text style={ styles.courseText }>{ course.hole }홀, { course.courseName1 }, { course.courseName2 }</Text>
                    </View>
                    <View style={ styles.courseRow }>
                        <Text style={ styles.infoText }>지역</Text>
                        <Text style={ styles.courseText }>{ course.location }</Text>
                    </View>
                    <View style={ styles.courseRow }>
                        <Text style={ styles.infoText }>코스난이도</Text>
                        <View style={ styles.rowContainer }>
                            { Array.from({ length: Number(course.courseDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                if (Math.floor(course.courseDifficulty) === index) {
                                    return <HalfStar key={ index } />
                                }
                                return (                                         
                                    <FilledStar style={ styles.star } key={ index } />
                                )
                            })}                        
                            { Array.from({ length: 5 - Number(course.courseDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                return (                                         
                                    <EmptyStar style={ styles.star } key={ index } />
                                )
                            })}      
                        </View>
                    </View>
                    <View style={[ styles.courseRow, { marginBottom: 0 }]}>
                        <Text style={ styles.infoText }>그린난이도</Text>
                        <View style={ styles.rowContainer }>
                            { Array.from({ length:  Number(course.greenDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                if (Math.floor(course.greenDifficulty) === index) {
                                    return <HalfStar key={ index } />
                                }
                                return (                                         
                                    <FilledStar style={ styles.star } key={ index } />
                                )
                            })}                        
                            { Array.from({ length: 5 - Number(course.greenDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                return (                                         
                                    <EmptyStar style={ styles.star } key={ index } />
                                )
                            })}      
                        </View>
                    </View>
                </View>

                <View style={ styles.blankContainer } />

                <View style={[ styles.container, { paddingBottom: 0 }]}>
                    {/* <Text style={[ styles.title, { fontSize: 18 }]}>티별 거리</Text>
                    <View style={ styles.distanceContainer }>
                        <View style={ styles.distanceBox }>
                            <View style={[ styles.rowContainer, { marginBottom: 30 }]}>
                                <View style={[ styles.circle, { backgroundColor: '#121619'} ]}></View>
                                <Text style={ styles.infoText }>Black</Text>
                            </View>
                            <Text style={ styles.distanceText }>{ course.black[hole - 1] }m</Text>
                        </View>
                    </View> */}

                    {/* <Text style={[ styles.title, { fontSize: 18 }]}>평균 타수</Text> */}

                    <Text style={[ styles.title, { fontSize: 18 }]}>홀 정보</Text>
                </View>

                <TopTabBar type={ type } typeChange={ handleTypeChange } tab1={ course.courseName1 } tab2={ course.courseName2 } />

                <View style={[ styles.mapContainer, { width: mapWidth, height: mapHeight }]}>
                    <View style={ styles.mapInfo }>
                        <Text style={ styles.holeInfoText }>{ hole } Hole</Text>
                        <View style={ styles.holeInfoBlank }></View>
                        <Text style={ styles.holeInfoText }>PAR { getPar() }</Text>
                    </View>
                    { minimapList && minimapList.length > 0 &&
                        <FastImage 
                            style={ styles.minimap }                   
                            source={{ 
                                uri: courseInfo[hole - 1].minimapResource ?? '',
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable 
                            }} 
                            resizeMode="cover"
                        />
                    }
                    
                    <Pressable style={[ styles.arrow, { left: 15 }]} onPress={ onPressLeft }>
                        <LeftArrow />
                    </Pressable>
                    <Pressable style={[ styles.arrow, { right: 15 }]} onPress={ onPressRight }>
                        <RightArrow />
                    </Pressable>
                </View>
                

                <View style={ styles.courseCard }>
                    <View style={[ styles.courseCardRow, { backgroundColor: '#f6f6f6' }]}>
                        <View style={ styles.typeBox }>
                            <Text style={ styles.typeText }>HOLE</Text>
                        </View>
                        <View style={ styles.centerRow }>
                            { Array.from({ length: 9 }, (_, index: number) => (
                                <View key={ index }>
                                    { type === 0 ? 
                                        <Text style={[ styles.typeText, { width: (Dimensions.get('window').width - 82) / 9 }]}>{ index + 1 }</Text>
                                        :
                                        <Text style={[ styles.typeText, { width: (Dimensions.get('window').width - 82) / 9 }]}>{ index + 10 }</Text>
                                    }
                                </View>
                            ))}
                        </View>                            
                    </View>
                    {/* <View style={ styles.courseCardRow }>
                        <View style={ styles.typeBox }>
                            <Text style={[ styles.typeText, { color: '#121619' }]}>Black</Text>
                        </View>
                        <View style={ styles.centerRow }>
                            { Array.from({ length: 9 }, (_, index: number) => (
                                <View key={ index }>
                                    { type === 0 ? 
                                        <Text style={ styles.holeText }>{ course.black[index] }</Text>
                                        :
                                        <Text style={ styles.holeText }>{ course.black[index + 9] }</Text>
                                    }
                                </View>
                            ))}
                        </View>                            
                    </View> */}
                    {/* <View style={ styles.courseCardRow }>
                        <View style={ styles.typeBox }>
                            <Text style={ styles.typeText }>White</Text>
                        </View>
                        <View style={ styles.centerRow }>
                            { Array.from({ length: 9 }, (_, index: number) => (
                                <Text style={ styles.holeText } key={ index }>{ index + 1 }</Text>
                            ))}
                        </View>                            
                    </View>
                    <View style={ styles.courseCardRow }>
                        <View style={ styles.typeBox }>
                            <Text style={ styles.typeText }>Red</Text>
                        </View>
                        <View style={ styles.centerRow }>
                            { Array.from({ length: 9 }, (_, index: number) => (
                                <Text style={ styles.holeText } key={ index }>{ index + 1 }</Text>
                            ))}
                        </View>                            
                    </View> */}
                    <View style={ styles.courseCardRow }>
                        <View style={ styles.typeBox }>
                            <Text style={[ styles.typeText, { color: '#121619' }]}>PAR</Text>
                        </View>
                        <View style={ styles.centerRow }>
                            { Array.from({ length: 9 }, (_, index: number) => {
                                if (minimapList && minimapList.length > 0) {
                                    return (
                                        <View key={ index }>
                                            { type === 0 ? 
                                                <Text style={ styles.holeText }>{ minimapList[index].par }</Text>
                                                :
                                                <Text style={ styles.holeText }>{ minimapList[index + 9].par }</Text>
                                            }
                                        </View>     
                                    )  
                                }
                            })}
                        </View>                            
                    </View>
                </View>

                <Pressable style={ styles.button } onPress={ () => navigation.goBack() }>
                    <Text style={ styles.btnText }>목록가기</Text>
                </Pressable>            
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    thumbnailContainer: {
        justifyContent: 'center',
        alignItems: 'center',

        height: Dimensions.get('window').width,
    },
    thumbnail: {
        width: '100%',
        height: '100%'
    },
    container: {
        marginHorizontal: 15,
        paddingVertical: 30
    },
    title: {
        includeFontPadding: false,
        fontSize: 24,
        fontFamily: 'Pretendard-SemiBold',

        marginBottom: 18,

        color: '#121619'
    },
    courseRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        marginBottom: 24
    },
    infoText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#949494'
    },
    courseText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    star: {
        marginRight: 2
    },
    blankContainer: {
        height: 6,

        backgroundColor: '#f2f2f2'
    },
    courseCard: {
        marginTop: 24,
        marginBottom: 42,
        marginHorizontal: 15,

        borderTopWidth: 1,
        borderTopColor: '#fcbc8a',
        borderBottomWidth: 1,
        borderBottomColor: '#bbbbbb'
    },
    courseCardRow: {
        flexDirection: 'row',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderColor: '#eeeeee'
    },
    centerRow: {
        height: (Dimensions.get('window').width - 122) / 9,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#eeeeee'
    },
    typeBox: {
        width: 52,
        height: (Dimensions.get('window').width - 82) / 9,

        justifyContent: 'center',
        alignItems: 'center' 
    },
    typeText: {
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 11,
        fontFamily: 'Pretendard-Regular',

        color: '#666666'
    },
    holeText: {        
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 11,
        fontFamily: 'Pretendard-SemiBold',

        width: (Dimensions.get('window').width - 82) / 9,

        color: '#121619'
    },
    button: {
        alignItems: 'center',

        marginBottom: 60,
        marginHorizontal: 15,

        borderColor: '#fd780f',
        borderWidth: 1,
        borderRadius: 3
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 13,

        color: '#fd780f'
    },
    distanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    distanceBox: {
        width: (Dimensions.get('window').width - 58) / 3,

        padding: 15,
        marginBottom: 48,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#eeeeee'
    },
    circle: {
        width: 8,
        height: 8,

        marginRight: 3,

        borderRadius: 50
    },
    distanceText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    mapContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    minimap: {
        width: '100%',
        height: '100%',
    },
    arrow: {
        position: 'absolute',

        zIndex: 1
    },
    holeInfoText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        color: '#ffffff'
    },
    holeInfoBlank: {
        width: 1,
        height: 21,

        marginHorizontal: 9,

        backgroundColor: '#ffffff'
    },
    mapInfo: {
        flexDirection: 'row',
        alignItems: 'center',

        position: 'absolute',
        top: 26,

        zIndex: 1
    }
})

export default CourseDetail