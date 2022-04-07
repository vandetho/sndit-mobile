import React from 'react';
import { Jwt, User } from '@interfaces';
import { AuthStorage } from '@utils';

export const AuthenticationContext = React.createContext<{
    jwt: Jwt | undefined;
    isLogged: boolean;
    isRefreshingToken: boolean;
    onLogged: (jwt: Jwt) => void;
    onNotLogged: () => void;
    storeAuthentication: () => void;
    onUpdateUser: (user: User) => void;
}>({
    isLogged: false,
    isRefreshingToken: true,
    jwt: undefined,
    onLogged: (jwt: Jwt) => {
        console.log(jwt);
    },
    onNotLogged: () => {
        console.log({ name: 'onNotLogged' });
    },
    storeAuthentication: () => {
        console.log({ name: 'storeAuthentication' });
    },
    onUpdateUser: (user: User) => {
        console.log(user);
    },
});

export const AuthenticationProvider: React.FunctionComponent = ({ children }) => {
    const [authentication, setAuthentication] = React.useState<{
        isRefreshingToken: boolean;
        isLogged: boolean;
        jwt: Jwt | undefined;
    }>({
        isLogged: false,
        isRefreshingToken: true,
        jwt: undefined,
    });

    const storeAuthentication = React.useCallback(async () => {
        await AuthStorage.storeAuthentication(authentication.jwt);
    }, [authentication.jwt]);

    const onLogged = React.useCallback(async (jwt: Jwt) => {
        await AuthStorage.storeAuthentication(jwt);
        setAuthentication((prevState) => ({
            ...prevState,
            jwt,
            isLogged: true,
            isRefreshingToken: false,
        }));
    }, []);

    const onNotLogged = React.useCallback(() => {
        setAuthentication((prevState) => ({ ...prevState, isRefreshingToken: false }));
    }, []);

    const onUpdateUser = React.useCallback(
        async (user: User) => {
            const jwt: Jwt = { ...authentication.jwt, user };
            await AuthStorage.storeAuthentication(jwt);
            setAuthentication((prevState) => ({ ...prevState, jwt }));
        },
        [authentication.jwt],
    );

    return (
        <AuthenticationContext.Provider
            value={{ ...authentication, onLogged, onNotLogged, onUpdateUser, storeAuthentication }}
        >
            {children}
        </AuthenticationContext.Provider>
    );
};

export const useAuthentication = () => {
    return React.useContext(AuthenticationContext);
};
