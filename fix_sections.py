import re

with open('D:/portfolio-html-dark/work-detail.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 直接字符串替换：把 city 块内的 sections 数组整个换掉
# city 块的 cover 已经是 UI-city-01.jpg，用这个来验证
old_city_sections = """        sections: [
          {image: 'assets/images/UI-charge-02.jpg'},
          {image: 'assets/images/UI-charge-03.jpg'},
          {image: 'assets/images/UI-charge-04.jpg'},
          {image: 'assets/images/UI-charge-05.png'},
          {image: 'assets/images/UI-charge-06.png'},
          {image: 'assets/images/UI-charge-07.png'},
          {image: 'assets/images/UI-charge-08.png'},
          {image: 'assets/images/UI-charge-09.png'},
          {image: 'assets/images/UI-charge-10.png'},
          {image: 'assets/images/UI-charge-11.png'},
        ]"""

new_city_sections = """        sections: [
          {image: 'assets/images/UI-city-01.jpg'},
        ]"""

if old_city_sections in content:
    content = content.replace(old_city_sections, new_city_sections, 1)
    print('OK: city sections 已修复')
else:
    print('WARN: city sections 旧内容未找到')

# railway 块的 sections 也换掉
old_railway_sections = """        sections: [
          {image: 'assets/images/UI-charge-02.jpg'},
          {image: 'assets/images/UI-charge-03.jpg'},
          {image: 'assets/images/UI-charge-04.jpg'},
          {image: 'assets/images/UI-charge-05.png'},
          {image: 'assets/images/UI-charge-06.png'},
          {image: 'assets/images/UI-charge-07.png'},
          {image: 'assets/images/UI-charge-08.png'},
          {image: 'assets/images/UI-charge-09.png'},
          {image: 'assets/images/UI-charge-10.png'},
          {image: 'assets/images/UI-charge-11.png'},
        ]"""

new_railway_sections = """        sections: [
          {image: 'assets/images/UI-railway-01.jpg'},
          {video: 'assets/images/UI-railway-video.mp4', caption: '平台操作演示视频'},
        ]"""

if old_railway_sections in content:
    content = content.replace(old_railway_sections, new_railway_sections, 1)
    print('OK: railway sections 已修复')
else:
    print('WARN: railway sections 旧内容未找到')

with open('D:/portfolio-html-dark/work-detail.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 验证
with open('D:/portfolio-html-dark/work-detail.html', 'r', encoding='utf-8') as f:
    result = f.read()
# 检查 city 块内是否还有 UI-charge
idx = result.find("'city': {")
city_block = result[idx:idx+800]
if 'UI-charge' in city_block:
    print('ERR: city 块内仍有 UI-charge 残留')
else:
    print('OK: city 块内已无 UI-charge')
# 检查 railway 块
idx2 = result.find("'railway': {")
railway_block = result[idx2:idx2+800]
if 'UI-charge' in railway_block:
    print('ERR: railway 块内仍有 UI-charge 残留')
else:
    print('OK: railway 块内已无 UI-charge')
print('完成')
