# Claude Code Web UI 实施方案

## 概述

将 `/workspace` 仓库（Claude Code CLI 源码快照）改造为基于设计稿的可运行 Web 项目。设计稿位于 `/tmp/webui-design/claude-code-webui/`，包含 3 个 HTML 页面（workspace / sessions / settings）、完整 CSS token 体系、23 个 `ds-*` 组件和 ~100 个 SVG 图标。

## 当前状态分析

### 仓库现状
- **类型**：Bun CLI 项目（React + Ink 终端渲染），非 Web 应用
- **构建**：Bun + TypeScript，无 Web 打包工具（无 webpack/vite）
- **运行时**：依赖 `bun:bundle`、`child_process`、`ink` 等终端 API
- **CSS**：无 CSS 文件，样式通过 Ink 内联处理
- **关键结论**：现有代码无法直接在浏览器运行，需要新建 Web 层

### 设计稿资源
- **3 个完整 HTML 页面**：workspace.html（IDE 工作区）、sessions.html（会话管理）、settings.html（设置页）
- **CSS 体系**：TRAE Design Library dark-only token（~400 个 CSS 变量）+ 23 个 `ds-*` 组件样式
- **SVG 图标**：`assets/icons/`（~80 个）+ `assets/claude-icons/`（~40 个）
- **JS 交互**：slash 命令面板、tab 切换、modal 开关（已有基础实现）

### 可借鉴的源码模式
- **React 组件结构**：`src/components/` 下的组件拆分方式
- **状态管理**：`src/state/AppState.ts` 的 Context + Provider 模式
- **设置系统**：`src/utils/settings/` 的配置读写逻辑
- **权限系统**：`src/utils/permissions/` 的权限模型
- **快捷键**：`src/keybindings/` 的键位映射
- **消息渲染**：`src/components/Message.tsx`、`src/components/Markdown.tsx`

---

## 实施计划

### 阶段 1：项目脚手架（Web 层搭建）

**目标**：在仓库中创建独立的 Web 子项目，不破坏原有 CLI 代码

#### 1.1 创建 Web 项目结构

```
web/                          # Web 子项目根目录
├── index.html                # SPA 入口
├── package.json              # Web 项目依赖
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # Web 专用 TS 配置
├── public/                   # 静态资源
│   └── assets/
│       ├── icons/            # 从设计稿复制的 SVG 图标
│       └── claude-icons/     # 从设计稿复制的 SVG 图标
├── src/
│   ├── main.tsx              # React 入口
│   ├── App.tsx               # 路由 + 布局
│   ├── styles/
│   │   ├── tokens.css        # TRAE Design Token（从设计稿提取）
│   │   ├── components.css    # ds-* 组件样式（从设计稿提取）
│   │   └── global.css        # 全局重置 + 字体引入
│   ├── pages/
│   │   ├── Workspace.tsx     # 主工作区页面
│   │   ├── Sessions.tsx      # 会话管理页面
│   │   └── Settings.tsx      # 设置页面
│   ├── components/
│   │   ├── workbench/
│   │   │   ├── Titlebar.tsx
│   │   │   ├── ActivityRail.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── EditorArea.tsx
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── StatusBar.tsx
│   │   │   └── SlashCommandPanel.tsx
│   │   ├── sessions/
│   │   │   ├── SessionCard.tsx
│   │   │   ├── SessionTable.tsx
│   │   │   └── NewSessionModal.tsx
│   │   └── settings/
│   │       ├── SettingsNav.tsx
│   │       └── SettingsContent.tsx
│   ├── hooks/
│   │   ├── usePanelToggle.ts
│   │   └── useSlashCommand.ts
│   └── types/
│       └── index.ts
```

#### 1.2 技术选型

| 项目 | 选择 | 理由 |
|------|------|------|
| 构建工具 | Vite | 快速 HMR，原生 TS/JSX 支持 |
| 路由 | React Router v6 | SPA 页面切换 |
| 样式方案 | 纯 CSS（TRAE token + ds-* 组件） | 设计稿已有完整 CSS，无需 CSS-in-JS |
| 图标 | 内联 SVG / img 引用 | 设计稿已提供所有 SVG |
| 状态管理 | React Context + useState | 页面级状态简单，无需 Redux |

