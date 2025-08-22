# Markdown Catalog Viewer

This is a VS Code extension that previews `.catalog.md` files in the sidebar from the current workspace root directory.

## Features

- Display the content of `.catalog.md` files in the VS Code sidebar
- Real-time preview of Markdown formatted catalog content
- Automatically detect changes to `.catalog.md` files and refresh the display

## How to Use

1. Create a file named `.catalog.md` in your workspace root directory
2. Write your catalog content in this file (supports standard Markdown syntax)
3. Open the "MD Catalog" panel in the VS Code sidebar to view the preview

## Example .catalog.md file

```markdown
# Project Catalog

## Chapter 1
- [Introduction](./docs/intro.md)
- [Quick Start](./docs/quickstart.md)

## Chapter 2
- [Advanced Features](./docs/advanced.md)
- [API Reference](./docs/api.md)

## Appendix
- [FAQ](./docs/faq.md)
- [Changelog](./docs/changelog.md)
```

## Notes

- The extension only looks for `.catalog.md` files in the workspace root directory
- If the file is not found, the panel will display a prompt message
- Content will automatically update after the file is saved