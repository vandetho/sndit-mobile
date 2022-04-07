import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@components/Text';
import { GradientIcon } from '@components/Gradient/GradientIcon';
import { BarLoader } from '@components/Loader/BarLoader';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useMap } from '@contexts';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
    map: {
        height: 200,
        borderRadius: 15,
    },
});

type MapScreenNavigationProps = StackNavigationProp<ApplicationStackParamsList, 'Map'>;

interface MapProps {
    onChange: (coords: { latitude: number; longitude: number }) => void;
}

const Map = React.memo<MapProps>(({ onChange }) => {
    const { t } = useTranslation();
    const mapRef = React.useRef<MapView>(null);
    const navigation = useNavigation<MapScreenNavigationProps>();
    const { region, onSelectRegion, isLoading } = useMap();
    const [currenLocation, setCurrenLocation] = React.useState(isLoading);
    const [mapRegion, setMapRegion] = React.useState<Region>({
        ...region,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004,
    });

    React.useEffect(() => {
        setCurrenLocation(isLoading);
    }, [isLoading]);

    const onSelectCurrentLocation = React.useCallback(async () => {
        setCurrenLocation(true);

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setMapRegion({
            longitude: region.longitude,
            latitude: region.latitude,
            latitudeDelta: 0.004,
            longitudeDelta: 0.004,
        });
        if (mapRef.current) {
            mapRef.current.animateCamera({
                center: {
                    longitude: region.longitude,
                    latitude: region.latitude,
                },
            });
        }
        onChange({
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
        });
        setCurrenLocation(false);
    }, [onChange, region.latitude, region.longitude]);

    const onMapPress = React.useCallback(() => {
        if (!currenLocation) {
            onSelectRegion(mapRegion);
            navigation.navigate('Map', { draggable: true });
        }
    }, [currenLocation, mapRegion, navigation, onSelectRegion]);

    return (
        <React.Fragment>
            <View style={{ paddingVertical: 25 }}>
                <TouchableOpacity
                    disabled={currenLocation}
                    onPress={onSelectCurrentLocation}
                    style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            marginHorizontal: 20,
                            fontWeight: 'bold',
                            textAlign: 'center',
                            textDecorationLine: 'underline',
                        }}
                    >
                        {t('use_current_location')}
                    </Text>
                    {currenLocation ? <BarLoader /> : <GradientIcon name="location-arrow" />}
                </TouchableOpacity>
            </View>
            <View style={{ borderRadius: 15, paddingHorizontal: 20 }}>
                <MapView
                    style={styles.map}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    region={mapRegion}
                    provider={PROVIDER_GOOGLE}
                    ref={mapRef}
                    onPress={onMapPress}
                >
                    {mapRegion && (
                        <Marker coordinate={{ latitude: mapRegion.latitude, longitude: mapRegion.longitude }} />
                    )}
                </MapView>
            </View>
        </React.Fragment>
    );
});

export default Map;
