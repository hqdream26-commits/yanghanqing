/**
 * Dream.HQ - AI学习助手
 * 侧重互联网知识学习，支持科技/编程/互联网领域的智能问答
 * 使用 DeepSeek API（兼容 OpenAI 格式）
 *
 * 使用说明：
 *   下方 API_KEY 需替换为你的 DeepSeek API Key
 *   获取地址：https://platform.deepseek.com/api_keys
 */

// ==================== 配置 ====================
// DeepSeek API Key（请替换为你自己的 Key）
// 获取地址：https://platform.deepseek.com/api_keys
const API_KEY = 'sk-20617f20cc7a4b85a5bdf7a9cc4ed489';

// DeepSeek API 端点（兼容 OpenAI 格式）
const BASE_URL = 'https://api.deepseek.com';
const API_URL = BASE_URL + '/v1/chat/completions';

// DeepSeek 模型: deepseek-chat (DeepSeek-V3), deepseek-reasoner (DeepSeek-R1)
const MODEL_NAME = 'deepseek-chat';

// 最大对话历史条数（超出后截断旧消息）
const MAX_HISTORY_LENGTH = 30;

// ==================== 系统提示词 ====================
const SYSTEM_PROMPT = `你是 DreamHQ，杨翰卿技术博客的AI学习助手。你的核心使命是帮助每个人学会用AI、用好AI，在AI时代成为「全能发展、一专多强」的创造者。

你的身份：
- 名字叫 DreamHQ，寓意"梦想总部"——每个人都可以在这里启动自己的AI梦想
- 你是杨翰卿打造的AI伙伴，与用户一起探索AI的无限可能
- 核心理念：AI不是少数人的特权，而是每个人的"新超能力"。学AI不是为了成为程序员，而是为了十倍放大自己已有的专业能力

你的知识体系——一专多强：
- 🎯 核心专长（一专）：大模型深度知识——Transformer架构原理、Attention机制、预训练/微调/RLHF全流程、Prompt Engineering、AI Agent设计、RAG检索增强生成、模型量化与部署、多模态AI（文生图/文生视频/图生文）、主流模型对比（GPT/Claude/Gemini/DeepSeek/Qwen/文心/通义）、开源模型生态、AI安全与对齐、AI商业化落地
- 💪 广泛能力（多强）：前端开发（React/TypeScript/CSS/JS）、后端（Node.js/Java/Python/Go）、鸿蒙开发（ArkTS）、网络协议、性能优化、数据库、DevOps、产品设计、数据分析
- 🌟 跨领域AI融合：医疗AI、金融AI、教育AI、法律AI、农业AI、制造AI、营销AI、生物医药AI、物流AI、人文AI —— 用AI打通任何一个行业

大模型知识科普——你可以向用户介绍这些话题：
- 基础概念：什么是大模型？参数是什么？Token是什么？上下文窗口？训练和推理的区别？
- 模型对比：GPT-4o vs Claude vs Gemini vs DeepSeek vs Qwen vs 文心/通义——各有什么优劣？哪个适合什么场景？
- 核心技术：Transformer、Self-Attention、MoE混合专家、KV Cache、量化(GPTQ/AWQ)、蒸馏、多模态融合
- 应用层面：如何搭建RAG知识库？如何构建AI Agent？Function Calling怎么用？LangChain/LlamaIndex入门
- 行业趋势：开源 vs 闭源之争、端侧模型、具身智能、AI编程、AI for Science
- 实用技巧：Prompt Engineering进阶、Token省钱的N种方法、API调用最佳实践、模型选型指南

你的风格：
- 回答结构清晰，善用标题、列表、代码块、表格等结构化排版
- 先给出核心观点（1-2句话），再分层展开
- 善用类比和emoji让抽象概念生动好懂——把复杂的技术概念讲得"连小学生都能理解"
- 代码示例优先使用现代语法（ES2024+、TypeScript 5.x、React 19、Python 3.12+、Java 21+ 等）
- 回答长度灵活：简单问题 100-200 字；复杂问题 300-800 字充分展开
- 遇到不确定的知识点，诚实说明并指明查阅方向
- 永远保持热情、鼓励的语气——让用户感觉在和一位亦师亦友的伙伴对话

回答格式规范：
1. 先用一两句话点明核心答案
2. 按需使用标题（###）分层展开细节
3. 代码示例附上简短注释，标明语言
4. 使用表格对比方案优劣、列表梳理要点
5. 结尾给出延伸学习建议或一个值得思考的问题

你喜欢的表达：
- 鼓励用户找准方向："在AI时代，一专多强才是王道——先在一个领域做到顶尖，再用广度打开视野"
- 降低学习门槛："别怕，大模型没那么神秘。说白了它就是一个'超级完形填空'——只不过这个填空太厉害了，厉害到看起来像在思考"
- 相信未来："AI是你的翅膀，但飞向哪里——由你决定"`;

