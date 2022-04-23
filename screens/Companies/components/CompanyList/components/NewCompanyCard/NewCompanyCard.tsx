import React from 'react';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { CARD_HEIGHT, Text } from '@components';
import { FontAwesome5 } from '@expo/vector-icons';
import { Company } from '@interfaces';
import { useTheme } from '@react-navigation/native';
import { HEADER_HEIGHT } from '@screens/Company/components/CompanyDetail';

interface NewCompanyCardProps {
    animatedValue: Animated.Value;
    company: Company;
    onPress: () => void;
}

const NewCompanyCard = React.memo<NewCompanyCardProps>(({ company, animatedValue, onPress }) => {
    const { colors } = useTheme();
    const inputRange = React.useMemo(() => [0, HEADER_HEIGHT], []);
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View
                style={{
                    height: CARD_HEIGHT,
                    borderRadius: 15,
                    flexDirection: 'row',
                    backgroundColor: colors.card,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    opacity: animatedValue.interpolate({ inputRange, outputRange: [1, 0], extrapolate: 'clamp' }),
                    transform: [
                        { scale: animatedValue.interpolate({ inputRange, outputRange: [1, 0], extrapolate: 'clamp' }) },
                    ],
                }}
            >
                <FontAwesome5 name="plus" size={26} color={colors.text} />
                <Text fontSize={16} style={{ marginHorizontal: 10 }}>
                    {company.name}
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
});

export default NewCompanyCard;
