export const lobbyStyles = {
    drawer: {
        flexShrink: 0,
        margin:0,
        '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            backgroundColor: '#3F4E4F',
            color: '#DCD7C9',
            border: 'none',
            margin:0,
        },

    },

    abr: {
        backgroundColor: '#2C3639',
        color: '#DCD7C9',
    },

    logo: {
        // backgroundColor: 'aqua',
        height: '100%',
    },

    divider:{
        borderColor: '#DCD7C9',

    },

    topInfo: {
        fontFamily: 'Noto Sans KR',
        fontWeight: '400',
        // textAlign : 'center',
        color : '#DCD7C9',
        backgroundColor: '#2C3639',
    },

    infoName:{
        fontSize: '19px',
        fontWeight: 400,
        height: '35px',
    },

    infoRuby:{
        fontSize: '16px',
        fontWeight: 400,
    },

    center: {
        paddingTop:'10px',
        paddingBottom:'10px',
        fontFamily: 'Noto Sans KR',
        '&:hover': {
            backgroundColor: '#2C3639',
        },
        '&:focus': {
            backgroundColor: '#A27B5C',
        },
    },

    icons: {
        color: '#DCD7C9',
        marginLeft: '5px',
    },

    bottomList: {
        // backgroundColor: 'aqua',
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },

    bottom: {
        paddingTop:'10px',
        paddingBottom:'10px',
        fontFamily: 'Noto Sans KR',
        '&:hover': {
            backgroundColor: '#2C3639',
        },
        '&:focus': {
            backgroundColor: '#A27B5C',
        },       
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

    
    logout: {
        color: '#DCD7C9',
        // backgroundColor: '#FFF',
        fontFamily: 'Noto Sans KR',
        fontSize: 'medium',
        fontWeight: '500',

        '&:hover': {
            backgroundColor: 'transparent',
            color: '#A27B5C',
        },
        '&:focus': {
            backgroundColor: 'transparent',
            color: '#A27B5C',
        },
    },
};
