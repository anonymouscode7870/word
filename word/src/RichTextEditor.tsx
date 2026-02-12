import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { saveAs } from 'file-saver';
import * as HTMLDOCX from 'html-docx-js/dist/html-docx';
import jsPDF from 'jspdf';

const RichTextEditor: React.FC = () => {
  const [value, setValue] = useState<string>('');
  const editorRef = useRef<ReactQuill>(null);

  // Save as Word
  const handleSaveWord = () => {
    const content = `
      <html>
        <head>
          <meta charset="utf-8" />
        </head>
        <body>${value}</body>
      </html>
    `;
    const converted = HTMLDOCX.asBlob(content);
    saveAs(converted, 'document.docx');
  };

  // Save as PDF
  const handleSavePDF = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    pdf.html(value, {
      callback: (doc) => {
        doc.save('document.pdf');
      },
      margin: [40, 40, 40, 40],
      autoPaging: 'text',
      x: 20,
      y: 20
    });
  };

  return (
    <div>
      <h2>Rich Text Editor</h2>
      <ReactQuill
        ref={editorRef}
        theme="snow"
        value={value}
        onChange={setValue}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
          ],
        }}
        formats={[
          'header', 'bold', 'italic', 'underline', 'strike', 'align', 'list', 'bullet', 'link', 'image'
        ]}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={handleSaveWord}>Save as Word</button>
        <button onClick={handleSavePDF} style={{ marginLeft: '10px' }}>Save as PDF</button>
      </div>
    </div>
  );
};

export default RichTextEditor;
