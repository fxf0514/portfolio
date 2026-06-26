import re

with open('D:/portfolio-html-dark/work-detail.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

content = ''.join(lines)

# 验证 keys
keys = re.findall(r"^\\s+'(\\w+)':\\s*\\{", content, re.MULTILINE)
print('keys:', keys)

# 方法：在每个 key 的块内做替换
# 找 'city': { 的位置，然后只替换该块内的图片路径
def fix_block_images(content, key, cover_path, section_items_js):
    """
    key: 如 'city'
    cover_path: 如 "assets/images/UI-city-01.jpg"
    section_items_js: 如 "[{image: '...'}]"
    返回修改后的 content
    """
    # 找 key 块的起始位置
    key_marker = "      '" + key + "': {"
    idx = content.find(key_marker)
    if idx == -1:
        print('NOT FOUND:', key)
        return content
    
    # 找该块的结束位置（下一个 "'xxx': {" 或 "      // ----------"）
    block_start = idx
    # 找块的结束：从该块开始后，找下一个顶级 key 或文件结束
    next_key = re.search(r"\\n      '[a-z]+': \\{", content[block_start + len(key_marker):])
    if next_key:
        block_end = block_start + len(key_marker) + next_key.start()
    else:
        block_end = len(content)
    
    block = content[block_start:block_end]
    
    # 替换 cover
    block = re.sub(r"cover: '[^']*'", "cover: '" + cover_path + "'", block, count=1)
    
    # 替换整个 sections 数组
    # 找到 sections: [ ... ] 并替换
    new_sections = "sections: [\n" + section_items_js + "\n        ]"
    block = re.sub(r"sections: \\[[^]]*?\\]\\n      \\},", new_sections + "\n      },",
                      block, count=1, flags=re.DOTALL)
    
    # 拼回
    content = content[:block_start] + block + content[block_end:]
    print('FIXED:', key)
    return content

content = fix_block_images(content, 'city', 
    'assets/images/UI-city-01.jpg',
    "          {image: 'assets/images/UI-city-01.jpg'},")

content = fix_block_images(content, 'railway',
    'assets/images/UI-railway-01.jpg',
    "          {image: 'assets/images/UI-railway-01.jpg'},\n          {video: 'assets/images/UI-railway-video.mp4', caption: '平台操作演示视频'},")

with open('D:/portfolio-html-dark/work-detail.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 验证
keys2 = re.findall(r"^\\s+'(\\w+)':\\s*\\{", content, re.MULTILINE)
print('完成后 keys:', keys2)
# 检查 city 和 railway 的 cover
for key in ['city', 'railway']:
    marker = "      '" + key + "': {"
    idx = content.find(marker)
    block = content[idx:idx+500]
    if 'UI-city' in block or 'UI-railway' in block:
        print('OK:', key, '图片路径已更新')
    else:
        print('WARN:', key, '图片路径可能未更新')
print('DONE')
