import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

const links: NavBarLink[] = [
	{ name: "主页", url: "/", icon: "material-symbols:home" },
	{ name: "归档", url: "/archive/", icon: "material-symbols:archive" },
	{
		name: "友链",
		url: "/friends/",
		icon: "material-symbols:handshake",
		pageKey: "friends",
	},
	{
		name: "动态",
		url: "/dynamic/",
		icon: "material-symbols:timeline",
		pageKey: "dynamic",
	},
	{
		name: "番剧",
		url: "/bangumi/",
		icon: "material-symbols:live-tv",
		pageKey: "bangumi",
	},
	{
		name: "网址导航",
		url: "/booknav/",
		icon: "material-symbols:explore",
		pageKey: "booknav",
	},
	{
		name: "相册",
		url: "/gallery/",
		icon: "material-symbols:photo-library",
		pageKey: "gallery",
	},
	{
		name: "更多",
		url: "#",
		icon: "material-symbols:apps",
		children: [
			{
				name: "时间线",
				url: "/timeline/",
				icon: "material-symbols:timeline",
			},
			{
				name: "作品",
				url: "/projects/",
				icon: "material-symbols:rocket-launch",
				pageKey: "projects",
			},
			{
				name: "我的设备",
				url: "/devices/",
				icon: "material-symbols:devices",
			},
			{
				name: "技能",
				url: "/skills/",
				icon: "material-symbols:auto-awesome",
			},
			{
				name: "打赏",
				url: "/sponsor/",
				icon: "material-symbols:favorite",
				pageKey: "sponsor",
			},
			{ name: "关于", url: "/about/", icon: "material-symbols:person" },
		],
	},
	{
		name: "GitHub",
		url: "https://github.com/hqdream26-commits/yanghanqing",
		external: true,
		icon: "fa7-brands:github",
	},
];

export const navBarConfig: NavBarConfig = { links };

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};
