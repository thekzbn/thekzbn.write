import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import './App.css'; // This will contain our layout and component-specific styles

function App() {
  const [title, setTitle] = useState<string>('');
  const [markdownContent, setMarkdownContent] = useState<string>('## Welcome to the Markdown Editor!\n\nStart writing your **blog post** here. You can use Markdown syntax to format your content.\n\n### Features:\n* Live preview\n* Download as .md file\n\n```javascript\n// Code blocks are supported too!\nconst message = "Hello, world!";\nconsole.log(message);\n```\n\nEnjoy!');
  const [htmlPreview, setHtmlPreview] = useState<string>('');

  useEffect(() => {
    const renderMarkdown = async () => {
      // Configure marked
      marked.setOptions({
        gfm: true, // Use GitHub Flavored Markdown
        breaks: true, // Add <br> on a single newline
      });
      setHtmlPreview(await marked.parse(markdownContent));
    };
    renderMarkdown();
  }, [markdownContent]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(event.target.value);
  };

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
          placeholder="Enter blog post title"
          value={title}
          onChange={handleTitleChange}
          className="title-input"
        />
        <button onClick={handleDownload} className="download-button">
          Download Post
        </button>
      </header>

      <main className="editor-main">
        <div className="editor-pane">
          <textarea
            value={markdownContent}
            onChange={handleMarkdownChange}
            placeholder="Start writing your Markdown content here..."
            className="markdown-textarea"
          />
        </div>
        <div className="preview-pane" dangerouslySetInnerHTML={{ __html: htmlPreview }} />
      </main>
    </div>
  );
}

export default App;