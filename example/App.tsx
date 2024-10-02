import { TextRecognition, TextBlock } from "expo-mlkit-text-recognition-latin";
import { useState } from "react";
import { StyleSheet, TextInput, Button, View, Text } from "react-native";

export default function App() {
  const [value, setValue] = useState(
    "https://images.squarespace-cdn.com/content/v1/57b71e086a49637a9109a3f9/1527864537531-J03OPPRDN1JTUAB26PUI/First+Page+The+Little+Prince.JPG"
  );
  const [result, setResult] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<TextBlock[]>([]);

  return (
    <View style={styles.container}>
      <TextInput value={value} onChangeText={setValue} style={styles.input} />
      <Button
        title="Recognize text"
        onPress={async () => {
          const r = await TextRecognition.recognize(value);
          setResult(r.text);
          setBlocks(r.blocks);
        }}
      />
      {result && (
        <TextInput value={result} style={styles.textarea} editable={false} />
      )}
      {blocks.map((block, i) => (
        <View key={i} style={{ margin: 12 }}>
          <Text>{block.text}</Text>
          {block.lines.map((line, i) => (
            <View key={i} style={{ margin: 12 }}>
              <Text>{line.text}</Text>
              {line.elements.map((element, i) => (
                <View key={i} style={{ margin: 12 }}>
                  <Text>{element.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
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
