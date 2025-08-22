import sys
from argparse import ArgumentParser
from os import PathLike
from pathlib import Path


def delete_code_block(lines):
    code_block_lines = []
    for number, line in enumerate(lines):
        if line.startswith('```'):
            code_block_lines.append(number)
    if (len(code_block_lines) % 2) != 0:
        print(code_block_lines)
        raise RuntimeError("Code block lines error")
    if len(code_block_lines) >= 2:
        del lines[code_block_lines[0]:code_block_lines[1] + 1]
        lines = delete_code_block(lines)
    return lines


def generate_table_of_content(file: PathLike):
    headlines = []
    table_of_content = [table_of_content_comment + '\n']
    with open(file, mode="r", encoding="utf-8") as f:
        content = f.readlines()
        delete_code_block(content)
        for line in content:
            if line.startswith("#"):
                headlines.append(line)
        # print(headlines)

        for headline in headlines:
            table_of_content_entry = ""
            splits = headline.split(" ", 1)
            sharp_count = splits[0].count("#")
            for i in range(1, sharp_count):
                table_of_content_entry += "  "
            if sharp_count > 1:
                table_of_content_entry += "- "
            else:
                table_of_content_entry = "\n"
            table_of_content_entry += f"[{splits[1].strip()}](#{splits[1].strip().lower().replace(' ', '-').replace('`', '')})\n"
            table_of_content.append(table_of_content_entry)
    table_of_content.append("\n" + table_of_content_comment)
    table_of_content.append("\n")
    table_of_content.append("\n")
    return table_of_content


def add_table_of_content_in_file(file: PathLike):
    with open(file, mode="r", encoding="utf-8") as f:
        original_content = f.readlines()
        table_of_content = generate_table_of_content(file)
        generated_comment_line = []
        for number, line in enumerate(original_content.copy()):
            if line.strip() == table_of_content_comment:
                generated_comment_line.append(number)
        if len(generated_comment_line) == 0:
            print("No generated table of content, generating a new one")
            content = table_of_content + original_content.copy()
        elif len(generated_comment_line) == 2:
            print(
                f"Table of content exists, deleting from line {generated_comment_line[0]} to line {generated_comment_line[1] + 1}")
            del original_content[generated_comment_line[0]:generated_comment_line[1] + 1]
            content = table_of_content + original_content.copy()
        else:
            raise RuntimeError(
                f"Error generated table of content comments! generated_comment_line:{generated_comment_line}")

    print(content)
    with open(file, mode="w", encoding="utf-8") as f:
        f.writelines(content)

table_of_content_comment = '[//]: # (Generated table of content)'
def main():
    parser = ArgumentParser()
    parser.add_argument('-f', '--file')
    args = parser.parse_args()

    target_file = Path(args.file)
    if target_file.is_file():
        add_table_of_content_in_file(target_file)
    elif target_file.is_dir():
        for f in target_file.iterdir():
            if f.is_file() and f.name.endswith(".md") and f.name != '.catalog.md':
                print(f"Process {f.name}")
                add_table_of_content_in_file(f)

if __name__ == '__main__':
    sys.exit(main())