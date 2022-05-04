import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/Text';
import { format } from 'date-fns';
import { PackageHistory } from '@interfaces';
import { DISPLAY_DATETIME_FORMAT } from '@config';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const HISTORY_ITEM_HEIGHT = 125;

interface HistoryCardProps {
    history: PackageHistory;
}

const HistoryCardComponent: React.FunctionComponent<HistoryCardProps> = ({ history }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    return (
        <View
            style={{
                height: HISTORY_ITEM_HEIGHT,
                borderRadius: 15,
                padding: 10,
                backgroundColor: colors.card,
                justifyContent: 'space-between',
            }}
        >
            <Text bold>{t(history.transitionName)}</Text>
            <Text>{history.description}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>{format(new Date(history.createdAt), DISPLAY_DATETIME_FORMAT)}</Text>
                <Text>
                    {history.user.lastName} {history.user.firstName}
                </Text>
            </View>
        </View>
    );
};

const HistoryCard = React.memo(HistoryCardComponent);

export default HistoryCard;
