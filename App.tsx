import React, {useEffect} from "react";

import {Text, View, StyleSheet, Dimensions, KeyboardAvoidingView, Platform} from "react-native";
import {DEFAULT_TOOLBAR_ITEMS, PlaceholderBridge, RichText, TenTapStartKit, Toolbar, useEditorBridge} from "@10play/tentap-editor";
import {editorHtml} from "./src/editor-web/build/editorHtml.ts";
import {HyperMultimediaBridge} from "./src/editor-web/bridges/HyperMultimediaBridge.ts";
import * as rnFS from "react-native-fs";
const EMBED_WIDTH = Dimensions.get("window").width - 40;
const EMBED_HEIGHT = EMBED_WIDTH * 0.5234;
const App = () => {
  const editor = useEditorBridge({
    customSource: editorHtml,
    bridgeExtensions: [
      ...TenTapStartKit,
      PlaceholderBridge.configureExtension({
        placeholder: "Start writing...",
      }),
      HyperMultimediaBridge.configureExtension({
        Youtube: {
          width: EMBED_WIDTH,
          height: EMBED_HEIGHT,
          resizeGripper: true,
        },

        Image: {
          inline: false,
          addPasteHandler: true,
          resizeGripper: true,
          theme: "light",
          width: EMBED_WIDTH,
          height: EMBED_HEIGHT,
        },
        Twitter: {
          inline: false,
          addPasteHandler: true,
          resizeGripper: true,
          theme: "light",
          width: EMBED_WIDTH,
          height: EMBED_HEIGHT,

          HTMLAttributes: {
            class: "media-twitter twitter-tweet",
            "data-chrome": "transparent noheader nofooter",
            "data-dnt": "true",
            style: {
              backgroundColor: "transparent",
              width: EMBED_WIDTH,
            },
          },
        },
        SoundCloud: {
          inline: false,
          width: EMBED_WIDTH,
        },
      }),
    ],
    autofocus: true,
    avoidIosKeyboard: true,
  });

  useEffect(() => {
    rnFS.writeFile(
        rnFS.CachesDirectoryPath + '/editorOnDevice.html',
        editorHtml,
        'utf8'
    );
  }, []);

  if(!editor)return null

  return (
  <View style={styles.container}>
    <RichText
        editor={editor}
        source={{
          uri: "file://" + rnFS.CachesDirectoryPath + "/editorOnDevice.html",
        }}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        originWhitelist={["*"]}
        mixedContentMode="always"
        allowingReadAccessToURL={"file://" + rnFS.CachesDirectoryPath}
        style={{
          backgroundColor: "transparent",
          width: "100%",
        }}
        containerStyle={{
          width: "100%",
          backgroundColor: "transparent",
        }}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn("WebView error:", nativeEvent);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onShouldStartLoadWithRequest={() => true}
        webviewDebuggingEnabled={true}
        cacheEnabled={false}
    />
    <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
    >
    <Toolbar
        items={[
          {
            onPress: () => () => {
              editor.setMediaImage("https://www.shutterstock.com/image-photo/calm-weather-on-sea-ocean-600nw-2212935531.jpg")
            },
            active: () => false,
            disabled: () => false,
            image: () => require("./src/assets/image-.png"),
          },
          ...DEFAULT_TOOLBAR_ITEMS,
        ]}
        editor={editor}
    />
    </KeyboardAvoidingView>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical:100
  },
  keyboardAvoidingView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
});

export default App;
