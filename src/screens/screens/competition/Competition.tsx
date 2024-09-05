import { useEffect, useRef, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RootStackNavigationProp } from "../../../types/stackTypes"

import Loading from "../../../components/Loading"
import TopTabBar from "../../../components/tabBar/TopTabBar"
import Header from "../../../components/Header"
import Eraser from "../../../assets/imgs/login/eraser.svg"
import Search from "../../../assets/imgs/common/icon_search.svg"
import FilledStar from "../../../assets/imgs/store/star_fill.svg"
import EmptyStar from "../../../assets/imgs/store/star_empty_gray.svg"
import { useCompetition } from "../../../hooks/useCompetition"
import { CompetitionListResult, Payload } from "../../../types/apiTypes"
import { useShopList } from "../../../hooks/useReservation"


const Competition = (): JSX.Element => {
    const navigation = useNavigation<RootStackNavigationProp>()
    const { getCompetitionList } = useCompetition()
    const shopList = useShopList()

    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [type, setType] = useState<number>(0)
    const [text, setText] = useState<string>('')
    const [searchText, setSearchText] = useState<string>('')
    const [sortType, setSortType] = useState<number>(0)
    const [sortedList, setSortedList] = useState<CompetitionListResult[]>([])
    const [searchedList, setSearchedList] = useState<CompetitionListResult[]>([])
    const [pageIndex, setPageIndex] = useState<number>(0)
    
	const searchRef = useRef<TextInput>(null)

    useEffect(() => {
        getList()
    }, [type, sortType])


    useEffect(() => {
        onPressSearch()
    }, [sortedList])

    const getList = async () => {
        if (isConnected) return

        setIsConnected(true)
        const payload: Payload = await getCompetitionList(type, sortType, 20, pageIndex)
        setIsConnected(false)
        if (payload.code !== 1000) return
        if (payload.compList) {
            setSortedList(payload.compList)
        }
    }

    // change top menu
    const handleTypeChange = (newType: number) => {
        setType(newType)
    }

    const clearTextInput = () => {
        if (searchRef.current) {
            searchRef.current.setNativeProps({ text: '' })
            setSearchText('')
            setSearchedList(sortedList)
        }
    }

    const onPressSearch = () => {
        if (searchText !== '') {
            const searchIndex: number[] = []

            sortedList.forEach((item, index) => {
                if ((item.compName && item.compName.toLowerCase().includes(searchText.toLowerCase()))) {
                    searchIndex.push(index)
                }
            })

            const result: CompetitionListResult[] = []

            if (searchIndex.length > 0) {
                for (let i = 0; i < searchIndex.length; i++) {
                    result[i] = sortedList[searchIndex[i]]
                }
            }
            
            setSearchedList(result)
            return
        }
        setSearchedList(sortedList)
    }

    const cutString = (val: string, length: number): string => {
        if (!val) return ''

        if (val.length > length) return val.substring(0, length) + ".."
        return val
    }

    const CompetitionList = (): JSX.Element => {
        if (!searchedList) return (<></>)

        return (
            <>
                <View style={ styles.filterContainer }>
                    <View style={ styles.rowContainer }>
                        <View style={[ styles.rowContainer, { flex: 1 }]}>
                            { type === 0 ? <Text style={ styles.regularText }>대회</Text> : <Text style={ styles.regularText }>참가한 대회</Text> }
                            
                            <Text style={[ styles.regularText, { color: '#fd780f' }]}> { searchedList.length ?? 0 }</Text>
                            <Text style={ styles.regularText }>개</Text>
                        </View>
                        <View style={ styles.rowContainer }> 
                            <Pressable style={{ paddingHorizontal: 6 }} onPress={ () => setSortType(0) }>
                                <Text  style={[ styles.regularText, sortType === 0 && { fontFamily: 'Pretendard-SemiBold', color: '#666666' }]}>최신순</Text>
                            </Pressable>
                            <View style={ styles.bar }>
                                <Text>l</Text>
                            </View>
                            <Pressable style={{ paddingHorizontal: 6 }} onPress={ () => setSortType(1) }>
                                <Text style={[ styles.regularText, sortType === 1 && { fontFamily: 'Pretendard-SemiBold', color: '#666666' }]}>마감임박순</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                { searchedList && searchedList.map((item: CompetitionListResult, index: number) => {
                    let compStatus = 0 // 0 : playing, 1 : before open, 2 : end
                    let isFavorite = false

                    const now = new Date()
                    const stDate = new Date(item.stDate)
                    const edDate = new Date(item.edDate)
                    edDate.setHours(23)
                    edDate.setMinutes(59)
        
                    if (now < stDate) {
                        compStatus = 1
                    } else if (now > edDate) {
                        compStatus = 2
                    }

                    if (item.shopName && shopList) {
                        for (let i = 0; i < shopList.length; i++) {
                            if (shopList[i].id === item.shopId) {
                                isFavorite = shopList[i].favorite === 'F' ? true : false
                            }
                        }
                    }

                    const getCompType = () => {
                        switch (item.compType) {
                            case 'H':
                                return '본사'                 
                            case 'S':
                                return '매장'
                            case 'U':
                                return '유저'
                            case 'E':
                                return '기타'                           
                        }
                    }

                    // format date
                    const getTimeRemaining = () => {
                        if (compStatus === 2) return
                        const nowYear = now.getFullYear()
                        const nowMonth = now.getMonth()
                        const nowDay = now.getDate()
                        const nowHour = now.getHours()
                        const nowMin = now.getMinutes()

                        if(compStatus === 0) { 
                            const date = new Date(edDate)
                            const year = date.getFullYear() 
                            const month = date.getMonth()
                            const day = date.getDate()

                            if (year === nowYear) {
                                if (month === nowMonth) {
                                    if (day === nowDay) {
                                        // if (hour === nowHour) {
                                        //     if (min === nowMin) {
                                        //         return '곧 시작'
                                        //     }
                                        //     return nowMin - min + '분 남음'
                                        // }
                                        // return hour - nowHour + '시간 남음'
                                        return '오늘 종료'
                                    }
                                    return day - nowDay + '일 남음'
                                }
                                
                                return month - nowMonth + '달 남음'
                            }

                        } else if(compStatus === 1) {
                            const date = new Date(stDate)
                            const year = date.getFullYear() 
                            const month = date.getMonth()
                            const day = date.getDate()
                            const hour = date.getHours()
                            const min = date.getMinutes()

                            if (year === nowYear) {
                                if (month === nowMonth) {
                                    if (day === nowDay) {
                                        if (hour === nowHour) {
                                            if (min === nowMin) {
                                                return '곧 시작'
                                            }
                                            return nowMin - min + '분 전'
                                        }
                                        return nowHour - hour + '시간 전'
                                    }
                                    return nowDay - day + '일 전'
                                }
                                
                                return nowMonth - month + '달 전'
                            }
                        }
                    } 

                    const formatDate = () => {
                        const day = ['일', '월', '화', '수', '목', '금', '토']
                        const stMonth = (stDate.getMonth() + 1) < 10 ? '0' + (stDate.getMonth() + 1) : (stDate.getMonth() + 1)
                        const edMonth = (edDate.getMonth() + 1) < 10 ? '0' + (edDate.getMonth() + 1) : (edDate.getMonth() + 1)
                        const stDay = (stDate.getDate()) < 10 ? '0' + (stDate.getDate()) : (stDate.getDate())
                        const edDay = (edDate.getDate()) < 10 ? '0' + (edDate.getDate()) : (edDate.getDate())

                        return stDate.getFullYear().toString().slice(2, 4) + `.${stMonth}.${stDay}(${day[stDate.getDay()]}) ~`  +
                                `${edDate.getFullYear().toString().slice(2, 4)}.${edMonth}.${edDay}(${day[edDate.getDay()]})`
                    }

                    return (
                        <Pressable style={ styles.infoContainer } key={ index } onPress={ () => navigation.navigate('CompetitionDetail', { id: item.compId, before: 'competition' })}>
                            <View style={ styles.rowContainer }>
                                <View style={[ styles.rowContainer, { flex: 1 }]}>
                                    { compStatus === 0 &&
                                        <View style={ styles.status }>
                                            <Text style={ styles.semiBoldText }>진행중</Text>
                                        </View>
                                    }
                                    { compStatus === 1 &&
                                        <View style={[ styles.status, { backgroundColor: '#e9ffe9'} ]}>
                                            <Text style={[ styles.semiBoldText, { color: '#007a4e' }]}>진행예정</Text>
                                        </View>
                                    }
                                    { compStatus === 2 && 
                                        <View style={[ styles.status, { backgroundColor: '#f0f0f0'} ]}>
                                            <Text style={[ styles.semiBoldText, { color: '#333333' }]}>종료됨</Text>
                                        </View>
                                    }
                                    
                                    <Text style={[ styles.regularText, compStatus === 0 ? { color: '#e20500' } : { color: '#009746' }]}>{ getTimeRemaining() }</Text>
                                </View>
                                <Text style={ styles.extraLightText }>{ getCompType() }대회</Text>
                            </View>
                            <Text style={ styles.boldText }>{ item.compName }</Text>
                            <Text style={[ styles.regularText, { color: '#949494' }]}>{ formatDate() }</Text>
                            { item.shopName &&
                                <View style={[ styles.rowContainer, { marginTop: 15 }]}>
                                    { isFavorite ? <FilledStar width={18} height={18} style={{ marginRight: 5 }} />
                                        :  <EmptyStar width={18} height={18} style={{ marginRight: 5 }} />
                                    }
                                    <Text style={[ styles.regularText, { fontSize: 16, color: '#666666'}]}>{ item.shopName }</Text>
                                </View>
                            }
                            
                        </Pressable>
                    )
                })}
            </>
        )
    }

    return (
        <>
            <Header title='대회' type={ 0 } isFocused  />
            <View style={ styles.wrapper }>
                { isConnected && <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}><Loading /></View>  }
                <TopTabBar type={ type } typeChange={ handleTypeChange } tab1='대회 목록' tab2='참가한 대회' />

                <ScrollView style={ styles.container } showsVerticalScrollIndicator={ false }>
                    { type === 0 ? (
                        <View style={{ paddingBottom: 50 }}>
                            <View style={ styles.inputContainer }>
                                <Search style={ styles.searchIcon } />
                                <TextInput style={ styles.input } 
                                    placeholder="원하는 대회를 찾아보세요" placeholderTextColor="#cccccc" ref={ searchRef } returnKeyType="search" autoCapitalize='none'
                                    onChangeText={(text: string): void => setSearchText(text)} onSubmitEditing={ onPressSearch }/>
                                { searchText !== '' && <Eraser style={ styles.eraser } onPress={ clearTextInput } /> }
                            </View>
                    

                            { searchedList && searchedList.length === 0 ? (
                                <View style={{ marginTop: 200, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style= { styles.regularText }>진행중인 대회가 없습니다.</Text>
                                </View>
                            ) : (
                                <View style={{ marginTop: 20 }}>
                                    <CompetitionList />
                                </View>
                            )}
                        </View>
                        ) : (
                        <>
                            { searchedList && searchedList.length === 0 ? (
                                <View style={{ marginTop: 200, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style= {[ styles.regularText, { marginBottom: 5 }]}>아직 참가한 대회가 없습니다.</Text>
                                    <Text style= { styles.regularText }>도전하고 우승을 노려보세요!</Text>
                                </View>
                            ) : (
                                <View style={{ marginTop: 20 }}>
                                    <CompetitionList />
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        marginVertical: 18,

        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 5,

        backgroundColor: '#ffffff'
    },
    input: {
        flex: 1,

        paddingHorizontal: 10,
        paddingVertical: 13,
        marginRight: 15,

        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619',
	},
    eraser: {
        position: 'absolute',
        right: 17,
        top: 13,
    },
    searchIcon: {
        marginLeft: 15
    },
    container: {
        marginHorizontal : 15,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterContainer: {
        paddingBottom: 11,
        
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        marginVertical: 10,

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        color: '#fd780f'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        color: '#999999'
    },
    extraLightText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-ExtraLight',

        color: '#fd780f'
    },
    bar: {
        width: 1,
        height: '100%',

        backgroundColor: '#cccccc'
    },
    infoContainer: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },
    status: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        marginRight: 16,

        borderRadius: 3,

        backgroundColor: '#fff3e9'
    }
})

export default Competition