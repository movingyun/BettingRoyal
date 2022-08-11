export const navbarStyles = {
    drawer: {
        flexShrink: 0,
        margin:0,
        '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: '#202425',
            color: '#DCD7C9',
            border: 'none',
            margin:0,
        },
    },

    divider:{
        // borderWidth: '5px',
        // borderTop: '3px solid #bbb',
        borderColor: '#DCD7C9',

    },
    
    topList: {
        paddingTop:0,
        paddingBottom:0,
        width: '100%',
        textAlign: 'center',
    },

    topInfo: {
        // backgroundColor: 'aqua',
        paddingTop: '5px',
        paddingLeft: '5px',
        textAlign : 'left',
        margin: '10px',
    },

    infoName:{
        fontFamily: 'Noto Sans KR',
        fontSize: '19px',
        // marginBottom: '5px',
        fontWeight: 600,

    },
    infoRuby:{
        fontFamily: 'Noto Sans KR',
        fontSize: '16px',
        fontWeight: 400,
    },

    centerList: {
        paddingTop:0,
        paddingBottom:0,
    },

    bottomList: {
        paddingTop:0,
        paddingBottom:0,
        position: 'absolute',
        backgroundColor: '#2C3639',
        bottom: 0,
        width: '100%',
    },

    center: {
        paddingTop:'10px',
        paddingBottom:'10px',
        '&:hover': {
            backgroundColor: '#2C3639',
        },
        '&:focus': {
            backgroundColor: '#A27B5C',
        },
    },

    icons: {
        color: '#DCD7C9',
        marginLeft: '20px',
    },
    centerText: {
        fontFamily: 'Noto Sans KR',
        fontWeight: '300',
        fontSize: '15px',
    },

    bottom: {
        paddingTop:'10px',
        paddingBottom:'10px',
        bottom: '0%',
        fontFamily: 'Noto Sans KR',
        fontWeight: '300',
        fontSize: '15px',
        textAlign : 'center',
        '&:hover': {
            backgroundColor: '#A27B5C',
        },
        '&:focus': {
            backgroundColor: '#A27B5C',
        },

    },

    bottomText: {
        fontFamily: 'Noto Sans KR',
        fontWeight: '300',
        fontSize: '15px',
        textAlign : 'center',
    },

    btn: {
        marginLeft: '5px',
        marginRight: '5px',
        marginBottom: '10px',
        fontFamily: 'Noto Sans KR',
        color: '#DCD7C9',
        backgroundColor: '#2C3639',
        borderRadius: 0,
        width: '44%',
        fontSize: '15px',

        '&:hover': {
            backgroundColor: '#A27B5C',
        },
        '&:focus': {
            backgroundColor: '#A27B5C',
        },
    },

};
