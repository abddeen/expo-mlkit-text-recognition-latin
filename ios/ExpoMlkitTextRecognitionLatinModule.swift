    import ExpoModulesCore
    import MLKitVision
    import MLKitTextRecognition
    
    public class ExpoMlkitTextRecognitionLatinModule: Module {
        public func definition() -> ModuleDefinition {
            Name("ExpoMlkitTextRecognitionLatin")
            
            AsyncFunction("recognize") { (imageURL: String, promise: Promise) in
                let latinOptions = TextRecognizerOptions()
                let textRecognizer = TextRecognizer.textRecognizer(options: latinOptions)
                
                guard
                    let url = URL(string: imageURL),
                    let imageData = try? Data(contentsOf: url),
                    let image = UIImage(data: imageData)
                else {
                    promise.reject("Text Recognition", "Image data could not be loaded")
                    return
                }
                
                let visionImage = VisionImage(image: image)
                visionImage.orientation = image.imageOrientation
                textRecognizer.process(visionImage) { result, error in
                    guard error == nil, let result = result else {
                        promise.reject("Text Recognition", "Text recognition failed")
                        return
                    }
                    var response: [String: Any] = [:]
                    response["text"] = result.text
                    response["blocks"] = result.blocks.map { block in
                        self.blockToDict(block: block)
                    }
                    
                    promise.resolve(response)
                }
            }
        }
        
        private func frameToDict(frame: CGRect) -> [String: Any] {
            return [
                "width": frame.size.width,
                "height": frame.size.height,
                "top": frame.origin.y,
                "left": frame.origin.x
            ]
        }
        
        private func pointsToDicts(points: [NSValue]) -> [[String: CGFloat]] {
            return points.map { point in
                [
                    "x": point.cgPointValue.x,
                    "y": point.cgPointValue.y
                ]
            }
        }
        
        private func langsToDicts(langs: [TextRecognizedLanguage]) -> [[String: String]] {
            return langs.map { lang in
                [
                    "languageCode": lang.languageCode!
                ]
            }
        }
        
        private func lineToDict(line: TextLine) -> [String: Any] {
            var dict: [String: Any] = [:]
            
            dict["text"] = line.text
            dict["frame"] = frameToDict(frame: line.frame)
            dict["cornerPoints"] = pointsToDicts(points: line.cornerPoints)
            dict["recognizedLanguages"] = langsToDicts(langs: line.recognizedLanguages)
            
            let elements = line.elements.map { element in
                [
                    "text": element.text,
                    "frame": frameToDict(frame: element.frame),
                    "cornerPoints": pointsToDicts(points: element.cornerPoints)
                ]
            }
            
            dict["elements"] = elements
            
            return dict
        }
        
        private func blockToDict(block: TextBlock) -> [String: Any] {
            var dict: [String: Any] = [:]
            
            dict["text"] = block.text
            dict["frame"] = frameToDict(frame: block.frame)
            dict["cornerPoints"] = pointsToDicts(points: block.cornerPoints)
            dict["recognizedLanguages"] = langsToDicts(langs: block.recognizedLanguages)
            
            let lines = block.lines.map { line in
                lineToDict(line: line)
            }
            
            dict["lines"] = lines
            
            return dict
        }
    }
