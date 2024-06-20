import { BackHandler, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

// svg
import Close from "../../assets/imgs/common/x_black.svg"
import { useReservationActions } from "../../hooks/useReservationActions"
import { useCallback, useEffect, useRef, useState } from "react"
import { useIsOpen, useReservationInfo } from "../../hooks/useReservation"
import { useFocusEffect } from "@react-navigation/native"

interface Select {
    date: number,
    hour: number,
    minute: number,
    people: number
}

const ChangeReservation = (): JSX.Element => {
    const { saveIsOpen, saveReservationSetting } = useReservationActions()
    const isOpen = useIsOpen()

    const now = new Date()
    
    const day = ['일', '월', '화', '수', '목', '금', '토']

    const initialIndex: Select = {
        date: 0,
        hour: now.getHours() + 1,
        minute: 0,
        people: 0
    }

    const [selectedIndex, setSelectedIndex] = useState<Select>(initialIndex)

    useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				saveIsOpen(false)

                return true
			}

			BackHandler.addEventListener('hardwareBackPress', onBackPress)

			return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress)
		}, [])
	)
    
    const changeReservationInfo = () => {
        const year = now.getFullYear()
        const month = now.getMonth()
        const minute = selectedIndex.minute * 10
        const hour = selectedIndex.hour
        const date = now.getDate() + selectedIndex.date

        const updatedDate = new Date(year, month, date, hour, minute).toString()
        saveReservationSetting({
            date: updatedDate,
            people: selectedIndex.people
        })
        saveIsOpen(false)
    }

    const cancelChange = () => {
        setSelectedIndex(initialIndex)

        saveIsOpen(false)
    }

    const getNewDate = (index: number) => {
        const date = new Date(now)
        date.setDate(now.getDate() + index)
        return date.getDate()
    }

    return (
        <View style={ styles.wrapper }>
            { isOpen &&
                <View style={ styles.container }>
                    <View style={[ styles.rowContainer, { marginBottom: 30 }]}>
                        <Text style={ styles.title }>예약일시 및 인원</Text>
                        <Pressable onPress={ () => cancelChange() }>
                            <Close/>
                        </Pressable>
                    </View>

                    <Text style={ styles.subTitle }>예약 일자</Text>
                    <ScrollView style={ styles.dateContainer } horizontal showsHorizontalScrollIndicator={ false }>
                        { day.map((item: string, index: number) => 
                            <Pressable style={[ styles.box, selectedIndex.date === index && { borderWidth: 0, backgroundColor: '#fd780f' }]} key={ index } onPress={() => setSelectedIndex({ ...selectedIndex, date: index, hour: 0 })}>
                                <Text style={[ styles.text, { marginBottom: 6 }, selectedIndex.date === index && { color: '#ffffff' }]}>{ getNewDate(index) }</Text>
                                { now.getDay() + index < 7 ? (
                                    <>
                                        { index === 0 ? 
                                            <Text style={[ styles.dayText, selectedIndex.date === index && { color: '#ffffff' }]}>오늘</Text>
                                            :
                                            <Text style={[ styles.dayText, selectedIndex.date === index && { color: '#ffffff' }]}>{ day[now.getDay() + index] }</Text>
                                        }
                                    </>
                                ) : (
                                    <Text style={[ styles.dayText, selectedIndex.date === index && { color: '#ffffff' }]}>{ day[now.getDay() + index - 7] }</Text>
                                )}
                            </Pressable>
                        )}
                    </ScrollView>

                    <Text style={ styles.subTitle }>시작 시간</Text>
                    <ScrollView style={ styles.timeContainer } horizontal showsHorizontalScrollIndicator={ false }>
                        { Array.from({ length: 24 }, (_, i) => i).map((index: number) => {
                            return (
                                <View key={ index }>
                                    { 0 === selectedIndex.date ? 
                                        (
                                            <>
                                                { index > now.getHours() &&
                                                    <Pressable style={[ styles.timeBox, selectedIndex.hour === index && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={() => setSelectedIndex({ ...selectedIndex, hour: index })}>
                                                    { index < 9 ?
                                                        <Text style={[ styles.text, selectedIndex.hour === index && { color: '#ffffff' }]}>0{ index }시</Text>
                                                            :
                                                        <Text style={[ styles.text, selectedIndex.hour === index && { color: '#ffffff' }]}>{ index }시</Text>
                                                    }
                                                    </Pressable>
                                                }
                                            </>
                                        ) : (
                                            <Pressable style={[ styles.timeBox, selectedIndex.hour === index && { borderWidth: 0, backgroundColor: '#fd780f' }]} onPress={() => setSelectedIndex({ ...selectedIndex, hour: index })}>
                                                { index < 9 ?
                                                    <Text style={[ styles.text, selectedIndex.hour === index && { color: '#ffffff' }]}>0{ index }시</Text>
                                                        :
                                                    <Text style={[ styles.text, selectedIndex.hour === index && { color: '#ffffff' }]}>{ index }시</Text>
                                                }
                                            </Pressable>

                                        )
                                    }
                                </View>
                            )
                        })}
                    </ScrollView>

                    <ScrollView style={ styles.dateContainer } horizontal showsHorizontalScrollIndicator={ false }>
                        { ['00', '10', '20', '30', '40', '50'].map((item: string, index: number) => 
                            <Pressable style={[ styles.timeBox, selectedIndex.minute === index && { borderWidth: 0, backgroundColor: '#fd780f' }]} key={ index } onPress={() => setSelectedIndex({ ...selectedIndex, minute: index })}>
                                <Text style={[ styles.text, selectedIndex.minute === index && { color: '#ffffff' }]}>{ item }분</Text>
                            </Pressable>
                        )}
                    </ScrollView>


                    <ScrollView style={{ flexDirection: 'row' }} horizontal showsHorizontalScrollIndicator={ false }>
                        { Array.from({ length: 6 }, (_, i) => i).map((index: number) => 
                            <Pressable style={[ styles.box, { height: 52 }, selectedIndex.people === index && { borderWidth: 0, backgroundColor: '#fd780f' }]} key={ index } onPress={() => setSelectedIndex({ ...selectedIndex, people: index })}>
                                <Text style={[ styles.text, selectedIndex.people === index && { color: '#ffffff' }]}>{ index + 1 }명</Text>
                            </Pressable>
                        )}
                    </ScrollView>

                    <View style={ styles.btnContainer }>
                        <Pressable style={ styles.button } onPress={ () => cancelChange() }>
                            <Text style={ styles.btnText }>취소</Text>
                        </Pressable>
                        <Pressable style={[ styles.button, { borderWidth: 0, backgroundColor: '#fd780f'} ]} onPress={ () => changeReservationInfo() }>
                            <Text style={[ styles.btnText, { color: '#ffffff'} ]}>변경</Text>
                        </Pressable>
                    </View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,

        backgroundColor: '#ffffff'
    },
    container: {
        width: Dimensions.get('window').width - 30,

        marginTop: 24,
        marginHorizontal: 15
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-SemiBold',

        marginLeft: 18,

        color: '#121619'
    },
    subTitle: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 15,

        color: '#949494'
    },
    dateContainer: {
        flexDirection: 'row',

        paddingBottom: 24,
        marginBottom: 24,

        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2'
    },
    timeContainer: {
        flexDirection: 'row',

        marginBottom: 8
    },
    timeBox: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 52,
        height: 45,

        marginRight: 6,

        borderRadius: 3,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    box: {
        alignItems: 'center',
        justifyContent: 'center',

        width: 52,
        height: 64,

        marginRight: 6,

        borderRadius: 26,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    text: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    dayText: {
        includeFontPadding: false,
        fontSize: 13,
        fontFamily: 'Pretendard-Regular',

        color: '#121619'
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

        marginVertical: 36
    },
    button: {
        width: (Dimensions.get('window').width - 36) / 2,
        alignItems: 'center',

        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    btnText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-Bold',

        paddingVertical: 16,

        color: '#121619'
    }
})

export default ChangeReservation