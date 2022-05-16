import { Dimensions } from 'react-native';

export const FONT_SCALE = Dimensions.get('window').fontScale;

export const getHeightWithFontScale = (height: number) => height * FONT_SCALE;
