import json
import os
import sys
from argparse import ArgumentParser
from os import PathLike
from pathlib import Path


def get_filelist(path: PathLike):
    #backup the catalog if exists
    catalog_file = os.path.join(path, catalog_file_name)
    catalog_bakup = os.path.join(path, catalog_backup_name)
    if os.path.exists(catalog_file):
        if os.path.exists(catalog_bakup):
            print("Deleting catalog backup")
            Path.unlink(catalog_bakup)
        print(f"Backup the existed catalog file")
        Path(catalog_file).rename(catalog_bakup)
    #generate catalog
    file_list = []
    files = path.iterdir()
    for file in files:
        if file.is_file():
            print(f"Processing file: {file.name}")
            if file.name != catalog_file_name and file.name != catalog_backup_name and file.name != order_file_name:
                file_list.append(file.name)
    print(file_list)
    return file_list

def write_order_file(path:PathLike, file_list: list[str]):
    order_file = Path(path).joinpath(order_file_name)

    if not order_file.exists():
        order_list = {}
        for file in file_list:
            order_list[f"{file}"] = 0
    else:
        with open(order_file, mode="r", encoding="utf-8") as f:
            order_list = json.load(f)

    order_keys = order_list.keys()
    for file in file_list.copy():
        if file not in order_keys:
            order_list[f"{file}"] = 0

    with open(order_file, mode="w", encoding="utf-8") as f:
        json.dump(order_list, f)
    return order_list


def write_catalog_file(path: PathLike, sorted_file_list: dict):
    with open(Path(path).joinpath(catalog_file_name), mode="w", encoding="utf-8") as f:
        f.write(f"# {Path(path).name}\n")
        for file in sorted_file_list.keys():
            file_title = file.replace(".md", "").replace("_"," ")
            f.write(f"- [{file_title}]({file})\n")


# constants
catalog_file_name = ".catalog.md"
catalog_backup_name = catalog_file_name + ".bak"
order_file_name = ".order.json"

def main():
    parser = ArgumentParser()
    parser.add_argument('-p', '--path')
    args = parser.parse_args()

    target_path = Path(args.path)
    file_list = get_filelist(target_path)
    order_list = write_order_file(target_path, file_list)
    print(order_list)
    write_catalog_file(target_path, dict(sorted(order_list.items(), key=lambda entry:entry[1])))



if __name__ == '__main__':
    sys.exit(main())