#### 1.3 依赖安装

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "lucide-react": "^1.8.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0"
  }
}
```

### 阶段 2：CSS 基础设施

**目标**：从设计稿 HTML 中提取 CSS，建立可复用的样式体系

#### 2.1 提取 Token CSS

从 `workspace.html` 的 `<style id="theme-vars">` 提取 `:root` 变量到 `web/src/styles/tokens.css`。

包含：
- radius / spacers / font / body / heading / code token
- bg / bg-brand / text / text-brand / icon / icon-brand / border token
- accent / status / brand / special token

#### 2.2 提取组件 CSS

从 `workspace.html` 的 `<style id="component-vars">` 提取 23 个 `ds-*` 组件到 `web/src/styles/components.css`。

组件清单：activityrail, alert, avatar, btn, card, composer, dialog, drawer, editortabs, filetree, forms (input/select/textarea/slider/check/radio/switch), kbd, menu, navlist, pagehead, pagination, statcard, statusbar, tablepanel, table, tabs, tag, wbtitlebar, settingrow

#### 2.3 创建全局 CSS

`web/src/styles/global.css`：
- CSS 重置（box-sizing, margin, padding）
- 字体引入（SF Pro Text, JetBrains Mono 的 web fallback）
- body 基础样式
- 滚动条样式
- Tailwind CDN 兼容层（如需要）

### 阶段 3：页面实现

#### 3.1 主工作区页面（Workspace）

**从 `workspace.html` 转换为 React 组件**

核心布局（CSS Grid）：
```css
.cc-workbench {
  display: grid;
  grid-template-rows: 40px 1fr 24px;
  grid-template-columns: 48px 260px 1fr minmax(0, 480px);
  width: 100vw;
  height: 100vh;
}
```

组件拆分：
- **Titlebar**：traffic lights + CC logo + project selector + view mode tabs + sidebar/panel toggles + avatar
- **ActivityRail**：5 个功能按钮（Files/Search/Git/Terminal）+ 2 个导航按钮（Sessions/Settings）+ active 指示器
- **Sidebar**：Explorer 标题 + FileTree 组件
- **EditorArea**：EditorTabs + 代码内容（带行号和语法高亮）
- **ChatPanel**：Chat header + 消息列表 + Chat Composer + Slash 命令面板
- **StatusBar**：git branch + sync status + error/warning count + cursor position + encoding + language

**交互功能**：
- Sidebar 折叠/展开（切换 grid-template-columns）
- Chat Panel 折叠/展开
- Activity Rail 按钮切换（active 状态 + 绿色指示条）
- Slash 命令面板（输入 `/` 触发，键盘导航选择）
- Tab 切换（Chat/Plan、Verbose/Normal/Summary）
- 消息气泡 hover 效果
- 工具调用块状态（done 绿色 / progress 蓝色 + spinner）

#### 3.2 会话管理页面（Sessions）

**从 `sessions.html` 转换为 React 组件**

布局：
- Page Header（标题 + 操作按钮）
- Tabs（活跃会话 / 历史记录 / 已归档）
- Card Grid（2 列响应式）
- History Table（6 列网格布局）
- New Session Modal

**交互功能**：
- Tab 切换
- 新建会话 Modal（打开/关闭/点击遮罩关闭）
- 卡片 hover 效果（translateY + shadow）
- 响应式：680px 以下卡片单列，768px 以下表格隐藏部分列

#### 3.3 设置页面（Settings）

**从 `settings.html` 转换为 React 组件**

布局：
- Page Header
- Two-column（左侧 NavList + 右侧 SettingRow 面板）
- Danger Zone

**交互功能**：
- NavList 项切换 active 状态
- Switch 开关切换
- Select 下拉交互
- 危险操作按钮样式

### 阶段 4：路由与导航

#### 4.1 路由配置

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Workspace />} />
    <Route path="/sessions" element={<Sessions />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</BrowserRouter>
```

#### 4.2 导航连接

- Activity Rail 底部：Sessions / Settings 按钮 → `useNavigate` 跳转
- Sessions 页面：返回工作区 / 设置 链接
- Settings 页面：返回工作区 / 会话管理 链接

### 阶段 5：多端适配

#### 5.1 响应式断点

| 断点 | 适配策略 |
|------|----------|
| ≥1280px | 完整 4 列 IDE 布局 |
| 1024-1279px | 隐藏 sidebar，chat panel 可折叠 |
| 768-1023px | 隐藏 sidebar + chat，仅编辑器 |
| <768px | 移动端：垂直堆叠，底部 tab 导航 |

#### 5.2 关键适配点

