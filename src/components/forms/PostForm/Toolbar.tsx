import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Minus,
  Image,
  SquarePlay,
  Link,
  List,
  ListOrdered,
  Undo,
  Redo,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Quote,
} from "lucide-react";
import { useState } from "react";

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-200">
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        isActive={editor?.isActive("heading", { level: 1 })}
      >
        <Heading1 />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        isActive={editor?.isActive("heading", { level: 2 })}
      >
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 3 }).run()
        }
        isActive={editor?.isActive("heading", { level: 3 })}
      >
        <Heading3 />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBold().run()}
        isActive={editor?.isActive("bold")}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleItalic().run()}
        isActive={editor?.isActive("italic")}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
        isActive={editor?.isActive("underline")}
      >
        <Underline />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleStrike().run()}
        isActive={editor?.isActive("strike")}
      >
        <Strikethrough />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        isActive={editor?.isActive("quote")}
      >
        <Quote />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        isActive={editor?.isActive("codeBlock")}
      >
        <Code />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        isActive={editor?.isActive("HorizontalRule")}
      >
        <Minus />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
        isActive={editor?.isActive("bulletList")}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        isActive={editor?.isActive("orderedList")}
      >
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("right").run()}
        isActive={editor?.isActive({ textAlign: "right" })}
      >
        <AlignRight />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("center").run()}
        isActive={editor?.isActive({ textAlign: "center" })}
      >
        <AlignCenter />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor?.chain().focus().setTextAlign("left").run()}
        isActive={editor?.isActive({ textAlign: "left" })}
      >
        <AlignLeft />
      </ToolbarButton>
      <LinkPopover editor={editor} />
      <ImagePopover editor={editor} />
      <VideoPopover editor={editor} />
      <ToolbarButton onClick={() => editor?.chain().focus().redo().run()}>
        <Redo />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor?.chain().focus().undo().run()}>
        <Undo />
      </ToolbarButton>
    </div>
  );
};

interface ToolbarButtonProps extends React.ComponentProps<"button"> {
  isActive?: boolean;
}

export const ToolbarButton = ({ isActive, ...props }: ToolbarButtonProps) => (
  <button
    {...props}
    type="button"
    className={cn(
      "p-2 rounded-md ",
      isActive && "font-bold text-black bg-zinc-200",
      props.className
    )}
  />
);

export const LinkPopover = ({ editor }: ToolbarProps) => {
  const [link, setLink] = useState("");

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (link === "") return;

    editor?.chain().focus().toggleLink({ href: link }).run();
    setLink("");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarButton isActive={editor?.isActive("link")}>
          <Link />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <p className="text-xs">اختر نصًا واضغط على زر الرابط لإضافة رابط.</p>
          <Input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="الرابط"
            className="w-full p-2 border rounded-md"
          />
          <Button type="button" onClick={addLink}>
            إضافة
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ImagePopover = ({ editor }: ToolbarProps) => {
  const [link, setLink] = useState("");

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (link === "") return;

    editor?.chain().focus().setImage({ src: link }).run();
    setLink("");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarButton isActive={editor?.isActive("image-renderer")}>
          <Image />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <Input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="رابط الصورة"
            className="w-full p-2 border rounded-md"
          />
          <Button type="button" onClick={addLink}>
            إضافة
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const VideoPopover = ({ editor }: ToolbarProps) => {
  const [link, setLink] = useState("");

  const addLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (link === "") return;

    editor
      ?.chain()
      .focus()
      .setYoutubeVideo({ src: link, width: 640, height: 480 })
      .run();
    setLink("");
  };

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarButton isActive={editor?.isActive("image-renderer")}>
          <SquarePlay />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <Input
            type="url"
            value={link}
            onChange={e => setLink(e.target.value)}
            placeholder="رابط الفديو"
            className="w-full p-2 border rounded-md"
          />
          <Button type="button" onClick={addLink}>
            إضافة
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
