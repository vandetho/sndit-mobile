import React from 'react';
import { render } from '@testing-library/react-native';
import { EmployeeScreen } from '@screens';

it('render default elements ', function () {
    const { getByTestId } = render(<EmployeeScreen />);
    expect(getByTestId('loginContainer')).toBeTruthy();
});
