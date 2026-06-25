# Claude Code Web UI - 项目实施计划

## 概述

将 `/workspace` 仓库（Claude Code CLI 源码快照）改造为基于设计稿的可运行 Web 项目。设计稿包含 3 个页面：主工作区（Workspace）、会话管理（Sessions）、设置（Settings），使用 TRAE Design Library 的 dark-only token 体系和 `ds-*` 组件。

---

## 当前状态分析

### 仓库现状
- **技术栈**：Bun + TypeScript + React（Ink 终端渲染）+ Zod
- **项目类型**：CLI 工具源码快照，非 Web 项目
- **构建系统**：Bun 脚本（`scripts/build.ts`）
- **入口**：`src/entrypoints/cli.tsx`（终端 CLI）
- **React 用途**：Ink 终端 UI，非浏览器 DOM
- **CSS 方案**：无（终端应用不需要 CSS）
- **package.json**：`"type": "module"`, `"private": true`, Bun 作为包管理器

### 设计稿资源（`/tmp/design-upload/claude-code-webui/`）
- **3 个 HTML 页面**：`workspace.html`、`sessions.html`、`settings.html`
- **图标资产**：`assets/icons/`（约 65 个 SVG）、`assets/claude-icons/`（约 40 个 SVG）
- **设计系统**：TRAE Design Library tokens（CSS 变量）+ 23 个 `ds-*` 组件定义
- **外部依赖**：Tailwind CSS CDN v4.3.1、Lucide Icons v1.8.0

### 设计稿特点
- **workspace.html**：全屏 IDE 布局（grid），包含 titlebar、activity rail、sidebar、editor、chat panel、status bar
- **sessions.html**：使用不同的 token 体系（Anthropic 品牌色 #c96442），有 light/dark 模式
- **settings.html**：使用 TRAE dark-only token 体系，两栏布局（nav + content）
- **所有页面**：自包含 HTML，CSS/JS 内联，依赖 CDN

---

## 实施方案

### 核心决策

1. **技术选型**：Vite + React + TypeScript + CSS Variables
   - 理由：设计稿已是 HTML+CSS+JS，Vite 是最快的 React 开发服务器，与仓库现有 TypeScript/React 生态兼容
   - 保留 Bun 作为包管理器（`bun install`）

2. **样式方案**：直接复用设计稿的 CSS 变量 + `ds-*` 组件 CSS
   - 将设计稿的 `#theme-vars` 和 `#component-vars` 提取为独立 CSS 文件
   - 不引入 Tailwind CDN（设计稿中 Tailwind 仅用于少量 reset，实际样式全部用 CSS 变量）
   - 图标使用内联 SVG 或 Lucide React 组件

3. **路由方案**：React Router（3 个页面需要导航）

4. **统一 Token 体系**：以 TRAE dark-only token 为主（workspace 和 settings 页面使用），sessions 页面需要适配
   - 决策：sessions 页面也统一使用 TRAE dark token，保持视觉一致性

5. **项目结构**：在 `/workspace` 根目录下创建 `web/` 子目录作为 Web 项目，不破坏原有 CLI 源码

### 项目结构

