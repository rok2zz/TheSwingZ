import { TextInput } from "react-native";

export interface Focus {
    ref: React.RefObject<TextInput>,
    isFocused: boolean
}

export interface Message {
    type: string,
    msg: string
}

export interface Timer {
    type: string,
    isActive: boolean
}

export interface Form {
    id: number,
    type: string,
    ref: React.RefObject<TextInput>,
    value: string,
    placeholder: string
}

export interface Store {
	name: string,
	address: string,
	contact: string,
	time: string
}

export interface RevSet {
    index: number
    value: number[]
}
