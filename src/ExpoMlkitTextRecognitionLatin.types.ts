import { NativeModule } from "react-native";

export interface Frame {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Language {
  /** Language code of the language */
  languageCode: string;
}

export type CornerPoints = readonly [Point, Point, Point, Point];

export interface TextElement {
  /** Recognized text of the element (word) */
  text: string;
  /** Bonding box of the element (word) */
  frame?: Frame;
  /** Corner points of the element (word) */
  cornerPoints?: CornerPoints;
}

export interface TextLine {
  /** Recognized text in the line */
  text: string;
  /** Line bounding box */
  frame?: Frame;
  /** Line corner points */
  cornerPoints?: CornerPoints;
  /** Elements (words) in the line */
  elements: TextElement[];
  /** Languages recognized in the line */
  recognizedLanguages: Language[];
}

export interface TextBlock {
  /** Recognized text in the block */
  text: string;
  /** Block bounding box */
  frame?: Frame;
  /** Block corner points */
  cornerPoints?: CornerPoints;
  /** Lines of text in the block */
  lines: TextLine[];
  /** Languages recognized in the block */
  recognizedLanguages: Language[];
}

export interface TextRecognitionResult {
  /** Recognized text in the image */
  text: string;
  /** Block of text recognized in the image */
  blocks: TextBlock[];
}

export interface ExpoMlkitTextRecognitionModuleType extends NativeModule {
  recognize: (imageURL: string) => Promise<TextRecognitionResult>;
}
