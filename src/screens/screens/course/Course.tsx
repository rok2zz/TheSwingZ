import { useEffect, useRef, useState } from "react"
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"
import { CourseInfo, courseList } from "./courseInfo"
import { ImageSource } from "react-native-vector-icons/Icon"
import { Payload } from "../../../types/apiTypes"
import { useCourse, useCourseThumbnail } from "../../../hooks/useCourse"
import { CourseThumnail } from "../../../slices/course"
import FastImage from "react-native-fast-image"

// svg
import Eraser from "../../../assets/imgs/login/eraser.svg"
import Search from "../../../assets/imgs/main/search.svg"
import Filter from "../../../assets/imgs/course/filter.svg"
import EmptyStar from "../../../assets/imgs/course/star_empty.svg"
import FilledStar from "../../../assets/imgs/course/star_fill.svg"
import HalfStar from "../../../assets/imgs/course/star_half.svg"
import Loading from "../../../components/Loading"
import Logo from "../../../assets/imgs/course/logo.svg"



const Course = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()

    const { getCourseThumbnail } = useCourse()
    const courseThumbnail: CourseThumnail[] = useCourseThumbnail()

    const [sort, setSort] = useState<boolean>(true)
    const [locationSort, setLocationSort] = useState<boolean>(false)
    const [easySort, setEasySort] = useState<boolean>(false)
    const [difficultsort, setDifficultSort] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')
    const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false)
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const [sortedCourse, setSortedCourse] = useState<CourseInfo[]>(courseList)
    const [searchedCourse, setSearchedCourse] = useState<CourseInfo[]>([])
    const [thumbnail, setThumbnail] = useState<ImageSource>(require('../../../assets/imgs/course/course_detail.png'))

	const searchRef = useRef<TextInput>(null)

    useEffect(() => {
        setSearchedCourse(sortedCourse.sort((a, b) => a.ccName.localeCompare(b.ccName)))
        getCourse()
    }, [])

    const getCourse = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getCourseThumbnail()
        setIsConnected(false)
        if (payload.code !== 1000) {
            return
        }

        setIsLoaded(true)
    }

    const sorting = () => {
        setSortedCourse(sortedCourse.sort((a, b) => {
            if (sort) {
                return a.id - b.id
            }        
            return 0
        }).sort((a, b) => {
            if (!sort) {
                return a.ccName.localeCompare(b.ccName)
            }
            return 0
        }).sort((a, b) => {
            if (locationSort) {
                const locations = ['서울', '경기도']
            
                const aIndex = locations.indexOf(a.location)
                const bIndex = locations.indexOf(b.location)
                
                return bIndex - aIndex
            }
            return 0
        }).sort((a, b) => {
            if (easySort) {
                return a.courseDifficulty + a.greenDifficulty - b.courseDifficulty - b.greenDifficulty
            }
            return 0
        }).sort((a, b) => {
            if (difficultsort) {
                return b.courseDifficulty + b.greenDifficulty - a.courseDifficulty - a.greenDifficulty
            }
            return 0
        }))
        onPressSearch()
    }

    const locationSorting = () => {
        setSortedCourse(sortedCourse.sort((a, b) => {
            if (locationSort) {
                return a.id - b.id
            }        
            return 0
        }).sort((a, b) => {
            if (sort) {
                return a.ccName.localeCompare(b.ccName)
            }
            return 0
        }).sort((a, b) => {
            if (!locationSort) {
                const locations = ['서울', '경기도']
            
                const aIndex = locations.indexOf(a.location)
                const bIndex = locations.indexOf(b.location)
            
                return bIndex - aIndex
            }
            return 0
        }).sort((a, b) => {
            if (easySort) {
                return a.courseDifficulty + a.greenDifficulty - b.courseDifficulty - b.greenDifficulty
            }
            return 0
        }).sort((a, b) => {
            if (difficultsort) {
                return b.courseDifficulty + b.greenDifficulty - a.courseDifficulty - a.greenDifficulty
            }
            return 0
        }))
        onPressSearch()
    }

    const easySorting = () => {
        setSortedCourse(sortedCourse.sort((a, b) => {
            if (easySort) {
                return a.id - b.id
            }        
            return 0
        }).sort((a, b) => {
            if (sort) {
                return a.ccName.localeCompare(b.ccName)
            }
            return 0
        }).sort((a, b) => {
            if (locationSort) {
                const locations = ['서울', '경기도']
            
                const aIndex = locations.indexOf(a.location)
                const bIndex = locations.indexOf(b.location)
            
                return bIndex - aIndex
            }
            return 0
        }).sort((a, b) => {
            if (!easySort) {
                return a.courseDifficulty + a.greenDifficulty - b.courseDifficulty - b.greenDifficulty
            }
            return 0
        }))
        onPressSearch()
    }

    const difficultsorting = () => {
        setSortedCourse(sortedCourse.sort((a, b) => {
            if (!sort && !locationSort && !easySort && difficultsort) {
                return a.id - b.id
            }        
            return 0
        }).sort((a, b) => {
            if (sort) {
                return a.ccName.localeCompare(b.ccName)
            }
            return 0
        }).sort((a, b) => {
            if (locationSort) {
                const locations = ['서울', '경기도']
            
                const aIndex = locations.indexOf(a.location)
                const bIndex = locations.indexOf(b.location)
            
                return bIndex - aIndex
            }
            return 0
        }).sort((a, b) => {
            if (!difficultsort) {
                return b.courseDifficulty + b.greenDifficulty - a.courseDifficulty - a.greenDifficulty
            }
            return 0
        }))
        onPressSearch()
    }

    const onPressSearch = () => {
        if (searchText !== '') {
            setSearchedCourse(sortedCourse.filter((course) =>
                course.ccName.toLowerCase().includes(searchText.toLowerCase()) || course.location.toLowerCase().includes(searchText.toLowerCase())
            ))
            return
        }
        setSearchedCourse(sortedCourse)
    }

    const clearTextInput = () => {
        if (searchRef.current) {
            searchRef.current.setNativeProps({ text: '' })
            setSearchText('')
            setSearchedCourse(sortedCourse)
        }
    }

    const cutString = (val: string): string => {
        if (val.length > 18) return val.substring(0, 18) + ".."
        return val
    }

    return (
        <>
            { !isLoaded && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View> }
            <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={ styles.imgContainer }>
                <Image style={ styles.img } source={ require('../../../assets/imgs/course/course_main.png')} resizeMode="cover" />
                <View style={ styles.mask }></View>

                <View style={ styles.courseSub }>
                    <Text style={ styles.courseMainText }>더스윙제트의 다양한 코스에서</Text>
                    <Text style={ styles.courseMainText }>즐거운 라운딩 하세요</Text>
                </View>
            </View>

            <View style={ styles.container }>
                {/* <Text style={[ styles.title, { fontSize: 20 }]}>인기코스</Text>
                <ScrollView style={ styles.rowScroll } horizontal={ true } showsHorizontalScrollIndicator={ false }>

                </ScrollView>
                <Text style={[ styles.title, { fontSize: 20 }]}>신규코스</Text>
                <ScrollView style={ styles.rowScroll } horizontal={ true } showsHorizontalScrollIndicator={ false }>
                    
                </ScrollView> */}
                <Text style={[ styles.title, { fontSize: 20 }]}>코스 목록</Text>
                <View style={ styles.searchContainer }>
                    <View style={ styles.rowContainer }>
                        <TextInput style={[ styles.input, { marginBottom: 20 }, isSearchFocused ? { borderBottomColor: '#cccccc'} : { borderBottomColor: '#cccccc'}]} 
                            placeholder="코스명을 검색해 보세요." placeholderTextColor="#aaaaaa" ref={ searchRef } returnKeyType="next" autoCapitalize='none' onFocus={ () => setIsSearchFocused(true) } onBlur={ () => setIsSearchFocused(false) }
                            onChangeText={(text: string): void => setSearchText(text)} onSubmitEditing={ onPressSearch }/>
                        { searchText !== '' && <Eraser style={ styles.eraser } onPress={ clearTextInput } /> }
                        <Search style={ styles.searchIcon } onPress={ onPressSearch } />
                    </View>

                    <View style={ styles.rowContainer }>
                        <Filter style={{ marginRight: 12 }} />
                        <Pressable style={[ styles.filter, sort && { backgroundColor: '#121619' }]} onPress={ () => { 
                            setSort(prev => !prev) 
                            sorting()
                        }}>
                            <Text style={ sort ? styles.selectedText : styles.filterText }>가나다순</Text>
                        </Pressable>
                        <Pressable style={[ styles.filter, locationSort && {  backgroundColor: '#121619' }]}  onPress={ () => {
                            setLocationSort(prev => !prev)
                            locationSorting()
                        }}>
                            <Text style={ locationSort ? styles.selectedText : styles.filterText }>지역</Text>
                        </Pressable>
                        <Pressable style={[ styles.filter, easySort && {  backgroundColor: '#121619' }]} onPress={ () => {
                            setEasySort(prev => !prev)
                            if (!easySort) {
                                setDifficultSort(easySort)
                            }
                            easySorting()
                        }}>
                            <Text style={ easySort ? styles.selectedText : styles.filterText }>쉬운</Text>
                        </Pressable>
                        <Pressable style={[ styles.filter, difficultsort && {  backgroundColor: '#121619' }]} onPress={ () => {
                            setDifficultSort(prev => !prev)
                            if (!difficultsort) {
                                setEasySort(difficultsort)
                            }
                            difficultsorting()
                        }}>
                            <Text style={ difficultsort ? styles.selectedText : styles.filterText }>어려운</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={[ styles.rowContainer, { marginBottom: 18 }]}>
                    <Text style={ styles.regular16 }>전체 코스</Text>
                    <Text style={[ styles.title, { fontSize: 16 }]}> { searchedCourse.length }</Text>
                </View>
                
                { searchedCourse.map((item: CourseInfo, index: number) => {
                    let thumbnail = ''
                    for (let i = 0; i < courseThumbnail.length; i++) {
                        if ((courseThumbnail[i].name.includes(item.cc))) {
                            thumbnail = courseThumbnail[i].url
                        }
                    }
                    return (
                        <Pressable style={[ styles.courseContainer, index === 0 && { paddingTop: 0, borderTopWidth: 0 }]} key={ index } onPress={ () => navigation.push('CourseDetail', { course: item, thumbnail: thumbnail })}>
                            <View style={ styles.courseImgContainer }>
                                <View style={[ styles.courseImg, { alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0 }]} >
                                    <Logo />
                                </View>

                                { thumbnail !== '' &&
                                    <FastImage 
                                        style={ styles.courseImg }                   
                                        source={{ 
                                            uri: thumbnail,
                                            priority: FastImage.priority.normal,
                                            cache: FastImage.cacheControl.immutable 
                                        }} 
                                        resizeMode="cover"
                                    />
                                }
                                    
                            </View>

                            <View>
                                <Text style={ styles.courseTitle }>{ cutString(item.ccName) }</Text>

                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ marginRight: 30 }}>
                                        <Text style={ styles.courseText }>코스정보</Text>
                                        <Text style={ styles.courseText }>지역</Text>
                                        <Text style={ styles.courseText }>코스난이도</Text>
                                        <Text style={[ styles.courseText, { marginBottom: 0 }]}>그린난이도</Text>
                                    </View>

                                    <View>
                                        <Text style={ styles.courseText }>{ item.hole }홀, { item.course1 }, { item.course2 }</Text>
                                        <Text style={ styles.courseText }>{ item.location }</Text>
                                        <View style={[ styles.courseRow, { marginBottom: 14 }]}>
                                            { Array.from({ length: Number(item.courseDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                                if (Math.floor(item.courseDifficulty) === index) {
                                                    return <HalfStar key={ index } />
                                                }
                                                return (                                         
                                                    <FilledStar style={ styles.star } key={ index } />
                                                )
                                            })}                          
                                            { Array.from({ length: 5 - Number(item.courseDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                                return (                                         
                                                    <EmptyStar style={ styles.star } key={ index } />
                                                )
                                            })}           
                                        </View>
                                        <View style={ styles.courseRow }>
                                            { Array.from({ length: Number(item.greenDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                                if (Math.floor(item.greenDifficulty) === index) {
                                                    return <HalfStar key={ index } />
                                                }
                                                return (                                         
                                                    <FilledStar style={ styles.star } key={ index } />
                                                )
                                            })}                       
                                            { Array.from({ length: 5 - Number(item.greenDifficulty.toFixed(0)) }, (_, i) => i).map((index: number) => {
                                                return (                                         
                                                    <EmptyStar style={ styles.star } key={ index } />
                                                )
                                            })}      
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    )
                })} 
            </View>
        </ScrollView>
        </>
        
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: Dimensions.get('window').width,
        height: 156,

        marginBottom: 30
    },
    img: {
        width: '100%',
        height: '100%'
    },
    mask: {
        width: '100%',
        height: 156,

        position: 'absolute',
        top: 0,

        opacity: 0.4,

        backgroundColor: '#121619'
    },
    courseSub: {
        alignItems: 'center',

        position: 'absolute',
        top: 36
    },
    courseMainText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-Bold',

        color: '#ffffff'
    },
    container: {
        marginHorizontal: 15
    },
    title: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    rowScroll: {
        marginTop: 18,
        marginBottom: 48
    },
    searchContainer: {
        marginTop: 18,
        marginBottom: 30,
        paddingHorizontal: 15,
        paddingVertical: 18,

        backgroundColor: '#f3f3f3'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        height: 45,

        paddingHorizontal: 10,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        borderBottomWidth: 1,

        color: '#121619'
	},
    eraser: {
        position: 'absolute',
        right: 57,
        top: 13,
    },
    searchIcon: {
        position: 'absolute',
        right: 15,
        top: 13,
    },
    filter: {
        marginRight: 6,

        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#949494',
        
        backgroundColor: '#ffffff'
    },
    filterText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',
        
        paddingHorizontal: 12,
        paddingVertical: 10,

        color: '#666666'
    },
    selectedText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Bold',
        
        paddingHorizontal: 12,
        paddingVertical: 10,

        color: '#ffffff'
    },
    regular16: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    courseContainer: {
        flexDirection: 'row',

        paddingVertical: 24,

        borderTopWidth: 1,
        borderColor: '#eeeeee'
    },
    courseImgContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 102,
        height: 138,

        marginRight: 18,
        borderRadius: 3,

        backgroundColor: '#f3f3f3'
    },
    courseImg: {
        width: '100%',
        height: '100%',

        borderRadius: 3
    },
    courseTitle: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        marginBottom: 15,

        color: '#121619'
    },
    courseText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 12,

        color: '#121619'
    },
    courseRow: {
        flexDirection: 'row',

        marginTop: 2,
    },
    star: {
        marginRight: 2
    }
})

export default Course