```
/workspace/
├── web/                          # 新增：Web UI 项目
│   ├── index.html                # Vite 入口 HTML
│   ├── vite.config.ts            # Vite 配置
│   ├── tsconfig.json             # Web 项目 TypeScript 配置
│   ├── package.json              # Web 项目依赖（独立于根目录）
│   ├── src/
│   │   ├── main.tsx              # React 入口
│   │   ├── App.tsx               # 根组件 + 路由
│   │   ├── styles/
│   │   │   ├── tokens.css        # TRAE Design Tokens（从设计稿提取）
│   │   │   ├── components.css    # ds-* 组件样式（从设计稿提取）
│   │   │   └── global.css        # 全局样式 + reset
│   │   ├── assets/
│   │   │   └── icons/            # SVG 图标（从设计稿复制）
│   │   ├── pages/
│   │   │   ├── Workspace.tsx     # 主工作区页面
│   │   │   ├── Sessions.tsx      # 会话管理页面
│   │   │   └── Settings.tsx      # 设置页面
│   │   ├── components/
│   │   │   ├── workbench/
│   │   │   │   ├── Titlebar.tsx
│   │   │   │   ├── ActivityRail.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── EditorArea.tsx
│   │   │   │   ├── ChatPanel.tsx
│   │   │   │   ├── StatusBar.tsx
│   │   │   │   └── SlashPanel.tsx
│   │   │   ├── sessions/
│   │   │   │   ├── SessionCard.tsx
│   │   │   │   ├── HistoryList.tsx
│   │   │   │   └── NewSessionModal.tsx
│   │   │   ├── settings/
│   │   │   │   ├── SettingsNav.tsx
│   │   │   │   └── SettingsContent.tsx
│   │   │   └── shared/
│   │   │       └── Icon.tsx       # SVG 图标组件
│   │   └── hooks/
│   │       └── usePanelToggle.ts  # 面板折叠 hook
│   └── public/
│       └── favicon.svg
├── (原有 CLI 源码保持不变)
```

---

## 具体实施步骤

### 步骤 1：初始化 Web 项目

**操作**：
- 在 `/workspace/web/` 创建 Vite + React + TypeScript 项目
- 配置 `vite.config.ts`、`tsconfig.json`、`package.json`
- 安装依赖：`react`、`react-dom`、`react-router-dom`、`lucide-react`
- 复制图标资产到 `web/src/assets/icons/`

**文件**：
- `/workspace/web/package.json` — 新建
- `/workspace/web/vite.config.ts` — 新建
- `/workspace/web/tsconfig.json` — 新建
- `/workspace/web/index.html` — 新建

### 步骤 2：提取设计系统样式

**操作**：
- 从 `workspace.html` 的 `#theme-vars` 提取 TRAE tokens → `tokens.css`
- 从 `workspace.html` 的 `#component-vars` 提取 ds-* 组件 → `components.css`
- 创建 `global.css`（reset + 基础排版）
- 注意：tokens.css 和 components.css 直接从设计稿 HTML 复制，不做修改

**文件**：
- `/workspace/web/src/styles/tokens.css` — 从设计稿提取
- `/workspace/web/src/styles/components.css` — 从设计稿提取
- `/workspace/web/src/styles/global.css` — 新建

### 步骤 3：搭建应用框架 + 路由

**操作**：
- 创建 React 入口 `main.tsx` 和根组件 `App.tsx`
- 配置 React Router（3 个路由：`/`、`/sessions`、`/settings`）
- 引入全局样式

**文件**：
- `/workspace/web/src/main.tsx` — 新建
- `/workspace/web/src/App.tsx` — 新建

### 步骤 4：实现主工作区页面（Workspace）

**操作**：
- 将 `workspace.html` 的 HTML 结构转化为 React 组件
- 拆分为：Titlebar、ActivityRail、Sidebar、EditorArea、ChatPanel、StatusBar
- 实现面板折叠交互（sidebar/chat 显示隐藏）
- 实现 slash 命令面板交互
- 实现多端适配（响应式 grid）

**文件**：
- `/workspace/web/src/pages/Workspace.tsx`
- `/workspace/web/src/components/workbench/Titlebar.tsx`
- `/workspace/web/src/components/workbench/ActivityRail.tsx`
- `/workspace/web/src/components/workbench/Sidebar.tsx`
- `/workspace/web/src/components/workbench/EditorArea.tsx`
- `/workspace/web/src/components/workbench/ChatPanel.tsx`
- `/workspace/web/src/components/workbench/StatusBar.tsx`
- `/workspace/web/src/components/workbench/SlashPanel.tsx`
- `/workspace/web/src/hooks/usePanelToggle.ts`

**关键交互**：
- Activity Rail 按钮切换 sidebar 内容（文件/搜索/Git/终端）
- Sidebar 折叠/展开
- Chat Panel 折叠/展开
- Editor Tabs 切换/关闭
- Slash 命令面板（输入 `/` 触发，键盘导航）
- Chat/Plan 模式切换
- View mode 切换（Verbose/Normal/Summary）

