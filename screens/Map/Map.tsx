import React from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ApplicationStackParamsList } from '@navigations/ApplicationNavigator';
import { useMap } from '@contexts';
import { BarLoader, CustomLinearGradient, Header, Text } from '@components';

type MapScreenRouteProp = RouteProp<ApplicationStackParamsList, 'Map'>;

interface MapProps {}

const Map = React.memo<MapProps>(() => {
    const { t } = useTranslation();
    const mapRef = React.useRef<MapView>(null);
    const navigation = useNavigation();
    const { params } = useRoute<MapScreenRouteProp>();
    const { width, height } = useWindowDimensions();
    const { selectRegion, onSelectRegion } = useMap();
    const [currenLocation, setCurrenLocation] = React.useState(false);
    const [mapRegion, setMapRegion] = React.useState(
        params.draggable
            ? selectRegion
            : {
                  longitude: params.longitude,
                  latitude: params.latitude,
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004,
              },
    );

    const onSave = React.useCallback(() => {
        if (!currenLocation) {
            onSelectRegion(mapRegion);
            navigation.goBack();
        }
    }, [currenLocation, mapRegion, navigation, onSelectRegion]);

    const onPressCurrentLocation = React.useCallback(async () => {
        setCurrenLocation(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            return;
        }
        if (params.draggable) {
            const location = await Location.getCurrentPositionAsync({});
            setMapRegion({
                longitude: location.coords.longitude,
                latitude: location.coords.latitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
            });
            if (mapRef.current) {
                mapRef.current.animateCamera({
                    center: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            }
        } else {
            setMapRegion({
                longitude: params.longitude,
                latitude: params.latitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.004,
            });
            if (mapRef.current) {
                mapRef.current.animateCamera({
                    center: {
                        longitude: params.longitude,
                        latitude: params.latitude,
                    },
                });
            }
        }

        setCurrenLocation(false);
    }, [params.draggable, params.latitude, params.longitude]);

    const icon = React.useMemo(() => (params.draggable ? 'location-arrow' : 'map-marker-alt'), [params.draggable]);

    return (
        <View style={styles.container}>
            <Header
                goBackIcon="times"
                goBackTitle="Close"
                disabledBack={currenLocation}
                onRightButtonPress={params.draggable && onSave}
                headerRightIcon="check"
                headerRightTitle="Done"
                containerStyle={styles.headerStyle}
            />
            <MapView
                initialRegion={mapRegion}
                style={{ width, height }}
                scrollEnabled={!currenLocation}
                zoomEnabled={!currenLocation}
                pitchEnabled={!currenLocation}
                rotateEnabled={!currenLocation}
                onRegionChange={params.draggable && setMapRegion}
                //provider={PROVIDER_GOOGLE}
                ref={mapRef}
            >
                <Marker
                    draggable={params.draggable}
                    coordinate={mapRegion}
                    onDragEnd={(e) => setMapRegion((prevState) => ({ ...prevState, ...e.nativeEvent.coordinate }))}
                />
            </MapView>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    right: 40,
                }}
                disabled={currenLocation}
                onPress={onPressCurrentLocation}
            >
                <CustomLinearGradient
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 50,
                        borderRadius: 10,
                    }}
                >
                    <Text color="#000000" fontSize={16} bold style={{ marginHorizontal: 10 }}>
                        {params.draggable ? t('use_current_location') : t('location')}
                    </Text>
                    {currenLocation ? <BarLoader color="#000000" /> : <FontAwesome5 name={icon} size={26} />}
                </CustomLinearGradient>
            </TouchableOpacity>
        </View>
    );
});

export default Map;

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerStyle: {
        top: 20,
        left: 20,
        right: 20,
        zIndex: 1,
        position: 'absolute',
    },
});
