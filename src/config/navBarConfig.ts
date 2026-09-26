import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";

const links: NavBarLink[] = [
	{ name: "主页", url: "/", icon: "material-symbols:home" },
	{
		name: "文章",
		url: "#",
		icon: "material-symbols:article",
		children: [
			{ name: "归档", url: "/archive/", icon: "material-symbols:archive" },
			{
				name: "分类",
				url: "/categories/",
				icon: "material-symbols:folder-open-rounded",
			},
			{ name: "标签", url: "/tags/", icon: "material-symbols:tag-rounded" },
		],
	},
	{
		name: "项目",
		url: "/projects/",
		icon: "material-symbols:rocket-launch",
		pageKey: "projects",
	},
	{
		name: "成长记录",
		url: "/dynamic/",
		icon: "material-symbols:timeline",
		pageKey: "dynamic",
	},
	{ name: "关于我", url: "/about/", icon: "material-symbols:person" },
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
