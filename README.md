# Claude Architect 20 題互動練習

Claude Certified Architect – Foundations 的中英對照互動練習網站。

> 本站題目皆為依官方考試領域自行設計的原創練習題，不是官方題庫、正式考題或外流題目。

## 功能

- 20 題英文情境題與繁體中文翻譯
- 單選題與複選題
- 作答後顯示正確答案、逐項解析與關鍵單字
- 即時計算答對題數、正確率與完成進度
- 中英對照及純英文模式
- 題目地圖、錯題標記及下一題未作答導覽
- 使用瀏覽器 Local Storage 自動保存進度
- 支援桌面及手機版
- 純 HTML、CSS、JavaScript，沒有外部套件或追蹤程式

## 使用方式

直接開啟 **index.html** 即可使用，不需要安裝套件或啟動伺服器。

如需使用本機 HTTP 預覽：

    python -m http.server 8002 --bind 127.0.0.1

再開啟 http://127.0.0.1:8002/。

## 題目分布

| 領域 | 題數 |
|---|---:|
| Agent 架構與流程 | 5 |
| Tool 與 MCP | 4 |
| Claude Code 工作流程 | 4 |
| Prompt 與結構化輸出 | 4 |
| Context 與可靠性 | 3 |

## 專案結構

    .
    ├── index.html       # Page structure
    ├── styles.css       # Visual design and responsive layout
    ├── questions.js     # Question and answer data
    └── app.js           # Quiz state and interactions

## 資料隱私

作答紀錄只保存在使用者目前瀏覽器的 Local Storage，不會傳送至伺服器。
