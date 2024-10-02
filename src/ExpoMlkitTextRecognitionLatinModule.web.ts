import { ExpoMlkitTextRecognitionModuleType } from "./ExpoMlkitTextRecognitionLatin.types";

const TextRecognition: ExpoMlkitTextRecognitionModuleType = {
  async recognize(imageUrl) {
    return {
      text: "",
      blocks: [],
    };
  },
  addListener() {},
  removeListeners() {},
};

export default { TextRecognition };
