import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { useVisible } from '@hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { ScannerModal } from './components';

const ICON_SIZE = 36;
const TAB_HEIGHT = 50;

interface ScannerButtonProps {}

const ScannerButton: React.FC<ScannerButtonProps> = ({}) => {
    const { visible, onToggle } = useVisible();

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={onToggle}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: TAB_HEIGHT,
                        width: 50,
                    }}
                >
                    <MaterialIcons name="qr-code-scanner" size={ICON_SIZE} />
                </View>
            </TouchableWithoutFeedback>
            <ScannerModal visible={visible} onClose={onToggle} />
        </React.Fragment>
    );
};

export default ScannerButton;
