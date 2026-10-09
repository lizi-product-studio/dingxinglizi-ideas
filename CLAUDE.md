# 项目说明（给 Claude 的上下文）

## 项目

开项 · 想法与项目。提供「梳理想法」和「规划项目」两个入口：普通用户从一句话整理行动卡，项目用户填写需求并生成简报交给 AI 开发；可选调用本机 Codex 生成 `AGENTS.md`。用法见 `README.md`。

- `web/model.mjs`：字段、显示条件、必填规则（`REQUIRED_BY_DEPTH`）、协作建议（`recommend`）、人机交接（`handoff`）和简报文本（`brief`）。改表单内容主要改这里。
  - 选项标签以「待推荐 / 待估」结尾 = 交给 AI；以「待定 / 待确认」结尾 = 人还没决定（`intentOf`）。多选里具体选项和「待X」可以共存，分别归类。
  - 简报页问题的答复存在 `data.answers`，键为问题 id。
- `web/app.js`：渲染、交互、localStorage 草稿、导入导出；在支持 WebMCP 的浏览器里注册只读工具 `read_project_kickoff`。
- `server.py`：只监听 127.0.0.1，校验 Host/Origin，调用 Codex CLI。

## 关于仓库主人

- 跨专业的产品经理，零代码基础。
- 主人负责需求、取舍和验收；技术选型、编码、测试、部署由 Claude 完成。
- 沟通用中文，技术概念用大白话解释，说明做了什么、为什么。

## 规则

- 本仓库是公开的，不提交密钥或个人数据。
- 改动后运行 `node --test tests/model.test.mjs`、`python3 -m unittest discover -s tests -v` 和 `node tests/e2e.mjs`（浏览器走查；云端环境用 `PLAYWRIGHT_MODULE=/opt/node22/lib/node_modules/playwright/index.mjs`）。改了页面交互，就在 `tests/e2e.mjs` 里补对应检查。
- 调整选项时不要复用已停用选项的 value；旧草稿里认不出的选项会被移除。
- `web/index.html` 和 `web/app.js` 里引用页面文件时带 `?v=dev`，发布流程会把它换成提交号，避免浏览器混用新旧文件。新增页面文件引用时也要带上。
- 保存草稿走 `persist()`：先读最新存储，只写回本页改动的那份，不要直接整体覆盖 localStorage。

## 想法入口

- `web/idea.mjs` 定义轻量想法字段、规则行动草案、AI 交接提示和界面；不调用模型。
- 新草稿默认 `mode: idea`；旧备份没有 mode 时按项目处理。两种模式的数据均保留，转为项目创建新草稿。
- 修改想法不能自动覆盖已编辑行动或勾选；按 `taskSource` 提示版本变化，重新整理须说明会重置行动。
- 验证新增逻辑运行 `node --test tests/*.test.mjs`，浏览器同时检查想法路径和原项目路径。
