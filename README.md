# 个人简介网站

礼仪模特个人作品集与简介网站。

## 技术栈

纯静态 HTML/CSS/JS，无框架、无构建工具，可直接部署。

## 项目结构

```
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── main.js         # 交互逻辑（语言切换、滚动动画等）
├── assets/             # 资源文件夹（图片、图标等）
├── .nojekyll           # GitHub Pages 配置
└── README.md           # 本文件
```

## 如何替换占位内容

1. **名字/标题**：已填入「婧婧 / JING JING」，如需修改英文名，在 `index.html` 中搜索 "JING JING" 替换
2. **个人简介**：在 `index.html` 中找到 `<section id="about">`，替换中英文简介文案
3. **服务项目**：在 `index.html` 中找到 `<section id="services">`，修改服务名称和描述
4. **联系方式**：邮箱已填入，微信二维码与社交链接为占位（`href="#"`），后续在 `index.html` 中 `<section id="contact">` 替换
5. **形象图**：将你的照片放入 `assets/` 文件夹，然后在 `index.html` 中替换 `<img>` 的 `src` 属性
6. **画廊图片**：在 `<section id="gallery">` 中，将渐变占位块替换为真实图片

## 如何部署到 GitHub Pages

1. 创建 GitHub 仓库（命名随意，如 `my-portfolio`）
2. 将本项目所有文件推送到仓库的 `main` 或 `master` 分支
3. 进入仓库 Settings > Pages
4. Source 选择 `Deploy from a branch`，分支选择 `main`，目录选择 `/ (root)`
5. 保存后稍等片刻，访问 `https://你的用户名.github.io/仓库名/` 即可

> **注意**：仓库根目录的 `.nojekyll` 文件已包含在内，确保 GitHub Pages 不会跳过以下划线开头的文件。

## 语言切换

网站支持中英双语，默认显示中文。点击导航栏右侧的语言切换按钮即可切换。
