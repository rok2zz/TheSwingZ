import { ScrollView, StyleSheet, Text, View } from "react-native"

const PrivacyPolicy = (): JSX.Element => {

    return (
        <ScrollView style={ styles.wrapper } showsVerticalScrollIndicator={ false }>
            <View style={ styles.container }>
                <View style={{ alignItems: 'center', marginVertical: 24 }}>
                    <Text style={ styles.boldText }>개인정보처리방침</Text>
                </View>

                <Text style={ styles.regularText }>㈜더스윙골프(이하 “회사”라 함)는 ｢개인정보 보호법｣ 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립․공개합니다. 회사는 개인정보처리방침의 공개를 통하여 이용자 여러분의 개인정보가 어떠한 목적과 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치가 취해지고 있는지를 알려드립니다.</Text>
                
                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제1조. 개인정보의 처리 목적</Text>
                    <Text style={ styles.regularText }>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 ｢개인정보 보호법｣ 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</Text>   
                    
                    <Text style={ styles.semiBoldText}>1. 회원 가입 및 관리</Text>
                    <Text style={ styles.regularText }>- 회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별∙인증, 회원자격 유지∙관리, 제한적 본인확인제 시행에 따른 본인확인, 서비스 부정이용 방지, 각종 고지∙통지, 고충처리 등</Text>   
                    <Text style={ styles.semiBoldText}>2. 재화 또는 서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금 정산</Text>
                    <Text style={ styles.regularText }>- 물품배송, 서비스 제공, 계약서∙청구서 발송, 콘텐츠 제공, 맞춤서비스 제공, 본인인증, 연령인증, 요금결제∙정산, 채권추심 등</Text>   
                    <Text style={ styles.semiBoldText}>3. 고충처리</Text>
                    <Text style={ styles.regularText }>- 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락∙통지, 처리결과 통보 등</Text>   
                    <Text style={ styles.semiBoldText}>4. 마케팅 목적에 활용</Text>
                    <Text style={ styles.regularText }>- 신규 서비스 개발 및 맞춤 서비스 제공, 통계학적 특성에 따른 서비스 제공 및 광고 게재, 서비스의 유효성 확인, 이벤트 정보 및 참여기회 제공, 광고성 정보 제공, 접속빈도 파악, 회원의 서비스이용에 대한 통계</Text>
                    <Text style={ styles.semiBoldText}>5. 광고성 정보 전달에 활용</Text>
                    <Text style={ styles.regularText }>- 영리 목적을 포함한 광고성 정보 전송</Text>
                    <Text style={ styles.regularText }>- 새로운 상품 안내 판매 권유 등 (보험, 마켓, 부킹, 투어, 회원권 등 회사에서 운영중인 서비스)</Text>
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제2조. 처리하는 개인정보 항목 및 수집 방법</Text>
                    <Text style={ styles.regularText }>회사는 다음의 개인정보 항목을 처리하고 있습니다.</Text>   
                    
                    <Text style={ styles.semiBoldText}>1. 개인정보 수집 항목</Text>
                    <Text style={ styles.regularText }>① 회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 최초 회원가입 당시 또는 서비스를 이용하는 과정에서 아래와 같은 최소한의 개인정보를 필수항목으로 수집하고 있습니다</Text>   
                    <Text style={ styles.regularText }>- 필수 : 아이디, 휴대폰번호, 이메일, 닉네임, 비밀번호, 만 14세 이상 동의, 본인인증 시 식별자 코드, 간편가입 시 소셜(구글, 네이버, 카카오, 애플) 고유 식별자 코드</Text>   
                    <Text style={ styles.regularText }>② 서비스 이용과정이나 사업처리 과정에서 아래와 같은 정보들이 자동으로 생성되어 수집될 수 있습니다</Text>   
                    <Text style={ styles.regularText }>- 단말기정보(OS, 화면사이즈, 디바이스 아이디, 폰기종, 단말기 모델명), IP Address, 쿠키, 방문 일시, 서비스 이용 기록, 불량 이용 기록 등의 정보</Text>   
                    <Text style={ styles.regularText }>③ ㈜더스윙골프 회원을 대상으로 부가 서비스 및 맞춤식 서비스 이용 또는 이벤트 응모 과정에서 해당 서비스의 이용자에 한해서만 아래와 같은 정보들이 수집될 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>④ 상품구입 시 배송을 위해 배송정보(이름, 이메일, 휴대폰번호, 주소)를 수집하며, 유료 서비스를 이용하는 과정에서 결제 등을 위하여 불가피하게 필요한 때에는 아래와 같이 결제에 필요한 정보가 수집될 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>- 신용카드 결제시 : 카드사명, 카드번호 등</Text>   
                    <Text style={ styles.regularText }>- 휴대전화 결제시 : 이동전화번호, 통신사, 결제승인번호 등</Text>   
                    <Text style={ styles.regularText }>- 계좌이체시 : 은행명, 계좌번호 등</Text>   
                    <Text style={ styles.regularText }>- 상품권 이용시 : 상품권 번호</Text>   
                    <Text style={ styles.regularText }>⑤ 스크린골프 매장에서 ㈜더스윙골프가 서비스중인 스크린골프 시뮬레이션을 이용해 라운딩을 하는 경우, 다음의 정보들이 수집될 수 있으며, 홈페이지 또는 개별 어플리케이션을 통한 서비스 제공 목적으로 수집하고 있습니다.</Text>   
                    <Text style={ styles.regularText }>- 계정정보, 닉네임, 방문매장, 코스, 게임모드(종류), 경기일자, 본인 및 동반자의 골프기록정보, 스윙영상정보, 대회정보</Text>   
                    <Text style={ styles.regularText }>⑥ ㈜더스윙골프 스크린골프장 예약서비스를 이용하는 경우 다음의 정보가 수집될 수 있으며, 예약하고자 하는 골프장에 제공될 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>- 예약 매장, 예약 시간, 성명, 휴대폰번호, 각종 결제를 진행하기 위하여 필요한 정보</Text>   
                    
                    <Text style={ styles.semiBoldText}>2. 개인정보 수집 방법</Text>
                    <Text style={ styles.regularText }>회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 최초 회원가입 당시 또는 서비스를 이용하는 과정에서 아래와 같은 최소한의 개인정보를 필수항목으로 수집하고 있습니다. 회사는 다음과 같은 방법으로 개인정보를 수집합니다.</Text>   
                    <Text style={ styles.regularText }>- 홈페이지, 서면 양식, 팩스, 전화, 상담 게시판, 이메일, 이벤트 응모, 배송요청</Text>   
                    <Text style={ styles.regularText }>- 이벤트 및 상담요청을 위한 개인정보 수집</Text>   
                    <Text style={ styles.regularText }>- ㈜더스윙골프의 가맹 매장에서 운영하는 시뮬레이션(시스템)을 통한 본인의 라운드 정보(라운드 기록, 영상, 대회 기록 등) </Text>   
                    <Text style={ styles.regularText }>단, 회원의 위와 같은 서비스 제공을 위하여 매장으로부터 라운드 정보를 제공받고 내장객의 골프기록 및 스윙영상정보를 수집하며. 회원이 포함된 팀/단체의 라운드 기록 및 영상정보는 회원자격 유지기간동안 보관/제공됩니다.</Text>   
                    <Text style={ styles.regularText }>- 생성정보 수집 툴을 통한 수집</Text>   
                    <Text style={ styles.regularText }>- 온/오프라인 경품행사 응모시 및 쇼핑몰 배송을 위한 개인정보 수집</Text>   
                    <Text style={ styles.regularText }>- 이벤트 및 상담요청을 위한 개인정보 수집</Text>   
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제3조. 개인정보 처리 및 보유기간</Text>
                    <Text style={ styles.regularText }>회사는 다음의 개인정보 항목을 처리하고 있습니다.</Text>   
                    <Text style={ styles.regularText }>① 회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 개인정보 처리·보유합니다. 다만, 관계 법령의 규정에 따라 보존할 필요성이 있는 경우에는 관계법령에 따라 보존합니다.</Text>   
                    <Text style={ styles.regularText }>② 회원의 경우 개인정보의 보유 및 이용 기간은 서비스 이용계약 체결시(회원가입시)부터 서비스 이용계약 해지(탈퇴신청, 직권탈퇴 포함)까지 입니다. 회사는 다른 법령에서 별도의 기간을 정하고 있거나 고객의 요청이 있는 경우를 제외하면, 법령에서 정의하는 기간(1년) 동안 재이용하지 아니하는 회원의 개인정보를 파기하거나 다른 회원의 개인정보와 분리하여 별도로 저장·관리합니다. 단, 기간 만료 30일 전까지 개인정보가 파기되거나 분리되어 저장·관리되는 사실과 기간 만료일 및 해당 개인정보의 항목을 이메일·서면·모사전송·전화 또는 이와 유사한 방법 중 어느 하나의 방법으로 회원에게 알립니다.</Text>   
                    <Text style={ styles.regularText }>③ 관련 법령에 의한 개인정보 보유 기간은 다음과 같습니다.</Text>   
                    <View style={ styles.table }>
                        <View style={[ styles.rowContainer, { backgroundColor: '#cccccc' } ]}>
                            <Text style ={ styles.tableHead }>보유 항목</Text>
                            <Text style ={ styles.tableHead }>보유기간</Text>
                            <Text style ={ styles.tableHead }>관련 법률</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>계약 또는 청약철회 등에 관한 기록</Text>
                            <Text style ={ styles.tableBody }>5년</Text>
                            <Text style ={ styles.tableBody }>「전자상거래 등에서의 소비자보호에 관한 법률」</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>대금결제 및 재화 등의 공급에 관한 기록</Text>
                            <Text style ={ styles.tableBody }>5년</Text>
                            <Text style ={ styles.tableBody }>「전자상거래 등에서의 소비자보호에 관한 법률」</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>소비자의 불만 또는 분쟁처리에 관한 기록</Text>
                            <Text style ={ styles.tableBody }>3년</Text>
                            <Text style ={ styles.tableBody }>「전자상거래 등에서의 소비자보호에 관한 법률」</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>표시/광고에 관한 기록</Text>
                            <Text style ={ styles.tableBody }>6개월</Text>
                            <Text style ={ styles.tableBody }>관련 법률</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>서비스 방문 기록</Text>
                            <Text style ={ styles.tableBody }>3개월</Text>
                            <Text style ={ styles.tableBody }>「통신비밀보호법」</Text>
                        </View>
                    </View>

                    <Text style={ styles.regularText }>④ 관련 법령에 그 근거가 없더라도, 회사의 중대한 손실을 예방하거나, 범죄 및 소송 등을 위해 보관해야 하는 경우 회사방침에 따라 보관할 수 있습니다. 단 그 목적을 달성하기 위한 최소한의 기간 및 항목만 보관합니다</Text>   
                    <View style={ styles.table }>
                        <View style={[ styles.rowContainer, { backgroundColor: '#cccccc' } ]}>
                            <Text style ={ styles.tableHead }>보관 정보</Text>
                            <Text style ={ styles.tableHead }>보관기간</Text>
                            <Text style ={ styles.tableHead }>보관 사유</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>부정이용 회원 탈퇴 후 이용자 정보에 관한 기록</Text>
                            <Text style ={ styles.tableBody }>6개월</Text>
                            <Text style ={ styles.tableBody }>부정이용 회원의 재발 방지</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>이용약관에 따라 자격이 상실된 회원정보</Text>
                            <Text style ={ styles.tableBody }>5년</Text>
                            <Text style ={ styles.tableBody }>부정이용 회원의 재발 방지</Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제4조. 개인정보의 제3자 제공</Text>
                    <Text style={ styles.regularText }>① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 ｢개인정보 보호법｣ 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다. 다만, 아래의 경우에는 예외로 합니다.</Text>   
                    <Text style={ styles.regularText }>1) 고객님이 사전에 공개하거나 제3자 제공에 동의한 경우</Text>   
                    <Text style={ styles.regularText }>2) 법령에 의하거나, 수사, 조사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관 및 감독당국의 요구가 있는 경우</Text>   
                    <Text style={ styles.regularText }>3) 재화 등의 거래에 따른 대금정산을 위하여 필요한 경우</Text>   
                    <Text style={ styles.regularText }>4) 법률의 규정 또는 관계 법률에 의하여 필요한 불가피한 사유가 있는 경우</Text>   
                    <Text style={ styles.regularText }>5) 영업의 이동 및 합병 등</Text>   
                    <Text style={ styles.regularText }>② 회사는 원할한 서비스 제공을 위해 다음의 경우 정보주체의 동의를 얻어 필요 최소한의 범위로만 제공합니다.</Text>   
                    <View style={ styles.table }>
                        <View style={[ styles.rowContainer, { backgroundColor: '#cccccc' } ]}>
                            <Text style ={ styles.tableHead }>제공받는 자</Text>
                            <Text style ={ styles.tableHead }>제공목적</Text>
                            <Text style ={ styles.tableHead }>제공항목</Text>
                            <Text style ={ styles.tableHead }>보유 및 이용기간</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>㈜더스윙커머스 </Text>
                            <Text style ={ styles.tableBody }>주문상품의 배송.반품.환불.고객상담</Text>
                            <Text style ={ styles.tableBody }>이름, 이메일, 주소,휴대전화번호</Text>
                            <Text style ={ styles.tableBody }>서비스제공 목적달성시까지, 관계 법령이 정한 시점까지 보존</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>㈜더스윙골프 가맹 골프매장</Text>
                            <Text style ={ styles.tableBody }>예약 내역 확인</Text>
                            <Text style ={ styles.tableBody }>이름, 이용시간, 휴대전화번호</Text>
                            <Text style ={ styles.tableBody }>서비스제공 목적달성시까지, 관계 법령이 정한 시점까지 보존</Text>
                        </View>
                    </View>
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제5조. 개인정보처리의 위탁</Text>
                    <Text style={ styles.regularText }>① 회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리 업무를 위탁하고 있습니다.</Text>   
                    <View style={ styles.table }>
                        <View style={[ styles.rowContainer, { backgroundColor: '#cccccc' } ]}>
                            <Text style ={ styles.tableHead }>위탁받는자</Text>
                            <Text style ={ styles.tableHead }>위탁업무내용</Text>
                            <Text style ={ styles.tableHead }>개인정보의 보유 및 이용기간</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>Amazon Web Services Inc.</Text>
                            <Text style ={ styles.tableBody }>휴대폰 본인 인증, 이메일 본인인증, 클라우드 서버 운영 및 관리</Text>
                            <Text style ={ styles.tableBody }>회원탈퇴 또는 위탁 계약 종료시까지</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <Text style ={ styles.tableBody }>카페24</Text>
                            <Text style ={ styles.tableBody }>쇼핑(마켓) 시스템 운영 및 관리 </Text>
                            <Text style ={ styles.tableBody }>회원탈퇴 또는 위탁 계약 종료시까지</Text>
                        </View>
                    </View>
                    <Text style={ styles.regularText }>② 회사는 위탁계약 체결 시 ｢개인정보 보호법｣ 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리∙감독, 손해배상 등 책임에 관한 사항을 계약서 등 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독하고 있습니다.</Text>   
                    <Text style={ styles.regularText }>③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하도록 하겠습니다.</Text>   
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제6조. 정보주체와 법정대리인의 권리∙의무 및 행사방법</Text>
                    <Text style={ styles.regularText }>① 정보주체는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>② 제1항에 따른 권리 행사는 회사에 대해 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 회사는 이에 대해 지체없이 조치하겠습니다.</Text>   
                    <Text style={ styles.regularText }>③ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 “개인정보 처리 방법에 관한 고시(제2020-7호)” 별지 제11호 서식에 따른 위임장을 제출하셔야 합니다.</Text>   
                    <Text style={ styles.regularText }>④ 개인정보 열람 및 처리정지 요구는 개인정보보호법 제35조 제4항, 제37조 제2항에 의하여 정보주체의 권리가 제한 될 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>⑤ 개인정보의 정정 및 삭제 요구는 다른 법령에서 그 개인정보가 수집 대상으로 명시되어 있는 경우에는 그 삭제를 요구할 수 없습니다.</Text>   
                    <Text style={ styles.regularText }>⑥ 회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</Text>   
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제7조. 개인정보 열람청구</Text>
                    <Text style={ styles.regularText }>정보주체는 ｢개인정보 보호법｣ 제35조에 따른 개인정보의 열람 청구를 아래의 부서에 할 수 있습니다. 회사는 정보주체의 개인정보 열람청구가 신속하게 처리되도록 노력하겠습니다.</Text>   
                    <View style={ styles.table }>
                        <View style={[ styles.rowContainer, { backgroundColor: '#cccccc' } ]}>
                            <Text style ={ styles.tableHead }>개인정보 열람청구 접수·처리 부서</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <View style={ styles.tableBox }>
                                <Text style ={[ styles.tableBody, { flex: 0 }]}>담당부서</Text>
                            </View>
                            <Text style ={ styles.tableBody }>개발실</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <View style={ styles.tableBox }>
                                <Text style ={[ styles.tableBody, { flex: 0 }]}>담당자</Text>
                            </View>
                            <Text style ={ styles.tableBody }>장대훈</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <View style={ styles.tableBox }>
                                <Text style ={[ styles.tableBody, { flex: 0 }]}>연락처</Text>
                            </View>
                            <Text style ={ styles.tableBody }>1855-0753</Text>
                        </View>
                        <View style={ styles.rowContainer }>
                            <View style={ styles.tableBox }>
                                <Text style ={[ styles.tableBody, { flex: 0 }]}>이메일</Text>
                            </View>
                            <Text style ={ styles.tableBody }>sominha@the-swing.co.kr</Text>
                        </View>
                        
                    </View>
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제8조. 개인정보의 파기</Text>
                    <Text style={ styles.regularText }>① 회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.</Text>   
                    <Text style={ styles.regularText }>② 정보주체로부터 동의 받은 개인정보 보유기간이 경과하거나 처리 목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.</Text>   
                    <Text style={ styles.regularText }>③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.</Text>   

                    <Text style={ styles.semiBoldText}>1. 파기절차</Text>
                    <Text style={ styles.regularText }>- 회사는 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</Text>   
                    <Text style={ styles.regularText }>- 정보주체의 개인정보는 이용목적의 달성 및 이용자의 서비스 해지(탈퇴) 요청이 있을 경우 지체 없이 파기합니다.</Text>   
                    <Text style={ styles.regularText}>단, 회사의 내부방침 또는 법령에 의하여 보존할 필요성이 있는 경우에는 별도의 DB로 옮겨져 보존합니다. 이 때, DB로 옮겨진 개인정보는 법령에 의한 경우가 아니고서는 다른 목적으로 이용되지 않습니다.</Text>
                    
                    <Text style={ styles.semiBoldText}>2. 파기방법</Text>
                    <Text style={ styles.regularText }>회사는 전자적 파일 형태로 기록∙저장된 개인정보는 기록을 재생할 수 없도록 기술적 방법을 사용하여 파기하며, 종이 문서에 기록∙저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</Text>
                </View> 

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제9조. 개인정보의 안전성 확보 조치</Text>
                    <Text style={ styles.regularText }>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</Text>   
                    <Text style={ styles.regularText }>1. 관리적 조치 : 내부관리계획 수립∙시행, 정기적 직원 교육 등</Text>   
                    <Text style={ styles.regularText }>2. 기술적 조치 : 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치</Text>   
                    <Text style={ styles.regularText }>3. 물리적 조치 : 전산실, 자료보관실 등의 접근통제</Text>   
                </View> 

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제10조. 개인정보 자동 수집 장치의 설치, 운영 및 그 거부에 관한 사항</Text>
                    <Text style={ styles.regularText }>① 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 ‘쿠키(cookie)’를 사용합니다.</Text>   
                    <Text style={ styles.regularText }>② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자들의 PC 컴퓨터내의 하드디스크에 저장되기도 합니다.</Text>   
                    <Text style={ styles.regularText }>1. 쿠키의 사용목적: 이용자가 방문한 각 서비스와 웹 사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부, 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.</Text>   
                    <Text style={ styles.regularText }>2. 쿠키의 설치∙운영 및 거부 : 웹브라우저 상단의 도구&gt;인터넷 옵션&gt;개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>3. 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>③ 이용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 언제든지 이러한 쿠키의 저장을 거부하거나 삭제할 수 있습니다. 쿠키의 설정은 웹 브라우저별 옵션 선택을 통해 모든 쿠키를 허용, 쿠키가 저장될 때 마다 확인, 모든 쿠키의 저장을 거부할 수 있습니다. 이러한 쿠키의 설정 방법은 웹브라우저에 따라 차이가 있으므로, 자세한 사항은 각 브라우저 별 도움말을 참고해 주시기 바랍니다.</Text>   
                    <Text style={ styles.regularText }>- Internet Explorer 웹 브라우저</Text>   
                    <Text style={ styles.regularText }>[도구] &gt; [인터넷 옵션] &gt; [개인정보] 탭 &gt; [고급] 변경</Text>   
                    <Text style={ styles.regularText }>- Chrome 웹 브라우저</Text>   
                    <Text style={ styles.regularText }>우측 상단 메뉴 [설정] &gt; [개인정보 및 보안] &gt; [사이트 설정] &gt; [쿠키 및 사이트 데이터] 설정</Text>   
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제11조. 개인정보 보호책임자 및 담당부서</Text>
                    <Text style={ styles.regularText }>① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</Text>   
                    <Text style={ styles.regularText }>▶ 개인정보 보호책임자</Text>   
                    <Text style={ styles.regularText }>- 성명 : 장대훈</Text>   
                    <Text style={ styles.regularText }>- 직책 : 부장</Text>   
                    <Text style={ styles.regularText }>- 연락처 : 1855-0753</Text>   
                    <Text style={ styles.regularText }>- 이메일 : sominha@the-swing.co.kr</Text>   
                    <Text style={ styles.regularText }>※ 고객센터로 연결됩니다.</Text>   
                    <Text style={ styles.regularText }>▶ 개인정보 보호 담당부서</Text>   
                    <Text style={ styles.regularText }>- 부서명 : 개발실</Text>   
                    <Text style={ styles.regularText }>- 담당자 : 장대훈</Text>   
                    <Text style={ styles.regularText }>- 연락처 : 1855-0753</Text>   
                    <Text style={ styles.regularText }>- 이메일 : sominha@the-swing.co.kr</Text>   
                    <Text style={ styles.regularText }>② 정보주체는 회사의 서비스(또는 사업)를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드릴 것입니다.</Text>   
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제12조. 권익침해 구제방법</Text>
                    <Text style={ styles.regularText }>정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.</Text>   
                    <Text style={ styles.regularText }>※ 아래의 기관은 회사와는 별개 기관으로서, 자체적인 개인정보 불만처리, 피해구제 결과에 만족하지 못하시거나 보다 자세한 도움이 필요하시면 문의하여 주시기 바랍니다.</Text>   
                    <Text style={ styles.regularText }>1. 개인정보 침해신고센터 (한국인터넷진흥원 운영)</Text>   
                    <Text style={ styles.regularText }>- 소관업무 : 개인정보 침해사실 신고, 상담 신청</Text>   
                    <Text style={ styles.regularText }>- 홈페이지 : privacy.kisa.or.kr</Text>   
                    <Text style={ styles.regularText }>- 전화 : (국번없이) 118</Text>   
                    <Text style={ styles.regularText }>- 주소 : (58324) 전남 나주시 진흥길 9(빛가람동 301-2) 3층</Text>   
                    <Text style={ styles.regularText }>2. 개인정보 분쟁조정위원회</Text>   
                    <Text style={ styles.regularText }>- 소관업무 : 개인정보 분쟁조정신청, 집단분쟁조정 (민사적 해결)</Text>   
                    <Text style={ styles.regularText }>- 홈페이지 : www.kopico.go.kr</Text>   
                    <Text style={ styles.regularText }>- 전화 : (국번없이) 1833-6972</Text>   
                    <Text style={ styles.regularText }>- 주소 : (03171)서울특별시 종로구 세종대로 209 정부서울청사 12층</Text>   
                    <Text style={ styles.regularText }>3. 대검찰청 사이버범죄수사단 : 02-3480-3573 (www.spo.go.kr)</Text>   
                    <Text style={ styles.regularText }>4. 경찰청 사이버안전국 : 182 (cyberbureau.police.go.kr)</Text>   
                </View>

                <View style={{ marginVertical: 24 }}>
                    <Text style={ styles.semiBoldText}>제13조. 개인정보처리방침의 변경</Text>
                    <Text style={ styles.regularText }>본 개인정보처리방침은 정부의 정책 또는 회사의 필요에 의하여 변경될 수 있습니다. 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다. 다만, 개인정보의 수집 및 활용, 제3자 제공 등과 같이 이용자 권리의 중요한 내용 변경이 있을 경우에는 최소 30일전에 고지합니다.</Text>   
                    <Text style={ styles.regularText }>① 이 개인정보 처리방침은 2023년 11월 6일부터 적용됩니다.</Text>   
                    {/* <Text style={ styles.regularText }>■ 위와 같은 개인정보 수집 및 이용에 동의하십니까? [ 동의 □ ] / [ 미동의 □ ]</Text>   
                    <Text style={ styles.regularText }>■ 위의 제 4조 개인정보 제3자 제공 및 이용에 동의하십니까? [ 동의 □ ] / [ 미동의 □ ]</Text>   
                    <Text style={ styles.regularText }>■ 위의 제 5조 개인정보 위탁 관리 및 이용에 동의하십니까? [ 동의 □ ] / [ 미동의 □ ]</Text>    */}
                </View>
            </View>
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
    }
})

export default PrivacyPolicy