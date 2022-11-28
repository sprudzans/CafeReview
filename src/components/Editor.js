import { createReactEditorJS } from 'react-editor-js'
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import List from "@editorjs/list";
import Warning from "@editorjs/warning";
import Code from "@editorjs/code";
import LinkTool from "@editorjs/link";
import ImageTool from "@editorjs/image";
import Raw from "@editorjs/raw";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import CheckList from "@editorjs/checklist";
import Delimiter from "@editorjs/delimiter";
import InlineCode from "@editorjs/inline-code";
import SimpleImage from "@editorjs/simple-image";
import axios from "axios";

const EDITOR_JS_TOOLS = {
    embed: Embed,
    table: Table,
    marker: Marker,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    image: {
        class: ImageTool,
        config: {
            uploader: {
                async uploadByFile(file) {
                    const formData = new FormData()
                    formData.append("image", file)

                    const response = await axios.post(process.env.NEXT_PUBLIC_UPLOAD_LINK, formData, {headers: {'content-type': 'multipart/form-data'}});

                    return {
                        success: 1,
                        file: {
                            url: process.env.NEXT_PUBLIC_UPLOAD_LINK + response.data.file,
                        }
                    };
                }
            }
        }
    },
    raw: Raw,
    header: Header,
    quote: Quote,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage
};

const ReactEditorJS = createReactEditorJS()

const Editor = (props) => (
    <>
        <style>{`
            .ce-toolbar, .ce-inline-toolbar{
                color: #000;
            }
        
            .ce-toolbar__actions .ce-toolbar__plus,
            .ce-toolbar__actions .ce-toolbar__settings-btn {
                color: white;
            }
        `}</style>
        <ReactEditorJS tools={EDITOR_JS_TOOLS} {...props}/>
    </>
)

export default Editor