# 栗子软件科技

企业软件、AI Agent 与工作流自动化的多页品牌网站。

公开地址：https://lizi-product-studio.github.io/dingxinglizi-ideas/

## 页面

- 首页：数字系统主视觉、精选作品与能力入口。
- 作品：三个明确标注的产品概念演示及分类筛选。
- 项目详情：运营工作台、知识 Agent、审批工作流的交互演示。
- 能力：可逐步探索的业务流程示意。
- 实验室：支持鼠标、触屏与键盘的三维线场。
- 关于与合作：联系方式与本地项目简报生成。

所有概念项目、模拟界面与流程数据均为演示，不代表客户项目、实际业务成果或真实 AI 服务。项目简报在浏览器本地生成，通过复制交给用户，不会自动发送。

## 本地运行

```sh
python -m http.server 4188 --directory web
```

打开 http://localhost:4188/ 。无构建步骤，无运行时网络依赖。

```sh
node scripts/check-site.mjs web
```

推送 main 后，GitHub Actions 检查页面资源与 JavaScript 语法并发布 web/ 到 GitHub Pages。

网站使用本地 Manrope 字体，字体许可见 web/assets/manrope.OFL.txt。动画由 CSS 与原生 JavaScript 实现。

本次官网替换以前的项目规划工具；旧代码可通过 Git 历史恢复。

