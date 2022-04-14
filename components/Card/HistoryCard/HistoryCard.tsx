import React from 'react';
import { View } from 'react-native';
import { Text } from '@components/Text';
import { format } from 'date-fns';
import { PackageHistory } from '@interfaces';
import { DISPLAY_DATETIME_FORMAT } from '@config';

export const HISTORY_ITEM_HEIGHT = 100;

interface HistoryCardProps {
    history: PackageHistory;
}

const HistoryCardComponent: React.FunctionComponent<HistoryCardProps> = ({ history }) => (
    <View
        style={{
            height: HISTORY_ITEM_HEIGHT,
            borderRadius: 15,
            padding: 10,
        }}
    >
        <Text bold>{history.transitionName}</Text>
        <Text disabled>{history.description}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text>{format(new Date(history.createdAt), DISPLAY_DATETIME_FORMAT)}</Text>
            <Text>
                {history.user.lastName} {history.user.lastName}
            </Text>
        </View>
    </View>
);

const HistoryCard = React.memo(HistoryCardComponent);

export default HistoryCard;
