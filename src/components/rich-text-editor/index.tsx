'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState } from 'react';
import MenuBar from './menu-bar';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Document from '@tiptap/extension-document';
import { toast } from 'sonner';
import { uploadImageToCloudinary, validateImageFile } from '@/utils/cloudinary';

// Custom ResizableImage extension
const ResizableImage = Image.extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const width = element.getAttribute('width') || element.style.width;
          return width;
        },
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return {
            width: attributes.width,
            style: `width: ${attributes.width}${typeof attributes.width === 'number' ? 'px' : ''};`,
          };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => {
          const height = element.getAttribute('height') || element.style.height;
          return height;
        },
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return {
            height: attributes.height,
            style: `height: ${attributes.height}${typeof attributes.height === 'number' ? 'px' : ''};`,
          };
        },
      },
    };
  },

  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const container = document.createElement('div');
      container.className =
        'image-resize-wrapper relative inline-block group max-w-full';

      const img = document.createElement('img');

      // Set all attributes including src, alt, etc.
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (key !== 'style') {
          img.setAttribute(key, value as string);
        }
      });

      img.className = 'block rounded-md my-2 cursor-pointer';
      img.draggable = false;

      // Apply width/height from node attributes
      if (node.attrs.width) {
        const width =
          typeof node.attrs.width === 'number'
            ? `${node.attrs.width}px`
            : node.attrs.width;
        img.style.width = width;
      } else {
        img.style.maxWidth = '100%';
      }

      if (node.attrs.height) {
        const height =
          typeof node.attrs.height === 'number'
            ? `${node.attrs.height}px`
            : node.attrs.height;
        img.style.height = height;
      } else {
        img.style.height = 'auto';
      }

      // Create resize handles container
      const resizeHandles = document.createElement('div');
      resizeHandles.className =
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200';

      // Create individual resize handles
      const handlePositions = [
        {
          position: 'top-left',
          cursor: 'nw-resize',
          classes: '-top-2 -left-2',
        },
        {
          position: 'top-right',
          cursor: 'ne-resize',
          classes: '-top-2 -right-2',
        },
        {
          position: 'bottom-left',
          cursor: 'sw-resize',
          classes: '-bottom-2 -left-2',
        },
        {
          position: 'bottom-right',
          cursor: 'se-resize',
          classes: '-bottom-2 -right-2',
        },
        {
          position: 'top',
          cursor: 'n-resize',
          classes: '-top-2 left-1/2 -translate-x-1/2',
        },
        {
          position: 'bottom',
          cursor: 's-resize',
          classes: '-bottom-2 left-1/2 -translate-x-1/2',
        },
        {
          position: 'left',
          cursor: 'w-resize',
          classes: '-left-2 top-1/2 -translate-y-1/2',
        },
        {
          position: 'right',
          cursor: 'e-resize',
          classes: '-right-2 top-1/2 -translate-y-1/2',
        },
      ];

      handlePositions.forEach(({ position, cursor, classes }) => {
        const handle = document.createElement('div');
        handle.className = `absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full ${classes}`;
        handle.style.cursor = cursor;
        handle.dataset.position = position;
        resizeHandles.appendChild(handle);
      });

      // Add delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.className =
        'absolute -top-2 -right-8 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-sm font-bold';
      deleteBtn.innerHTML = '×';
      deleteBtn.title = 'Delete image';

      // Handle deletion
      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof getPos === 'function') {
          const pos = getPos();
          const tr = editor.view.state.tr.delete(pos, pos + node.nodeSize);
          editor.view.dispatch(tr);
        }
      });

      // Resize functionality
      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startWidth = 0;
      let startHeight = 0;
      let currentHandle = '';
      let aspectRatio = 1;

      const startResize = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.dataset.position) return;

        e.preventDefault();
        e.stopPropagation();

        isResizing = true;
        currentHandle = target.dataset.position;
        startX = e.clientX;
        startY = e.clientY;

        const rect = img.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        aspectRatio = startWidth / startHeight;

        document.body.style.cursor = target.style.cursor;
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
      };

      const handleResize = (e: MouseEvent) => {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;

        // Calculate new dimensions based on handle position
        switch (currentHandle) {
          case 'right':
          case 'bottom-right':
          case 'top-right':
            newWidth = startWidth + deltaX;
            break;
          case 'left':
          case 'bottom-left':
          case 'top-left':
            newWidth = startWidth - deltaX;
            break;
        }

        switch (currentHandle) {
          case 'bottom':
          case 'bottom-right':
          case 'bottom-left':
            newHeight = startHeight + deltaY;
            break;
          case 'top':
          case 'top-right':
          case 'top-left':
            newHeight = startHeight - deltaY;
            break;
        }

        // Maintain aspect ratio for corner handles or when Shift is pressed
        if (currentHandle.includes('-') || e.shiftKey) {
          const ratioWidth = newWidth;
          const ratioHeight = newHeight;

          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            newHeight = newWidth / aspectRatio;
          } else {
            newWidth = newHeight * aspectRatio;
          }
        }

        // Apply constraints
        newWidth = Math.max(50, Math.min(800, newWidth));
        newHeight = Math.max(50, Math.min(600, newHeight));

        // Apply new dimensions
        img.style.width = `${newWidth}px`;
        img.style.height = `${newHeight}px`;
      };

      const stopResize = () => {
        if (!isResizing) return;

        isResizing = false;
        document.body.style.cursor = '';
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);

        // Update node attributes
        if (typeof getPos === 'function') {
          const pos = getPos();
          const newAttrs = {
            ...node.attrs,
            width: img.style.width,
            height: img.style.height,
          };

          const tr = editor.view.state.tr.setNodeMarkup(pos, null, newAttrs);
          editor.view.dispatch(tr);
        }
      };

      // Add event listeners
      resizeHandles.addEventListener('mousedown', startResize);

      // Prevent dragging
      img.addEventListener('dragstart', (e) => e.preventDefault());

      // Assemble the component
      container.appendChild(img);
      container.appendChild(resizeHandles);
      container.appendChild(deleteBtn);

      return {
        dom: container,
        contentDOM: null,
        update: (updatedNode) => {
          if (updatedNode.type !== node.type) return false;

          // Update image attributes
          if (updatedNode.attrs.src !== node.attrs.src) {
            img.src = updatedNode.attrs.src;
          }
          if (updatedNode.attrs.alt !== node.attrs.alt) {
            img.alt = updatedNode.attrs.alt || '';
          }
          if (updatedNode.attrs.title !== node.attrs.title) {
            img.title = updatedNode.attrs.title || '';
          }

          // Update dimensions
          if (updatedNode.attrs.width) {
            const width =
              typeof updatedNode.attrs.width === 'number'
                ? `${updatedNode.attrs.width}px`
                : updatedNode.attrs.width;
            img.style.width = width;
          }
          if (updatedNode.attrs.height) {
            const height =
              typeof updatedNode.attrs.height === 'number'
                ? `${updatedNode.attrs.height}px`
                : updatedNode.attrs.height;
            img.style.height = height;
          }

          return true;
        },
      };
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  uploadPreset?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  uploadPreset = 'your_upload_preset',
}: RichTextEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-3',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-3',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      ResizableImage.configure({
        allowBase64: false,
        inline: false,
      }),
      Document,
      Dropcursor.configure({
        color: '#3b82f6',
        width: 2,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          'min-h-[156px] border rounded-md bg-slate-50 py-2 px-3 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none max-w-none',
      },
      handleDrop: (view, event, slice, moved) => {
        if (
          !moved &&
          event.dataTransfer &&
          event.dataTransfer.files &&
          event.dataTransfer.files[0]
        ) {
          const file = event.dataTransfer.files[0];

          if (file.type.startsWith('image/')) {
            event.preventDefault();
            handleImageUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        const items = event.clipboardData?.items;

        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                handleImageUpload(file);
              }
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!editor || isUploading) return;

    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast?.error?.(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);

    try {
      const currentPos = editor.state.selection.from;
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '🔄 Uploading image...',
              marks: [{ type: 'italic' }],
            },
          ],
        })
        .run();

      const response = await uploadImageToCloudinary(file, uploadPreset);

      const loadingTextLength = '🔄 Uploading image...'.length;
      const deleteFrom = currentPos;
      const deleteTo = currentPos + loadingTextLength + 1;

      editor
        .chain()
        .focus()
        .deleteRange({ from: deleteFrom, to: deleteTo })
        .insertContent({
          type: 'resizableImage',
          attrs: {
            src: response.secure_url,
            alt: file.name,
            title: file.name,
          },
        })
        .run();

      toast?.success?.('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload image';

      editor
        .chain()
        .focus()
        .deleteRange({
          from:
            editor.state.selection.from - '🔄 Uploading image...'.length - 1,
          to: editor.state.selection.from,
        })
        .insertContent({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `❌ Upload failed: ${errorMessage}`,
              marks: [{ type: 'italic' }],
            },
          ],
        })
        .run();

      toast?.error?.(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageButtonClick = () => {
    if (isUploading) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    };

    input.click();
  };

  return (
    <div className="w-full">
      <style jsx global>{`
        .image-resize-wrapper:hover {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .image-resize-wrapper img {
          display: block;
        }

        .ProseMirror .image-resize-wrapper {
          margin: 8px 0;
        }
      `}</style>

      <MenuBar
        editor={editor}
        onImageClick={handleImageButtonClick}
        isUploading={isUploading}
      />
      <EditorContent editor={editor} />

      {isUploading && (
        <div className="mt-2 text-sm text-blue-600 flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Uploading image...
        </div>
      )}
    </div>
  );
}
