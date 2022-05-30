import React from 'react';
import { Animated } from 'react-native';
import { Button } from '@components';
import { useTranslation } from 'react-i18next';
import { Package } from '@interfaces';
import { ActionButtons } from './components';
import { HEADER_HEIGHT } from '../../PackageDetail';
import { ActionButtonRefProps } from '@screens/Package/components';

interface ShowButtonsProps {
    animatedValue: Animated.Value;
    item: Package;
    onDone: () => void;
}

const ShowButtons = React.memo<ShowButtonsProps>(({ animatedValue, item, onDone }) => {
    const { t } = useTranslation();
    const actionButtonsRef = React.useRef<ActionButtonRefProps>(null);

    const inputRange = React.useMemo<Array<number>>(() => [0, HEADER_HEIGHT], []);
    return (
        <React.Fragment>
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: animatedValue.interpolate({
                                inputRange,
                                outputRange: [0, 10],
                                extrapolate: 'clamp',
                            }),
                        },
                    ],
                }}
            >
                <Button label={t('show_buttons')} onPress={onPress} style={{ margin: 10, borderRadius: 15 }} />
            </Animated.View>
            <ActionButtons onDone={onDone} item={item} />
        </React.Fragment>
    );
});

export default ShowButtons;
