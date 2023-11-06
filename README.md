# Sndit Mobile App

This package serve for building sndit mobile app that can be used with [sndit-backend](https://github.com/vandetho/sndit-backend)


## Dependencies

This package uses the following dependencies: 
- [React Native](https://reactnative.dev/) let you create mobile native app with javascript
- [Expo](https://docs.expo.dev/) a SDK that make react native development easier
- [React Navigation](https://reactnavigation.org/) for navigation between screen
- [react-hook-form](https://react-hook-form.com/) for form state management
- [yup](https://github.com/jquense/yup) for form validation

## Environment Variable

|Name | Type                                             | Default       | Description                                             |
| ----------- |--------------------------------------------------|---------------|---------------------------------------------------------|
| APP_VARIANT | `simulator`, `development`, `preview`, `release` | `development` | Determine which version your app would when it is built |
| EXPO_PUBLIC_API_URL | `string`                                         | `null`        | The backend server api url to call                      |
| EXPO_PROJECT_ID | `string`                                         | `null`          | The project id on expo                                  |
