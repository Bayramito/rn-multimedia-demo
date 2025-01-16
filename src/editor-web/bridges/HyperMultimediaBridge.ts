import {BridgeExtension} from "@10play/tentap-editor";
import {HyperMultimediaKit} from "@docs.plus/extension-hypermultimedia";
import {SingleCommands} from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    setMediaImage: (options: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
      display?: string;
      margin?: string;
      clear?: string;
      float?: string;
    }) => ReturnType;
  }
}

// Define the state interface for all media types
interface HyperMultimediaEditorState {
  currentMedia: {
    type: "image" | "video" | "audio" | "youtube" | "vimeo" | "soundcloud" | "twitter";
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
  selectedElement: {
    type: string;
    attrs: any;
    text: string;
    position: {
      from: number;
      to: number;
    };
  } | null;
}

// Define the instance methods for all media types
interface HyperMultimediaEditorInstance {
  setMediaImage: (src: string, options?: {alt?: string; width?: number; height?: number}) => void;
  // setVideo: (src: string, options?: {width?: number; height?: number}) => void;
  setAudio: (src: string, options?: {title?: string; controls?: boolean}) => void;
  setYoutube: (src: string, options?: {width?: number; height?: number}) => void;
  setVimeo: (src: string, options?: {width?: number; height?: number}) => void;
  setSoundCloud: (src: string, options?: {width?: number; height?: number}) => void;
  setTwitter: (src: string) => void;
}

// Define message types for communication
export enum HyperMultimediaActionType {
  SetMediaImage = "set-media-image",
  // SetVideo = "set-video",
  SetAudio = "set-audio",
  SetYoutube = "set-youtube",
  SetVimeo = "set-vimeo",
  SetSoundCloud = "set-soundcloud",
  SetTwitter = "set-twitter",
}

type HyperMultimediaMessage =
  | {
      type: HyperMultimediaActionType.SetMediaImage;
      payload: {src: string; alt?: string; width?: number; height?: number};
    }
  // | {
  //     type: HyperMultimediaActionType.SetVideo;
  //     payload: {src: string; width?: number; height?: number};
  //   }
  | {
      type: HyperMultimediaActionType.SetAudio;
      payload: {src: string; title?: string; controls?: boolean};
    }
  | {
      type: HyperMultimediaActionType.SetYoutube;
      payload: {src: string; width?: number; height?: number};
    }
  | {
      type: HyperMultimediaActionType.SetVimeo;
      payload: {src: string; width?: number; height?: number};
    }
  | {
      type: HyperMultimediaActionType.SetSoundCloud;
      payload: {src: string; width?: number; height?: number};
    }
  | {
      type: HyperMultimediaActionType.SetTwitter;
      payload: {src: string};
    };

declare module "@10play/tentap-editor" {
  interface BridgeState extends HyperMultimediaEditorState {}
  interface EditorBridge extends HyperMultimediaEditorInstance {}
}

export const HyperMultimediaBridge = new BridgeExtension<
  HyperMultimediaEditorState,
  HyperMultimediaEditorInstance,
  HyperMultimediaMessage
>({
  tiptapExtension: HyperMultimediaKit.configure({
    Image: {
      resizeGripper: true,
      HTMLAttributes: {
        class: "media-image",
        draggable: "true",
      },
    },
    Video: {
      resizeGripper: true,
      HTMLAttributes: {
        class: "media-video",
        controls: true,
      },
    },
    Audio: {
      resizeGripper: true,
      HTMLAttributes: {
        class: "media-audio",
        controls: true,
      },
    },
    Youtube: {
      resizeGripper: true,
      HTMLAttributes: {
        class: "media-youtube",
        allowfullscreen: true,
        frameborder: "0",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
      },
      controls: 1,
      autoplay: 0,
    },
    Vimeo: {
      resizeGripper: true,
      HTMLAttributes: {
        class: "media-vimeo",
      },
    },
    SoundCloud: {
      resizeGripper: true,
      HTMLAttributes: {
        class: "media-soundcloud",
      },
    },
    Twitter: {
      addPasteHandler: true,
      inline: false,
      HTMLAttributes: {
        class: "media-twitter twitter-tweet",
        "data-chrome": "transparent noheader nofooter",
        "data-dnt": "true",
      },
    },
  }),

  onBridgeMessage: (editor, message, sendMessageBack) => {
    switch (message.type) {
      case HyperMultimediaActionType.SetMediaImage: {
        const {src, alt, width, height} = message.payload;
        editor.commands.insertContent({
          type: "Image",
          attrs: {
            src,
            alt,
            width,
            height,
            display: "block",
            margin: "0in",
            clear: "none",
            float: "unset",
            objectFit: "contain",
          },
        });
        break;
      }
      // case HyperMultimediaActionType.SetVideo: {
      //   const {src, width, height} = message.payload;
      //   editor.commands.setVideo({src, width, height});
      //   break;
      // }
      case HyperMultimediaActionType.SetAudio: {
        const {src, title, controls} = message.payload;
        editor.commands.setAudio({src, title, controls});
        break;
      }
      case HyperMultimediaActionType.SetYoutube: {
        const {src} = message.payload;
        editor.commands.insertContent({
          type: "Youtube",
          attrs: {
            src,
            controls: 1,
            autoplay: 0,
          },
        });
        break;
      }
      case HyperMultimediaActionType.SetVimeo: {
        const {src, width, height} = message.payload;
        editor.commands.insertContent({
          type: "Vimeo",
          attrs: {src, width, height},
        });
        break;
      }
      case HyperMultimediaActionType.SetSoundCloud: {
        const {src, width, height} = message.payload;
        editor.commands.insertContent({
          type: "SoundCloud",
          attrs: {src, width, height},
        });
        break;
      }
      case HyperMultimediaActionType.SetTwitter: {
        const {src} = message.payload;

        const twitterConfig =
          editor.extensionManager.extensions.find(ext => ext.name === "Twitter")?.options?.HTMLAttributes || {};
        editor.commands.insertContent({
          type: "Twitter",
          attrs: {
            src,
            ...twitterConfig.style,
          },
        });

        break;
      }
      default:
        return false;
    }
    return true;
  },

  extendEditorInstance: sendBridgeMessage => {
    return {
      setMediaImage: (src, options = {}) => {
        sendBridgeMessage({
          type: HyperMultimediaActionType.SetMediaImage,
          payload: {src, ...options},
        });
      },
      // setVideo: (src, options = {}) => {
      //   sendBridgeMessage({
      //     type: HyperMultimediaActionType.SetVideo,
      //     payload: {src, ...options},
      //   });
      // },
      setAudio: (src, options = {}) => {
        sendBridgeMessage({
          type: HyperMultimediaActionType.SetAudio,
          payload: {src, ...options},
        });
      },
      setYoutube: (src, options = {}) => {
        sendBridgeMessage({
          type: HyperMultimediaActionType.SetYoutube,
          payload: {src, ...options},
        });
      },
      setVimeo: (src, options = {}) => {
        sendBridgeMessage({
          type: HyperMultimediaActionType.SetVimeo,
          payload: {src, ...options},
        });
      },
      setSoundCloud: (src, options = {}) => {
        sendBridgeMessage({
          type: HyperMultimediaActionType.SetSoundCloud,
          payload: {src, ...options},
        });
      },
      setTwitter: src => {
        sendBridgeMessage({
          type: HyperMultimediaActionType.SetTwitter,
          payload: {src},
        });
      },
    };
  },

  extendEditorState: editor => {
    const content = editor.getJSON().content || [];
    const selection = editor.state.selection;
    const selectedNode = selection.$anchor.nodeAfter;

    // Get details of selected node if it exists
    const selectedElement = selectedNode
      ? {
          type: selectedNode.type.name,
          attrs: selectedNode.attrs,
          text: selectedNode.textContent,
          position: {
            from: selection.from,
            to: selection.to,
          },
        }
      : null;

    const currentMedia = content
      .filter((node: any) =>
        ["image", "video", "audio", "youtube", "vimeo", "soundcloud", "twitter"].includes(node.type),
      )
      .map((node: any) => ({
        type: node.type,
        ...node.attrs,
      }));

    return {
      currentMedia,
      selectedElement,
    };
  },

  extendCSS: `
    .media-image, .media-video, .media-youtube, .media-vimeo, .media-twitter {
      max-width: 100%;
    //   height: auto;
      display: block;
      margin: 10px 0;
      &.ProseMirror-selectednode {
        outline: 3px solid #68cef8;
      }
    }
    
    div[data-youtube-video],
    div[data-youtube-video].youtube-video {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important;
    }

    div[data-youtube-video] iframe,
    div[data-youtube-video].youtube-video iframe {
      width: 100% !important;
      max-width: 100% !important;
      aspect-ratio: 16/9;
      border: none;
      display: block;
      margin: 0;
      padding: 0;
    }
    
    .media-audio, .media-soundcloud {
      width: 100%;
      max-width: 500px;
      &.ProseMirror-selectednode {
        outline: 3px solid #68cef8;
      }
    }

    .media-twitter.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }

    .hypermultimedia--twitter__content {
        width: var(--tweet-width) !important;
        max-width: 96% !important;
        pointer-events: none !important; // DISABLES CLICKING ON TWEET
    }

    .hypermultimedia--twitter__content iframe {
        pointer-events: none !important; // DISABLES CLICKING ON TWEET
    }

    .hypermultimedia--twitter__content blockquote {
        pointer-events: none !important; // DISABLES CLICKING ON TWEET
    }
  `,
});
