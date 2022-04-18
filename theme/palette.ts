import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

export const PALETTE = {
    primary: '#F16E8C',
    secondary: '#F48FB1',
    error: '#FF5252',
    success: '#4CAF50',
    warning: '#DEB801',
    info: '#036CD5',
    disabled: '#DDDDDD',
    grey: 'rgb(221, 221, 221)',
};

export const darkTheme: Theme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: PALETTE.primary,
        background: 'rgb(18, 18, 18)',
        card: 'rgb(30, 30, 30)',
        text: 'rgb(225, 225, 225)',
    },
};

export const lightTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: PALETTE.primary,
    },
};

export const gradientColor: { [key: string]: string[] } = {
    amberAmber: ['#ff6f00', '#ffca28'],
    blueIndigo: ['#2962ff', '#3949ab'],
    redPink: ['#FF5252', '#f48fb1'],
    lightBlueTeal: ['#b3e5fc', '#64ffda'],
    lightBlueIndigo: ['#b3e5fc', '#9fa8da'],
    yellowGreen: ['#ffff8d', '#b9f6ca'],
    orangeDeepOrange: ['#ffe0b2', '#ffccbc'],
    deedPurplePurple: ['#d1c4e9', '#f3e5f5'],
    lightGreenAmber: ['#c5e1a5', '#fff8e1'],
    purplePink: ['#ea80fc', '#fce4ec'],
    indigoBlue: ['#303f9f', '#1976d2'],
    brownBrown: ['#6d4c41', '#bbdefb'],
    blueGreyBlue: ['#263238', '#2979ff'],
    purpleDeepOrange: ['#8e24aa', '#ff6e40'],
    greenTeal: ['#43a047', '#1de9b6'],
    indigoLightBlue: ['#3949ab', '#4fc3f7'],
    tealCyan: ['#e0f2f1', '#00e5ff'],
    blueGreyBlueGrey: ['#cfd8dc', '#546e7a'],
    cyanLightGreen: ['#0097a7', '#b2ff59'],
    orangeBlue: ['#e65100', '#1976d2'],
    indigoPurple: ['#303f9f', '#7b1fa2'],
    deepPurpleBlue: ['#6200ea', '#1976d2'],
    deepOrangeOrange: ['#bf360c', '#f57c00'],
    lightBlueCyan: ['#0288d1', '#26c6da'],
    purpleAmber: ['#d500f9', '#ffa000'],
    purpleDeepPurple: ['#7b1fa2', '#7c4dff'],
    purpleLightBlue: ['#e040fb', '#4fc3f7'],
    cyanCyan: ['#18ffff', '#00e5ff'],
    yellowTeal: ['#fff9c4', '#64ffda'],
    pink: ['#F16E8C', '#F48FB1'],
};
