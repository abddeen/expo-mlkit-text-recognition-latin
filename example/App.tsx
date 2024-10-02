import {
  TextRecognition,
  TextBlock,
  TextElement,
} from "expo-mlkit-text-recognition-latin";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  Button,
  View,
  ScrollView,
  Image,
  Alert,
} from "react-native";

export default function App() {
  const [value, setValue] = useState(
    "https://images.squarespace-cdn.com/content/v1/57b71e086a49637a9109a3f9/1527864537531-J03OPPRDN1JTUAB26PUI/First+Page+The+Little+Prince.JPG"
  );
  const [result, setResult] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<TextBlock[]>([]);

  return (
    <ScrollView style={styles.scrollview}>
      <View style={styles.container}>
        <TextInput value={value} onChangeText={setValue} style={styles.input} />
        <Button
          title="Recognize text"
          onPress={async () => {
            try {
              const r = await TextRecognition.recognize(value);
              setResult(r.text);
              setBlocks(r.blocks);
            } catch (e) {
              Alert.alert("Error", e.message);
            }
          }}
        />
        {result && (
          <TextInput
            value={result}
            style={styles.textarea}
            editable={false}
            multiline
          />
        )}
        {blocks && blocks.length > 0 && (
          <ImageWithBoundingBoxes imageURL={value} blocks={blocks} />
        )}
      </View>
    </ScrollView>
  );
}
// Render Image with boxes rendered on top of it
function ImageWithBoundingBoxes({
  imageURL,
  blocks,
}: {
  imageURL: string;
  blocks: TextBlock[];
}) {
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  useEffect(() => {
    Image.getSize(imageURL, (width, height) => {
      setImageWidth(width);
      setImageHeight(height);
    });
  }, [imageURL]);
  // get all elements from all lines
  const textElements = blocks.flatMap((block) =>
    block.lines.flatMap((line) => line.elements)
  );
  const textLines = blocks.flatMap((block) => block.lines);
  return (
    <View
      style={{
        position: "relative",
      }}
    >
      <Image
        source={{ uri: imageURL }}
        style={{
          width: imageWidth,
          height: imageHeight,
        }}
      />

      {blocks.map((block, i) => (
        <BoundingBox key={i} box={block} color="green" opacity={0.3} />
      ))}

      {textLines.map((block, i) => (
        <BoundingBox key={i} box={block} color="blue" opacity={0.5} />
      ))}

      {textElements.map((block, i) => (
        <BoundingBox key={i} box={block} color="red" opacity={1} />
      ))}
    </View>
  );
}

function BoundingBox({
  box,
  color,
  opacity = 1,
}: {
  box: TextElement;
  color: string;
  opacity?: number;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top: box.frame?.top,
        left: box.frame?.left,
        borderWidth: 1,
        borderColor: color,
        zIndex: 100,
        width: box.frame?.width,
        height: box.frame?.height,
        opacity,
      }}
    />
  );
}
const styles = StyleSheet.create({
  scrollview: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  input: {
    width: "90%",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textarea: {
    width: "90%",
    height: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
