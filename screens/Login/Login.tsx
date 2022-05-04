import React from 'react';
import { StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { LoginForm, Register, VerifyOTP } from './components';
import { Jwt, ResponseSuccess, User } from '@interfaces';
import { useApplication, useAuthentication } from '@contexts';
import { request, showToast } from '@utils';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    viewContainer: {
        flex: 1,
        marginBottom: 10,
    },
    navigationContainer: {
        height: 75,
    },
});

interface WelcomeProps {}

const Welcome = React.memo<WelcomeProps>(() => {
    const pageViewerRef = React.useRef<PagerView>(null);
    const { onLogged } = useAuthentication();
    const { isBeta } = useApplication();
    const navigation = useNavigation();
    const [state, setState] = React.useState<{
        phoneNumber: string;
        jwt: Jwt | undefined;
        isRegister: boolean;
        page: number;
    }>({
        isRegister: false,
        jwt: undefined,
        page: 0,
        phoneNumber: '',
    });

    const handleLogged = React.useCallback(
        async (jwt: Jwt) => {
            try {
                const {
                    data: { data },
                } = await request.get<ResponseSuccess<User>>('/api/users/current', {
                    headers: {
                        Authorization: `Bearer ${jwt.token}`,
                    },
                });
                onLogged({ ...jwt, createdAt: new Date(), user: data });
                navigation.goBack();
            } catch (e) {
                let errorMessage: string | undefined = e.toString();
                if (e.response) {
                    const { data } = e.response;
                    errorMessage = data.message || data.detail;
                } else {
                    console.error(e);
                }
                showToast({ type: 'error', text2: errorMessage });
            }
        },
        [navigation, onLogged],
    );

    React.useEffect(() => {
        if (pageViewerRef.current) {
            pageViewerRef.current.setPage(state.page);
        }
    }, [state.page, state.isRegister, isBeta, handleLogged, navigation]);

    const onLogin = React.useCallback(
        async (phoneNumber: string, jwt: Jwt, isRegister: boolean) => {
            setState((prevState) => ({
                ...prevState,
                page: isBeta ? (isRegister ? prevState.page + 2 : prevState.page) : prevState.page + 1,
                phoneNumber,
                jwt,
                isRegister,
            }));
            if (isBeta && !state.isRegister) {
                await handleLogged(jwt);
                navigation.goBack();
                return;
            }
        },
        [handleLogged, isBeta, navigation, state.isRegister],
    );

    const onVerified = React.useCallback(async () => {
        if (state.isRegister) {
            setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
            return;
        }
        await handleLogged(state.jwt);
    }, [handleLogged, state.isRegister, state.jwt]);

    const onBack = React.useCallback(() => {
        setState((prevState) => ({ ...prevState, page: prevState.page - 1 }));
    }, []);

    const onRegistered = React.useCallback(
        async (user: User) => {
            onLogged({ ...state.jwt, user });
            navigation.goBack();
        },
        [navigation, onLogged, state.jwt],
    );

    return (
        <View style={styles.container}>
            <PagerView initialPage={0} scrollEnabled={false} style={styles.viewContainer} ref={pageViewerRef}>
                <View key="1">
                    <LoginForm phoneNumber={state.phoneNumber} onNext={onLogin} />
                </View>
                <View key="2">
                    <VerifyOTP phoneNumber={state.phoneNumber} jwt={state.jwt} onBack={onBack} onNext={onVerified} />
                </View>
                <View key="3">
                    <Register phoneNumber={state.phoneNumber} jwt={state.jwt} onRegistered={onRegistered} />
                </View>
            </PagerView>
        </View>
    );
});

export default Welcome;
