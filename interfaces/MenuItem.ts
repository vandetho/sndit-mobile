import { SettingStackParamsList } from '@navigations';

export interface MenuItem {
    key: string;
    text: string;
    color?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
    textColor?: string;
    icon?: any;
    animatedIcon?: boolean;
    align?: string;
    screen?: keyof SettingStackParamsList;
    onPress?: () => void;
}
