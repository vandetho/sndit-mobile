import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { PALETTE } from '@theme';
import { BarLoader } from '@components/Loader/BarLoader';

interface FullScreenLoaderProps {
    visible: boolean;
}

const FullScreenLoader = React.memo<FullScreenLoaderProps>(({ visible }) => {
    if (visible) {
        return (
            <Modal animationType="fade" transparent={true} visible={visible}>
                <View style={styles.modalContainer}>
                    <View style={[styles.container, { backgroundColor: PALETTE.primary }]}>
                        <BarLoader color="#FFFFFF" size={10} />
                    </View>
                </View>
            </Modal>
        );
    }
    return null;
});

export default FullScreenLoader;

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        borderRadius: 15,
    },
    separator: {
        marginVertical: 10,
        height: 2,
    },
    headerContainer: {
        paddingHorizontal: 20,
        height: 50,
    },
    buttonText: {
        marginBottom: 2,
        fontSize: 14,
        textAlign: 'right',
        textDecorationLine: 'underline',
    },
});
