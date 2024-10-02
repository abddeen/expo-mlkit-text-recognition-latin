package expo.modules.mlkittextrecognitionlatin

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

import android.graphics.Point
import android.graphics.Rect
import android.net.Uri
import android.graphics.BitmapFactory
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.Text
import expo.modules.kotlin.Promise
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import expo.modules.kotlin.exception.toCodedException
import java.io.IOException
import java.net.URL

class ExpoMlkitTextRecognitionLatinModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoMlkitTextRecognitionLatin")
    
    AsyncFunction("recognize") { imageURL: String, promise: Promise ->
      try {
        val image = getInputImage(imageURL)
        val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
        recognizer.process(image)
          .addOnSuccessListener { visionText ->
            val response = mutableMapOf<String, Any>()
            response["text"] = visionText.text

            val blocks = visionText.textBlocks.map { block ->
              blockToMap(block)
            }
            response["blocks"] = blocks
            
            promise.resolve(response)
          }
          .addOnFailureListener { e ->
            e.printStackTrace()
            promise.reject(e.toCodedException())
          }
      } catch (e: IOException) {
        e.printStackTrace()
        promise.reject(e.toCodedException())
      }
    }
  }

  private val context
    get() = requireNotNull(appContext.reactContext)

  private fun getInputImage(url: String): InputImage {
    return if (url.startsWith("http://") || url.startsWith("https://")) {
      val urlInput = URL(url)
      val image = BitmapFactory.decodeStream(urlInput.openConnection().getInputStream())
      InputImage.fromBitmap(image, 0)
    } else {
      val uri = Uri.parse(url)
      InputImage.fromFilePath(context, uri)
    }
  }

  private fun rectToMap(rect: Rect): Map<String, Any> {
    return mapOf(
      "width" to rect.width(),
      "height" to rect.height(),
      "top" to rect.top,
      "left" to rect.left
    )
  }

  private fun cornerPointsToMap(points: Array<Point>): List<Map<String, Int>> {
    return points.map { point ->
      mapOf(
        "x" to point.x,
        "y" to point.y
      )
    }
  }

  private fun langToMap(lang: String?): List<Map<String, String>> {
    lang?.let {
      return listOf(mapOf("languageCode" to it))
    }
    return emptyList()
  }

  private fun lineToMap(line: Text.Line): Map<String, Any> {
  val map = mutableMapOf<String, Any>()
  map["text"] = line.text
  
  line.boundingBox?.let {
    map["frame"] = rectToMap(it)
  } ?: let {
    map["frame"] = emptyMap<String, Any>()
  }

  line.cornerPoints?.let {
    map["cornerPoints"] = cornerPointsToMap(it)
  } ?: let {
    map["cornerPoints"] = emptyList<Map<String, Int>>()
  }
    
  map["recognizedLanguages"] = langToMap(line.recognizedLanguage)
  
  val elements = line.elements.map { element ->
    val elementMap = mutableMapOf<String, Any>()
    elementMap["text"] = element.text

    element.boundingBox?.let {
      elementMap["frame"] = rectToMap(it)
    } ?: let {
      elementMap["frame"] = emptyMap<String, Any>()
    }

    element.cornerPoints?.let {
      elementMap["cornerPoints"] = cornerPointsToMap(it)
    } ?: let {
      elementMap["cornerPoints"] = emptyList<Map<String, Int>>()
    }

    elementMap
  }
  map["elements"] = elements

  return map
}

  private fun blockToMap(block: Text.TextBlock): Map<String, Any> {
    return mutableMapOf<String, Any>().apply {
      put("text", block.text)
      block.boundingBox?.let { put("frame", rectToMap(it)) }
      block.cornerPoints?.let { put("cornerPoints", cornerPointsToMap(it)) }

      val lines = block.lines.map { line ->
        lineToMap(line)
      }
      put("lines", lines)
      
      put("recognizedLanguages", langToMap(block.recognizedLanguage))
    }
  }
}