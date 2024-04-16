import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [toggleCamera, setToggleCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  function transliterateArabic(text) {
    const map = {
      أ: "a",
      ب: "b",
      ت: "t",
      ث: "th",
      ج: "j",
      ح: "h",
      خ: "kh",
      د: "d",
      ذ: "dh",
      ر: "r",
      ز: "z",
      س: "s",
      ش: "sh",
      ص: "s",
      ض: "d",
      ط: "t",
      ظ: "dh",
      ع: "a",
      غ: "gh",
      ف: "f",
      ق: "q",
      ك: "k",
      ل: "l",
      م: "m",
      ن: "n",
      ه: "h",
      و: "w",
      ي: "y",
      ى: "a",
      ة: "h",
      ئ: "e",
      أ: "a",
      إ: "i",
      // Add more mappings based on your needs
    };

    return text
      .split("")
      .map((char) => map[char] || char)
      .join("");
  }

  const traiterImage = async (base64) => {
    console.log(Object.keys(base64), "base 64");
    console.log("called ");
    const apiKey = "AIzaSyBCo0CWPB1gz20j6-KWUYqnN_sZ6erKMcA";
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const body = {
      requests: [
        {
          image: {
            content: base64.base64,
          },
          features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
          imageContext: {
            languageHints: ["ar"], // "ar" is the language code for Arabic
          },
        },
      ],
    };

    try {
      const response = await axios.post(url, body);
      console.log("Texte détecté :", response.data.responses[0]);
      alert(response.data.responses[0].fullTextAnnotation.text);
    } catch (error) {
      console.error("Erreur :", error);
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        skipProcessing: true,
      });
      setPhoto(photo); // Ensure this sets only after photo is captured.
    }
  };

  useEffect(() => {
    traiterImage(photo);
  }, [photo]);

  if (hasPermission === null) {
    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <Text style={styles.text}>
          Demande d'autorisation d'accès à la caméra
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={{ backgroundColor: "black", flex: 1 }}>
        <Text style={styles.text}>Pas d'accès à la caméra</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          width: 200,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => {
          setToggleCamera(!toggleCamera); // Toggle visibility
        }}>
        <Text style={{ color: "white" }}>Toggle Camera</Text>
      </TouchableOpacity>
      {toggleCamera && (
        <Camera style={styles.camera} type={type} ref={cameraRef} ratio="16:9">
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.button}>
              <Text style={styles.buttonText}>capture</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 300,
    height: 400,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.8,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    width: 480,
    backgroundColor: "red",
    textAlign: "center",
  },
});
