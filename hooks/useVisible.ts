import React from 'react';

export const useVisible = ({ defaultValue = false } = {}) => {
    const [visible, setVisible] = React.useState(defaultValue);

    const onClose = React.useCallback(() => {
        setVisible(false);
    }, []);

    const onOpen = React.useCallback(() => {
        setVisible(true);
    }, []);

    const onToggle = React.useCallback(() => {
        setVisible((prevState) => !prevState);
    }, []);

    return { visible, onClose, onOpen, onToggle };
};
