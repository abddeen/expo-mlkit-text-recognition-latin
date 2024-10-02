# expo-mlkit-text-recognition-latin

Expo Module Wrapper for Google MLKit Text Recognition (Latin only)

This is a wrapper only for Latin text recognition to keep the bundle size down.

## Installation

```bash
npx expo add expo-mlkit-text-recognition-latin
npx expo prebuild --clean
# Create a dev client
npx expo run:ios
npx expo run:android
```

## Usage

### Recognize text

```tsx
// imageURL: remote image url or local image path
const { text, blocks } =
  await ExpoMlkitTranslationModule.recognizeText(imageURL);
```
