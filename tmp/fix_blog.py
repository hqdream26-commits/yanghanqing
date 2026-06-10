import re

with open('blog.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

output = []
in_old_intro = False
in_intro_div = False
skip_intro = False
skip_count = 0
intro_replaced = False
policy_inserted = False

new_intro_lines = [
    '            // 引言卡片HTML\n',
    '            const introCardHTML = `\n',
    '            <div class="blog-intro-card">\n',
    '              <span class="intro-icon">🌐</span>\n',
    '              <h3 class="intro-title">拥抱AI时代，编程赋能千行百业</h3>\n',
    '              <p class="intro-text">\n',
    '                2026年，"<strong>十五五</strong>"规划蓝图全面展开，<span class="intro-highlight">数字经济、人工智能、新质生产力</span>上升为国家战略核心。无论你身处医疗、金融、法律、教育、农业还是人文艺术——<strong>AI与编程已不再是程序员的专属</strong>，而是每个专业人才的"第二语言"。本专栏以14大行业为切口，用<strong>真实案例、通俗代码和落地场景</strong>，带你看见技术如何与你的专业发生奇妙的化学反应。<span class="intro-highlight">时代不负躬身入局者——主动拥抱，方能乘势而上。</span>\n',
    '              </p>\n',
    '              <div class="intro-timeline">\n',
    '                <span class="milestone">📋 2026 十五五开局</span>\n',
    '                <span class="arrow-sep">→</span>\n',
    '                <span class="milestone">🤖 AI赋能千行百业</span>\n',
    '                <span class="arrow-sep">→</span>\n',
    '                <span class="milestone">🚀 新质生产力</span>\n',
    '                <span class="arrow-sep">→</span>\n',
    '                <span class="milestone">🎯 2030 数字中国</span>\n',
    '              </div>\n',
    '            </div>\n',
    '          `;\n',
]

policy_card_lines = [
    '\n',
    '            // 政策指引卡片HTML\n',
    '            const policyCardHTML = `\n',
    '            <div class="blog-policy-card">\n',
    '              <div class="policy-header">\n',
    '                <span class="policy-icon">📜</span>\n',
    '                <span class="policy-title">「十五五」规划 · AI与数字化政策指引</span>\n',
    '              </div>\n',
    '              <p class="policy-desc">\n',
    '                以下政策文件明确了<strong>人工智能、数字经济、新质生产力</strong>在"十五五"时期的核心地位。理解政策方向，就是理解<strong>未来五年的职业风口与产业红利</strong>。\n',
    '              </p>\n',
    '              <div class="policy-links">\n',
    '                <a class="policy-link-item" href="https://www.gov.cn/zhengce/2025-10/content_7034785.htm" target="_blank" title="国民经济和社会发展第十五个五年规划纲要">\n',
    '                  📋 "十五五"规划纲要 <span class="arrow">→</span>\n',
    '                </a>\n',
    '                <a class="policy-link-item" href="https://www.gov.cn/zhengce/2025-08/content_7028651.htm" target="_blank" title="新一代人工智能发展规划">\n',
    '                  🤖 新一代AI发展规划 <span class="arrow">→</span>\n',
    '                </a>\n',
    '                <a class="policy-link-item" href="https://www.miit.gov.cn/" target="_blank" title="工业和信息化部·智能制造">\n',
    '                  🏭 工信部·智造强国 <span class="arrow">→</span>\n',
    '                </a>\n',
    '                <a class="policy-link-item" href="https://www.ndrc.gov.cn/" target="_blank" title="国家发展和改革委员会·数字经济">\n',
    '                  📊 发改委·数字经济 <span class="arrow">→</span>\n',
    '                </a>\n',
    '                <a class="policy-link-item" href="https://www.most.gov.cn/" target="_blank" title="科学技术部·前沿创新">\n',
    '                  🔬 科技部·前沿创新 <span class="arrow">→</span>\n',
    '                </a>\n',
    '                <a class="policy-link-item" href="https://www.gov.cn/zhengce/zc_search.htm?type=0&zcd=%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD" target="_blank" title="国务院·AI相关政策汇总">\n',
    '                  📁 更多AI相关政策 <span class="arrow">→</span>\n',
    '                </a>\n',
    '              </div>\n',
    '            </div>\n',
    '          `;\n',
]

for i, line in enumerate(lines):
    # Detect old intro card start
    if '// 引言卡片HTML' in line and '拥抱' not in line and not intro_replaced:
        skip_intro = True
        output.extend(new_intro_lines)
        intro_replaced = True
        continue

    if skip_intro:
        # Skip until we find the closing `; after the intro div
        if line.strip() == '`;' and skip_count > 5:
            skip_intro = False
            # Insert policy card after intro
            output.extend(policy_card_lines)
            policy_inserted = True
            continue
        skip_count += 1
        continue

    # Replace blogList.innerHTML to include policyCardHTML
    if 'blogList.innerHTML = introCardHTML + articlesHTML;' in line:
        line = line.replace(
            'blogList.innerHTML = introCardHTML + articlesHTML;',
            'blogList.innerHTML = introCardHTML + policyCardHTML + articlesHTML;'
        )

    output.append(line)

with open('blog.html', 'w', encoding='utf-8') as f:
    f.writelines(output)

print(f'Intro replaced: {intro_replaced}')
print(f'Policy inserted: {policy_inserted}')
print(f'Total lines: {len(output)}')
