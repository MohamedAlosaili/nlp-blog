import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Typography from "@tiptap/extension-typography";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Video from "@tiptap/extension-youtube";
import { Toolbar } from "./Toolbar";
import { use } from "react";
import { PostFormContext } from "./PostFormContext";

export const TextEditor = () => {
  const { formData, onChange, loading } = use(PostFormContext);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      Underline,
      Link.extend({
        inclusive: false,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "right",
      }),
      Video,
    ],
    editorProps: {
      attributes: {
        class:
          "flex-1 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none py-8 px-4",
      },
    },
    content: formData.content,
    onUpdate({ editor }) {
      onChange({ name: "content", value: editor.getHTML() });
    },
  });

  return (
    <div className="min-h-screen sm:min-h-[75vh] border border-input rounded-md flex flex-col">
      <Toolbar editor={editor} />
      <EditorContent
        style={{ whiteSpace: "pre-wrap" }}
        editor={editor}
        disabled={loading}
      />
    </div>
  );
};
