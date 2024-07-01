import { UserInfo } from "../slices/auth"
import { CourseImage, CourseInfo, CourseThumnail } from "../slices/course"
import { Record, Stat } from "../slices/record"
import { ReservationInfo, ReservationTime, ShopInfo } from "../slices/reservation"
import { Thumbnail, VideoList } from "../slices/video"

// async storage
export interface LoginData {
    userInfo: UserInfo,
    token?: Token
}

export interface Token {
    accessToken?: string | null,
    refreshToken?: string | null
}

// request & response
export interface Body {
    cls: string,
    method: string,
    params?: (string | boolean | number | number[] | UserSettingBody[] | Date | null)[]
}

export interface Response {
    data: { 
        code: number,
        msg?: string,

        result?: {
            uid?: number | null,
            phone?: string,
            name?: string,
            nick?: string 
            user?: {
                name?: string | null,
                category?: string
            }
        
            payload?: string,
            url?: string,
        
            users?: UserProfileImgs[]

            // course
            ccList?: CourseInfo[]

            // board
            noticeList?: NoticeListResult
            notice?: NoticeResult
        
            // token
            token?: string,
            accessToken?: string,
            refreshToken?: string,
        }
    }
}

// board result
export interface NoticeListResult {
    total?: number,
    list?: NoticeList[]
}

export interface NoticeList {
    id: number,
    type: number,
    title: string,
    pinYn: string,
    view: number,
    createdAt: string
}

export interface NoticeResult {
    detail: {
        id: number,
        title: string,
        detail: string,
        type: number,
        view: number,
        createdAt: string,
        attach: NoticeAttach[]
    },
    before: {
        id: number,
        title: string,
        type: number,
        createdAt: string
    },
    after: {
        id: number,
        title: string,
        type: number,
        createdAt: string
    }
}

export interface NoticeAttach {
    key: string
}

export interface FAQResult {
    list?: FAQList[]
}

export interface FAQList {
    id: number,
    title: string,
    detail: string,
    type: number,
    attach: string[]
}

export interface InquiryResult {
    total?: number,
    list?: InquiryList[],
    inquiry?: Inquiry
}

export interface InquiryList {
    id: number,
    status: string,
    title: string,
    type: number,
    realName: string,
    createdAt: string
}

export interface Inquiry {

}

export interface UserSettingBody {
    codeId: string,
    codeValue: string,
    codeStatus: string
}

export interface Payload {
    code: number,
    msg?: string,

    update?: string,

    uid?: number | null,
    name?: string
    phone?: string,
    userID?: string,
    nick?: string,
    category?: string,

    record?: Record,
    thumbnailList?: Thumbnail[]
    stat?: Stat,

    revId?: number,

    bill?: Bill[],
    operationTime?: OperationTime[],
    shopImages?: ShopImages[],
    notice?: string,

    userProfileImgs?: UserProfileImgs[],


    noticeList?: NoticeListResult,
    noticeResult?: NoticeResult
}

export interface LoginResult {
    uid: number,
    type: number,
    status: string,
    realName: string,
    phone: string,
    country: string,
    language: string,
    updatedAt: string,
    birth: string,
    gender: string,
    name: string,
    nick: string,
    email: string,
    point: number,
    createdAt: string,
    pwdUpdatedAt: string,
    category: string,
    favoriteLocate: string,
    profileImg: string | null,

    accessToken: string,
    refreshToken: string,
}

export interface ResponseResult {
    uid?: number | null,
    phone?: string,
    name?: string,
    nick?: string 
    user?: {
        name?: string | null,
        category?: string
    }

    payload?: string,
    url?: string,

    users?: UserProfileImgs[]

    token?: string,
    accessToken?: string,
    refreshToken?: string,
}

export interface UserProfileImgs {
    uid: number,
    nick: string,
    profileImg: string,
    url: string
}



export interface LoginResponse {
    data: { 
        code: number,
        msg?: string,

        result?: LoginResult
    }
}

// course
export interface CourseResponse {
    data: {
        code: number,
        msg?: string,

        result?: {
            courses?: CourseImage[]
            urls?: CourseThumnail[]
        }
    }
}

// reservation
export interface ShopResponse {
    data: {
        code: number,
        msg?: string,

        result?: {
            shopList?: ShopInfo[],
            revList?: ReservationTime[],
            myRevList?: ReservationInfo[]
            accessToken?: string
            revId?: number,

            bill?: Bill[],
            time?: OperationTime[],
            images?: ShopImages[],
            notice?: string
        }
    }
}

export interface ShopImages {
    order: number,
    path: string
}

export interface Bill {
    before: string,
    after: string,
    weekYn: string,
    hole: number,
    turningTime: string
}

export interface OperationTime {
    weekly: number,
    closedYn: string,
    restYn: string,
    openedAt: string,
    closedAt: string
}

// settingInfo
export interface SettingResponse {
    data: {
        code: number,
        msg?: string,

        result?: {
            status: string // R: 조회, D: 삭제, E: 에러

            confList: Setting[]
        }
    }
}