- **Workspace**：sidebar/chat 面板通过 CSS media query + JS toggle 控制
- **Sessions**：卡片网格从 2 列变 1 列，表格隐藏次要列
- **Settings**：NavList 折叠为顶部水平 tabs
- **触摸适配**：按钮/开关最小 44px 触摸区域

### 阶段 6：验证与完善

- Vite dev server 启动验证
- 3 个页面路由切换正常
- 面板折叠/展开交互正常
- 响应式布局在不同宽度下正常
- 所有图标正确加载
- CSS token 一致性检查（无硬编码颜色）

---

## 关键决策

1. **独立 web/ 目录**：不修改原 CLI 代码，Web 项目完全独立
2. **纯 CSS 方案**：设计稿已有完整 CSS，直接提取复用，不用 Tailwind/CSS-in-JS
3. **Vite 构建**：零配置支持 TSX + CSS，HMR 快
4. **Lucide React 图标**：设计稿的 SVG 图标通过 lucide-react 组件化使用，同时保留自定义 SVG
5. **页面级代码分割**：React Router lazy loading

## 假设

- 设计稿 HTML 中的 CSS 和结构即为最终视觉标准
- 不需要连接真实后端 API（纯前端展示）
- 不需要暗/亮主题切换（设计稿为 dark-only）
- 字体使用 web-safe fallback（SF Pro / JetBrains Mono 不可用时）

## 文件变更清单

### 新建文件（~30 个）

| 文件 | 说明 |
|------|------|
| `web/index.html` | SPA 入口 HTML |
| `web/package.json` | Web 项目依赖 |
| `web/vite.config.ts` | Vite 配置 |
| `web/tsconfig.json` | Web TS 配置 |
| `web/src/main.tsx` | React 入口 |
| `web/src/App.tsx` | 路由 + 布局 |
| `web/src/styles/tokens.css` | TRAE Design Token |
| `web/src/styles/components.css` | ds-* 组件样式 |
| `web/src/styles/global.css` | 全局样式 |
| `web/src/pages/Workspace.tsx` | 主工作区页面 |
| `web/src/pages/Sessions.tsx` | 会话管理页面 |
| `web/src/pages/Settings.tsx` | 设置页面 |
| `web/src/components/workbench/Titlebar.tsx` | 标题栏 |
| `web/src/components/workbench/ActivityRail.tsx` | 活动栏 |
| `web/src/components/workbench/Sidebar.tsx` | 侧边栏 |
| `web/src/components/workbench/EditorArea.tsx` | 编辑器区域 |
| `web/src/components/workbench/ChatPanel.tsx` | 聊天面板 |
| `web/src/components/workbench/StatusBar.tsx` | 状态栏 |
| `web/src/components/workbench/SlashCommandPanel.tsx` | Slash 命令面板 |
| `web/src/components/sessions/SessionCard.tsx` | 会话卡片 |
| `web/src/components/sessions/SessionTable.tsx` | 会话表格 |
| `web/src/components/sessions/NewSessionModal.tsx` | 新建会话弹窗 |
| `web/src/components/settings/SettingsNav.tsx` | 设置导航 |
| `web/src/components/settings/SettingsContent.tsx` | 设置内容 |
| `web/src/hooks/usePanelToggle.ts` | 面板切换 hook |
| `web/src/hooks/useSlashCommand.ts` | Slash 命令 hook |
| `web/src/types/index.ts` | 类型定义 |

### 复制的资源文件

| 源 | 目标 | 说明 |
|----|------|------|
| `/tmp/webui-design/claude-code-webui/assets/icons/*` | `web/public/assets/icons/` | ~80 个 SVG 图标 |
| `/tmp/webui-design/claude-code-webui/assets/claude-icons/*` | `web/public/assets/claude-icons/` | ~40 个 SVG 图标 |

### 不修改的文件

原仓库 `src/`、`scripts/`、`cli` 等所有文件保持不变。

---

## 验证步骤

1. `cd web && npm install && npm run dev` — Vite dev server 启动
2. 浏览器访问 `http://localhost:5173/` — Workspace 页面正常渲染
3. 点击 Activity Rail 的 Sessions/Settings 按钮 — 页面切换正常
4. 点击 sidebar toggle — 面板折叠/展开
5. 输入 `/` — Slash 命令面板弹出
6. 缩放浏览器窗口 — 响应式布局适配
7. 检查所有 CSS 变量 — 无硬编码颜色值
