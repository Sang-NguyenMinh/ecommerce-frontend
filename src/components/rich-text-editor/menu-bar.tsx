import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { Toggle } from "@radix-ui/react-toggle";
import axios from "axios";
import { Select } from "antd";

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) {
    return null;
  }

  const Options = [
    {
      icon: <Heading1 className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      icon: <Heading2 className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 }),
    },
    {
      icon: <Heading3 className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 }),
    },
    {
      icon: <Bold className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      icon: <Italic className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      icon: <Strikethrough className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      icon: <AlignLeft className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      icon: <AlignCenter className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      icon: <AlignRight className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      icon: <List className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      icon: <ListOrdered className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      icon: <Highlighter className="size-5 mr-1" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
    {
      icon: <ImageIcon className="size-5 mr-1" />,
      onClick: async () => {
        console.log(editor.extensionManager.extensions);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "ecommerce");

          try {
            const response = await axios.post(
              `https://api.cloudinary.com/v1_1/ddrrh2cxt/image/upload`,
              formData
            );

            const imageUrl = response.data.secure_url;
            console.log("Image URL:", imageUrl);
            if (imageUrl) {
              editor.commands.insertContent(
                `<img  src="${imageUrl}" alt="Uploaded Image" />`
              );
            }
          } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed!");
          }
        };

        input.click();
      },
      pressed: false,
    },
    {
      icon: (
        <Select
          defaultValue={editor.getAttributes("textStyle").fontSize || "14px"}
          onChange={(value) => {
            editor
              .chain()
              .focus()
              .setMark("textStyle", { fontSize: value })
              .run();
          }}
        >
          <Select.Option value="12px">12</Select.Option>
          <Select.Option value="14px">14</Select.Option>
          <Select.Option value="16px">16</Select.Option>
          <Select.Option value="18px">18</Select.Option>
          <Select.Option value="20px">20</Select.Option>
        </Select>
      ),
      onClick: () => {},
      pressed: false,
    },
  ];

  return (
    <div className="border rounded-md p-1 mb-2 bg-slate-50 space-x-2 z-50">
      {Options.map((option, index) => (
        <Toggle
          key={index}
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
    </div>
  );
}
