import jieba
from pypinyin import pinyin
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import json
import time
import os

shared_dir = './shared'
print('hallo von main.py')

class FileHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path == os.path.join(shared_dir, 'input.json'):
            with open(os.path.join(shared_dir, 'input.json'), 'r', encoding='utf-8') as f:
                data = json.load(f)
                input_text = data['text']
                print('input_text', input_text, flush=True)
            
            processed_text = process_text(input_text)
            
            with open(os.path.join(shared_dir, 'output.json'), 'w', encoding='utf-8') as f:
                json.dump(processed_text, f)
                print('text output', processed_text, flush=True)
                print('text output done ✅', flush=True)

def process_text(text):
    ## pinyin conversion logic
    segments = jieba.cut(text, cut_all=False)
    seg_list = []
    for word in segments:
        seg_list.append([word])
    # print(seg_list)
    print('len hanzi - ', len(seg_list), flush=True)

    nested_pinyin_list = []
    for word in seg_list:
        nested_pinyin_list.append((pinyin(word)))
    # print(nested_pinyin_list)
    # print('len nested pinyin - ', len(nested_pinyin_list), flush=True)

    pinyin_list = []
    for sublist in nested_pinyin_list:
        concatenated_string = ''.join(''.join(items) for items in sublist)
        pinyin_list.append([concatenated_string])
    # print(pinyin_list)
    print('len pinyin - ', len(pinyin_list), flush=True)

    return { 'hanzi_seg': seg_list, 'pinyin_seg': pinyin_list }

if __name__ == "__main__":
    path = '.'
    event_handler = FileHandler()
    observer = Observer()
    observer.schedule(event_handler, shared_dir, recursive=False)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
