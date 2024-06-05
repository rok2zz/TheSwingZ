import { RouteProp } from "@react-navigation/native"
import { useEffect, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { RootStackParamList } from "../../../types/stackTypes"

interface Props {
    route: RouteProp<RootStackParamList, 'TermsOfUse'>
}

const TermsOfUse = ({ route }: Props): JSX.Element => {
    const termsType = route.params?.type ?? 0

    const [type, setType] = useState<number>(0)

    useEffect(() => {
        setType(termsType)
    }, [termsType])

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={[ styles.rowContainer, { marginHorizontal: 15, borderBottomWidth: 0 }]}>
                <Pressable style={[ styles.button, type === 0 ? { borderWidth: 1, borderColor: '#fd780f' } : { backgroundColor: '#f2f2f2' } ]} onPress={ () => setType(0)}>
                    <Text style={[ styles.semiBoldText, { marginBottom: 0 }, type === 0 ? { color: '#fd780f',  } : { color: '#aaaaaa' } ]}>서비스 이용약관</Text>
                </Pressable>
                <Pressable style={[ styles.button, type === 1 ? { borderWidth: 1, borderColor: '#fd780f' } : { backgroundColor: '#f2f2f2' } ]} onPress={ () => setType(1) }>
                    <Text style={[ styles.semiBoldText, { marginBottom: 0 }, type === 1 ? { color: '#fd780f',  } : { color: '#aaaaaa' } ]}>위치정보 이용약관</Text>
                </Pressable>
            </View>

            { type === 0 &&
                <View style={ styles.container }>
                    <View style={{ alignItems: 'center', marginVertical: 24 }}>
                        <Text style={ styles.boldText }>서비스 이용약관</Text>
                    </View>
                    <Text style={ styles.semiBoldText }>제1장 총칙</Text>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제1조 (목적)</Text>
                        <Text style={ styles.regularText }>본 약관은 주식회사 더스윙골프(이하 “회사”라 함)가 제공/운영하는 웹사이트 (이하 “홈페이지”라 함)와 스마트폰 등 이동통신기기를 통해 제공되는 모바일 애플리케이션(이하 “앱”이라 함)을 통해서 제공되는 고객 관련 서비스(이하 “서비스”라 함)를 이용함에 있어 회사 및 회원의 제반 권리, 의무, 관련 절차 등을 규정하는데 그 목적이 있습니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText}>제2조 (용어의 정의)</Text>
                        <Text style={ styles.regularText }>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</Text>   
                        <Text style={ styles.regularText }>1. “홈페이지”란 회원이 온라인을 통해 서비스를 이용할 수 있는 회사의 인터넷 사이트를 말하며, 홈페이지에서 서비스를 원활히 이용하고자 하는 회원은 회사에서 정하는 회원 가입 절차를 거쳐야 합니다.</Text>   
                        <Text style={ styles.regularText }>2. “이용자”란 홈페이지 및 앱에 접속하여 본 약관에 따라 홈페이지 및 앱이 제공하는 서비스를 받거나 회사의 제휴매장에서 회사가 제공하는 서비스를 이용하는 회원, 준회원을 말합니다.</Text>   
                        <Text style={ styles.regularText }>3. “회원”이란 홈페이지와 앱을 통해 본 약관에 정해진 가입 절차에 따라 가입하여 정상적으로 홈페이지와 앱 서비스를 이용할 수 있는 권한 및 회원 계정을 부여받은 고객을 말합니다. </Text>   
                        <Text style={ styles.regularText }>4. “준회원”이란 회사의 제휴매장 고객이며, 회사가 제공하는 서비스를 일부 제한적으로 이용할 수 있는 권한을 부여받은 고객을 말합니다. 준회원이 추후 정해진 가입 절차에 따라 회원이 되면 준회원 상태에서 보유한 정보를 본 약관이 정하는 바에 따라 승계하여 사용할 수 있습니다.</Text>   
                        <Text style={ styles.regularText }>5. "계정"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는 문자와 숫자의 조합 또는 휴대폰번호, 이메일 등 회원을 식별할 수 있는 고유한 식별기준을 의미합니다.</Text>   
                        <Text style={ styles.regularText }>6. “비밀번호”라 함은 회원 계정으로 식별되는 회원의 본인여부를 검증하고 로그인을 하기 위해, 회원 계정과 함께 회원이 설정하여 회사에 등록한 고유한 문자와 숫자의 조합을 말합니다.</Text>   
                        <Text style={ styles.regularText }>7. "제휴매장"이라 함은, 회사가 제공하는 스크린골프 시뮬레이션 제품을 이용하고, 관련 제반 기능을 매장 운영에 활용하거나, 회원이 서비스의 일부를 이용할 수 있도록 하는 스크린골프 매장을 의미합니다.</Text>   
                        <Text style={ styles.regularText }>8. “온라인 몰(Mall)” 이란 (이하 “몰”이라 함) 회사가 재화 또는 용역(이하 “재화 등”이라 함)을 이용자에게 제공하기 위해 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말하며, 아울러 사이버몰을 운영하는 사업자의 의미로도 사용합니다.</Text>   
                        <Text style={ styles.regularText }>9. "유료서비스"라 함은 회사가 유료로 제공하는 각종 온라인디지털콘텐츠(각종 정보콘텐츠, VOD, 아이템 기타 유료콘텐츠를 포함) 및 제반 서비스를 의미합니다.</Text>   
                        <Text style={ styles.regularText }>10. "게시물"이라 함은 회원이 "서비스"를 이용함에 있어 "서비스상"에 게시한 부호ㆍ문자ㆍ음성ㆍ음향ㆍ화상ㆍ동영상 등의 정보 형태의 글, 사진, 동영상 및 각종 파일과 링크 등을 의미합니다.</Text>   
                        <Text style={ styles.regularText }>11. "포인트"라 함은 서비스의 효율적 이용을 위해 회사가 임의로 책정 또는 지급, 조정할 수 있는 재산적 가치가 없는 "서비스" 상의 가상 데이터를 의미합니다.</Text>   
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제3조 (약관의 명시와 설명 및 개정)</Text>
                        <Text style={ styles.regularText }>1. 회사는 약관의 내용과 상호 및 대표자 성명, 영업소 소재지 주소(소비자의 불만을 처리할 수 있는 곳의 주소를 포함), 전화번호, 모사전송번호, 전자우편주소, 사업자등록번호, 통신판매업신고번호, 개인정보관리책임자등을 이용자가 확인할 수 있도록 홈페이지 초기 서비스 화면에 게시합니다. 약관의 내용은 이용자가 연결화면을 통하여 볼 수 있도록 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>2. 회사는 이용자가 약관에 동의하기에 앞서 약관에 정하여져 있는 내용 중 청약철회․배송책임․환불조건 등과 같은 중요한 내용을 이용자가 이해할 수 있도록 별도의 연결화면 또는 팝업화면 등을 제공하여 이용자의 확인을 구하여야 합니다.</Text>
                        <Text style={ styles.regularText }>3. 회사는 「전자상거래 등에서의 소비자보호에 관한 법률」, 「약관의 규제에 관한 법률」, 「전자문서 및 전자거래기본법」, 「전자금융거래법」, 「전자서명법」, 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」, 「방문판매 등에 관한 법률」, 「소비자기본법」 등 관련 법을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>4. 회사가 약관을 변경하는 경우 적용일자, 개정사유를 명시하여 현행약관과 함께 홈페이지에 그 적용일자 7일 이전부터 적용일자 전일까지 약관변경사실을 공지하면, 약관변경의 효력이 발생합니다. 다만 회원에게 불리하게 약관내용을 변경하는 경우에는 최소한 30일 이상의 사전 유예기간을 두고 고지합니다.</Text>
                        <Text style={ styles.regularText }>5. 회사가 약관을 개정할 경우에는 개정 약관 공지 또는 고지 후 개정 약관의 적용에 대한 회원의 동의 여부를 확인합니다. 개정 약관 공지 또는 고지 시 회원이 동의 또는 거부의 의사표시를 하지 않으면 승낙한 것으로 간주하겠다는 내용도 함께 공지 또는 고지한 경우에는 회원이 약관 시행일까지 거부 의사를 표시하지 않는다면 개정 약관에 동의한 것으로 간주할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>6. 회사가 고지의 의무를 이행했음에도 불구하고 회원이 변경된 약관에 대한 정보를 알지 못해 발생하는 피해는 회사에서 책임지지 않습니다</Text>
                        <Text style={ styles.regularText }>7. 이 약관에서 정하지 아니한 사항과 이 약관의 해석에 관하여는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제 등에 관한 법률, 공정거래위원회가 정하는 전자상거래 등에서의 소비자 보호지침 및 관계법령 또는 상관례에 따릅니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제4조 (서비스의 제공 및 변경)</Text>
                        <Text style={ styles.regularText }>1. 회사가 제공하는 서비스의 종류는 다음과 같습니다.</Text>
                        <Text style={ styles.regularText }>가) 제휴매장에서 로그인하여 사용하는 온라인 서비스</Text>
                        <Text style={ styles.regularText }>나) 홈페이지 또는 앱을 통한 제휴매장 스크린골프 기록정보</Text>
                        <Text style={ styles.regularText }>다) 소셜 네트워킹 서비스 (피드, 탐색 등)</Text>
                        <Text style={ styles.regularText }>라) 게시판형 서비스 및 앨범형 서비스 </Text>
                        <Text style={ styles.regularText }>마) 스크린 제휴매장 예약을 위한 부킹 서비스</Text>
                        <Text style={ styles.regularText }>바) 회사가 직접 또는 제휴사와 공동으로 진행하는 이벤트 서비스 등 이용자에게 제공하는 일체의 서비스</Text>
                        <Text style={ styles.regularText }>사) 골프코스 정보, 라운드 공략 정보 등 맞춤형 플랫폼 서비스</Text>
                        <Text style={ styles.regularText }>2. 회사는 제공하기로 이용자와 계약을 체결한 서비스의 내용을 재화등의 품절 또는 기술적 사양의 변경 등의 사유로 변경할 경우에는 그 사유를 이용자에게 통지 가능한 주소로 즉시 통지합니다.</Text>
                        <Text style={ styles.regularText }>3. 전항의 경우 회사는 이로 인하여 이용자가 입은 손해를 배상합니다. 다만, 회사는 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</Text>
                        <Text style={ styles.regularText }>4. 서비스 제공은 회사의 업무상 또는 기술상 특별한 사정이 없는 한 연중무휴, 1일 24시간 운영을 원칙으로 합니다.</Text>
                        <Text style={ styles.regularText }>5. 회사는 시스템 정기점검, 증설, 교체 및 또는 운영상의 상당한 이유가 있는 경우 서비스를 일시적으로 중단할 수 있고, 이 경우 예정된 작업으로 인한 서비스의 일시중단은 홈페이지를 통해 사전에 공지됩니다.</Text>
                        <Text style={ styles.regularText }>6. 회사는 긴급한 시스템 점검, 증설, 교체, 설비장애, 고장, 통신두절, 서비스 이용의 폭주, 국가비상상태, 정전, 천재지변 등 부득이한 사유가 발생한 경우 사전 예고없이 일시적으로 서비스의 전부 또는 일부를 중단할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>7. 회사는 7번조항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자 또는 제3자가 입은 손해에 대하여 배상합니다. 단, 회사가 고의 또는 과실이 없음을 입증하는 경우에는 그러하지 아니합니다.</Text>
                        <Text style={ styles.regularText }>8. 회사는 서비스의 개편 등 서비스 운영상 필요하다고 판단되는 경우 회원에게 사전 고지한 후 서비스의 전부 또는 일부를 제공 중단할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>9. 회사는 회원에게 이메일이나 서신, SMS, 전화 등의 방법을 이용하여 서비스 이용에 필요가 있다고 인정되는 각종 정보를 제공할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>10. 회사가 회원에 대하여 통지하는 경우 회원이 회사에 등록한 이메일이나 휴대전화번호 등으로 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>11. 회사는 불특정 다수의 회원에게 통지를 해야 할 경우 게시판을 통해 7일 이상 게재함으로써 개별통지에 갈음할 수 있습니다. 다만, 회원의 거래와 관련하여 중대한 영향을 미치는 사항에 대하여는 개별 통지를 합니다.</Text>
                        <Text style={ styles.regularText }>12. 회사는 상당한 이유가 있는 경우에 운영상, 기술상의 필요에 따라 제공하고 있는 전부 또는 일부 "서비스"를 변경할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>13. 서비스의 내용, 이용방법, 이용시간에 대하여 변경이 있는 경우에는 변경사유, 변경될 서비스의 내용 및 제공일자 등은 그 변경 전에 해당 서비스 초기화면에 게시하여야 합니다.</Text>
                        <Text style={ styles.regularText }>14. 회사는 무료로 제공되는 서비스의 일부 또는 전부를 회사의 정책 및 운영의 필요상 수정, 중단, 변경할 수 있으며, 이에 대하여 관련법에 특별한 규정이 없는 한 회원에게 별도의 보상을 하지 않습니다.</Text>
                        <Text style={ styles.regularText }>15. 사업종목의 전환, 사업의 포기, 업체 간의 통합 등의 이유로 서비스를 제공할 수 없게 되는 경우에는 회사는 제9조에 정한 방법으로 이용자에게 통지하고 당초 회사에서 제시한 조건에 따라 소비자에게 보상합니다. 다만, 회사는 보상기준 등을 고지하지 아니한 경우에는 이용자들의 마일리지 또는 적립금 등을 회사에서 통용되는 통화가치에 상응하는 현물 또는 현금으로 이용자에게 지급합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제5조 (이용계약 체결)</Text>
                        <Text style={ styles.regularText }>①이용계약은 회원이 되고자 하는 자(이하 "가입신청자")가 약관의 내용에 대하여 동의를 한 다음 회원가입신청을 하고 회사가 이러한 신청에 대하여 승낙함으로써 체결됩니다.</Text>
                        <Text style={ styles.regularText }>②회사는 "가입신청자"의 신청에 대하여 "서비스" 이용을 승낙함을 원칙으로 합니다. 다만, 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나 사후에 이용계약을 해지할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>1. 가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우, 단 회사의 회원 재가입 승낙을 얻은 경우에는 예외로 함.</Text>
                        <Text style={ styles.regularText }>2. 실명이 아니거나 타인의 명의를 이용한 경우</Text>
                        <Text style={ styles.regularText }>3. 허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</Text>
                        <Text style={ styles.regularText }>4. 이용자의 귀책사유로 인하여 승인이 불가능하거나 기타 규정한 제반 사항을 위반, 신청하는 경우</Text>
                        <Text style={ styles.regularText }>5. 부정한 용도 및 개인영리추구를 목적으로 서비스를 이용하고자 하는 경우</Text>
                        <Text style={ styles.regularText }>③제1항에 따른 신청에 있어 회사는 회원의 종류에 따라 전문기관을 통한 실명확인 및 본인인증을 요청할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>④회사는 서비스관련설비의 여유가 없거나, 기술상 또는 업무상 문제가 있는 경우에는 승낙을 유보할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑤이용계약의 성립 시기는 회사가 가입완료를 신청절차 상에서 표시한 시점으로 합니다. </Text>
                        <Text style={ styles.regularText }>⑥회사는 회원에 대해 회사정책에 따라 등급별로 구분하여 이용시간, 이용횟수, 서비스 메뉴 등을 세분하여 이용에 차등을 둘 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑦회사는 회원에 대하여 "영화및비디오물의진흥에관한법률" 및 "청소년보호법"등에 따른 등급 및 연령 준수를 위해 이용제한이나 등급별 제한을 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑧회원은 회원가입 시 등록한 사항에 변경이 있는 경우, 상당한 기간 이내에 회사에 대하여 회원정보 수정 등의 방법으로 그 변경사항을 알려야 합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제6조 (회원정보의 변경)</Text>
                        <Text style={ styles.regularText }>①회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다. 다만, 서비스 관리를 위해 필요한 아이디, 실명 등은 수정이 불가능합니다.</Text>
                        <Text style={ styles.regularText }>②회원은 회원가입신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나 전자우편 기타 방법으로 회사에 대하여 그 변경사항을 알려야 합니다.</Text>
                        <Text style={ styles.regularText }>③제2항의 변경사항을 회사에 알리지 않아 발생한 불이익에 대하여 회사는 책임지지 않습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제7조 (개인정보보호 의무)</Text>
                        <Text style={ styles.regularText }>①회사는 "정보통신망법" 등 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다. 개인정보의 보호 및 사용에 대해서는 관련법 및 회사의 개인정보취급방침이 적용됩니다. 다만, 회사의 공식 사이트 이외의 링크된 사이트에서는 회사의 개인정보취급방침이 적용되지 않습니다.</Text>
                        <Text style={ styles.regularText }>②회사는 서비스 제공과 관련해서 수집된 회원의 신상정보를 본인의 승낙 없이 제3자에게 누설, 배포하지 않습니다. 단, 아래 경우에는 그러하지 않습니다.</Text>
                        <Text style={ styles.regularText }>1. 전기통신기본법 등 법률 규정에 의해 국가기관의 요구가 있는 경우</Text>
                        <Text style={ styles.regularText }>2. 범죄에 대한 수사상의 목적이 있거나 정보통신윤리 위원회의 요청이 있는 경우 또는 기타 관계법령에서 정한 절차에 따른 요청이 있는 경우</Text>
                        <Text style={ styles.regularText }>3. 회사에 가입한 미성년자의 법정대리인이 정보를 요청하여 서류상으로 가족관계가 확인된 경우</Text>
                        <Text style={ styles.regularText }>4. 회원이 회사에 제공한 개인정보를 스스로 공개하거나 공개 승낙을 한 경우(동의서명 경우)</Text>
                        <Text style={ styles.regularText }>5. 회사가 제공하는 정보, 자료 송부를 위하여 관련업체에게 최소한의 회원의 정보를 알려주는 경우</Text>
                        <Text style={ styles.regularText }>6. 회사가 회원의 서비스 이용 편의나 원활한 이용을 위하여 여러 분야의 전문 콘텐츠 사업자 혹은 비즈니스 사업자에게 최소한의 회원정보를 알려주는 경우</Text>
                        <Text style={ styles.regularText }>7. 통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정개인을 식별할 수 없는 형태로 제공하는 경우</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제8조 (회원의 계정 및 비밀번호의 관리에 대한 의무)</Text>
                        <Text style={ styles.regularText }>①회원의 계정과 비밀번호에 관한 관리책임은 회원에게 있으며, 이를 제3자가 이용하도록 하여서는 안 됩니다.</Text>
                        <Text style={ styles.regularText }>②회사는 회원의 계정이 개인정보 유출 우려가 있거나, 반사회적 또는 미풍양속에 어긋나거나 회사 및 회사의 운영자로 오인한 우려가 있는 경우, 해당 계정의 이용을 제한할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>③회원은 계정 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우에는 이를 즉시 회사에 통지하고 회사의 안내에 따라야 합니다.</Text>
                        <Text style={ styles.regularText }>④제3항의 경우에 해당 회원이 회사에 그 사실을 통지하지 않거나, 통지한 경우에도 회사의 안내에 따르지 않아 발생한 불이익에 대하여 회사는 책임지지 않습니다.</Text>
                    </View>
                    
                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제9조 (회원에 대한 통지)</Text>
                        <Text style={ styles.regularText }>①회사가 회원에 대한 통지를 하는 경우 이 약관에 별도 규정이 없는 한 서비스 내 전자우편주소, 휴대전화번호, 등으로 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>②회사는 회원 전체에 대한 통지의 경우 7일 이상 회사의 게시판에 게시함으로써 제1항의 통지에 갈음할 수 있습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제10조 (회사의 의무)</Text>
                        <Text style={ styles.regularText }>①회사는 관련법과 이 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 계속적이고 안정적으로 서비스를 제공하기 위하여 최선을 다하여 노력합니다.</Text>
                        <Text style={ styles.regularText }>②회사는 회원이 안전하게 서비스를 이용할 수 있도록 개인정보(신용정보 포함)보호를 위해 보안시스템을 갖추어야 하며 개인정보취급방침을 공시하고 준수합니다.</Text>
                        <Text style={ styles.regularText }>③회사는 서비스이용과 관련하여 발생하는 이용자의 불만 또는 피해구제요청을 적절하게 처리할 수 있도록 필요한 인력 및 시스템을 구비합니다.</Text>
                        <Text style={ styles.regularText }>④회사는 서비스이용과 관련하여 회원으로부터 제기된 의견이나 불만이 정당하다고 인정할 경우에는 이를 처리하여야 합니다. 회원이 제기한 의견이나 불만사항에 대해서는 게시판을 활용하거나 전자우편, 휴대전화번호 등을 통하여 회원에게 처리과정 및 결과를 전달합니다.</Text>
                    </View>
                    
                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제11조 (회원의 의무)</Text>
                        <Text style={ styles.regularText }>①회원은 다음 행위를 하여서는 안 됩니다.</Text>
                        <Text style={ styles.regularText }>1.신청 또는 변경 시 허위내용의 등록</Text>
                        <Text style={ styles.regularText }>2.타인의 정보도용</Text>
                        <Text style={ styles.regularText }>3.회사가 게시한 정보의 변경</Text>
                        <Text style={ styles.regularText }>4.회사가 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</Text>
                        <Text style={ styles.regularText }>5.회사와 기타 제3자의 저작권 등 지적재산권에 대한 침해</Text>
                        <Text style={ styles.regularText }>6.회사 및 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</Text>
                        <Text style={ styles.regularText }>7.외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 "서비스"에 공개 또는 게시하는 행위</Text>
                        <Text style={ styles.regularText }>8.회사의 동의 없이 영리를 목적으로 서비스를 사용하는 행위</Text>
                        <Text style={ styles.regularText }>9.기타 불법적이거나 부당한 행위</Text>
                        <Text style={ styles.regularText }>10.타인의 명의를 이용하는 행위를 하여서는 안되며 그로 인한 모든 책임은 본인에게 있습니다.</Text>
                        <Text style={ styles.regularText }>②회원은 관계법, 이 약관의 규정, 이용안내 및 "서비스"와 관련하여 공지한 주의사항, 회사가 통지하는 사항 등을 준수하여야 하며, 기타 회사의 업무에 방해되는 행위를 하여서는 안 됩니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제12조 (정보의 제공 및 광고의 게재)</Text>
                        <Text style={ styles.regularText }>①회사는 회원이 서비스 이용 중 필요하다고 인정되는 다양한 정보를 공지사항이나 전자우편, 휴대전화 등의 방법으로 회원에게 제공할 수 있습니다. 다만, 회원은 관련법에 따른 거래관련 정보 및 고객문의 등에 대한 답변 등을 제외하고는 언제든지 수신 거절을 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>②제1항의 정보를 휴대전화 및 모사전송기기에 의하여 전송하려고 하는 경우에는 회원의 사전 동의를 받아서 전송합니다. 다만, 회원의 거래관련 정보 및 고객문의 등에 대한 회신에 있어서는 제외됩니다.</Text>
                        <Text style={ styles.regularText }>③회사는 서비스의 운영과 관련하여 서비스 화면, 홈페이지, 전자우편, 휴대전화 등에 광고를 게재할 수 있습니다. 광고가 게재된 전자우편, 휴대전화를 수신한 회원은 수신거절을 회사에게 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>④이용자(회원, 비회원포함)는 회사가 제공하는 서비스와 관련하여 게시물 또는 기타 정보를 변경, 수정, 제한하는 등의 조치를 취하지 않습니다.</Text>
                    </View>
                    
                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제15조 (게시물의 저작권)</Text>
                        <Text style={ styles.regularText }>①회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</Text>
                        <Text style={ styles.regularText }>②회원이 서비스 내에 게시하는 게시물은 검색결과 내지 서비스 및 관련 프로모션 등에 노출될 수 있으며, 해당 노출을 위해 필요한 범위 내에서는 일부 수정, 복제, 편집되어 게시될 수 있습니다. 이 경우, 회사는 저작권법 규정을 준수하며, 회원은 언제든지 고객센터 또는 서비스 내 관리기능을 통해 해당 게시물에 대해 삭제, 검색결과 제외, 비공개 등의 조치를 취할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>③회사는 제2항 이외의 방법으로 회원의 게시물을 이용하고자 하는 경우에는 전화, 팩스, 전자우편 등을 통해 사전에 회원의 동의를 얻어야 합니다.</Text>
                    </View>
                    
                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제16 조 (게시물의 관리)</Text>
                        <Text style={ styles.regularText }>①회원의 게시물이 "정보통신망법" 및 "저작권법"등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있으며, 회사는 관련법에 따라 조치를 취하여야 합니다.</Text>
                        <Text style={ styles.regularText }>②회사는 전항에 따른 권리자의 요청이 없는 경우라도 권리침해가 인정될 만한 사유가 있거나 기타 회사 정책 및 관련법에 위반되는 경우에는 관련법에 따라 해당 게시물에 대해 임시조치 등을 취할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>③본 조에 따른 세부절차는 "정보통신망법" 및 "저작권법"이 규정한 범위 내에서 회사가 정한 "게시중단요청서비스"에 따릅니다.</Text>
                        <Text style={ styles.regularText }>④회원은 타인의 권리가 상호 존중되고 보호받을 수 있도록 게시물 및 댓글 작성 시 다음 각 호의 원칙을 준수하여 작성합니다. </Text>
                        <Text style={ styles.regularText }>1. 거짓 정보 또는 오해를 불러일으킬 만한 정보를 제공하지 않도록 정확성 및 진실성 있는 후기를 작성합니다. </Text>
                        <Text style={ styles.regularText }>2. 명예를 훼손할 수 있는 내용을 담지 않습니다.</Text>
                        <Text style={ styles.regularText }>3. 본인 또는 타인의 개인정보가 노출되지 않도록 합니다.</Text>
                        <Text style={ styles.regularText }>4. 다른 사람에게 공포심 또는 불안감, 불쾌감을 유발할 수 있는 내용을 담지 않습니다.</Text>
                        <Text style={ styles.regularText }>5. 특정 골프 사업장의 평판을 저해하려는 목적으로 부정적인 후기를 반복적으로 게시하지 않습니다.</Text>
                        <Text style={ styles.regularText }>6. 이미지, 사진, 영상, 언어적 표현 등 다른 사람의 저작권, 초상권 등을 침해하지 않도록 합니다.</Text>
                        <Text style={ styles.regularText }>7. 상업 광고, 상거래 유도 등 특정인의 영리를 위한 상업적인 내용을 담지 않습니다. </Text>
                        <Text style={ styles.regularText }>8. 이용약관 또는 기타 법령이 정한 사항을 위반하는 후기를 작성해서는 안 됩니다. </Text>
                        <Text style={ styles.regularText }>- 후기 작성 시 타인의 저작권 등 지식 재산권을 포함하여 여타 권리를 침해할 경우, 회사는 그에 대한 어떠한 책임도 부담하지 않습니다.</Text>
                    </View>
                    
                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제17 조 (권리의 귀속)</Text>
                        <Text style={ styles.regularText }>①서비스에 대한 저작권 및 지적재산권은 회사에 귀속됩니다. 단, 회원의 게시물 및 제휴계약에 따라 제공된 저작물 등은 제외합니다.</Text>
                        <Text style={ styles.regularText }>②회사는 서비스와 관련하여 회원에게 회사가 정한 이용조건에 따라 계정, 콘텐츠, 포인트 등을 이용할 수 있는 이용권만을 부여하며, 회원은 이를 양도, 판매, 담보제공 등의 처분행위를 할 수 없습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제18 조 (포인트)</Text>
                        <Text style={ styles.regularText }>①포인트는 서비스이용시 부여되는 일종의 점수로써 회원에게 제공하는 포인트입니다.</Text>
                        <Text style={ styles.regularText }>②포인트는 회사 제휴매장 및 상품구매 이용 시 지원하는 일종의 서비스 정책입니다.</Text>
                        <Text style={ styles.regularText }>③회원의 포인트는 회사가 정하는 다양한 서비스 이용 시 획득, 소비 할 수 있으며, 포인트를 부당하게 취득한 증거가 있을 때에 회사는 사전 통지 없이 회원이 부당 취득한 포인트를 삭제할 수 있으며 회원 자격을 제한할 수 있습니다. (서비스 상 구매 등 계약 철회 또는 중도 취소)</Text>
                        <Text style={ styles.regularText }>⑤회원탈퇴 또는 회원 자격 상실 시 잔여 여부와 상관없이 회원의 포인트는 소멸되며 타인에게 양도, 양수, 대여, 담보의 목적으로 이용할 수 없습니다.</Text>
                        <Text style={ styles.regularText }>⑥회사는 서비스의 효율적 이용 및 운영을 위해 사전 공지 후 포인트의 일부 또는 전부를 조정할 수 있으며, 포인트는 회사가 정한 기간에 따라 주기적으로 소멸할 수 있습니다.</Text>
                    </View>
                    
                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제19 조 (계약해제, 해지 등)</Text>
                        <Text style={ styles.regularText }>①회원은 언제든지 마이페이지 메뉴 등을 통하여 이용계약 해지 신청을 할 수 있으며, 회사는 관련법 등이 정하는 바에 따라 이를 즉시 처리하여야 합니다.</Text>
                        <Text style={ styles.regularText }>②회원이 계약을 해지할 경우, 관련법 및 개인정보취급방침에 따라 회사가 회원정보를 보유하는 경우를 제외하고는 해지 즉시 회원의 모든 데이터는 소멸됩니다.</Text>
                        <Text style={ styles.regularText }>③회원이 계약을 해지하는 경우, 회원이 작성한 본인 계정에 등록된 게시물 일체는 삭제됩니다. 다만, 공용게시판에 등록된 게시물, 댓글 등은 삭제되지 않으니 사전에 삭제 후 탈퇴하시기 바랍니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제20 조 (회원탈퇴 및 이용제한 등)</Text>
                        <Text style={ styles.regularText }>① 회원은 서비스에 언제든지 탈퇴를 요청할 수 있으며 서비스는 즉시 회원탈퇴를 처리합니다.</Text>
                        <Text style={ styles.regularText }>②회사는 회원이 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지, 영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>③회사는 전항에도 불구하고, "주민등록법"을 위반한 명의도용 및 결제도용, "저작권법" 및 "컴퓨터프로그램보호법"을 위반한 불법프로그램의 제공 및 운영방해, "정보통신망법"을 위반한 불법통신 및 해킹, 악성프로그램의 배포, 접속권한 초과행위 등과 같이 관련법을 위반한 경우에는 즉시 영구이용정지를 할 수 있습니다. 본 항에 따른 영구이용정지 시 "서비스" 이용을 통해 획득한 "포인트" 및 기타 혜택 등도 모두 소멸되며, 회사는 이에 대해 별도로 보상하지 않습니다.</Text>
                        <Text style={ styles.regularText }>④회사는 회원이 180일 이상 로그인하지 않는 경우, 회원정보의 보호 및 운영의 효율성을 위해 이용을 제한할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑤회사는 본 조의 이용제한 범위 내에서 제한의 조건 및 세부내용은 이용제한정책 및 개별 서비스상의 운영정책에서 정하는 바에 의합니다.</Text>
                        <Text style={ styles.regularText }>⑥회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수 있습니다.</Text>
                        <Text style={ styles.regularText }>1. 가입 신청 시에 허위 내용을 등록한 경우</Text>
                        <Text style={ styles.regularText }>2. “몰”을 이용하여 구입한 재화 등의 대금, 기타 “몰”이용에 관련하여 회원이 부담하는 채무를 기일에 지급하지 않는 경우</Text>
                        <Text style={ styles.regularText }>3. 다른 사람의 “몰” 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</Text>
                        <Text style={ styles.regularText }>4. “몰”을 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</Text>
                        <Text style={ styles.regularText }>⑦본 조에 따라 서비스 이용을 제한하거나 계약을 해지하는 경우에는 회사는 제9조[회원에 대한 통지]에 따라 통지합니다.</Text>
                        <Text style={ styles.regularText }>⑧회원은 본 조에 따른 이용제한 등에 대해 회사가 정한 절차에 따라 이의신청을 할 수 있습니다. 이 때 이의가 정당하다고 회사가 인정하는 경우 회사는 즉시 서비스의 이용을 재개합니다.</Text>
                        <Text style={ styles.regularText }>⑨회사가 회원 자격을 제한․정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 “몰”은 회원자격을 상실 시킬 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑨회사가 회원 자격을 제한․정지 시킨 후, 동일한 행위가 2회 이상 반복되거나 30일 이내에 그 사유가 시정되지 아니하는 경우 “몰”은 회원자격을 상실 시킬 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑧회사가 회원자격을 상실시키는 경우에는 회원등록을 말소합니다. 이 경우 회원에게 이를 통지하고, 회원등록 말소 전에 최소한 30일 이상의 기간을 정하여 소명할 기회를 부여합니다.</Text>
                    </View>

                    <Text style={ styles.semiBoldText }>제2장 온라인몰 및 유료 서비스</Text>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제21조 (몰의 운영)</Text>
                        <Text style={ styles.regularText }>1. “몰”은 다음과 같은 업무를 수행합니다.</Text>
                        <Text style={ styles.regularText }>가) 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</Text>
                        <Text style={ styles.regularText }>나) 구매계약이 체결된 재화 또는 용역의 배송</Text>
                        <Text style={ styles.regularText }>다) 기타 “몰”이 정하는 업무</Text>
                        <Text style={ styles.regularText }>2. “몰”은 재화 또는 용역의 품절 또는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 재화 또는 용역의 내용을 변경할 수 있습니다. 이 경우에는 변경된 재화 또는 용역의 내용 및 제공일자를 명시하여 현재의 재화 또는 용역의 내용을 게시한 곳에 즉시 공지합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제22조 (구매신청 및 개인정보 제공 동의 등)</Text>
                        <Text style={ styles.regularText }>①“몰”이용자는 “몰”상에서 다음 또는 이와 유사한 방법에 의하여 구매를 신청하며, “몰”은 이용자가 구매신청을 함에 있어서 다음의 각 내용을 알기 쉽게 제공하여야 합니다. 단, 회원인 경우 제 2번조항 내지 제 4번조항의 적용을 제외할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>1. 재화등의 검색 및 선택</Text>
                        <Text style={ styles.regularText }>2. 받는 사람의 성명, 주소, 전화번호, 전자우편주소(또는 이동전화번호) 등의 입력</Text>
                        <Text style={ styles.regularText }>3. 약관내용, 청약철회권이 제한되는 서비스, 배송료, 설치비 등의 비용부담과 관련한 내용에 대한 확인</Text>
                        <Text style={ styles.regularText }>4. 이 약관에 동의하고 위 다.호의 사항을 확인하거나 거부하는 표시</Text>
                        <Text style={ styles.regularText }>5. 재화등의 구매신청 및 이에 관한 확인 또는 “몰”의 확인에 대한 동의</Text>
                        <Text style={ styles.regularText }>6. 결제방법의 선택</Text>
                        <Text style={ styles.regularText }>②“몰”이 제3자에게 구매자 개인정보를 제공할 필요가 있는 경우 1) 개인정보를 제공받는 자, 2)개인정보를 제공받는 자의 개인정보 이용목적, 3) 제공하는 개인정보의 항목, 4) 개인정보를 제공받는 자의 개인정보 보유 및 이용기간을 구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.)</Text>
                        <Text style={ styles.regularText }>③“몰”이 제3자에게 구매자의 개인정보를 취급할 수 있도록 업무를 위탁하는 경우에는 1) 개인정보 취급위탁을 받는 자, 2) 개인정보 취급위탁을 하는 업무의 내용을 구매자에게 알리고 동의를 받아야 합니다. (동의를 받은 사항이 변경되는 경우에도 같습니다.) 다만, 서비스제공에 관한 계약이행을 위해 필요하고 구매자의 편의증진과 관련된 경우에는 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에서 정하고 있는 방법으로 개인정보 취급방침을 통해 알림으로써 고지절차와 동의절차를 거치지 않아도 됩니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제23조(구매계약의 성립)</Text>
                        <Text style={ styles.regularText }>①“몰”은 22조와 같은 구매신청에 대하여 다음 각 호에 해당하면 승낙하지 않을 수 있습니다. 다만, 미성년자와 계약을 체결하는 경우에는 법정대리인의 동의를 얻지 못하면 미성년자 본인 또는 법정대리인이 계약을 취소할 수 있다는 내용을 고지하여야 합니다.</Text>
                        <Text style={ styles.regularText }>1. 신청 내용에 허위, 기재누락, 오기가 있는 경우</Text>
                        <Text style={ styles.regularText }>2. 미성년자가 담배, 주류 등 청소년보호법에서 금지하는 재화 및 용역을 구매하는 경우</Text>
                        <Text style={ styles.regularText }>3. 기타 구매신청에 승낙하는 것이 “몰” 기술상 현저히 지장이 있다고 판단하는 경우</Text>
                        <Text style={ styles.regularText }>4. 만 14세 이하</Text>
                        <Text style={ styles.regularText }>②“몰”의 승낙이 제25조제1항의 수신확인통지형태로 이용자에게 도달한 시점에 계약이 성립한 것으로 봅니다.</Text>
                        <Text style={ styles.regularText }>③“몰”의 승낙의 의사표시에는 이용자의 구매 신청에 대한 확인 및 판매가능 여부, 구매신청의 정정 취소 등에 관한 정보 등을 포함하여야 합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제24조 (지급방법)</Text>
                        <Text style={ styles.regularText }>①“몰”에서 구매한 재화 또는 용역에 대한 대금지급방법은 다음 각호의 방법 중 가용한 방법으로 할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>1. 폰뱅킹, 인터넷뱅킹, 메일 뱅킹 등의 각종 계좌이체</Text>
                        <Text style={ styles.regularText }>2. 선불카드, 직불카드, 신용카드 등의 각종 카드 결제</Text>
                        <Text style={ styles.regularText }>3. 온라인무통장입금</Text>
                        <Text style={ styles.regularText }>4. 전자화폐에 의한 결제</Text>
                        <Text style={ styles.regularText }>5. 수령시 대금지급</Text>
                        <Text style={ styles.regularText }>6. 마일리지 등 “몰”이 지급한 포인트에 의한 결제</Text>
                        <Text style={ styles.regularText }>7. “몰”과 계약을 맺었거나 “몰”이 인정한 상품권에 의한 결제</Text>
                        <Text style={ styles.regularText }>8. 기타 전자적 지급 방법에 의한 대금 지급 등</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제25조 (수신확인통지, 구매신청 변경 및 취소)</Text>
                        <Text style={ styles.regularText }>1. “몰”은 이용자의 구매신청이 있는 경우 이용자에게 수신확인통지를 합니다.</Text>
                        <Text style={ styles.regularText }>2. 수신확인통지를 받은 이용자는 의사표시의 불일치등이 있는 경우에는 수신확인통지를 받은 후 즉시 구매신청 변경 및 취소를 요청할 수 있고 “몰”은 배송전에 이용자의 요청이 있는 경우에는 지체없이 그 요청에 따라 처리하여야 합니다.</Text>
                        <Text style={ styles.regularText }>3. 1항의 수신확인통지가 이용자에게 도달한 시점에 구매계약이 성립한 것으로 봅니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제26조 (재화 등의 공급 및 환급)</Text>
                        <Text style={ styles.regularText }>1. “몰”은 이용자와 재화 등의 공급시기에 관하여 별도의 약정이 없는 이상, 이용자가 청약을 한 날부터 7일 이내에 재화 등을 배송할 수 있도록 주문제작, 포장 등 기타의 필요한 조치를 취합니다. 다만, “몰”이 이미 재화 등의 대금의 전부 또는 일부를 받은 경우에는 대금의 전부 또는 일부를 받은 날부터 3영업일 이내에 조치를 취합니다. 이때 “몰”은 이용자가 재화 등의 공급 절차 및 진행 사항을 확인할 수 있도록 적절한 조치를 합니다..</Text>
                        <Text style={ styles.regularText }>2. “몰”은 이용자가 구매한 재화에 대해 배송수단, 수단별 배송비용 부담자, 수단별 배송기간 등을 명시합니다. 만약 “몰”이 약정 배송기간을 초과한 경우에는 그로 인한 이용자의 손해를 배상하여야 합니다. 다만 “몰”이 고의․과실이 없음을 입증한 경우에는 그러하지 아니합니다.</Text>
                        <Text style={ styles.regularText }>3. “몰”은 이용자가 구매신청한 재화등이 품절 등의 사유로 인도 또는 제공을 할 수 없을 때에는 지체없이 그 사유를 이용자에게 통지하고 사전에 재화 등의 대금을 받은 경우에는 대금을 받은 날부터 3영업일 이내에 환급하거나 환급에 필요한 조치를 취합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제27조 (청약철회 등 및 효과)</Text>
                        <Text style={ styles.regularText }>①“몰”과 재화등의 구매에 관한 계약을 체결한 이용자는 「전자상거래 등에서의 소비자보호에 관한 법률」 제13조 제2항에 따른 계약내용에 관한 서면을 받은 날(그 서면을 받은 때보다 재화 등의 공급이 늦게 이루어진 경우에는 재화 등을 공급받거나 재화 등의 공급이 시작된 날을 말합니다)부터 7일 이내에는 청약의 철회를 할 수 있습니다. 다만, 청약철회에 관하여 「전자상거래 등에서의 소비자보호에 관한 법률」에 달리 정함이 있는 경우에는 동 법 규정에 따릅니다. </Text>
                        <Text style={ styles.regularText }>②이용자는 재화 등을 배송 받은 경우 다음 각 호의 1에 해당하는 경우에는 반품 및 교환을 할 수 없습니다.</Text>
                        <Text style={ styles.regularText }>1. 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우(다만, 재화 등의 내용을 확인하기 위하여 포장 등을 훼손한 경우에는 청약철회를 할 수 있습니다)</Text>
                        <Text style={ styles.regularText }>2. 이용자의 사용 또는 일부 소비에 의하여 재화 등의 가치가 현저히 감소한 경우</Text>
                        <Text style={ styles.regularText }>3. 시간의 경과에 의하여 재판매가 곤란할 정도로 재화등의 가치가 현저히 감소한 경우</Text>
                        <Text style={ styles.regularText }>4. 같은 성능을 지닌 재화 등으로 복제가 가능한 경우 그 원본인 재화 등의 포장을 훼손한 경우</Text>
                        <Text style={ styles.regularText }>③제2항제2호 내지 제4호의 경우에 “몰”이 사전에 청약철회 등이 제한되는 사실을 소비자가 쉽게 알 수 있는 곳에 명기하거나 시용상품을 제공하는 등의 조치를 하지 않았다면 이용자의 청약철회 등이 제한되지 않습니다.</Text>
                        <Text style={ styles.regularText }>⑤“몰”은 이용자로부터 재화 등을 반환 받은 경우 3영업일 이내에 이미 지급받은 재화등의 대금을 환급합니다. 이 경우 “몰”이 이용자에게 재화등의 환급을 지연한때에는 그 지연기간에 대하여 「전자상거래 등에서의 소비자보호에 관한 법률 시행령」제21조의2에서 정하는 지연이자율을 곱하여 산정한 지연이자를 지급합니다.</Text>
                        <Text style={ styles.regularText }>⑥“몰”은 위 대금을 환급함에 있어서 이용자가 신용카드 또는 전자화폐 등의 결제수단으로 재화등의 대금을 지급한 때에는 지체없이 당해 결제수단을 제공한 사업자로 하여금 재화등의 대금의 청구를 정지 또는 취소하도록 요청합니다.</Text>
                        <Text style={ styles.regularText }>⑦청약철회등의 경우 공급받은 재화등의 반환에 필요한 비용은 이용자가 부담합니다. “몰”은 이용자에게 청약철회 등을 이유로 위약금 또는 손해배상을 청구하지 않습니다. 다만 재화 등의 내용이 표시·광고 내용과 다르거나 계약내용과 다르게 이행되어 청약철회 등을 하는 경우 재화 등의 반환에 필요한 비용은 “몰”이 부담합니다.</Text>
                        <Text style={ styles.regularText }>⑧이용자가 재화 등을 제공받을 때 발송비를 부담한 경우에 “몰”은 청약철회 시 그 비용을 누가 부담하는지를 이용자가 알기 쉽도록 명확하게 표시합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제28 조 (개인정보보호)</Text>
                        <Text style={ styles.regularText }>①“몰”은 이용자의 개인정보 수집시 서비스제공을 위하여 필요한 범위에서 최소한의 개인정보를 수집합니다. </Text>
                        <Text style={ styles.regularText }>②“몰”은 회원가입시 구매계약이행에 필요한 정보를 미리 수집하지 않습니다. 다만, 관련 법령상 의무이행을 위하여 구매계약 이전에 본인확인이 필요한 경우로서 최소한의 특정 개인정보를 수집하는 경우에는 그러하지 아니합니다.</Text>
                        <Text style={ styles.regularText }>③“몰”은 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. </Text>
                        <Text style={ styles.regularText }>④“몰”은 수집된 개인정보를 목적외의 용도로 이용할 수 없으며, 새로운 이용목적이 발생한 경우 또는 제3자에게 제공하는 경우에는 이용·제공단계에서 당해 이용자에게 그 목적을 고지하고 동의를 받습니다. 다만, 관련 법령에 달리 정함이 있는 경우에는 예외로 합니다.</Text>
                        <Text style={ styles.regularText }>⑤“몰”이 제2항과 제3항에 의해 이용자의 동의를 받아야 하는 경우에는 개인정보관리 책임자의 신원(소속, 성명 및 전화번호, 기타 연락처), 정보의 수집목적 및 이용목적, 제3자에 대한 정보제공 관련사항(제공받은자, 제공목적 및 제공할 정보의 내용) 등 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 제22조제2항이 규정한 사항을 미리 명시하거나 고지해야 하며 이용자는 언제든지 이 동의를 철회할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>⑥이용자는 언제든지 “몰”이 가지고 있는 자신의 개인정보에 대해 열람 및 오류정정을 요구할 수 있으며 “몰”은 이에 대해 지체 없이 필요한 조치를 취할 의무를 집니다. 이용자가 오류의 정정을 요구한 경우에는 “몰”은 그 오류를 정정할 때까지 당해 개인정보를 이용하지 않습니다.</Text>
                        <Text style={ styles.regularText }>⑦“몰”은 개인정보 보호를 위하여 이용자의 개인정보를 취급하는 자를 최소한으로 제한하여야 하며 신용카드, 은행계좌 등을 포함한 이용자의 개인정보의 분실, 도난, 유출, 동의 없는 제3자 제공, 변조 등으로 인한 이용자의 손해에 대하여 모든 책임을 집니다.</Text>
                        <Text style={ styles.regularText }>⑧“몰” 또는 그로부터 개인정보를 제공받은 제3자는 개인정보의 수집목적 또는 제공받은 목적을 달성한 때에는 당해 개인정보를 지체 없이 파기합니다.</Text>
                        <Text style={ styles.regularText }>⑨“몰”은 개인정보의 수집·이용·제공에 관한 동의 란을 미리 선택한 것으로 설정해두지 않습니다. 또한 개인정보의 수집·이용·제공에 관한 이용자의 동의거절시 제한되는 서비스를 구체적으로 명시하고, 필수수집항목이 아닌 개인정보의 수집·이용·제공에 관한 이용자의 동의 거절을 이유로 회원가입 등 서비스 제공을 제한하거나 거절하지 않습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제29조 (“몰”의 의무)</Text>
                        <Text style={ styles.regularText }>① “몰”은 법령과 이 약관이 금지하거나 공서양속에 반하는 행위를 하지 않으며 이 약관이 정하는 바에 따라 지속적이고, 안정적으로 재화․용역을 제공하는데 최선을 다하여야 합니다.</Text>
                        <Text style={ styles.regularText }>② “몰”은 이용자가 안전하게 인터넷 서비스를 이용할 수 있도록 이용자의 개인정보(신용정보 포함)보호를 위한 보안 시스템을 갖추어야 합니다.</Text>
                        <Text style={ styles.regularText }>③ “몰”이 상품이나 용역에 대하여 「표시․광고의 공정화에 관한 법률」 제3조 소정의 부당한 표시․광고행위를 함으로써 이용자가 손해를 입은 때에는 이를 배상할 책임을 집니다.</Text>
                        <Text style={ styles.regularText }>④ “몰”은 이용자가 원하지 않는 영리목적의 광고성 전자우편을 발송하지 않습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제30조 (회원의 계정 및 비밀번호에 대한 의무)</Text>
                        <Text style={ styles.regularText }>① 제28조의 경우를 제외한 계정과 비밀번호에 관한 관리책임은 회원에게 있습니다.</Text>
                        <Text style={ styles.regularText }>② 회원은 자신의 계정 및 비밀번호를 제3자에게 이용하게 해서는 안됩니다.</Text>
                        <Text style={ styles.regularText }>③ 회원이 자신의 계정 및 비밀번호를 도난당하거나 제3자가 사용하고 있음을 인지한 경우에는 바로 “몰”에 통보하고 “몰”의 안내가 있는 경우에는 그에 따라야 합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제31조(이용자의 의무) 이용자는 다음 행위를 하여서는 안 됩니다.</Text>
                        <Text style={ styles.regularText }>1. 신청 또는 변경시 허위 내용의 등록</Text>
                        <Text style={ styles.regularText }>2. 타인의 정보 도용</Text>
                        <Text style={ styles.regularText }>3. “몰”에 게시된 정보의 변경</Text>
                        <Text style={ styles.regularText }>4. “몰”이 정한 정보 이외의 정보(컴퓨터 프로그램 등) 등의 송신 또는 게시</Text>
                        <Text style={ styles.regularText }>5. “몰” 기타 제3자의 저작권 등 지적재산권에 대한 침해</Text>
                        <Text style={ styles.regularText }>6. “몰” 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</Text>
                        <Text style={ styles.regularText }>7. 외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 몰에 공개 또는 게시하는 행위</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제32 조 (연결“몰”과 피연결“몰” 간의 관계)</Text>
                        <Text style={ styles.regularText }>1. 상위 “몰”과 하위 “몰”이 하이퍼링크(예: 하이퍼링크의 대상에는 문자, 그림 및 동화상 등이 포함됨)방식 등으로 연결된 경우, 전자를 연결“몰”이라고 하고 후자를 피연결“몰”이라고 합니다.</Text>
                        <Text style={ styles.regularText }>2. 연결“몰”은 피연결“몰”이 제공하는 재화등에 의하여 이용자와 행하는 거래에 대해서 보증책임을 지지 않습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제33 조 (서비스 제공을 위한 프로그램 설치 공지)</Text>
                        <Text style={ styles.regularText }>① 회사는 이용자에게 안정적인 서비스를 제공하기 위해, 이용자의 PC나 각종 모바일 기기의 일부 저장공간이나 리소스를 활용하여, 서비스 이용 응용프로그램을 이용자의 동의를 통해 설치 적용할 수 있습니다.</Text>
                        <Text style={ styles.regularText }>② 회사는 이용자에게 최적의 서비스를 제공하기 위해, 더 나은 기술이 있다고 판단되는 경우, 이용자의 동의를 통해 이용자의 PC나 각종 모바일 기기에 적용된 프로그램을 수정/보완 및 교체할 수 있습니다.</Text>
                    </View>

                    <Text style={ styles.semiBoldText }>제3장 기타</Text>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제34조(저작권의 귀속 및 이용제한)</Text>
                        <Text style={ styles.regularText }>①“몰“이 작성한 저작물에 대한 저작권 기타 지적재산권은 ”몰“에 귀속합니다.</Text>
                        <Text style={ styles.regularText }>②이용자는 “몰”을 이용함으로써 얻은 정보 중 “몰”에게 지적재산권이 귀속된 정보를 “몰”의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</Text>
                        <Text style={ styles.regularText }>③“몰”은 약정에 따라 이용자에게 귀속된 저작권을 사용하는 경우 당해 이용자에게 통보하여야 합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제35조(분쟁해결)</Text>
                        <Text style={ styles.regularText }>①“몰”은 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치․운영합니다.</Text>
                        <Text style={ styles.regularText }>②“몰”은 이용자로부터 제출되는 불만사항 및 의견은 우선적으로 그 사항을 처리합니다. 다만, 신속한 처리가 곤란한 경우에는 이용자에게 그 사유와 처리일정을 즉시 통보해 드립니다.</Text>
                        <Text style={ styles.regularText }>③“몰”과 이용자 간에 발생한 전자상거래 분쟁과 관련하여 이용자의 피해구제신청이 있는 경우에는 공정거래위원회 또는 시·도지사가 의뢰하는 분쟁조정기관의 조정에 따를 수 있습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제36 조 (책임제한)</Text>
                        <Text style={ styles.regularText }>①회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</Text>
                        <Text style={ styles.regularText }>②회사는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</Text>
                        <Text style={ styles.regularText }>③회사는 회원이 서비스와 관련하여 게재한 정보, 자료, 사실의 신뢰도, 정확성 등의 내용에 관하여는 책임을 지지 않습니다. (컴퓨터오류, 신상정보, 전자우편 주소 부실기재 등)</Text>
                        <Text style={ styles.regularText }>④회사는 회원 간 또는 회원과 제3자 상호간에 서비스를 매개로 하여 거래 등을 한 경우에는 책임이 면제됩니다.</Text>
                        <Text style={ styles.regularText }>⑤회사는 무료로 제공되는 서비스 이용과 관련하여 관련법에 특별한 규정이 없는 한 책임을 지지 않습니다.</Text>
                        <Text style={ styles.regularText }>⑥ 회사는 기간통신 사업자가 전기통신 서비스를 중지하거나 정상적으로 제공하지 아니하여 손해가 발생한 경우 책임이 면제됩니다.</Text>
                        <Text style={ styles.regularText }>⑦ 회사는 서비스용 설비의 보수, 교체, 정기점검, 공사 등 부득이한 사유로 발생한 손해에 대한 책임이 면제됩니다.</Text>
                        <Text style={ styles.regularText }>⑧ 회사는 이용자 상호간 및 이용자와 제3자 상호 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할 책임도 없습니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제37 조 (준거법 및 재판관할)</Text>
                        <Text style={ styles.regularText }>①회사와 회원 간 제기된 소송은 대한민국법을 준거법으로 합니다.</Text>
                        <Text style={ styles.regularText }>②회사와 회원간 발생한 분쟁에 관한 소송은 제소 당시의 회원의 주소에 의하고, 주소가 없는 경우 거소를 관할하는 지방법원의 전속관할로 합니다. 단, 제소 당시 회원의 주소 또는 거소가 명확하지 아니한 경우의 관할법원은 민사소송법에 따라 정합니다.</Text>
                        <Text style={ styles.regularText }>③해외에 주소나 거소가 있는 회원의 경우 회사와 회원간 발생한 분쟁에 관한 소송은 전항에도 불구하고 대한민국 서울중앙지방법원을 관할법원으로 합니다.</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제38 조 (이용약관에 대한 문의 사항)</Text>
                        <Text style={ styles.regularText }>"이용약관"에 대한 의문 사항은 아래 연락처를 참조하시기 바랍니다.</Text>
                        <Text style={ styles.regularText }>대표번호: 1855-0753</Text>
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.regularText }>(부칙) 이 약관은 2023년 11월 6일부터 적용됩니다.</Text>
                    </View>

                </View>
            }

            { type === 1 && 
                <View style={ styles.container }>
                    <View style={{ alignItems: 'center', marginVertical: 24 }}>
                        <Text style={ styles.boldText }>위치정보 이용약관</Text>
                    </View>
                    <Text style={ styles.semiBoldText }>제1장 총칙</Text>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제1조 (목적)</Text>
                        <Text style={ styles.regularText }>본 약관은 회원이 주식회사 더스윙골프(이하”회사”)가 제공하는 위치기반서비스(이하”서비스”)를 이용함에 있어 회사와 회원의 권리, 의무 및 책임사항을 규정하는데 그 목적을 가진다.</Text>    
                        <Text style={ styles.regularText }>서비스의 이용 목적은 회원 및 본인(개인위치정보주체자)가 주식회사 더스윙골프가 제공하는 서비스 중 매장찾기 서비스에 이용에 이용됩니다. 본 약관은 회원은 서비스를 이용함에 있어, 회사와 회원간의 권리와 의무 및 책임삼을 규정함을 목적으로 합니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 2조 이용약관의 효력 및 변경</Text>
                        <Text style={ styles.regularText }>1) 본 약관은 서비스를 신청한 회원 및 고객 또는 개인위치정보주체자가 본 약관에 동의하여 회사가 규정한 절차에 따라 서비스 이용자로써 등록함을 통해 그 효력이 발생됩니다.</Text>    
                        <Text style={ styles.regularText }>2) 회원이 온라인 상에서 본 약관의 “동의하기” 버튼을 선택하였을 경우 회사는 회원이 본 약관의 내용을 모두 읽고 충분히 이해하였으며, 그 적용에 대해 동의한 것으로 간주합니다.</Text>    
                        <Text style={ styles.regularText }>3) 회사는 위치정보의 보호 및 용 등에 관한 법률, 콘텐츠산업 진흥법, 전자상거래 등에서의 소비자보호에 관한 법률, 소비자기본법 약관의 규제에 관한 법률 등 관렵법령을 위배하지 않는 범위내에 한하여 본 약관을 수정 및 개정할 수 있습니다.</Text>    
                        <Text style={ styles.regularText }>4) 회사가 본 약관을 개정할 경우, 기본약관과 개정약관 및 개정약관의 적용일자와 개정사유를 명확하게 명시하여 현행약관과 함께 그 적용일자 14일 전부터 적용일 이후 1개월간 공지하며, 개정된 약관의 내용이 일부 회원에게 불리한 경우에는 그 적용일자 30일 전부터 적용일 이후 2개월간 서비스 홈페이지 게시 및 회원에게 전자적 형태(이메일, SMS 등) 약관 개정을 사실을 발송하며 고지합니다.</Text>    
                        <Text style={ styles.regularText }>5) 회사가 전항에 따라 전항에 따라 회원에게 통지하면서 공지 또는 공지일로부터 개정약관 시행일 기준 7일이후가지 거부의사를 표명하지 아니하면 본 이용약관에 동의한 것으로 간주합니다. 회원이 개정약관에 동의하지 않을 겨우 회원은 이용계약을 해지할 수 있습니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 3조 관계법령의 적용</Text>
                        <Text style={ styles.regularText }>본 약관은 신의성실 원칙에 의거하여 공정하게 적용, 본 약관에 명시되지 않은 사항에 대하여는 일반 상관례 및 관계법령을 따릅니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 4조 서비스의 내용</Text>
                        <Text style={ styles.regularText }>회사가 제공하는 서비스는 다음 아래와 같습니다.</Text>    
                        <Text style={ styles.regularText }>1) 정보 검색 요청 시 개인위치정보주체의 현 위치를 활용 및 이용하여 회사가 제공하는 서비스인 주변 매장 검색 결과를 제공합니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 5조 서비스내용변경 통지</Text>
                        <Text style={ styles.regularText }>1) 회사가 서비스의 내용을 변경하거나 부득이하게 종료해야 할 경우 회사는 회원이 등록한 전자우편 주소로 이메일을 통하여 서비스의 내용 변경 내용 과 그 사항을 고지하여 종료할 수 있습니다.</Text>    
                        <Text style={ styles.regularText }>2) 위의 1)항의 경우 불특정 다수인을 상대로 통지함에 있어, 회사가 운영하는 웹사이트 등 기타 회사의 공지사항 채널을 통해 회원들에게 통지할 수 있습니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 6조 서비스이용의 제한 및 중지</Text>
                        <Text style={ styles.regularText }>1) 회사는 아래 각호의 해당하는 사유가 발생하거나 그 외 기타 회사가 회원에게 제공하는 서비스이용 제공에 어려움이 발생된다고 보는 경우 서비스 이용을 제한하거나 중지시길 수 있습니다.</Text>    
                        <Text style={ styles.regularText }>a. 회원이 회사 서비스의 운영을 고의 또는 중과실로 방해하는 경우</Text>    
                        <Text style={ styles.regularText }>b. 시설 설비 점검, 보수 또는 공사, 서비스 개선 작업이 필요하다고 보는 경우</Text>    
                        <Text style={ styles.regularText }>c. 전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중단한 경우</Text>    
                        <Text style={ styles.regularText }>d. 국가비사상태, 서비스 설비 장애 또는 디도스 공격을 포함한 서비스 의용의 폭주 등으로 원할한 서비스 제공에 지장이 있는 경우</Text>    
                        <Text style={ styles.regularText }>e. 기타 중대한 사유로 인해 회사가 서비스 제공을 지속하는 것이 부적절하다고 인정하는 경우</Text>    
                        <Text style={ styles.regularText }>2) 회사는 위의 전 항목의 규정에 의거하여 서비스의 이용을 제한 또는 중지한 경우 그 사유와 제한기간 등을 회원에게 알려야 합니다.</Text>     
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 7조 개인위치정보의 이용 또는 제공</Text>
                        <Text style={ styles.regularText }>1) 회사는 개인위치정보를 이용 및 활용하여 서비스를 제공하고자 할 경우에는 위치기반 서비스 이용약관에 명시한 개인위치정보주체의 동의를 받아야 합니다.</Text>    
                        <Text style={ styles.regularText }>2) 회원 및 법정대리인의 권리와 그 행사방법은 제소 당시의 이용자의 주소에 의거하며, 주소가 기재되지 않는 경우 거소를 관할하는 그 지역 지방법원의 전속관할로 합니다. 단, 제소 당시 이용자의 주소 또는 거소의 불명확, 외국 거주자의 경우 민사소송법상의 관할법원으로 제기합니다.</Text>    
                        <Text style={ styles.regularText }>3) 회사는 타사업자 또는 이용 고객과의 요금정산 및 이용불편에 따른 서비스 개선 목적의 민원처리를 위하여 위치정보 이용 내역 및 그 제공사실 확인자료 등을 자동으로 보존 및 기록하며, 그에 해당하는 자료의 보관일은 1년으로 합니다.</Text>    
                        <Text style={ styles.regularText }>4) 회사는 개인위치정보를 회원이 지정하고 동의하는 제3자에게 제공하는 경우, 개인위치정보를 수집한 당해년도에 통신 단말장치로 매회 회원에게 제공받는 자, 제공일시 , 제공목적을 그 즉시 통보합니다. 단, 다음 아래의 호에 해당하는 경우 회원이 미리 특정한 통신단말장치 및 전자우편을 통해 그 내용을 통보합니다.</Text>    
                        <Text style={ styles.regularText }>a. 개인위치정보를 수집한 당해년도 통신단말장치가 영상의 수신기능, 음성, 문자 등을 갖추지 아니한 경우</Text>    
                        <Text style={ styles.regularText }>b. 회원이 온라인 게시 등 기타 방법으로 회사에 통보 요청을 미리 한 경우</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 8조 개인위치정보주체의 권리 </Text>
                        <Text style={ styles.regularText }>1) 회원은 회사에 언제든지 개인위치정보를 이용한 위치기반서비스 제공 및 개인위치정보를 제3자에게 제공한 대한 동의 및 전부 또는 일부를 철회를 할 수 있습니다. 이 경우 회사는 수집한 개인위치정보 및 위치정보의 이용, 제공내역 사실 확인자료를 파기합니다.</Text>    
                        <Text style={ styles.regularText }>2) 회원은 회사에 대하여 언제든지 개인위치정보의 수집, 이용 또는 제공의 일시적인 중단을 요구 할 수 있으며, 회사는 이를 거절할 수 없으며, 회원이 요구하는 사항을 이행할 기술적 수단을 갖추고 있습니다.</Text>    
                        <Text style={ styles.regularText }>3) 회원은 회사에 대하여, 다음 아래 각호의 자료의 열람, 고지를 요구할 수 있으며, 당해 자료에 오류가 있을 경우 그 정정을 요구할 권리가 있습니다. 이와 같은 경우 회사는 정당한 사유 없이 회원의 요구를 거절할 권리는 없습니다.</Text>    
                        <Text style={ styles.regularText }>a. 회원 및 본인(개인위치정보주체자)에 대한 위치정보 수집, 제공내역 사실 확인, 이용에 대한 자료 일체</Text>    
                        <Text style={ styles.regularText }>b. 회원 및 본인(개인위치정보주체자)의 개인위치정보가 위치정보의 보호 및 이용 등에 관한 법률 또는 다른 법률 규정에 의거하여 제3자에게 제공된 내용과 제공된 이유 자료 일체</Text>    
                        <Text style={ styles.regularText }>4) 회원 및 본인(개인위치정보주체자)는 위의 제 1항 그리고 제 3항의 권리행사를 위해 회사에게 소정의 절차를 통하여 요구할 수 있는 권리가 있습니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 9조 개인위치정보관리책임자의 지정</Text>
                        <Text style={ styles.regularText }>1) 회사는 개인위치정보를 성실히 관리 및 보호하며, 개인위치정보주체의 불만을 원만하게 처리할 수 있고, 그 실직적인 업무적 책임을 질 수 있는 지위에 있는 자를 선임하여 위지정보관리책임자로 지정 및 운영합니다.</Text>    
                        <Text style={ styles.regularText }>2) 개인위치정보관리책임자는 위치기반서비스를 제공하는 부서의 부서장을 역임하며, 구체적인 사항은 본 약관의 부칙을 우선하여 따릅니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 10조 손해배상</Text>
                        <Text style={ styles.regularText }>1) 회사가 위치정보의 보호 및 이용 등에 관한 법률 제 15조 또는 제 26조의 규정을 위한한 행위로 말미암아, 회원에게 손해가 발생한 경우 회원은 회사에 손해배상 청구를 할 수 있습니다. 이와 같은 경우 회사는 고의성 및 과실이 없음을 입증하지 못하는 경우 책임을 면할 수 없습니다.</Text>    
                        <Text style={ styles.regularText }>2) 회원 및 본인(개인위치정보주체자)이 본 약관의 규정을 위반 및 어김을 통해 회사에 손해가 발생한 경우 회사는 회원 및 본인(개인위치정보주체자)에 대하여 손해배상을 청구할 수 있습니다. 이 경우 회원 및 본인(개인위치정보주체자)는 고의성 및 과실이 없음을 입증해야 하며, 입증하지 못 할 경우 책임을 면할 수 없습니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 11조 면책 </Text>
                        <Text style={ styles.regularText }>a. 천재지변 및 이에 준하는 국가비상사태에 해당하는 불가항력 상황의 경우</Text>    
                        <Text style={ styles.regularText }>b. 서비스 제공을 위해 회사와 서비스 제휴계약을 체결한 제3자의 고의적 서비스 방해 및 제 3자의 시설 장애 및 긴급 서비스 점검의 경우</Text>    
                        <Text style={ styles.regularText }>c. 회원 및 개인위치정보주체자의 귀책사유로 인해 서비스 이용의 장애가 발생한 경우</Text>    
                        <Text style={ styles.regularText }>d. 위의 사항을 제외한 기타 회사의 고의 및 과실이 없다고 인정된 경우</Text>    
                        <Text style={ styles.regularText }>2) 회사는 서비스 및 서비스 내에 게재된 정보, 자료, 사실의 신뢰도, 정확성 등에 대하여서는 보증하지 아니하며, 이로 인해 발생한 회원 및 개인위치정보주체자의 손해에 대해 그 책임에 대해 부담하지 아니합니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 12조 규정의 준용</Text>
                        <Text style={ styles.regularText }>1) 본 약관은 대한민국 관계법령의 의거하며 규정되며 성실히 이행합니다.</Text>    
                        <Text style={ styles.regularText }>2) 본 약관에 규정, 명시되지 않은 사항에 대해서는 관계법령 및 상관습에 우선하여 준용됩니다.</Text>    
                        <Text style={ styles.regularText }>3) 본 약관에 규정, 명시되지 않은 사항 중, 대한민국 관계법령 및 상관습을 따른 회사가 규정한 준칙 및 별칙, 부칙에 해당되는 경우 본 약관보다 우선시하여 규정을 준용합니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 13조 분쟁의 조정 및 기타</Text>
                        <Text style={ styles.regularText }>1) 회사는 위치정보관 관련된 분쟁에 대해 당사자간의 협의가 이루어지지 못하거나 협의를 할 수 없는 경우, 위치정보 보호 및 이용 등에 관한 법률 제 28조의 규정에 의한 방송통신위원회의 조정 및 재정을 신청할 수 있습니다.</Text>    
                        <Text style={ styles.regularText }>2) 회사 또는 회원 그리고 고객(개인정보위치주체자)의 관련된 분쟁에 대해 당사간의 협의가 이루어지지 못하거나 협의를 할 수 업는 경우, 개인정보보호법 제 42조 규정에 의거 개인정보분쟁조정위원회에 조정 및 재정을 신청 할 수 있습니다.</Text>    
                    </View>

                    <View style={{ marginVertical: 24 }}>
                        <Text style={ styles.semiBoldText }>제 14조 회사의 연락처 및 개인위치정보관리 책임자</Text>
                        <Text style={ styles.regularText }>회사의 상호 및 주소 등은 다음 아래와 같습니다.</Text>    
                        <Text style={ styles.regularText }>1) 상    호 : 주식회사 더스윙골프</Text>    
                        <Text style={ styles.regularText }>2) 상    표 : 더스윙제트 스크린골프</Text>    
                        <Text style={ styles.regularText }>3) 주    소 : 서울시 강남구 논현로 134길 10, 6층</Text>    
                        <Text style={ styles.regularText }>4) 대 표 자 : 최재호</Text>    
                        <Text style={ styles.regularText }>5) 대표번호 : 1855-0753</Text>    
                        <Text style={ styles.regularText }>개인위치정보관리 책임자</Text>    
                        <Text style={ styles.regularText }>1) 책 임 자 : 전상민</Text>    
                        <Text style={ styles.regularText }>2) 직    책 : CTO,CPO</Text>    
                        <Text style={ styles.regularText }>3) 고객센터 : 1855-0753</Text>    
                        <Text style={ styles.regularText }>4) 이 메 일 : privacy@the-swing.co.kr</Text>    
                        <Text style={ styles.regularText }>본 약관은 2024년 04월 20일부터 시행한다.</Text>    
                    </View>
                </View>
            }
            
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        flex: 1,

        backgroundColor: '#ffffff'
    },
    container: {
        marginHorizontal: 15
    },
    boldText: {
        includeFontPadding: false,
        fontSize: 20,
        fontFamily: 'Pretendard-Bold',

        color: '#121619'
    },
    regularText: {
        includeFontPadding: false,
        fontSize: 16,
        fontFamily: 'Pretendard-Regular',

        marginBottom: 5,

        color: '#121619'
    },
    semiBoldText: {
        includeFontPadding: false,
        fontSize: 18,
        fontFamily: 'Pretendard-SemiBold',

        marginBottom: 5,

        color: '#121619'
    },
    table: {
        marginVertical: 10,

        borderWidth: 1,
        borderColor: '#f3f3f3'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        borderBottomWidth: 1,
        borderBottomColor: '#f3f3f3'
    },
    tableHead: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-SemiBold',

        paddingVertical: 4,

        color: '#121619'
    },
    tableBody: {
        flex: 1,
        textAlign: 'center',

        includeFontPadding: false,
        fontSize: 14,
        fontFamily: 'Pretendard-Regular',

        paddingVertical: 10,

        color: '#121619'
    },
    tableBox: {
        width: 70,
        alignItems: 'center',
        justifyContent: 'center', 
        
        paddingHorizontal: 5, 
        
        backgroundColor: '#cccccc' 
    },
    button: {
        alignItems: 'center',

        width: '50%',

        paddingVertical: 13,

        borderRadius: 3
    }
})

export default TermsOfUse