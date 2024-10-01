import * as React from 'react';

import { ExpoMlkitTextRecognitionLatinViewProps } from './ExpoMlkitTextRecognitionLatin.types';

export default function ExpoMlkitTextRecognitionLatinView(props: ExpoMlkitTextRecognitionLatinViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
