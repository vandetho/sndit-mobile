import React from 'react';
import { Dimensions, TouchableWithoutFeedback, View } from 'react-native';
import { useVisible } from '@hooks';
import { MaterialIcons } from '@expo/vector-icons';
import { PALETTE } from '@theme';
import { ScannerModal } from './components';

const { width } = Dimensions.get('window');
const NEW_BUTTON_SIZE = 70;
const NEW_BUTTON_RADIUS = NEW_BUTTON_SIZE / 2;
const ICON_SIZE = 40;
const LEFT = width / 2 - NEW_BUTTON_RADIUS;

interface ScannerButtonProps {}

const ScannerButton: React.FC<ScannerButtonProps> = ({}) => {
    const { visible, onToggle } = useVisible();

    return (
        <React.Fragment>
            <TouchableWithoutFeedback onPress={onToggle}>
                <View
                    style={{
                        position: 'absolute',
                        width: NEW_BUTTON_SIZE,
                        height: NEW_BUTTON_SIZE,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: PALETTE.primary,
                        borderRadius: NEW_BUTTON_SIZE / 2,
                        top: -30,
                        left: (width - LEFT * 2) / 2 - 30,
                        zIndex: 10000,
                        elevation: 10000,
                    }}
                >
                    <MaterialIcons name="qr-code-scanner" size={ICON_SIZE} color="#FFFFFF" />
                </View>
            </TouchableWithoutFeedback>
            <ScannerModal visible={visible} onClose={onToggle} />
        </React.Fragment>
    );
};

export default ScannerButton;