// ==================== 对话状态 ====================
let conversationHistory = [];
let isProcessing = false;

// ==================== DOM元素引用 ====================
let triggerBtn;
let chatPanel;
let messagesContainer;
let chatInput;
let sendBtn;
let closeBtn;
let fullscreenBtn;

// ==================== 初始化 ====================
function initAIAssistant() {
    // 创建DOM元素
    createAssistantDOM();

    // 获取引用
    triggerBtn = document.getElementById('aiTrigger');
    chatPanel = document.getElementById('aiChatPanel');
    messagesContainer = document.getElementById('aiMessages');
    chatInput = document.getElementById('aiChatInput');
    sendBtn = document.getElementById('aiSendBtn');
    closeBtn = document.getElementById('aiCloseBtn');
    fullscreenBtn = document.getElementById('aiFullscreenBtn');

    // 绑定事件
    triggerBtn.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', handleInputKeydown);
    chatInput.addEventListener('input', autoResizeInput);

    // 绑定快捷建议点击
    document.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.dataset.question;
            if (question) {
                chatInput.value = question;
                handleSend();
            }
        });
    });

    // 点击面板外部关闭
    document.addEventListener('click', (e) => {
        if (chatPanel.classList.contains('open') &&
            !chatPanel.contains(e.target) &&
            e.target !== triggerBtn &&
            !triggerBtn.contains(e.target)) {
            closeChat();
        }
    });

    // ESC：全屏时先退出全屏，再按关闭面板
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatPanel.classList.contains('open')) {
            if (chatPanel.classList.contains('ai-fullscreen')) {
                exitFullscreen();
            } else {
                closeChat();
            }
        }
    });

    // 初始欢迎消息
    showWelcomeMessage();
}

// ==================== 创建DOM ====================
function createAssistantDOM() {
    const html = `
        <!-- DreamHQ 浮动按钮 -->
        <button class="ai-assistant-trigger pulse" id="aiTrigger" title="DreamHQ · AI学习伙伴">
            <span class="ai-icon">🤖</span>
        </button>

        <!-- DreamHQ 聊天面板 -->
        <div class="ai-chat-panel" id="aiChatPanel">
            <div class="ai-chat-header">
                <div class="ai-chat-header-left">
                    <div class="ai-chat-avatar">🤖</div>
                    <div>
                        <div class="ai-chat-title">DreamHQ</div>
                        <div class="ai-chat-subtitle">
                            <span class="dot"></span> 在线 · AI学习伙伴 · 一专多强
                        </div>
                    </div>
                </div>
                <div class="ai-chat-header-actions">
                    <button class="ai-chat-header-btn" id="aiFullscreenBtn" title="全屏模式">⛶</button>
                    <button class="ai-chat-header-btn" id="aiClearBtn" title="清空对话">🗑</button>
                    <button class="ai-chat-header-btn close-btn" id="aiCloseBtn" title="关闭">×</button>
                </div>
            </div>
            <div class="ai-chat-messages" id="aiMessages">
                <!-- 动态生成 -->
            </div>
            <div class="ai-chat-input-area">
                <textarea
                    class="ai-chat-input"
                    id="aiChatInput"
                    placeholder="向DreamHQ提问，一起探索AI的无限可能…"
                    rows="1"
                ></textarea>
                <button class="ai-send-btn" id="aiSendBtn" title="发送">➤</button>
            </div>
        </div>
    `;

    // 插入到body末尾（在音乐播放器之前）
    const temp = document.createElement('div');
    temp.innerHTML = html.trim();
    while (temp.firstChild) {
        document.body.appendChild(temp.firstChild);
    }

    // 绑定清空按钮
    setTimeout(() => {
        const clearBtn = document.getElementById('aiClearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearConversation);
        }
    }, 100);
}

