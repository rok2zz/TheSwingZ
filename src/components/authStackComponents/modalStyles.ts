import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: 'center',
    
        paddingTop : 100,
    
        backgroundColor: '#rgba(0, 0, 0, 0.5)'
    },
    modal: {
        width: 350,
    
        backgroundColor: 'white'
    },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 19,
        
        padding: 30,
        paddingLeft: 40,
    
        color: 'black',
        
        borderBottomWidth: 1,
        borderBottomColor: '#b4b4b4'
    },
    modalTextContainer: {
        paddingLeft: 40,
        paddingVertical: 20,
    },
    modalText: {
        fontSize: 15,
    
        marginBottom: 5,
        
        color: 'black'
    },
    modalBtnContainer: {
        flexDirection: 'row',
    },
    modalBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    
        paddingVertical: 20,
    
        backgroundColor: '#b4b4b4' 
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    
        color: 'white'
    },
    inputContainer: {
        width: 350,

        alignItems: 'center',
        justifyContent: 'center',

        marginBottom: 50,
    },
    input: {
        width: 280,

		borderBottomWidth: 1,
	},
    authBtn: {
        paddingHorizontal: 8,
        paddingVertical: 5,

        position: 'absolute',
        right: 8,
        top: 13,

        backgroundColor: '#58b6fe'
    },
    authBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        
        color: 'white'
    },
    timer: {
        paddingVertical: 6,

        color: 'black',

        position: 'absolute',
        right: 10,
        top: 10,
    },
    messageContainer: {
        width: 270,

        marginTop: 10,
    },
    message: {
        fontSize: 14,

        color: '#fb7576',
    }
})