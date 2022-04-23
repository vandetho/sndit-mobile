import React from 'react';
import { User } from '@interfaces';

const UserContext = React.createContext<{ user: User | undefined; onSelect: (user: User) => void }>({
    user: undefined,
    onSelect: (user: User) => {
        console.log({ name: 'onSelect', user });
    },
});

interface UserContextProps {}

export const UserProvider: React.FunctionComponent<UserContextProps> = ({ children }) => {
    const [state, setState] = React.useState<{ user: User | undefined }>({ user: undefined });

    const onSelect = React.useCallback((user: User) => {
        setState((prevState) => ({ ...prevState, user }));
    }, []);

    return <UserContext.Provider value={{ ...state, onSelect }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    return React.useContext(UserContext);
};