// ==================== 面板控制 ====================
function toggleChat() {
    if (chatPanel.classList.contains('open')) {
        closeChat();
    } else {
        openChat();
    }
}

function openChat() {
    chatPanel.classList.add('open');
    triggerBtn.classList.remove('pulse');
    triggerBtn.querySelector('.ai-icon').textContent = '✕';
    setTimeout(() => {
        chatInput.focus();
        scrollToBottom();
    }, 350);
}

function closeChat() {
    // 如果当前处于全屏模式，先退出全屏
    if (chatPanel.classList.contains('ai-fullscreen')) {
        exitFullscreen();
    }
    chatPanel.classList.remove('open');
    triggerBtn.querySelector('.ai-icon').textContent = '🤖';
}

// ==================== 全屏模式 ====================
function toggleFullscreen() {
    if (chatPanel.classList.contains('ai-fullscreen')) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function enterFullscreen() {
    chatPanel.classList.add('ai-fullscreen');
    fullscreenBtn.innerHTML = '🗗';
    fullscreenBtn.title = '退出全屏';
    document.body.classList.add('ai-fullscreen-active');
    // 移动端隐藏音乐播放器，避免遮挡
    const player = document.getElementById('player');
    if (player) player.style.display = 'none';
}

function exitFullscreen() {
    chatPanel.classList.remove('ai-fullscreen');
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.title = '全屏模式';
    document.body.classList.remove('ai-fullscreen-active');
    const player = document.getElementById('player');
    if (player) player.style.display = '';
}

// ==================== 消息渲染 ====================
function showWelcomeMessage() {
    const suggestions = [
        { label: '🚀 AI入门怎么学？', q: '完全零基础，想学AI该从哪里开始？有什么学习路线图？' },
        { label: '💡 Prompt怎么写？', q: 'Prompt Engineering 的核心技巧是什么？怎么写出高质量的提示词？' },
        { label: '🧠 AI Agent是什么？', q: 'AI agent 是什么？跟普通AI对话有什么区别？怎么搭建自己的agent？' },
        { label: '🎨 AI绘画&设计', q: 'AI绘画工具（Midjourney/Stable Diffusion）怎么用？设计思路是什么？' },
        { label: '📊 用AI做数据分析', q: '怎么用AI辅助数据分析？不会写代码也能用AI分析数据吗？' },
        { label: '🔗 AI+我的专业', q: '我学的不是计算机专业，怎么把AI用在我的专业领域里？' },
    ];

    const chipsHTML = suggestions.map(s =>
        `<span class="ai-suggestion-chip" data-question="${s.q}">${s.label}</span>`
    ).join('');

    const welcomeHTML = `
        <div class="ai-welcome-card">
            <span class="ai-welcome-icon">🚀</span>
            <h3>你好！我是 DreamHQ</h3>
            <p>AI时代的全能学习伙伴。我的使命是帮助每个人学会用AI、用好AI——<strong>无论你是什么专业，AI都能成为你的"第二大脑"</strong>。</p>
            <p style="font-size:12px;color:#6361DC;margin-top:4px;">🎯 一专多强 · 全能发展 · 知行合一</p>
            <div class="ai-welcome-suggestions">
                ${chipsHTML}
            </div>
        </div>
    `;

    messagesContainer.innerHTML = welcomeHTML;

    // 重新绑定建议点击
    document.querySelectorAll('.ai-suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.dataset.question;
            if (question) {
                chatInput.value = question;
                handleSend();
            }
        });
    });
}

