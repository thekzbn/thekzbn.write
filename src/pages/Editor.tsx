import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import { db } from '../firebase'; // Import Firestore db
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import Toolbar from '../components/Toolbar'; // Import the Toolbar component
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { MdOutlineSave, MdOutlineClear, MdOutlineDeleteOutline, MdOutlineOpenInBrowser } from 'react-icons/md';

import '../App.css'; // Global application styles

// Helper to debounce function calls
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
};

function Editor() {
  const [title, setTitle] = useState<string>('');
  const [markdownContent, setMarkdownContent] = useState<string>(
    localStorage.getItem('savedMarkdownContent') || '## Welcome to the Markdown Editor!\n\nStart writing your **blog post** here. You can use Markdown syntax to format your content.\n\n### Features:\n* Live preview\n* Save and Load online\n* Autosave\n\n```javascript\n// Code blocks are supported too!\nconst message = "Hello, world!";\nconsole.log(message);\n```\n\nEnjoy!'
  );
  const [htmlPreview, setHtmlPreview] = useState<string>('');
  const [history, setHistory] = useState<string[]>([markdownContent]);
  const [historyPointer, setHistoryPointer] = useState<number>(0);
  const [documentId, setDocumentId] = useState<string>(localStorage.getItem('currentDocumentId') || '');
  const [loadDocumentId, setLoadDocumentId] = useState<string>('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize markdown content from local storage or default
  useEffect(() => {
    // Save content to local storage
    localStorage.setItem('savedMarkdownContent', markdownContent);
  }, [markdownContent]);

  useEffect(() => {
    localStorage.setItem('currentDocumentId', documentId);
  }, [documentId]);


  useEffect(() => {
    const renderMarkdown = async () => {
      marked.setOptions({
        gfm: true,
        breaks: true,
      });
      setHtmlPreview(await marked.parse(markdownContent));
    };
    renderMarkdown();
  }, [markdownContent]);

  // Firebase save/load logic
  const savePost = useCallback(async () => {
    if (!markdownContent.trim()) {
      setMessage({ text: 'Cannot save an empty post.', type: 'error' });
      return;
    }
    const id = documentId || uuidv4();
    try {
      await setDoc(doc(db, 'posts', id), {
        title,
        markdownContent,
        updatedAt: new Date(),
      });
      setDocumentId(id);
      setMessage({ text: `Post saved successfully! ID: ${id}`, type: 'success' });
      // You might want to copy the ID to clipboard here
      navigator.clipboard.writeText(id);
    } catch (error) {
      console.error('Error saving post:', error);
      setMessage({ text: 'Error saving post.', type: 'error' });
    }
  }, [title, markdownContent, documentId]);

  const loadPost = useCallback(async (id: string) => {
    if (!id) {
      setMessage({ text: 'Please enter a document ID to load.', type: 'error' });
      return;
    }
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title);
        setMarkdownContent(data.markdownContent);
        setDocumentId(id);
        setMessage({ text: `Post "${data.title}" loaded successfully!`, type: 'success' });
      } else {
        setMessage({ text: 'No such document found!', type: 'error' });
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setMessage({ text: 'Error loading post.', type: 'error' });
    }
  }, []);

  const deletePost = useCallback(async () => {
    if (!documentId) {
      setMessage({ text: 'No document currently loaded to delete.', type: 'error' });
      return;
    }
    if (!window.confirm(`Are you sure you want to delete the post with ID: ${documentId}?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'posts', documentId));
      setMessage({ text: `Post ${documentId} deleted successfully!`, type: 'success' });
      setTitle('');
      setMarkdownContent('');
      setDocumentId(''); // Clear current document ID
      setHistory(['']); // Reset history
      setHistoryPointer(0); // Reset history pointer
    } catch (error) {
      console.error('Error deleting post:', error);
      setMessage({ text: 'Error deleting post.', type: 'error' });
    }
  }, [documentId]);

  const clearEditor = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear the editor? Any unsaved changes will be lost.')) {
      return;
    }
    setTitle('');
    setMarkdownContent('## Welcome to the Markdown Editor!\n\nStart writing your **blog post** here. You can use Markdown syntax to format your content.\n\n### Features:\n* Live preview\n* Save and Load online\n* Autosave\n\n```javascript\n// Code blocks are supported too!\nconst message = "Hello, world!";\nconsole.log(message);\n```\n\nEnjoy!');
    setDocumentId('');
    setHistory([markdownContent]); // Reset history
    setHistoryPointer(0); // Reset history pointer
    setMessage({ text: 'Editor cleared.', type: 'info' });
  }, []);


  // Autosave effect
  const debouncedSave = useCallback(
    debounce(() => {
      if (markdownContent.trim() && documentId) { // Only autosave if content and ID exist
        savePost();
      }
    }, 5000), // Save every 5 seconds of inactivity
    [markdownContent, documentId, savePost]
  );

  useEffect(() => {
    debouncedSave();
  }, [markdownContent, title, debouncedSave]);


  const updateMarkdownContent = useCallback((newContent: string) => {
    setMarkdownContent(newContent);
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyPointer + 1);
      return [...newHistory, newContent];
    });
    setHistoryPointer((prevPointer) => prevPointer + 1);
  }, [historyPointer]);

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = event.target.value;
    // Only add to history if content changed and it's not an undo/redo
    if (newContent !== history[historyPointer]) {
        setMarkdownContent(newContent);
        setHistory((prevHistory) => {
            const newHistory = prevHistory.slice(0, historyPointer + 1);
            return [...newHistory, newContent];
        });
        setHistoryPointer((prevPointer) => prevPointer + 1);
    }
  };


  const insertAtCursor = useCallback(( 
    startTag: string,
    endTag: string = '',
    placeholder: string = ''
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownContent.substring(start, end);

    let newText = '';
    let cursorOffset = 0;

    if (selectedText) {
      // If text is selected, wrap it
      newText = startTag + selectedText + endTag;
      cursorOffset = newText.length;
    } else {
      // If no text is selected, insert placeholder or just tags
      newText = startTag + placeholder + endTag;
      cursorOffset = startTag.length + placeholder.length;
    }

    const newContent = 
      markdownContent.substring(0, start) +
      newText +
      markdownContent.substring(end);

    updateMarkdownContent(newContent);

    // Restore cursor position
    requestAnimationFrame(() => {
      textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
    });
  }, [markdownContent, updateMarkdownContent]);

  const applyLineMarkdown = useCallback((prefix: string, defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const content = markdownContent;

    const lines = content.split('\n');
    let lineStart = 0;
    let newContentLines: string[] = [];
    let startLineIndex = -1;
    let endLineIndex = -1;

    // Find the lines containing the selection
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineEnd = lineStart + line.length;

      if (start <= lineEnd && end >= lineStart) {
        if (startLineIndex === -1) startLineIndex = i;
        endLineIndex = i;
      }
      lineStart += line.length + 1; // +1 for the newline character
    }

    // Apply prefix to selected lines or current line if no selection
    for (let i = 0; i < lines.length; i++) {
      if ((startLineIndex === -1 && i === lines.length - 1) || (i >= startLineIndex && i <= endLineIndex)) { 
        let line = lines[i];
        if (!line.startsWith(prefix)) {
            newContentLines.push(prefix + (line || defaultText));
        } else {
            newContentLines.push(line); // Already has prefix, don't double
        }
      } else {
        newContentLines.push(lines[i]);
      }
    }

    const newContent = newContentLines.join('\n');
    updateMarkdownContent(newContent);

    requestAnimationFrame(() => {
      // Attempt to maintain cursor position
      if (textarea.selectionStart >= start) {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = end + prefix.length;
      }
    });
  }, [markdownContent, updateMarkdownContent]);


  const handleMarkdownAction = useCallback((action: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdownContent.substring(start, end);

    switch (action) {
      case 'undo':
        if (historyPointer > 0) {
          setHistoryPointer(prev => prev - 1);
          setMarkdownContent(history[historyPointer - 1]);
        }
        break;
      case 'redo':
        if (historyPointer < history.length - 1) {
          setHistoryPointer(prev => prev + 1);
          setMarkdownContent(history[historyPointer + 1]);
        }
        break;
      case 'bold':
        insertAtCursor('**', '**', 'bold text');
        break;
      case 'italic':
        insertAtCursor('*', '*', 'italic text');
        break;
      case 'strikethrough':
        insertAtCursor('~~', '~~', 'strikethrough text');
        break;
      case 'heading':
        if (value === 'h2') {
            applyLineMarkdown('## ', 'Your Heading');
        }
        break;
      case 'ol':
        applyLineMarkdown('1. ', 'List item');
        break;
      case 'ul':
        applyLineMarkdown('* ', 'List item');
        break;
      case 'quote':
        applyLineMarkdown('> ', 'Quote');
        break;
      case 'code': // Inline code
        insertAtCursor('`', '`', 'code');
        break;
      case 'codeblock':
        insertAtCursor('```javascript\n', '\n```', 'console.log("hello");');
        break;
      case 'table':
        const tableTemplate = `| Header 1 | Header 2 |\n| -------- | -------- |\n| Item 1   | Item 2   |\n`;
        insertAtCursor('', '', tableTemplate);
        break;
      case 'link':
        const url = prompt('Enter the URL for the link:');
        if (url) {
          insertAtCursor('[', `](${url})`, 'link text');
        } else {
          insertAtCursor('[', `]()`, 'link text');
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter the URL for the image:');
        if (imageUrl) {
          insertAtCursor('![', `](${imageUrl})`, 'alt text');
        } else {
          insertAtCursor('![', `]()`, 'alt text');
        }
        break;
      case 'indent':
      case 'outdent':
        // Indent/Outdent logic (more complex, requires line-by-line processing)
        // For simplicity, I'll implement a basic tab insert/remove for selected lines
        const lines = markdownContent.substring(start, end).split('\n');
        const indentation = action === 'indent' ? '  ' : ''; // Use 2 spaces for indent for markdown lists/code
        let newLines = lines.map(line => {
            // Check if line starts with a list item or code block prefix and apply/remove indent appropriately
            // This is a simplified implementation; a full-featured one would be more robust.
            if (action === 'indent') {
                return indentation + line;
            } else { // outdent
                if (line.startsWith('  ')) {
                    return line.substring(2);
                } else if (line.startsWith('\t')) { // also handle tabs if any
                    return line.substring(1);
                }
                return line;
            }
        }).join('\n');

        const newContent = 
            markdownContent.substring(0, start) +
            newLines +
            markdownContent.substring(end);

        updateMarkdownContent(newContent);

        requestAnimationFrame(() => {
            textarea.selectionStart = start;
            textarea.selectionEnd = start + newLines.length;
        });
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
    textarea.focus(); // Keep focus on textarea
  }, [markdownContent, history, historyPointer, updateMarkdownContent, insertAtCursor, applyLineMarkdown]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey || event.metaKey) {
      if (event.key === 'z') {
        event.preventDefault();
        handleMarkdownAction('undo');
      } else if (event.key === 'y') {
        event.preventDefault();
        handleMarkdownAction('redo');
      }
    }
  }, [handleMarkdownAction]);


  const handleDownload = () => {
    if (!markdownContent.trim()) {
      alert('Cannot download an empty post.');
      return;
    }

    const sanitizedTitle = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Trim hyphens from start/end

    const filename = `${sanitizedTitle || 'untitled-post'}.md`;
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="markdown-editor-app">
      <header className="editor-header">
        <h1>@thekzbn.write</h1>
        <input
          type="text"
          placeholder={documentId ? `Editing ID: ${documentId}` : "Enter blog post title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
        />
        <button onClick={savePost} className="download-button" title="Save to Cloud">
          <MdOutlineSave /> {documentId ? 'Update Post' : 'Save New Post'}
        </button>
        <button onClick={handleDownload} className="download-button" title="Download as .md">
          Download Post
        </button>
        <button onClick={clearEditor} className="download-button" title="Clear Editor">
          <MdOutlineClear /> Clear
        </button>
        {documentId && (
          <button onClick={deletePost} className="download-button delete-button" title="Delete Post">
            <MdOutlineDeleteOutline /> Delete
          </button>
        )}
      </header>

      <div className="editor-toolbar-container">
        <Toolbar onAction={handleMarkdownAction} />
        <div className="firebase-load-section">
          <input
            type="text"
            placeholder="Load Document ID"
            value={loadDocumentId}
            onChange={(e) => setLoadDocumentId(e.target.value)}
            className="title-input small-input"
          />
          <button onClick={() => loadPost(loadDocumentId)} className="download-button" title="Load Post">
            <MdOutlineOpenInBrowser /> Load
          </button>
        </div>
      </div>

      <main className="editor-main">
        <div className="editor-pane">
          <textarea
            ref={textareaRef}
            value={markdownContent}
            onChange={handleMarkdownChange}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your Markdown content here..."
            className="markdown-textarea"
          />
        </div>
        <div className="preview-pane" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
        {message && (
          <div className={`message-banner ${message.type}`}>
            {message.text}
            <button onClick={() => setMessage(null)} className="close-message">X</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Editor;