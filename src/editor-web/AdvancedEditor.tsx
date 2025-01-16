import React from 'react';import { EditorContent } from '@tiptap/react';import {useTenTap, CoreBridge, TenTapStartKit} from '@10play/tentap-editor';import {HyperMultimediaBridge} from "./bridges/HyperMultimediaBridge";/** * Here we control the web side of our custom editor */export const AdvancedEditor = () => {    const editor = useTenTap({        bridges: [...TenTapStartKit,HyperMultimediaBridge],    });    return <EditorContent editor={editor} />;};