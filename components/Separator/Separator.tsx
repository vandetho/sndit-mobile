import React from 'react';
import { View } from 'react-native';

export const SEPARATOR_HEIGHT = 10;

interface SeparatorProps {}

const SeparatorComponent: React.FunctionComponent<SeparatorProps> = () => <View style={{ height: SEPARATOR_HEIGHT }} />;

export const Separator = React.memo(SeparatorComponent);
