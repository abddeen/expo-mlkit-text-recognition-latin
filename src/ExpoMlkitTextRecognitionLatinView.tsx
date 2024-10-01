import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { ExpoMlkitTextRecognitionLatinViewProps } from './ExpoMlkitTextRecognitionLatin.types';

const NativeView: React.ComponentType<ExpoMlkitTextRecognitionLatinViewProps> =
  requireNativeViewManager('ExpoMlkitTextRecognitionLatin');

export default function ExpoMlkitTextRecognitionLatinView(props: ExpoMlkitTextRecognitionLatinViewProps) {
  return <NativeView {...props} />;
}
