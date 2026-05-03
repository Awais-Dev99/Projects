'use client';

import React, { useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
// Import the type for the editor to satisfy TypeScript
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';

interface EditorProps {
  value: string;
  onChange: (data: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
  // Explicitly type the ref as an HTMLDivElement
  const toolbarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="document-editor border border-gray-300 rounded-md shadow-sm bg-white">
      <div 
        ref={toolbarRef} 
        className="border-b border-gray-200 bg-slate-50 sticky top-0 z-10 p-1"
      ></div>
      
      <div className="editor-container p-8 min-h-[600px]">
        <CKEditor
          editor={DecoupledEditor as any}
          data={value}
          onReady={(editor: any) => {
            // Using 'any' here is the quickest fix for the SuperBuild internal UI types
            if (toolbarRef.current) {
              toolbarRef.current.innerHTML = ''; 
              toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
            }
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            onChange(data);
          }}
          config={{
            placeholder: 'Start typing your article...',
            toolbar: {
              items: [
                'undo', 'redo', '|',
                'fontFamily', 'fontSize', 'fontColor', 'fontBackgroundColor', '|',
                'bold', 'italic', 'underline', 'strikethrough', '|',
                'alignment', 'bulletedList', 'numberedList', '|',
                'link', 'insertTable', 'blockQuote', 'mediaEmbed'
              ],
              shouldNotGroupWhenFull: true
            },
          }}
        />
      </div>

      <style jsx global>{`
        .editor-container .ck-editor__top {
          display: none !important;
        }
        .ck-editor__editable_inline {
          min-height: 550px !important;
          border: 1px solid #e2e8f0 !important;
          background: white !important;
          max-width: 850px;
          margin: 0 auto;
          padding: 2rem !important;
        }
      `}</style>
    </div>
  );
}