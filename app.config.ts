import { ConfigContext, ExpoConfig } from '@expo/config';

const variant = process.env.APP_VARIANT || 'development';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: `Sndit${variant !== 'release' ? ` ${variant}` : ''}`,
    slug: `sndit_${variant}`,
    scheme: `sndit${variant}`,
    version: '1.0.0',
    orientation: 'portrait',
    icon: `./assets/images/icon-${variant}.png`,
    owner: 'bangkeut',
    userInterfaceStyle: 'automatic',
    jsEngine: 'hermes',
    splash: {
        image: `./assets/images/splash-${variant}.png`,
        resizeMode: 'cover',
        backgroundColor: '#ffffff',
    },
    updates: {
        fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        jsEngine: 'hermes',
        userInterfaceStyle: 'automatic',
        bundleIdentifier: `io.sndit.mobile.${variant}`,
        supportsTablet: true,
        usesIcloudStorage: true,
        requireFullScreen: true,
        infoPlist: {
            NSPhotoLibraryUsageDescription: 'The app accesses your photos to let you share them with your teammates.',
            NSCameraUsageDescription:
                'The app accesses your camera to let you take some photo to share with your teammates.',
            NSFaceIDUsageDescription: '$(PRODUCT_NAME) Authentication with TouchId or FaceID',
        },
    },
    android: {
        package: `io.sndit.mobile.${variant}`,
        adaptiveIcon: {
            foregroundImage: `./assets/images/adaptive-icon-${variant}.png`,
            backgroundColor: '#FFFFFF',
        },
    },
    web: {
        favicon: `./assets/images/favicon-${variant}.png`,
    },
    extra: {
        variant: `${variant}`,
        host: 'https://sndit.io',
        eas: {
            projectId: '0c4bb569-acdc-4761-af14-b6853908cf19',
        },
        experienceId: `@vandetho/sndit_${variant}`,
    },
    experiments: {
        tsconfigPaths: true,
    },
    plugins: [
        ['expo-notifications'],
        [
            'expo-barcode-scanner',
            {
                cameraPermission: 'Allow $(PRODUCT_NAME) to access camera.',
            },
        ],
        [
            'expo-image-picker',
            {
                photosPermission: 'The app accesses your photos to let you share them with your teammates.',
                cameraPermission:
                    'The app accesses your camera to let you take some photo to share with your teammates.',
            },
        ],
        [
            'expo-screen-orientation',
            {
                initialOrientation: 'DEFAULT',
            },
        ],
        [
            'expo-local-authentication',
            {
                faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID.',
            },
        ],
        [
            'expo-build-properties',
            {
                android: {
                    enableProguardInReleaseBuilds: true,
                    extraProguardRules: '-keep public class com.horcrux.svg.** {*;}',
                    allowBackup: false,
                },
            },
        ],
    ],
});
