# Markdown Catalog Viewer

This is a VS Code extension that previews `.catalog.md` files in the sidebar from the current file's directory.

## Features

- Display the content of `.catalog.md` files in the VS Code sidebar under the Explorer view
- Real-time preview of Markdown formatted catalog content
- Automatically detect changes to `.catalog.md` files and refresh the display
- Shows the catalog for the directory of the currently active file

## How to Use

1. Create a file named `.catalog.md` in any directory
2. Write your catalog content in this file (supports standard Markdown syntax)
3. Open the "Catalog Viewer" panel in the Explorer section of VS Code sidebar to view the preview
4. When you switch between files, the catalog will automatically update to show the catalog for the directory of the active file

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

## Python Tools

This extension also includes two Python tools to help manage your documentation:

1. `generate_catalog.py` - Automatically generates a `.catalog.md` file based on the markdown files in a directory
2. `generate_table_of_content.py` - Automatically generates and updates table of contents for markdown files

See [TOOLS.md](./TOOLS.md) for detailed documentation on how to use these tools.

## Notes

- The extension looks for `.catalog.md` files in the directory of the currently active file
- If no active file exists, it falls back to the workspace root directory
- If the file is not found, the panel will display a prompt message
- Content will automatically update after the file is saved