export interface Setting {
    uid?: number,
    groupCode: string,
    codeId: string,
    codeName: string,
    codeValue: string,
    codeStatus: string
}

export interface Marketing {
    push: boolean,
    sms: boolean,
    email: boolean,
    kakao: boolean
}

// record
export interface RecordResponse {
    data: {
        code: number,
        msg?: string,

        result?: {
            status: string // R: 조회, D: 삭제, E: 에러
            totCnt: string,
            totShotCnt: string,

            parcount: Count[],
            shotcount: Count[],
            puttcount: Count[],
            teeShotArr: Count[],
            holeIdArr: Count[],
            mulliganArr: Count[],
            fairArr: Count[],
            girArr: Count[],
            concedeArr: Count[],
            parSaveArr: Count[],
            inArr: RoomInfo[],
            ccArr: CcInfo[],

            dtStat: DtStat[],
            fullRndCnt: number,
            handicap: string,
            positionArr: PositionInfo[]
        }
    }
}

export interface Count {
    category: string,
    date: string,
    uid: number,
    roomId: number,

    hole1: number | string | null,
    hole2: number | string | null,
    hole3: number | string | null,
    hole4: number | string | null,
    hole5: number | string | null,
    hole6: number | string | null,
    hole7: number | string | null,
    hole8: number | string | null,
    hole9: number | string | null,
    hole10: number | string | null,
    hole11: number | string | null,
    hole12: number | string | null,
    hole13: number | string | null,
    hole14: number | string | null,
    hole15: number | string | null,
    hole16: number | string | null,
    hole17: number | string | null,
    hole18: number | string | null
}

export interface CcInfo {
    category: string,
    ccId: number,
    uid: number,
    roomId: number,
    ccName: string,
    courseName: string,
    firstCourse: number,
    secondCourse: number,
    courseOrder: string
}

export interface RoomInfo {
    roomId: number,
    shopId: number,
    deviceId: string,
    gameMode: string,
    userCount: number,
    uid: number,
    nick: string,
    category: string,
    shopName: string
}

export interface DtStat {
    no: number,
    uid: number,
    roomId: number,
    totCnt: string,
    totPutts: string,
    avgFair: string,
    avgGir: string,
    maxTeeDist: number,
    avgTeeDist: number,
    avgBackSpin: string,
    avgSideSpin: string
}

export interface PositionInfo {
    uid: number,
    roomId: number,
    ccId: number,
    holeNumber: number,
    holeId: number,
    holeStPositionX: number,
    holeStPositionY: number,
    holeEdPositionX: number,
    holeEdPositionY: number,
    holeMiniX: number,
    holeMiniY: number,
    stMiniX: number,
    stMiniY: number,
    edMiniX: number,
    edMiniY: number,
    shotCount: number,
    landPlace: string,
    shotQuality: string,
    totalDistance: number,
}

// video
export interface VideoResponse {
    data: {
        code: number,
        msg?: string,

        result?: {
            roomList?: VideoList[] | VideoList,
            thumbnailList?: Thumbnail[]
            url?: string,
            total?: number,
            accessToken?: string
        }
    }
}

// board
export interface BoardResponse {
    data: {
        code: number,
        msg?: string,

        result?: {
            total?: number,
            noticeResult: {
                list: string,
                id: number
            }
        }
    }
}

// server info
export interface JsonResponse {
    data: {
        auth_server: string,
        office_server: string,
        game_server: string,
        inspection: boolean,
        start: string,
        end: string
    }
}

// google login api
export interface GoogleResponse {
    idToken: string | null,
    scopes?: string[],
    serverAuthCode: string | null,
    user: {
        email: string,
        familyName: string | null,
        givenName: string | null,
        id: string,
        name: string | null,
        photo: string | null
    }
}


// youtube api
interface YoutubeVideoSnippet {
    publishedAt: string,
    channelId: string,
    title: string,
    description: string,
    thumbnails: {
        default: { url: string, width: number, height: number },
        medium: { url: string, width: number, height: number },
        high: { url: string, width: number, height: number },
    }
    channelTitle: string
}
  
interface YoutubeVideoContentDetails {
    duration: string,
    dimension: string,
    definition: string,
    caption: string,
    licensedContent: boolean,
    contentRating: any,
    projection: string,
}
  
export interface YoutubeVideoItemResponse {
    data: {
        items: YoutubeVideoItem[]
    }
}

interface YoutubeVideoItem {
    kind: string,
    etag: string,
    id: { 
        kind: string,
        videoId: string 
    },
    snippet: YoutubeVideoSnippet,
    contentDetails: YoutubeVideoContentDetails,
    statistics?: {
        viewCount: string
    }
}
  
export interface YoutubeResponse {
    data: {
        kind: string,
        etag: string,
        nextPageToken?: string,
        prevPageToken?: string,
        regionCode: string,
        pageInfo: { 
            totalResults: number, 
            resultsPerPage: number 
        },
        items: YoutubeVideoItem[]
    }
}
  