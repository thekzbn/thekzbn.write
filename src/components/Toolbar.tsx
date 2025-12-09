import React from 'react';
import {
  MdOutlineUndo,
  MdOutlineRedo,
  MdFormatBold,
  MdFormatItalic,
  MdStrikethroughS,
  MdLooksTwo, // For H2
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdFormatQuote,
  MdCode,
  MdTableChart,
  MdLink,
  MdImage,
  MdCloudUpload,
  MdFormatIndentIncrease,

  MdFormatIndentDecrease,
} from 'react-icons/md';

interface ToolbarProps {
  onAction: (action: string, value?: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAction }) => {
  return (
    <div className="editor-toolbar">
      <button onClick={() => onAction('undo')} title="Undo"><MdOutlineUndo /></button>
      <button onClick={() => onAction('redo')} title="Redo"><MdOutlineRedo /></button>
      <span className="separator" />
      <button onClick={() => onAction('bold')} title="Bold"><MdFormatBold /></button>
      <button onClick={() => onAction('italic')} title="Italic"><MdFormatItalic /></button>
      <button onClick={() => onAction('strikethrough')} title="Strikethrough"><MdStrikethroughS /></button>
      <span className="separator" />
      <button onClick={() => onAction('heading', 'h2')} title="Heading 2"><MdLooksTwo /></button>
      <span className="separator" />
      <button onClick={() => onAction('ol')} title="Ordered List"><MdFormatListNumbered /></button>
      <button onClick={() => onAction('ul')} title="Unordered List"><MdFormatListBulleted /></button>
      <span className="separator" />
      <button onClick={() => onAction('indent')} title="Indent"><MdFormatIndentIncrease /></button>
      <button onClick={() => onAction('outdent')} title="Outdent"><MdFormatIndentDecrease /></button>
      <span className="separator" />
      <button onClick={() => onAction('quote')} title="Blockquote"><MdFormatQuote /></button>
      <span className="separator" />
      <button onClick={() => onAction('code')} title="Code (Inline)"><MdCode /></button>
      <button onClick={() => onAction('codeblock')} title="Code Block"><span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}><MdCode /></span></button>
      <span className="separator" />
      <button onClick={() => onAction('table')} title="Insert Table"><MdTableChart /></button>
      <button onClick={() => onAction('link')} title="Insert Link"><MdLink /></button>
      <button onClick={() => onAction('image')} title="Insert Image (URL)"><MdImage /></button>
      <button onClick={() => onAction('upload-image')} title="Upload Image"><MdCloudUpload /></button>
    </div>
  );
};

export default Toolbar;