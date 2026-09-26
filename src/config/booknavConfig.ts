import type { BooknavGroup, BooknavPageConfig } from "../types/booknavConfig";

// 书签导航页面配置
export const booknavPageConfig: BooknavPageConfig = {
	// 页面标题，如果留空则使用 i18n 中的翻译
	title: "网址导航",

	// 页面描述文本，如果留空则使用 i18n 中的翻译
	description: "常用的 AI、开发、学习与作品平台，整理成可搜索的个人导航。",

	// favicon 自动获取配置
	favicon: {
		// 书签未填写 icon 时，是否自动获取目标站点的 favicon 图标
		enabled: true,

		// favicon 接口地址，{domain} 为占位符，会被替换成目标站点域名
		// 更换接口只需保证地址里含有 {domain}，例如：
		//   https://a.favicon.im/{domain}
		//   https://favicon.im/{domain}
		api: "https://a.favicon.im/{domain}",
	},
};

// 书签导航配置
// 每个数组项是一个分类组，分类组内的 items 是该分类下的书签
export const booknavConfig: BooknavGroup[] = [
	{
		id: "ai",
		name: "AI 工具",
		icon: "material-symbols:auto-awesome",
		desc: "日常学习、编程与资料整理会用到的 AI 平台",
		weight: 120,
		items: [
			{
				title: "ChatGPT",
				url: "https://chatgpt.com",
				desc: "通用 AI 助手，用来梳理思路、写作和代码协作",
				weight: 10,
			},
			{
				title: "DeepSeek",
				url: "https://chat.deepseek.com",
				desc: "中文推理和代码分析常用工具",
				weight: 9,
			},
			{
				title: "Cursor",
				url: "https://cursor.com",
				desc: "AI 编程编辑器，适合项目级代码协作",
				weight: 8,
			},
			{
				title: "Kimi",
				url: "https://kimi.moonshot.cn",
				desc: "长文档阅读、资料提炼和中文写作辅助",
				weight: 7,
			},
		],
	},
	{
		id: "dev",
		name: "开发平台",
		icon: "material-symbols:code-rounded",
		desc: "代码托管、技术文档和开发生态",
		weight: 110,
		items: [
			{
				title: "GitHub",
				url: "https://github.com",
				desc: "全球最大的代码托管平台",
				icon: "fa7-brands:github",
				weight: 10,
			},
			{
				title: "MDN Web Docs",
				url: "https://developer.mozilla.org",
				desc: "最权威的 Web 技术文档",
				weight: 9,
			},
			{
				title: "Astro",
				url: "https://astro.build",
				desc: "内容驱动型网站的 Web 框架",
				weight: 8,
			},
			{
				title: "Cloudflare Pages",
				url: "https://pages.cloudflare.com",
				desc: "静态站点托管和全球边缘部署",
				weight: 7,
			},
			{
				title: "Vercel",
				url: "https://vercel.com",
				desc: "前端部署、预览和域名管理平台",
				weight: 6,
			},
		],
	},
	{
		id: "study",
		name: "学习资料",
		icon: "material-symbols:school",
		desc: "课程、教程和知识检索入口",
		weight: 100,
		items: [
			{
				title: "菜鸟教程",
				url: "https://www.runoob.com",
				desc: "编程语言和 Web 技术入门查询",
				weight: 10,
			},
			{
				title: "Bilibili",
				url: "https://www.bilibili.com",
				desc: "技术课程、项目实战和学习记录",
				weight: 9,
			},
			{
				title: "知乎",
				url: "https://www.zhihu.com",
				desc: "技术经验、行业问题和学习路线参考",
				weight: 8,
			},
		],
	},
	{
		id: "design-tools",
		name: "设计与图标",
		icon: "material-symbols:palette-outline-rounded",
		desc: "界面设计、配色和图标资源",
		weight: 90,
		items: [
			{
				title: "Iconify",
				url: "https://icon-sets.iconify.design",
				desc: "海量开源图标集合搜索",
				weight: 10,
			},
			{
				title: "iconfont",
				url: "https://www.iconfont.cn",
				desc: "阿里巴巴矢量图标库",
				weight: 9,
			},
		],
	},
	{
		id: "tools",
		name: "效率工具",
		icon: "material-symbols:build-outline-rounded",
		desc: "写文章、整理素材和调试站点时的工具箱",
		weight: 80,
		items: [
			{
				title: "TinyPNG",
				url: "https://tinypng.com",
				desc: "在线压缩 PNG / JPEG 图片",
				weight: 10,
			},
			{
				title: "Squoosh",
				url: "https://squoosh.app",
				desc: "Google 出品的图片压缩与格式转换",
				weight: 9,
			},
			{
				title: "PageSpeed Insights",
				url: "https://pagespeed.web.dev",
				desc: "检查网页性能、可访问性和 SEO",
				weight: 8,
			},
		],
	},
	{
		id: "blog-stack",
		name: "本站相关",
		icon: "material-symbols:deployed-code",
		desc: "这个博客迁移和维护直接相关的项目",
		weight: 70,
		items: [
			{
				title: "YHQ LAB",
				url: "https://www.yanghanqing.top",
				desc: "杨翰卿的个人 AI 实验室",
				weight: 10,
			},
			{
				title: "Firefly",
				url: "https://github.com/CuteLeaf/Firefly",
				desc: "当前博客使用的 Astro 主题模板",
				icon: "/favicon/firefly-32.png",
				weight: 9,
			},
			{
				title: "Firefly Docs",
				url: "https://docs-firefly.cuteleaf.cn",
				desc: "Firefly 主题模板文档",
				icon: "https://docs-firefly.cuteleaf.cn/logo.png",
				weight: 8,
			},
		],
	},
];