### 步骤 5：实现会话管理页面（Sessions）

**操作**：
- 将 `sessions.html` 转化为 React 组件
- 统一使用 TRAE dark token（替换 sessions 页面的 Anthropic 品牌色）
- 拆分为：SessionCard、HistoryList、NewSessionModal
- 实现 Tab 切换、Modal 打开/关闭、卡片交互

**文件**：
- `/workspace/web/src/pages/Sessions.tsx`
- `/workspace/web/src/components/sessions/SessionCard.tsx`
- `/workspace/web/src/components/sessions/HistoryList.tsx`
- `/workspace/web/src/components/sessions/NewSessionModal.tsx`

### 步骤 6：实现设置页面（Settings）

**操作**：
- 将 `settings.html` 转化为 React 组件
- 拆分为：SettingsNav、SettingsContent
- 实现 Nav 项切换、Switch 开关、Select 下拉

**文件**：
- `/workspace/web/src/pages/Settings.tsx`
- `/workspace/web/src/components/settings/SettingsNav.tsx`
- `/workspace/web/src/components/settings/SettingsContent.tsx`

### 步骤 7：共享组件 + 图标系统

**操作**：
- 创建 Icon 组件，封装 SVG 图标引用
- 统一页面间导航逻辑（Activity Rail 的 Sessions/Settings 按钮、页面 header 的返回链接）

**文件**：
- `/workspace/web/src/components/shared/Icon.tsx`

### 步骤 8：多端适配

**操作**：
- Workspace：响应式 grid（移动端隐藏 sidebar/chat，显示全屏编辑器）
- Sessions：卡片网格响应式（2 列 → 1 列）
- Settings：移动端 nav 折叠为顶部 tabs
- 添加 media query 断点

### 步骤 9：验证 + 启动

**操作**：
- `bun install` 安装依赖
- `bun run dev` 启动开发服务器
- 验证 3 个页面视觉效果与设计稿一致
- 验证交互功能正常
- 验证多端适配

---

## 关键约束

1. **Token 忠诚**：所有颜色/字体/间距使用 `var(--token-name)`，不硬编码
2. **组件复用**：优先使用 `ds-*` 组件 CSS，CC 特有组件用 TRAE token 构建
3. **样式提取**：tokens.css 和 components.css 直接从设计稿复制，保持一致
4. **不破坏原有代码**：Web 项目放在 `web/` 子目录，不影响 CLI 源码
5. **图标复用**：使用设计稿提供的 SVG 图标，不创建新图标
6. **Lucide React**：对于设计稿中通过 `<img src>` 引用的图标，优先使用 `lucide-react` 组件替代

---

## 假设与决策

- **设备类型**：desktop-first（IDE 工具），移动端做基本适配
- **Token 体系**：统一使用 TRAE dark-only token（sessions 页面原设计使用不同 token，需适配）
- **不引入 Tailwind**：设计稿中 Tailwind 仅用于少量 reset，实际样式全部用 CSS 变量，引入 Tailwind 会增加复杂度
- **图标方案**：使用 `lucide-react` 组件 + 设计稿特有 SVG（如 sparkles.32f08c.svg）
- **状态管理**：使用 React useState/useReducer，不引入额外状态库
- **包管理器**：使用 Bun（与仓库一致）

---

## 验证步骤

1. `cd /workspace/web && bun install` — 依赖安装成功
2. `bun run dev` — 开发服务器启动成功
3. 访问 `http://localhost:5173/` — Workspace 页面正常显示
4. 访问 `/sessions` — Sessions 页面正常显示
5. 访问 `/settings` — Settings 页面正常显示
6. 面板折叠/展开交互正常
7. Slash 命令面板交互正常
8. Tab 切换、Modal 开关交互正常
9. 响应式布局在不同屏幕宽度下正常
10. 视觉效果与设计稿一致（颜色、字体、间距、组件样式）
