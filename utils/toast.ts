import Toast from 'react-native-toast-message';
import { ToastShowParams } from 'react-native-toast-message/lib/src/types';

export const showToast = (params: ToastShowParams = { visibilityTime: 3000, position: 'bottom' }) => {
    Toast.show(params);
};
