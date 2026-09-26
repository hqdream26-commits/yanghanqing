import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(projectRoot, "..");
const postsDir = path.join(projectRoot, "src", "content", "posts");

const yamlString = (value) => JSON.stringify(value);

const readFrontmatterValue = (frontmatter, key) => {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
	if (!match) throw new Error(`Missing ${key} in source frontmatter`);
	return match[1].trim();
};

const convertPost = async (sourceFile, targetFile, lang) => {
	const source = await readFile(sourceFile, "utf8");
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) throw new Error(`Invalid frontmatter: ${sourceFile}`);

	const [, frontmatter, rawBody] = match;
	const title = JSON.parse(readFrontmatterValue(frontmatter, "title"));
	const description = JSON.parse(readFrontmatterValue(frontmatter, "description"));
	const published = JSON.parse(readFrontmatterValue(frontmatter, "pubDate"));
	const tags = JSON.parse(readFrontmatterValue(frontmatter, "tags"));
	const heroImage = readFrontmatterValue(frontmatter, "heroImage")
		.replace(/^['"]|['"]$/g, "")
		.split(/[\\/]/)
		.at(-1);
	const body = rawBody.trimStart().replace(/^#\s+.+?\r?\n+/, "");
	const slug = path.basename(sourceFile, ".md");
	const pinned = lang === "zh_CN" && slug === "robotics-ai";

	const output = `---
title: ${yamlString(title)}
published: ${published}
draft: false
description: ${yamlString(description)}
image: "/assets/images/blog-covers/${heroImage}"
tags: ${JSON.stringify(tags)}
category: ${yamlString(lang === "zh_CN" ? "AI 行业学习" : "AI Learning")}
lang: ${yamlString(lang)}
pinned: ${pinned}
author: "杨翰卿"
comment: false
---

${body}`;

	await writeFile(targetFile, output, "utf8");
};

await rm(postsDir, { recursive: true, force: true });
await mkdir(postsDir, { recursive: true });

for (const [sourceLang, targetLang, suffix] of [
	["zh", "zh_CN", ""],
	["en", "en", "-en"],
]) {
	const sourceDir = path.join(sourceRoot, "src", "content", "blog", sourceLang);
	const files = (await readdir(sourceDir)).filter((file) => file.endsWith(".md"));
	for (const file of files) {
		const basename = path.basename(file, ".md");
		await convertPost(
			path.join(sourceDir, file),
			path.join(postsDir, `${basename}${suffix}.md`),
			targetLang,
		);
	}
}

const copies = [
	["src/assets/blog/default-covers", "public/assets/images/blog-covers"],
	["assets/work", "public/assets/images/projects"],
	["assets/music", "public/assets/music"],
	["assets/about/wechat.png", "public/assets/images/about/wechat.png"],
	["assets/blog/avatar.svg", "public/assets/images/avatar.svg"],
	["assets/public/logo.svg", "public/assets/images/logo.svg"],
	["assets/public/favicon.svg", "public/favicon/favicon.svg"],
];

for (const [source, target] of copies) {
	const destination = path.join(projectRoot, target);
	await mkdir(path.dirname(destination), { recursive: true });
	await cp(path.join(sourceRoot, source), destination, {
		recursive: true,
		force: true,
	});
}

console.log("Migrated 28 posts and copied the original blog media into Firefly.");
