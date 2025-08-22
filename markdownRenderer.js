const vscode = require('vscode');

class MarkdownRenderer {
  constructor() {}
  
  render(content) {
    // Use more complete Markdown to HTML conversion
    return this.processMarkdown(content);
  }
  
  processMarkdown(content) {
    if (!content) return '';
    
    let html = content;
    
    // Code blocks (```...```)
    html = html.replace(/```(\w*)\n([\s\S]*?)\n```/g, (match, lang, code) => {
      return `<pre><code class="language-${lang}">${this.escapeHtml(code)}</code></pre>`;
    });
    
    // Inline code (`...`)
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Blockquotes (> ...)
    html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
    
    // Horizontal rules
    html = html.replace(/^-{3,}$|^\*{3,}$/gm, '<hr>');
    
    // Headers (# H1, ## H2, ...)
    html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
    html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
    html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    
    // Bold (**...** or __...__)
    html = html.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>');
    
    // Italic (*...* or _..._)
    html = html.replace(/(?<!\*)\*([^\*]+?)\*(?!\*)|(?<!_)_([^_]+?)_(?!_)/g, '<em>$1$2</em>');
    
    // Strikethrough (~~...~~)
    html = html.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Links ([text](url))
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    
    // Images (![alt](url))
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    
    // Unordered lists (* or - or +)
    html = html.replace(/^[*-+]\s+(.*)$/gm, '<li>$1</li>');
    
    // Ordered lists (1. 2. 3. etc)
    html = html.replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>');
    
    // Wrap adjacent <li> elements in <ul> or <ol>
    html = this.wrapLists(html);
    
    // Paragraphs and line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    
    // Clean up empty paragraph tags
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/^<p>(.*)<\/p>$/s, '$1');
    
    // Ensure entire content is wrapped in paragraph tags
    if (!html.startsWith('<h')) {
      html = '<p>' + html + '</p>';
    }
    
    return html;
  }
  
  wrapLists(html) {
    const lines = html.split('<br>');
    let inUnorderedList = false;
    let inOrderedList = false;
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if it's a list item
      if (line.startsWith('<li>')) {
        // Check if it's ordered or unordered list
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        if (/^\d+\.\s/.test(line.replace(/<li>(.*)<\/li>/, '$1'))) {
          // Ordered list
          if (!inOrderedList) {
            if (inUnorderedList) {
              result.push('</ul>');
              inUnorderedList = false;
            }
            result.push('<ol>');
            inOrderedList = true;
          }
        } else {
          // Unordered list
          if (!inUnorderedList) {
            if (inOrderedList) {
              result.push('</ol>');
              inOrderedList = false;
            }
            result.push('<ul>');
            inUnorderedList = true;
          }
        }
        result.push(line);
      } else {
        // Not a list item, close any open lists
        if (inUnorderedList) {
          result.push('</ul>');
          inUnorderedList = false;
        }
        if (inOrderedList) {
          result.push('</ol>');
          inOrderedList = false;
        }
        result.push(line);
      }
    }
    
    // Close ending lists
    if (inUnorderedList) {
      result.push('</ul>');
    }
    if (inOrderedList) {
      result.push('</ol>');
    }
    
    return result.join('<br>');
  }
  
  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

module.exports = MarkdownRenderer;