function addMessage(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${role}`;

    const avatarIcon = role === 'user' ? '👤' : '🤖';

    // 简单的消息格式化（处理代码块等）
    const formattedContent = formatMessageContent(content);

    messageDiv.innerHTML = `
        <div class="ai-message-avatar">${avatarIcon}</div>
        <div class="ai-message-bubble">${formattedContent}</div>
    `;

    // 移除欢迎卡片
    const welcomeCard = messagesContainer.querySelector('.ai-welcome-card');
    if (welcomeCard) {
        welcomeCard.remove();
    }

    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

function formatMessageContent(content) {
    // 使用 marked 库进行完整的 Markdown 渲染（blog.html 已引入）
    if (typeof marked !== 'undefined') {
        return marked.parse(content);
    }

    // 降级方案：基础HTML格式化
    let formatted = content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    formatted = formatted.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`;
    });

    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n/g, '<br>');

    return formatted;
}

function addTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message assistant';
    typingDiv.id = 'aiTyping';
    typingDiv.innerHTML = `
        <div class="ai-message-avatar">🤖</div>
        <div class="ai-message-bubble">
            <div class="ai-typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function removeTypingIndicator() {
    const typing = document.getElementById('aiTyping');
    if (typing) typing.remove();
}

function scrollToBottom() {
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 50);
}

// ==================== 发送消息 ====================
async function handleSend() {
    if (isProcessing) return;

    const message = chatInput.value.trim();
    if (!message) return;

    // 清空输入
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.disabled = true;

    // 添加用户消息
    addMessage('user', message);

    // 添加到历史
    conversationHistory.push({ role: 'user', content: message });

    // 截断历史
    if (conversationHistory.length > MAX_HISTORY_LENGTH) {
        conversationHistory = conversationHistory.slice(-MAX_HISTORY_LENGTH);
    }

    // 显示加载状态
    isProcessing = true;
    addTypingIndicator();

    try {
        const response = await callAIAPI(message);
        removeTypingIndicator();
        addMessage('assistant', response);
        conversationHistory.push({ role: 'assistant', content: response });
    } catch (error) {
        removeTypingIndicator();
        console.error('Dream.HQ请求失败:', error);
        addMessage('assistant', getErrorMessage(error));
    } finally {
        isProcessing = false;
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

// ==================== OpenAI 兼容 API 调用 ====================
async function callAIAPI(userMessage) {
    // 构建消息列表
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversationHistory.slice(0, -1), // 除了刚才添加的用户消息
        { role: 'user', content: userMessage }
    ];

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: MODEL_NAME,
            messages: messages,
            max_tokens: 1024,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
            errorData.error?.message ||
            `API请求失败 (${response.status}): ${response.statusText}`
        );
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// ==================== 错误处理 ====================
function getErrorMessage(error) {
    const msg = error.message || String(error);

    if (msg.includes('401') || msg.includes('authentication') || msg.includes('Invalid API Key')) {
        return '⚠️ **API Key 无效**。请检查 `js/ai-assistant.js` 中的 `API_KEY` 和 `BASE_URL` 配置是否正确。';
    }
    if (msg.includes('429') || msg.includes('rate')) {
        return '⚠️ **请求频率超限**。API 调用太频繁，请稍等片刻再试。';
    }
    if (msg.includes('404')) {
        return '⚠️ **API 端点或模型未找到**。请检查 `BASE_URL` 和 `MODEL_NAME` 配置。';
    }
    if (msg.includes('network') || msg.includes('fetch') || msg.includes('Failed to fetch')) {
        return '⚠️ **网络连接失败**。请检查网络连接，或确认 `BASE_URL` 是否可访问。';
    }

    return `⚠️ **出错了**：${msg}\n\n请稍后重试，或联系博客管理员。`;
}

// ==================== 清空对话 ====================
function clearConversation() {
    conversationHistory = [];
    showWelcomeMessage();
}

// ==================== 输入处理 ====================
function handleInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
}

function autoResizeInput() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
}

// ==================== 启动 ====================
// 页面加载后自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAIAssistant);
} else {
    initAIAssistant();
}
