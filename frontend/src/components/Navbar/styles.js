export const navbarStyles = {
    drawer: {
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: '#101F33',
            color: 'rgba(255, 255, 255, 0.7)',
        },
        '& .Mui-selected': {
            color: '',
        },
    },
    icons: {
        color: 'rgba(255, 255, 255, 0.7)!important',
        marginLeft: '20px',
    },
    text: {
        '& span': {
            marginLeft: '10px',  // -10px
            fontWeight: '550',
            fontSize: '15px',
        }
    }
};