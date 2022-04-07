import React from 'react';
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Text } from '@components/Text';

const styles = StyleSheet.create({
    mainBody: {
        marginTop: 15,
    },
    txtStyle: {
        flex: 1,
    },
    lessMoreStyle: {},
});

interface ReadMoreProps {
    text: string;
    containerStyle?: StyleProp<ViewStyle>;
    targetLines?: number;
}

const ReadMore = React.memo<ReadMoreProps>(({ targetLines, text, containerStyle }) => {
    const { width } = useWindowDimensions();
    const { colors } = useTheme();
    const [textShown, setTextShown] = React.useState(false);
    const [lengthMore, setLengthMore] = React.useState(false);
    const [triggerTextLocation, setTriggerTextLocation] = React.useState({
        top: 0,
        right: 0,
    });

    const toggleNumberOfLines = React.useCallback(() => {
        setTextShown((prevState) => !prevState);
    }, []);

    const onTextLayout = React.useCallback(
        (e) => {
            const { lines } = e.nativeEvent;
            if (lines && Array.isArray(lines) && lines.length > 0) {
                let tempTxtLocation = {
                    top: (lines.length - 1) * lines[0].height,
                    right: width - lines[lines.length - 1].width - 10,
                };
                setTriggerTextLocation(tempTxtLocation);
                setLengthMore(lines.length >= targetLines);
            }
        },
        [targetLines, width],
    );

    return (
        <View style={[styles.mainBody, containerStyle]}>
            <Text
                onTextLayout={onTextLayout}
                numberOfLines={textShown ? undefined : targetLines || 1}
                style={styles.txtStyle}
            >
                {text || ''}
            </Text>
            {lengthMore ? (
                <Text
                    onPress={toggleNumberOfLines}
                    style={[
                        styles.lessMoreStyle,
                        {
                            position: 'absolute',
                            backgroundColor: colors.primary,
                            right: triggerTextLocation.right,
                            top: triggerTextLocation.top,
                        },
                    ]}
                >
                    {textShown ? ' less' : '... more'}
                </Text>
            ) : null}
        </View>
    );
});

export default ReadMore;
