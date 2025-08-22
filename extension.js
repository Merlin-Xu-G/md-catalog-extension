const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const MarkdownRenderer = require('./markdownRenderer');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const provider = new MDCatalogViewProvider(context.extensionUri);
  
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(MDCatalogViewProvider.viewType, provider)
  );
  
  // Refresh view when files or directories change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(() => provider.refresh()),
    vscode.workspace.onDidSaveTextDocument(() => provider.refresh()),
    vscode.window.onDidChangeActiveTextEditor(() => provider.refresh())
  );
}

class MDCatalogViewProvider {
  static viewType = 'mdCatalogViewer';
  
  constructor(extensionUri) {
    this.extensionUri = extensionUri;
    this.currentPanel = undefined;
    this.renderer = new MarkdownRenderer();
  }
  
  resolveWebviewView(webviewView, context, _token) {
    this.webviewView = webviewView;
    
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri]
    };
    
    webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
    
    // Handle messages from webview
    webviewView.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'alert':
          vscode.window.showErrorMessage(message.text);
          return;
      }
    });
    
    // Initial content refresh
    this.refresh();
  }
  
  refresh() {
    if (this.webviewView) {
      this.webviewView.webview.html = this.getHtmlForWebview(this.webviewView.webview);
    }
  }
  
  getHtmlForWebview(webview) {
    // Get current active file directory
    let catalogDir = null;
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor) {
      // If there's an active editor, use its directory
      catalogDir = path.dirname(activeEditor.document.uri.fsPath);
    } else {
      // Fallback to workspace root
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders && workspaceFolders.length > 0) {
        catalogDir = workspaceFolders[0].uri.fsPath;
      }
    }
    
    // If we couldn't determine a directory, show no folder message
    if (!catalogDir) {
      return this.getNoFolderHtml();
    }
    
    const catalogPath = path.join(catalogDir, '.catalog.md');
    
    // Check if .catalog.md file exists
    if (!fs.existsSync(catalogPath)) {
      return this.getNoCatalogHtml(catalogDir);
    }
    
    try {
      const catalogContent = fs.readFileSync(catalogPath, 'utf8');
      return this.getCatalogHtml(catalogContent);
    } catch (err) {
      return this.getErrorHtml(err.message);
    }
  }
  
  getNoFolderHtml() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MD Catalog Viewer</title>
      </head>
      <body>
        <h3>No workspace folder found</h3>
        <p>Please open a folder to view its catalog.</p>
      </body>
      </html>
    `;
  }
  
  getNoCatalogHtml(directory) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MD Catalog Viewer</title>
      </head>
      <body>
        <h3>No .catalog.md file found</h3>
        <p>Looked in: ${directory}</p>
        <p>Create a .catalog.md file in the current directory to get started.</p>
      </body>
      </html>
    `;
  }
  
  getErrorHtml(error) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MD Catalog Viewer</title>
      </head>
      <body>
        <h3>Error loading catalog</h3>
        <p>${error}</p>
      </body>
      </html>
    `;
  }
  
  getCatalogHtml(content) {
    const htmlContent = this.renderer.render(content);
    
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MD Catalog Viewer</title>
        <style>
          body {
            padding: 10px;
            font-family: var(--vscode-font-family);
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            line-height: 1.6;
          }
          h1, h2, h3, h4, h5, h6 {
            color: var(--vscode-editor-foreground);
            margin-top: 24px;
            margin-bottom: 16px;
          }
          h1 {
            font-size: 2em;
            border-bottom: 1px solid var(--vscode-editorWidget-border);
            padding-bottom: 0.3em;
          }
          h2 {
            font-size: 1.5em;
            border-bottom: 1px solid var(--vscode-editorWidget-border);
            padding-bottom: 0.3em;
          }
          p {
            margin: 1em 0;
          }
          a {
            color: var(--vscode-textLink-foreground);
          }
          code {
            font-family: var(--vscode-editor-font-family);
            background-color: var(--vscode-textBlockQuote-background);
            padding: 2px 4px;
            border-radius: 3px;
          }
          pre {
            background-color: var(--vscode-textBlockQuote-background);
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
          }
          blockquote {
            margin: 0;
            padding: 0 1em;
            border-left: 0.25em solid var(--vscode-editorWidget-border);
            color: var(--vscode-descriptionForeground);
          }
          ul, ol {
            padding-left: 2em;
          }
          li {
            margin: 0.25em 0;
          }
          hr {
            border: 0;
            border-top: 1px solid var(--vscode-editorWidget-border);
            margin: 1.5em 0;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
}