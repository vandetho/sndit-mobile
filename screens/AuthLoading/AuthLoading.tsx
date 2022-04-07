import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AuthStorage, request, showToast } from '@utils';
import { useAuthentication } from '@contexts';
import { AxiosResponse } from 'axios';
import { BarLoader } from '@components';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
    },
});

interface AuthLoadingProps {}

const AuthLoading: React.FunctionComponent<AuthLoadingProps> = () => {
    const { onLogged, onNotLogged } = useAuthentication();

    const _bootstrapAsync = React.useCallback(async (): Promise<void> => {
        const jwtRefreshToken = await AuthStorage.getRefreshToken();
        if (jwtRefreshToken) {
            try {
                const { data } = await request.post<
                    { refreshToken: string },
                    AxiosResponse<{ refreshToken: string; token: string }>
                >('/api/token/refresh', {
                    refreshToken: jwtRefreshToken,
                });

                onLogged({
                    token: data.token,
                    refreshToken: data.refreshToken,
                    createdAt: new Date(),
                    user: JSON.parse(await AuthStorage.getUser()),
                });
                return;
            } catch (e) {
                if (e.response) {
                    const {
                        response: { data },
                    } = e;
                    showToast(data.message || data.detail);
                }
                console.error(e);
            }
        }
        onNotLogged();
    }, [onLogged, onNotLogged]);

    React.useEffect((): void => {
        (async () => _bootstrapAsync())();
    }, [_bootstrapAsync]);

    return (
        <View style={styles.container}>
            <BarLoader />
        </View>
    );
};
export default AuthLoading;
