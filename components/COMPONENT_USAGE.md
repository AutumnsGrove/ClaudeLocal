# Component Usage Guide

This document provides usage examples for the newly created components in ClaudeLocal.

## Table of Contents
- [ModelPicker](#modelpicker)
- [MarkdownPreview](#markdownpreview)
- [CodeBlock](#codeblock)
- [PDFPreview](#pdfpreview)
- [ImagePreview](#imagepreview)
- [Toast Notifications](#toast-notifications)

---

## ModelPicker

A dropdown component for selecting AI models with context window and token information display.

### Usage

```tsx
import { ModelPicker } from "@/components/model/ModelPicker";

function MyComponent() {
  const [selectedModel, setSelectedModel] = useState("claude-sonnet-3-5-20241022");

  return (
    <ModelPicker
      selectedModel={selectedModel}
      onModelChange={setSelectedModel}
      className="w-full max-w-md"
    />
  );
}
```

### Props
- `selectedModel: string` - Currently selected model ID
- `onModelChange: (modelId: string) => void` - Callback when model changes
- `className?: string` - Optional CSS classes

### Features
- Fetches models from `/api/models` endpoint
- Displays model name and description
- Shows context window and max tokens info
- Loading and error states
- Automatic retry on fetch failure

---

## MarkdownPreview

Renders markdown content with GitHub Flavored Markdown support.

### Usage

```tsx
import { MarkdownPreview } from "@/components/preview/MarkdownPreview";

function MyComponent() {
  const markdown = `
# Hello World

This is **bold** and this is *italic*.

- List item 1
- List item 2

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
  `;

  return <MarkdownPreview content={markdown} />;
}
```

### Props
- `content: string` - Markdown content to render
- `className?: string` - Optional CSS classes

### Features
- GitHub Flavored Markdown (tables, strikethrough, task lists)
- Syntax-highlighted code blocks
- Automatic external link handling (opens in new tab)
- Responsive images with lazy loading
- Claude-style markdown rendering

---

## CodeBlock

Displays code with syntax highlighting and copy functionality.

### Usage

```tsx
import { CodeBlock } from "@/components/preview/CodeBlock";
import { ToastProvider } from "@/components/ui/toast";

function MyComponent() {
  const code = `
function hello() {
  console.log("Hello, World!");
}
  `.trim();

  return (
    <ToastProvider>
      <CodeBlock
        code={code}
        language="javascript"
        showLineNumbers={true}
      />
    </ToastProvider>
  );
}
```

### Props
- `code: string` - Source code to display
- `language: string` - Programming language (js, ts, python, jsx, tsx, css, json, etc.)
- `showLineNumbers?: boolean` - Show line numbers (default: false)
- `className?: string` - Optional CSS classes

### Supported Languages
- JavaScript (js)
- TypeScript (ts)
- Python (python)
- JSX (jsx)
- TSX (tsx)
- CSS (css)
- SCSS (scss)
- JSON (json)
- Markdown (markdown)
- Bash (bash)
- YAML (yaml)
- SQL (sql)
- Rust (rust)
- Go (go)
- Java (java)

### Features
- Syntax highlighting via Prism.js
- Copy to clipboard button
- Toast notification on copy
- Language label display
- Hover-to-show controls

**Note:** Requires `ToastProvider` wrapper to enable copy notifications.

---

## PDFPreview

PDF viewer with page navigation and zoom controls.

### Usage

```tsx
import { PDFPreview } from "@/components/preview/PDFPreview";

function MyComponent() {
  return (
    <PDFPreview
      file="/path/to/document.pdf"
      // or file={fileBlob}
      // or file={new File(...)}
    />
  );
}
```

### Props
- `file: string | File | Blob` - PDF file path, File object, or Blob
- `className?: string` - Optional CSS classes

### Features
- Page navigation (previous/next)
- Zoom controls (50% - 300%)
- Page number display
- Canvas-based rendering
- Loading and error states
- Responsive layout

### Worker Setup
The component automatically loads the PDF.js worker from unpkg CDN. For production, consider hosting the worker locally.

---

## ImagePreview

Image viewer with zoom, pan, and lightbox functionality.

### Usage

```tsx
import { ImagePreview } from "@/components/preview/ImagePreview";

function MyComponent() {
  return (
    <ImagePreview
      src="/path/to/image.jpg"
      alt="Description of image"
      enableZoom={true}
      enableLightbox={true}
    />
  );
}
```

### Props
- `src: string` - Image source URL
- `alt: string` - Alt text for accessibility
- `className?: string` - Optional CSS classes
- `enableZoom?: boolean` - Enable zoom controls (default: true)
- `enableLightbox?: boolean` - Enable lightbox on click (default: true)

### Features
- Zoom in/out (100% - 300%)
- Pan by dragging when zoomed
- Lightbox/fullscreen view
- Loading and error states
- Hover-to-show zoom controls
- Responsive design

### Supported Formats
- JPG/JPEG
- PNG
- SVG
- WebP
- GIF

---

## Toast Notifications

Global toast notification system for user feedback.

### Setup

Wrap your app with `ToastProvider`:

```tsx
// app/layout.tsx or root component
import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### Usage

```tsx
import { useToast } from "@/components/ui/toast";

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast("Operation completed successfully!", "success");
  };

  const handleError = () => {
    showToast("Something went wrong", "error");
  };

  const handleInfo = () => {
    showToast("This is an info message", "info");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
      <button onClick={handleInfo}>Show Info</button>
    </div>
  );
}
```

### API
- `showToast(message: string, type?: "success" | "error" | "info")` - Display a toast notification

### Features
- Auto-dismiss after 3 seconds
- Manual dismiss with close button
- Three types: success, error, info
- Animated entrance/exit
- Stacked notifications
- Fixed position (bottom-right)

---

## Import Shortcuts

Use barrel exports for cleaner imports:

```tsx
// Preview components
import { CodeBlock, ImagePreview, MarkdownPreview, PDFPreview } from "@/components/preview";

// Model components
import { ModelPicker } from "@/components/model";

// UI components
import { useToast, ToastProvider } from "@/components/ui/toast";
```

---

## Notes

1. **ToastProvider Requirement:** The `CodeBlock` component requires the app to be wrapped in `ToastProvider` for copy notifications to work.

2. **PDF.js Worker:** The `PDFPreview` component loads the worker from unpkg CDN. For production, download and host it locally.

3. **Prism.js Themes:** The `CodeBlock` component uses the "tomorrow" theme. To change themes, modify the import in `CodeBlock.tsx`:
   ```tsx
   import "prismjs/themes/prism-okaidia.css"; // or other themes
   ```

4. **API Endpoint:** The `ModelPicker` expects a `/api/models` endpoint that returns:
   ```json
   {
     "models": [
       {
         "id": "model-id",
         "name": "Model Name",
         "description": "Model description",
         "context_window": 200000,
         "max_tokens": 8096
       }
     ]
   }
   ```

---

## TypeScript Types

All components are fully typed with TypeScript. Refer to the component source files for detailed type definitions.
