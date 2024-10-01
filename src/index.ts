import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to ExpoMlkitTextRecognitionLatin.web.ts
// and on native platforms to ExpoMlkitTextRecognitionLatin.ts
import ExpoMlkitTextRecognitionLatinModule from './ExpoMlkitTextRecognitionLatinModule';
import ExpoMlkitTextRecognitionLatinView from './ExpoMlkitTextRecognitionLatinView';
import { ChangeEventPayload, ExpoMlkitTextRecognitionLatinViewProps } from './ExpoMlkitTextRecognitionLatin.types';

// Get the native constant value.
export const PI = ExpoMlkitTextRecognitionLatinModule.PI;

export function hello(): string {
  return ExpoMlkitTextRecognitionLatinModule.hello();
}

export async function setValueAsync(value: string) {
  return await ExpoMlkitTextRecognitionLatinModule.setValueAsync(value);
}

const emitter = new EventEmitter(ExpoMlkitTextRecognitionLatinModule ?? NativeModulesProxy.ExpoMlkitTextRecognitionLatin);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { ExpoMlkitTextRecognitionLatinView, ExpoMlkitTextRecognitionLatinViewProps, ChangeEventPayload };
