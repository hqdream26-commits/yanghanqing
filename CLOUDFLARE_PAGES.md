# Cloudflare Pages 部署

本项目已经按 Astro 静态站点配置，生产构建输出为 `dist`。

## Git 部署

1. 在 GitHub 将 Firefly 项目推送到你自己的仓库，不要直接向 `CuteLeaf/Firefly` 上游仓库推送。
2. 在 Cloudflare 控制台进入 **Workers & Pages**，创建 Pages 项目并连接该仓库。
3. 使用以下构建设置：

| 设置 | 值 |
| --- | --- |
| Production branch | `main` |
| Framework preset | `Astro` |
| Build command | `pnpm run build` |
| Build output directory | `dist` |
| Root directory | `/` |

4. 添加环境变量 `NODE_VERSION=22.23.0`。仓库内的 `.nvmrc` 也声明了同一版本。
5. 首次部署成功后，在 Pages 项目的 **Custom domains** 中添加 `www.yanghanqing.top`，按 Cloudflare 提示更新 DNS。

## 本地验证

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm run build
pnpm dev
```

本地预览默认地址为 `http://localhost:4321`。

## Wrangler 直接部署

完成 Cloudflare 登录后，也可以从项目目录直接上传已有构建产物：

```bash
pnpm run build
pnpm wrangler pages deploy dist --project-name=yanghanqing-blog
```

`public/_redirects` 会随构建复制到 `dist`，用于把旧版静态页面和原 Astro 博客路由跳转到新的 Firefly 页面。
