import { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useAuthStore } from '../store/authStore';
import { useCodeSessionStore } from '../store/codeSessionStore';
import { Save, Play, Download, Eye, GitFork, GitMerge, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CodeEditor({ session, readOnly = false, onFork, onMergeRequest, showForkButton = false }) {
  const { user } = useAuthStore();
  const { updateCode, updateCursorPosition, updateSelection } = useCodeSessionStore();
  const editorRef = useRef(null);
  const [code, setCode] = useState(session.code);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const saveTimeoutRef = useRef(null);
  
  // Check if current user owns this session
  const isOwner = session.userId === user.$id;
  const effectiveReadOnly = readOnly || !isOwner;

  useEffect(() => {
    setCode(session.code);
    setHasUnsavedChanges(false);
  }, [session.$id]);

  // Update code from real-time changes
  useEffect(() => {
    if (session.code !== code && !hasUnsavedChanges) {
      setCode(session.code);
    }
  }, [session.code]);

  const handleEditorDidMount = (editor, monaco) => {                                                                              
    editorRef.current = editor;

    // Only track cursor/selection if user owns the session
    if (isOwner && !readOnly) {
      // Track cursor position changes
      editor.onDidChangeCursorPosition((e) => {
        const position = {
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        };
        updateCursorPosition(session.$id, user.$id, position);
      });

      // Track selection changes
      editor.onDidChangeCursorSelection((e) => {
        const selection = {
          startLineNumber: e.selection.startLineNumber,
          startColumn: e.selection.startColumn,
          endLineNumber: e.selection.endLineNumber,
          endColumn: e.selection.endColumn,
        };
        updateSelection(session.$id, user.$id, selection);
      });
    }

    // Render other users' cursors and selections
    renderRemoteCursorsAndSelections(editor, monaco);
  };

  const renderRemoteCursorsAndSelections = (editor, monaco) => {
    // This would need more sophisticated implementation with decorations
    // For now, this is a placeholder for the concept
    const decorations = [];
    
    Object.entries(session.cursorPositions || {}).forEach(([userId, position]) => {
      if (userId !== user.$id) {
        decorations.push({
          range: new monaco.Range(
            position.lineNumber,
            position.column,
            position.lineNumber,
            position.column
          ),
          options: {
            className: 'remote-cursor',
            glyphMarginClassName: 'remote-cursor-glyph',
          },
        });
      }
    });

    if (editorRef.current) {
      editorRef.current.deltaDecorations([], decorations);
    }
  };

  const handleCodeChange = (value) => {
    if (effectiveReadOnly) return; // Don't allow changes if not owner or in watch mode
    setCode(value);
    setHasUnsavedChanges(true);

    // Auto-save after 1 second of inactivity
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      handleSave(value);
    }, 1000);
  };

  const handleSave = async (codeToSave = code) => {
    try {
      await updateCode(session.$id, codeToSave);
      setHasUnsavedChanges(false);
      toast.success('Code saved!');
    } catch (error) {
      toast.error('Failed to save code');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${session.title}.${getFileExtension(session.language)}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Code downloaded!');
  };

  const getFileExtension = (language) => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      go: 'go',
      rust: 'rs',
      html: 'html',
      css: 'css',
    };
    return extensions[language] || 'txt';
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Editor Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div>
          <h3 className="font-medium flex items-center gap-2">
            {readOnly && <Eye className="w-4 h-4 text-green-400" />}
            {!isOwner && !readOnly && <Lock className="w-4 h-4 text-orange-400" />}
            {session.title}
          </h3>
          <p className="text-xs text-gray-400">
            {session.language} • Created by {session.userName}
            {readOnly && <span className="ml-2 text-green-400">• Watch Mode</span>}
            {!isOwner && !readOnly && <span className="ml-2 text-orange-400">• Read Only (Not Your Session)</span>}
            {isOwner && !readOnly && hasUnsavedChanges && <span className="ml-2 text-yellow-500">• Unsaved changes</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Fork button - shown when viewing someone else's session */}
          {!isOwner && showForkButton && onFork && (
            <button
              onClick={onFork}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-sm"
              title="Fork this session to your own editor"
            >
              <GitFork className="w-4 h-4" />
              Fork
            </button>
          )}
          
          {/* Merge Request button - shown when you have a forked session */}
          {!isOwner && !showForkButton && onMergeRequest && (
            <button
              onClick={onMergeRequest}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded transition-colors text-sm"
              title="Request to merge your changes"
            >
              <GitMerge className="w-4 h-4" />
              Merge Request
            </button>
          )}
          
          {/* Owner controls */}
          {isOwner && !readOnly && (
            <>
              <button
                onClick={() => handleSave()}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </>
          )}
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={session.language}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: true },
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            readOnly: effectiveReadOnly,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
