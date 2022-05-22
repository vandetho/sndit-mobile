import React from 'react';
import { Package } from '@interfaces';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { GradientIcon } from '@components';
import { useTheme } from '@react-navigation/native';
import { useVisible } from '@hooks';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import MapView, { Marker } from 'react-native-maps';

const BUTTON_HEIGHT = 40;
const PADDING = 15;

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: PADDING,
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    modalTopContainer: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

interface MapButtonProps {
    item: Package;
}

const MapButton = React.memo<MapButtonProps>(({ item }) => {
    const { colors } = useTheme();
    const mapRef = React.useRef<MapView>(null);
    const bottomSheetRef = React.useRef<BottomSheetModal>(null);
    const { visible, onToggle, onClose } = useVisible();
    const [mapRegion, setMapRegion] = React.useState({
        longitude: item.longitude,
        latitude: item.latitude,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
    });

    React.useEffect(() => {
        if (bottomSheetRef.current) {
            if (visible) {
                bottomSheetRef.current.present();
                return;
            }
            bottomSheetRef.current.close();
        }
    }, [visible]);

    const snapPoint = React.useMemo(() => ['65%', '85%'], []);

    if (item.latitude && item.latitude) {
        return (
            <React.Fragment>
                <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: colors.card }]} onPress={onToggle}>
                    <GradientIcon name="map-marker-alt" />
                </TouchableOpacity>
                <BottomSheetModal
                    backgroundStyle={{ backgroundColor: colors.card }}
                    handleIndicatorStyle={{ backgroundColor: colors.text }}
                    snapPoints={snapPoint}
                    ref={bottomSheetRef}
                    onDismiss={onClose}
                >
                    <TouchableOpacity
                        style={[styles.buttonContainer, { backgroundColor: colors.background }]}
                        onPress={onClose}
                    >
                        <GradientIcon name="times" />
                    </TouchableOpacity>
                    <MapView
                        initialRegion={{
                            longitude: item.longitude,
                            latitude: item.latitude,
                            latitudeDelta: 0.004,
                            longitudeDelta: 0.004,
                        }}
                        region={mapRegion}
                        style={{ width: '100%', height: '100%' }}
                        scrollEnabled
                        zoomEnabled
                        pitchEnabled
                        rotateEnabled
                        onRegionChange={setMapRegion}
                        //provider={PROVIDER_GOOGLE}
                        ref={mapRef}
                    >
                        <Marker
                            coordinate={{
                                longitude: item.longitude,
                                latitude: item.latitude,
                                latitudeDelta: 0.004,
                                longitudeDelta: 0.004,
                            }}
                        />
                    </MapView>
                </BottomSheetModal>
            </React.Fragment>
        );
    }

    return null;
});

export default MapButton;
