# 董航宇 · 个人主页

一份纯静态的个人主页（无构建步骤、无框架依赖），用于求职展示，可直接部署到 GitHub Pages。

## 目录结构

```
site/
├── index.html          # 页面结构
├── css/style.css       # 样式（暖纸 / 墨色 / 朱砂印章风格）
├── js/main.js          # 滚动动效、证书灯箱、导航高亮
└── assets/
    ├── certs/          # 证书图片（已压缩）
    └── 董航宇-简历.pdf  # 可下载的简历 PDF
```

## 部署到 GitHub Pages

### 方式一：把本目录作为仓库根目录（推荐，最简单）

1. 新建一个 GitHub 仓库（如 `donghangyu` 或 `resume`）。
2. 把 `site/` 文件夹里的 **所有内容**（`index.html`、`css`、`js`、`assets`、`README.md`）上传到仓库根目录。
3. 进入仓库 **Settings → Pages**：
   - Source 选择 **Deploy from a branch**；
   - Branch 选择 `main`，目录选择 **/ (root)**，保存。
4. 等待约 1 分钟，访问 `https://<用户名>.github.io/<仓库名>/` 即可。

> 如果你的仓库名是 `<用户名>.github.io`，主页会直接显示在 `https://<用户名>.github.io/`。

### 方式二：使用 /docs 目录

如果想保留源码与页面分离，可以把 `site/` 里的内容放进仓库的 `docs/` 文件夹，然后在 Pages 设置里把目录选为 **/docs**。

## 本地预览

因为没有任何构建依赖，直接用浏览器打开 `index.html` 就能看；也可以起一个本地静态服务器：

```bash
# 在本目录下执行（任选其一）
python -m http.server 8000
# 或
npx serve .
```

然后访问 `http://localhost:8000`。

## 修改说明

- **样式变量**：颜色、字体都在 `css/style.css` 顶部的 `:root` 里，改一处即可全局生效。
- **证书图片**：`assets/certs/` 下按需增删，替换后同步更新 `index.html` 中「证书认证」区块对应的 `<figure class="cert">`。
- **字体**：中文使用系统字体栈（宋体 + 苹方/雅黑），无需联网加载字体，国内访问不受影响。
