import React from 'react';
import { render } from '@testing-library/react-native';
import { DashboardScreen } from '@screens';

it('render default elements ', function () {
    const { getByTestId } = render(<DashboardScreen />);
    expect(getByTestId('loginContainer')).toBeTruthy();
});
