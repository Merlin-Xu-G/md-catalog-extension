# Python Tools Documentation

This extension includes two Python tools to help manage your documentation:

1. `generate_catalog.py` - Automatically generates a `.catalog.md` file based on the markdown files in a directory
2. `generate_table_of_content.py` - Automatically generates and updates table of contents for markdown files

## generate_catalog.py

This tool scans a directory and creates a `.catalog.md` file that lists all the markdown files in that directory.

### Features

- Automatically scans for markdown files in the specified directory
- Preserves existing catalog files by creating a backup (`.catalog.md.bak`)
- Creates an order configuration file (`.order.json`) to customize the order of files in the catalog
- Generates a markdown list with links to all files

### Usage

```bash
python generate_catalog.py -p /path/to/directory
```

Or:

```bash
python generate_catalog.py --path /path/to/directory
```

### How it works

1. The tool first checks if a `.catalog.md` file already exists. If so, it creates a backup by renaming it to `.catalog.md.bak`
2. It scans the directory for all files, excluding:
   - Existing `.catalog.md` files
   - Backup `.catalog.md.bak` files
   - Order configuration `.order.json` files
3. It creates or updates the `.order.json` file to define the order of files in the catalog
4. It generates the `.catalog.md` file with a list of all files as markdown links

### Customizing file order

The tool generates an `.order.json` file that allows you to customize the order of files in the catalog:

```json
{
  "introduction.md": 0,
  "installation.md": 1,
  "usage.md": 2,
  "advanced.md": 3
}
```

Files with lower order numbers appear first in the catalog. Files with the same order number (including the default 0) will be sorted alphabetically.

## generate_table_of_content.py

This tool automatically generates and updates table of contents for markdown files based on their headers.

### Features

- Automatically generates a table of contents based on headers (#, ##, ###, etc.)
- Updates existing table of contents without duplicating
- Ignores headers inside code blocks
- Works with single files or entire directories

### Usage

For a single file:

```bash
python generate_table_of_content.py -f /path/to/file.md
```

Or:

```bash
python generate_table_of_content.py --file /path/to/file.md
```

For an entire directory:

```bash
python generate_table_of_content.py -f /path/to/directory
```

### How it works

1. The tool scans the markdown file(s) for headers (lines starting with #)
2. It ignores headers that are inside code blocks (between ``` markers)
3. It generates a table of contents with properly indented markdown list items
4. It creates links using the standard markdown anchor format

### Generated table of contents format

The tool generates a table of contents like this:

```markdown
[//]: # (Generated table of content)

- [Introduction](#introduction)
  - [Getting Started](#getting-started)
    - [Installation](#installation)

[//]: # (Generated table of content)
```

The special comment markers `[//]: # (Generated table of content)` are used to identify and update existing tables of contents.

### Updating existing table of contents

When you run the tool on a file that already has a generated table of contents:
1. It identifies the existing table of contents by the special comment markers
2. It removes the old table of contents
3. It generates and inserts a new, updated table of contents

This makes it easy to keep your documentation up-to-date as you add or modify headers.