export const navbarStyles = {
    drawer: {
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: '#2C3639',
            color: '#DCD7C9',
        },
        '& .Mui-selected': {
            color: '',
        },
    },
    icons: {
        color: '#DCD7C9',
        marginLeft: '20px',
    },
    text: {
        fontFamily: 'Noto Sans KR',
        fontWeight: '300',
        fontSize: '15px',
        '&:hover': {
            color: '#A27B5C',
        },
        '&:active': {
            color: '#A27B5C',
        },
    },


};