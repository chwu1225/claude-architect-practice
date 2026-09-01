const mcpContextQuestions = [
  {
    id: 43,
    category: "mcp",
    title: "哪些 Tool 欄位真的應該 Required？",
    type: "single",
    en: "A `quote_shipping` tool needs a destination postal code, package weight, and weight unit to calculate a quote. Its schema also marks delivery instructions, declared value, coupon code, and customer phone as required, so Claude invents placeholders when users do not provide them. Which redesign is BEST?",
    zh: "`quote_shipping` Tool 計算報價真正需要目的地郵遞區號、包裹重量與重量單位。然而 Schema 也把配送說明、申報價值、優惠碼及客戶電話全部設為 Required，導致使用者未提供時 Claude 會編造 Placeholder。哪種重新設計最好？",
    options: [
      { key: "A", en: "Keep every field required and instruct Claude to use empty strings or plausible placeholders.", zh: "保留所有 Required 欄位，指示 Claude 使用空字串或看似合理的 Placeholder。" },
      { key: "B", en: "Silently assume kilograms, a zero declared value, and a default phone number whenever fields are missing.", zh: "欄位缺少時，靜默假設單位為公斤、申報價值為零，並使用預設電話。" },
      { key: "C", en: "Remove the schema and accept one free-form sentence containing all package details.", zh: "移除 Schema，改用一個自由格式句子承載所有包裹資料。" },
      { key: "D", en: "Require only fields essential to the calculation, define units with an enum and numeric ranges, leave genuinely optional fields optional, and request missing essential values instead of guessing.", zh: "只把計算不可缺少的欄位設為 Required，以 Enum 定義單位並限制數值範圍，真正可選欄位保持 Optional；缺少必要值時要求補充，不可猜測。" }
    ],
    answers: ["D"],
    explanation: "Required 應只用於工具無法正確執行時真正不可缺少的資料；把可選資訊標成必填，會逼模型編造值或產生無意義 Placeholder。重量單位等有限集合應使用 Enum，數字則應標示單位、合理範圍及參數作用。若必要值缺少，Agent 應向使用者釐清，Server 仍須驗證所有收到的值。",
    why: {
      A: "空字串和編造值不是真實資料，可能形成錯誤報價或下游驗證失敗。",
      B: "靜默預設可能改變價格或責任，且沒有反映使用者真正意圖。",
      C: "自由文字會失去型別、Required、Enum 與範圍等機器可驗證限制。",
      D: "正確。最小必要 Schema 降低猜值壓力，同時讓單位與值域可驗證。"
    },
    terms: [["required field", "必填欄位"], ["optional field", "選填欄位"], ["enum", "限定值清單"], ["unit", "計量單位"], ["placeholder", "暫代值"], ["value range", "數值範圍"]]
  },
  {
    id: 44,
    category: "mcp",
    title: "過度寬廣的管理工具",
    type: "single",
    en: "An account agent has one tool, `account_admin(action, payload)`, that can search, update, suspend, permanently close, and export any account. The model frequently confuses read-only requests with irreversible actions. What is the BEST interface change?",
    zh: "帳號 Agent 只有一個 `account_admin(action, payload)` 工具，可搜尋、更新、停權、永久關閉及匯出任何帳號。模型經常混淆唯讀要求與不可逆操作。最佳介面調整是什麼？",
    options: [
      { key: "A", en: "Add more possible action strings without changing permissions or schemas.", zh: "加入更多 Action 字串，但不調整權限或 Schema。" },
      { key: "B", en: "Hide the tool description so Claude relies on the user's wording.", zh: "隱藏 Tool Description，讓 Claude 只依賴使用者措辭。" },
      { key: "C", en: "Keep the broad tool and let it choose a random account when no ID is supplied.", zh: "保留寬廣工具；未提供 ID 時隨機選擇帳號。" },
      { key: "D", en: "Separate read-only lookup from high-impact mutations, give each operation a narrow schema and permission boundary, and require explicit identifiers and preconditions.", zh: "把唯讀查詢與高影響修改分開，為各操作設定狹窄 Schema 與權限邊界，並要求明確識別碼及前置條件。" }
    ],
    answers: ["D"],
    explanation: "工具邊界應對應清楚的業務能力與風險等級，而不是用一個自由格式入口承擔所有操作。至少應將唯讀查詢與不可逆修改隔離，讓 Agent 只取得當下需要的能力。明確的識別碼、前置條件及窄權限能在選錯工具時限制損害。",
    why: {
      A: "增加自由字串只會擴大歧義，並未建立可驗證的操作邊界。",
      B: "缺少說明會降低工具選擇品質，而不是提高可靠性。",
      C: "對高影響操作猜測目標是不安全且不可稽核的。",
      D: "正確。它讓介面語意、Schema、權限與操作風險保持一致。"
    },
    terms: [["tool boundary", "工具邊界"], ["read-only", "唯讀"], ["irreversible", "不可逆"], ["precondition", "前置條件"], ["least privilege", "最小權限"]]
  },
  {
    id: 45,
    category: "mcp",
    title: "工具之間如何可靠交接？",
    type: "multiple",
    en: "A workflow first creates a service request and then assigns it to a technician. Which TWO interface practices make the handoff between tools MOST reliable?",
    zh: "某流程先建立服務申請，再把它指派給技術人員。哪兩項介面做法能讓工具之間的交接最可靠？",
    options: [
      { key: "A", en: "Return every field from every service request so the model has maximum context.", zh: "回傳所有服務申請的全部欄位，讓模型擁有最大 Context。" },
      { key: "B", en: "Return only 'Done!' and ask Claude to rediscover the request later.", zh: "只回傳「完成！」，之後再讓 Claude 重新尋找該申請。" },
      { key: "C", en: "Document output fields, state transitions, and assignment preconditions, and reject invalid transitions on the server.", zh: "說明輸出欄位、狀態轉換與指派前置條件，並由 Server 拒絕無效轉換。" },
      { key: "D", en: "Have the create tool return a stable `request_id` and require the assign tool to accept that exact typed identifier.", zh: "讓建立工具回傳穩定的 `request_id`，並要求指派工具接受相同型別的確切識別碼。" }
    ],
    answers: ["C", "D"],
    explanation: "跨工具工作流程需要穩定且具語意的識別碼，後續工具才能明確引用前一步建立的物件。介面也應說明可接受的狀態與前置條件，並由 Server 強制驗證，避免模型跳過必要階段。回傳內容應以完成下一步所需的高訊號資料為主。",
    why: {
      A: "大量無關欄位浪費 Context，也可能增加敏感資料暴露。",
      B: "缺少識別碼會迫使模型猜測或重新搜尋，容易指派錯誤案件。",
      C: "正確。狀態與前置條件讓不合法工作流程在 Server 端失敗。",
      D: "正確。穩定 ID 建立明確的工具輸出與下一工具輸入合約。"
    },
    terms: [["stable identifier", "穩定識別碼"], ["handoff", "交接"], ["state transition", "狀態轉換"], ["precondition", "前置條件"], ["high-signal output", "高訊號輸出"]]
  },
  {
    id: 46,
    category: "mcp",
    title: "Protocol Error 與 Tool Error",
    type: "single",
    en: "An MCP server receives two failures: one request names a tool that does not exist, while another correctly calls `reserve_room` but supplies a date in the past. How should the server report them?",
    zh: "MCP Server 收到兩種失敗：第一個 Request 指定不存在的 Tool；第二個正確呼叫 `reserve_room`，但日期在過去。Server 應如何回報？",
    options: [
      { key: "A", en: "Return ordinary successful text for both failures.", zh: "兩種失敗都回傳一般成功文字。" },
      { key: "B", en: "Close the connection for both failures without an explanation.", zh: "兩種失敗都直接關閉連線，不提供說明。" },
      { key: "C", en: "Use a JSON-RPC protocol error for the unknown tool and a tool result with `isError: true` plus actionable details for the invalid date.", zh: "未知 Tool 使用 JSON-RPC Protocol Error；無效日期回傳 `isError: true` 的 Tool Result，並提供可採取行動的資訊。" },
      { key: "D", en: "Retry both requests indefinitely before returning anything.", zh: "兩個 Request 都無限重試，不回傳任何結果。" }
    ],
    answers: ["C"],
    explanation: "不存在的 Tool 或不符合 Call Request 結構屬於 Protocol 層問題，適合使用標準 JSON-RPC Error。日期值域、外部 API 或 Business Rule 失敗屬於 Tool Execution Error，應以 `isError: true` 和可修正訊息回傳。區分錯誤層級能讓 Client 與模型採取適當恢復方式。",
    why: {
      A: "把失敗偽裝成成功會使程式與模型無法可靠判斷狀態。",
      B: "關閉連線會丟失錯誤原因，且不利於修正可恢復的輸入問題。",
      C: "正確。它依錯誤所在的協定層或工具執行層選擇回報機制。",
      D: "永久性輸入錯誤不會因盲目重試而消失。"
    },
    terms: [["protocol error", "協定錯誤"], ["tool execution error", "工具執行錯誤"], ["isError", "工具錯誤標記"], ["JSON-RPC", "遠端程序呼叫協定"], ["actionable feedback", "可採取行動的回饋"]]
  },
  {
    id: 47,
    category: "mcp",
    title: "可恢復的工具錯誤怎麼回報？",
    type: "multiple",
    en: "A `submit_claim` MCP tool reaches its downstream insurer API, but the API is temporarily unavailable. Which TWO responses make recovery MOST reliable?",
    zh: "`submit_claim` MCP Tool 已呼叫下游保險 API，但 API 暫時無法使用。哪兩項處理能讓恢復最可靠？",
    options: [
      { key: "A", en: "Return success with a fabricated claim number so the workflow can continue.", zh: "回傳成功並編造理賠編號，讓工作流程繼續。" },
      { key: "B", en: "Return `isError: true` with a stable error code, a safe message, whether retry may help, and any known operation status.", zh: "回傳 `isError: true`，包含穩定 Error Code、安全訊息、重試是否可能有效，以及已知的操作狀態。" },
      { key: "C", en: "Include the downstream API secret and full stack trace so Claude can debug it.", zh: "回傳下游 API Secret 與完整 Stack Trace，讓 Claude 自行除錯。" },
      { key: "D", en: "Propagate the failure to the caller, preserve the correlation ID, and retry only when the error is classified as transient and the operation is safe to retry.", zh: "把失敗傳回呼叫端、保留 Correlation ID，並只在錯誤被判定為暫時性且操作可安全重試時才重試。" }
    ],
    answers: ["B", "D"],
    explanation: "結構化錯誤應讓上層知道失敗種類、是否可重試、是否可能已產生副作用，以及如何追蹤該請求。呼叫端不能把未知結果當成成功，也不應對所有錯誤無條件重試。安全訊息與 Correlation ID 能支援恢復和稽核，同時避免洩漏秘密。",
    why: {
      A: "編造成功資料會污染後續狀態，並隱藏真正失敗。",
      B: "正確。穩定且可操作的錯誤欄位讓 Agent 能選擇修正、重試或停止。",
      C: "Secret 與內部 Stack Trace 不應進入模型 Context 或使用者回應。",
      D: "正確。錯誤傳播與受控重試可避免靜默失敗及重複副作用。"
    },
    terms: [["error code", "錯誤代碼"], ["retryable", "可重試"], ["transient error", "暫時性錯誤"], ["correlation ID", "關聯識別碼"], ["operation status", "操作狀態"]]
  },
  {
    id: 48,
    category: "mcp",
    title: "輸入錯誤要提供多少資訊？",
    type: "single",
    en: "Claude calls `create_case` with `priority: 'urgent-now'`, but the schema allows only `low`, `medium`, or `high`. Which tool error is MOST useful?",
    zh: "Claude 呼叫 `create_case` 時傳入 `priority: 'urgent-now'`，但 Schema 只允許 `low`、`medium` 或 `high`。哪種 Tool Error 最有用？",
    options: [
      { key: "A", en: "Return `isError: true` and identify the invalid field, received value, allowed values, and that the call was not executed.", zh: "回傳 `isError: true`，指出無效欄位、收到的值、允許值，以及此次呼叫尚未執行。" },
      { key: "B", en: "Return only 'Something went wrong.'",
        zh: "只回傳「發生錯誤」。" },
      { key: "C", en: "Silently convert the value to a random allowed priority.", zh: "把該值靜默轉成隨機允許的 Priority。" },
      { key: "D", en: "Report success and mention the invalid value only in a private log.", zh: "回報成功，只在內部 Log 記錄無效值。" }
    ],
    answers: ["A"],
    explanation: "可修正的 Validation Error 應指出哪個欄位錯誤、收到什麼值、合法值為何，以及是否已產生副作用。這讓 Claude 能調整參數後再呼叫，而不必猜測。錯誤內容應足夠具體但不得洩漏內部秘密或不必要的實作細節。",
    why: {
      A: "正確。訊息具體、可修正，並清楚標示尚未執行。",
      B: "模糊訊息無法告訴模型該修改哪個參數。",
      C: "靜默改值可能建立錯誤優先級，並破壞使用者意圖。",
      D: "回報成功會讓上層流程在錯誤狀態上繼續。"
    },
    terms: [["validation error", "驗證錯誤"], ["invalid field", "無效欄位"], ["allowed values", "允許值"], ["side effect", "外部副作用"], ["self-correction", "自我修正"]]
  },
  {
    id: 49,
    category: "mcp",
    title: "多 Agent 應如何分配工具？",
    type: "multiple",
    en: "A university assistant uses three specialists: a public-course researcher, a payroll analyst, and an account administrator. Which TWO tool-distribution practices are BEST?",
    zh: "大學助理系統使用三個專家 Agent：公開課程研究員、薪資分析員及帳號管理員。哪兩項 Tool Distribution 做法最好？",
    options: [
      { key: "A", en: "Give every specialist every tool so delegation never fails.", zh: "把所有工具交給每個專家，確保委派永不失敗。" },
      { key: "B", en: "Put administrator credentials in each delegation prompt.", zh: "在每個委派 Prompt 中放入管理員憑證。" },
      { key: "C", en: "Expose only the domain tools and permissions required by each specialist's task.", zh: "只向各專家公開其任務所需的領域工具與權限。" },
      { key: "D", en: "Have the orchestrator pass a scoped task and identifiers, then combine structured results without sharing unrelated credentials.", zh: "由 Orchestrator 傳遞範圍明確的任務與識別碼，再整合結構化結果，不分享無關憑證。" }
    ],
    answers: ["C", "D"],
    explanation: "每個 Agent 的 Tool Set 應依角色和目前任務縮到最小，讓公開資料研究員無法碰觸薪資或帳號管理功能。Orchestrator 應傳遞完成工作所需的目標、限制與識別碼，接收結構化結果後再整合。這同時降低工具選擇歧義、Context 成本與權限外溢。",
    why: {
      A: "所有 Agent 擁有全部工具會增加誤用、外洩及選擇錯誤。",
      B: "憑證不應放進 Prompt，也不應跨角色不必要地散布。",
      C: "正確。角色型最小工具集建立清楚能力與安全邊界。",
      D: "正確。明確委派和結構化回傳能維持責任分工。"
    },
    terms: [["tool distribution", "工具分配"], ["specialist agent", "專家 Agent"], ["orchestrator", "協調者"], ["scoped task", "範圍明確的任務"], ["permission boundary", "權限邊界"]]
  },
  {
    id: 50,
    category: "mcp",
    title: "必須呼叫指定工具時怎麼設？",
    type: "single",
    en: "A compliance workflow must call `validate_contract` on every submitted contract. Claude must not select a different tool or answer without validation. Which `tool_choice` setting is MOST appropriate?",
    zh: "法遵流程要求每份送出的合約都必須呼叫 `validate_contract`。Claude 不可改用其他工具，也不可未驗證就直接回答。哪個 `tool_choice` 設定最適合？",
    options: [
      { key: "A", en: "`{ type: 'auto' }`, allowing Claude to decide whether any tool is needed.", zh: "`{ type: 'auto' }`，讓 Claude 自行決定是否需要工具。" },
      { key: "B", en: "`{ type: 'any' }`, allowing any available tool to satisfy the requirement.", zh: "`{ type: 'any' }`，允許任一可用工具滿足要求。" },
      { key: "C", en: "`{ type: 'tool', name: 'validate_contract' }`, forcing that specific tool.", zh: "`{ type: 'tool', name: 'validate_contract' }`，強制使用該指定工具。" },
      { key: "D", en: "`{ type: 'none' }`, preventing all tool calls.", zh: "`{ type: 'none' }`，禁止所有工具呼叫。" }
    ],
    answers: ["C"],
    explanation: "`tool_choice` 的 `tool` 模式可強制 Claude 呼叫指定名稱的工具，適合不可省略且只有一個正確工具的驗證關卡。`any` 只保證會使用某個工具，`auto` 則可能完全不呼叫。實作時仍須確認所用模型及其他功能是否支援強制 Tool Choice。",
    why: {
      A: "Auto 允許模型直接回答，無法保證驗證一定發生。",
      B: "Any 可能讓模型選擇另一個不具驗證效果的工具。",
      C: "正確。它把不可省略的步驟綁定到確切工具。",
      D: "None 會禁止必要的合約驗證呼叫。"
    },
    terms: [["tool_choice", "工具選擇控制"], ["auto", "模型自行決定"], ["any", "強制任一工具"], ["tool", "強制指定工具"], ["none", "禁止工具"]]
  },
  {
    id: 51,
    category: "mcp",
    title: "不同 Worker 的 Tool Choice",
    type: "multiple",
    en: "A workflow has a catalog researcher that must query at least one of two read-only catalog tools, and a final editor that must only rewrite the supplied findings without calling tools. Which TWO configurations are appropriate?",
    zh: "某流程包含 Catalog Researcher，必須至少查詢兩個唯讀 Catalog Tool 之一；Final Editor 只能改寫已提供的研究結果，不得呼叫工具。哪兩種設定適合？",
    options: [
      { key: "A", en: "Force the editor to call an arbitrary catalog tool before it can write.", zh: "強制 Editor 在寫作前呼叫任意 Catalog Tool。" },
      { key: "B", en: "Give both workers all write-capable tools and use `auto` for both.", zh: "把所有可寫入工具交給兩個 Worker，兩者都使用 `auto`。" },
      { key: "C", en: "Expose only the two catalog tools to the researcher and use `tool_choice: any` when at least one call is mandatory.", zh: "只向 Researcher 公開兩個 Catalog Tool；至少需要一次呼叫時使用 `tool_choice: any`。" },
      { key: "D", en: "Set the final editor's `tool_choice` to `none` and do not expose unrelated tools.", zh: "把 Final Editor 的 `tool_choice` 設為 `none`，且不公開無關工具。" }
    ],
    answers: ["C", "D"],
    explanation: "Tool Distribution 與 `tool_choice` 應一起反映每個 Worker 的責任。Researcher 只需要兩個唯讀查詢工具，且 `any` 可要求至少使用其中之一；Editor 的輸入已完整，應使用 `none` 避免不必要的外部動作。這比讓所有 Agent 共用寬廣工具集更可預測。",
    why: {
      A: "無關 Tool Call 只增加延遲與 Context，無法提升編輯品質。",
      B: "不必要的寫入能力增加風險，也讓工具選擇更模糊。",
      C: "正確。最小工具集搭配 Any 能保證 Researcher 至少執行一次相關查詢。",
      D: "正確。Editor 沒有工具需求，禁止 Tool Call 可維持純文字責任。"
    },
    terms: [["worker", "工作 Agent"], ["read-only tool", "唯讀工具"], ["tool_choice: any", "強制任一工具"], ["tool_choice: none", "禁止工具"], ["minimum tool set", "最小工具集"]]
  },
  {
    id: 52,
    category: "mcp",
    title: "團隊共用 MCP Server 設定",
    type: "single",
    en: "A team wants the same approved issue-tracker MCP server to be available whenever anyone opens the repository in Claude Code. Machine-specific credentials must not be committed. What is the BEST setup?",
    zh: "團隊希望任何人用 Claude Code 開啟 Repository 時，都能使用同一個核准的 Issue Tracker MCP Server，但不能提交各機器的憑證。最佳設定方式是什麼？",
    options: [
      { key: "A", en: "Paste the server command and API key into every chat session.", zh: "每個工作階段都把 Server Command 與 API Key 貼進對話。" },
      { key: "B", en: "Store the API key directly in a committed `CLAUDE.md` file.", zh: "把 API Key 直接存進提交到 Git 的 `CLAUDE.md`。" },
      { key: "C", en: "Configure the server only at user scope on one developer's machine.", zh: "只在某位開發者的電腦設定 User Scope Server。" },
      { key: "D", en: "Use a project-scoped `.mcp.json` committed at the repository root, reference credentials through environment variables, and let each user approve the project server.", zh: "在 Repository Root 提交 Project-scoped `.mcp.json`，透過環境變數引用憑證，並讓每位使用者核准該 Project Server。" }
    ],
    answers: ["D"],
    explanation: "Claude Code 的 Project-scoped MCP 設定存放於 Repository Root 的 `.mcp.json`，適合讓團隊共享 Server 定義。秘密應由各使用者的環境或核准的驗證流程提供，而不是寫入版本控制。Project Server 首次使用仍應由使用者審查並核准。",
    why: {
      A: "每次手動貼上容易不一致，也會把秘密送入模型 Context。",
      B: "CLAUDE.md 會進入版本控制與 Context，不應存放 API Key。",
      C: "User Scope 不會把設定隨 Repository 分享給整個團隊。",
      D: "正確。它兼顧團隊一致設定、秘密隔離及使用者核准。"
    },
    terms: [[".mcp.json", "專案 MCP 設定檔"], ["project scope", "專案範圍"], ["environment variable", "環境變數"], ["version control", "版本控制"], ["project approval", "專案 Server 核准"]]
  },
  {
    id: 53,
    category: "mcp",
    title: "MCP 已連線但沒有工具",
    type: "multiple",
    en: "Claude Code shows that a project MCP server is configured, but no tools are available. Which TWO diagnostic steps are MOST appropriate?",
    zh: "Claude Code 顯示 Project MCP Server 已設定，但沒有任何 Tool 可用。哪兩個診斷步驟最適合？",
    options: [
      { key: "A", en: "Rewrite the user's prompt repeatedly until tools appear.", zh: "反覆改寫使用者 Prompt，直到 Tool 出現。" },
      { key: "B", en: "Run Claude Code with MCP debug logging and inspect server stderr, command paths, arguments, and required environment variables.", zh: "以 MCP Debug Logging 啟動 Claude Code，檢查 Server stderr、Command Path、Arguments 與必要環境變數。" },
      { key: "C", en: "Use `/mcp` to inspect connection status, approval state, and the server's advertised tools, then reconnect if appropriate.", zh: "使用 `/mcp` 檢查連線狀態、核准狀態及 Server 宣告的 Tool，適當時重新連線。" },
      { key: "D", en: "Add administrator credentials before checking whether the server started successfully.", zh: "尚未確認 Server 是否成功啟動，就先加入管理員憑證。" }
    ],
    answers: ["B", "C"],
    explanation: "MCP Integration 問題應先區分設定未載入、尚未核准、Server 啟動失敗、連線失敗，或 Server 回傳空 Tool List。`/mcp` 提供狀態與能力檢視，Debug Log 和 stderr 則能揭露路徑、參數或環境錯誤。先取得證據再修改設定，避免以擴大權限掩蓋真正原因。",
    why: {
      A: "Tool Discovery 失敗不是靠改寫任務 Prompt 就能修復的。",
      B: "正確。啟動與協定錯誤通常可從 MCP Debug 與 Server stderr 定位。",
      C: "正確。它先確認 Claude Code 看到的連線、核准與 Tool 狀態。",
      D: "過度授權既危險，也無法解決錯誤 Command 或空 Tool List。"
    },
    terms: [["/mcp", "MCP 狀態介面"], ["debug logging", "除錯紀錄"], ["stderr", "標準錯誤輸出"], ["tool discovery", "工具探索"], ["approval state", "核准狀態"]]
  },
  {
    id: 54,
    category: "mcp",
    title: "審查 Repository 內的 MCP 設定",
    type: "single",
    en: "A developer checks out an unfamiliar branch containing a new project-scoped `.mcp.json` that launches a local command. What should happen BEFORE Claude Code uses that server?",
    zh: "開發者 Checkout 一個不熟悉的 Branch，其中新增 Project-scoped `.mcp.json`，會啟動本機 Command。Claude Code 使用該 Server 前應先做什麼？",
    options: [
      { key: "A", en: "Automatically approve every project server because the file is in Git.", zh: "因為檔案在 Git 中，所以自動核准所有 Project Server。" },
      { key: "B", en: "Move all machine credentials into the committed `.mcp.json` for convenience.", zh: "為了方便，把所有機器憑證移進提交的 `.mcp.json`。" },
      { key: "C", en: "Review the command or endpoint, arguments, environment references, and expected tools; approve only the intended server and retain normal tool permissions.", zh: "審查 Command 或 Endpoint、Arguments、環境變數引用及預期 Tool；只核准符合預期的 Server，並保留一般 Tool Permission。" },
      { key: "D", en: "Disable all confirmation and permission checks so integration testing is faster.", zh: "停用所有確認與權限檢查，讓整合測試更快。" }
    ],
    answers: ["C"],
    explanation: "Repository 內容可能被 Branch 或 Pull Request 修改，因此 Project-scoped MCP Server 不能因進入版本控制就自動受信任。使用者應審查它會執行的 Command、連線 Endpoint、參數、秘密引用與公開能力，再作一次性核准。連線核准也不等於核准所有後續高風險 Tool Call。",
    why: {
      A: "Git 來源不保證內容安全，惡意 Branch 也能修改 `.mcp.json`。",
      B: "提交憑證會造成秘密外洩，並讓所有 Clone 都取得相同權限。",
      C: "正確。它在啟動外部程式前建立明確信任與能力審查。",
      D: "停用防護會把整合錯誤或惡意設定直接轉成外部副作用。"
    },
    terms: [["project-scoped server", "專案範圍 Server"], ["trust review", "信任審查"], ["endpoint", "連線端點"], ["tool permission", "工具權限"], ["secret reference", "秘密引用"]]
  },
  {
    id: 55,
    category: "mcp",
    title: "大型專案中如何找目標程式？",
    type: "single",
    en: "In Claude Code, you need to locate every TypeScript file named `*Controller.ts` that contains the symbol `legacyAuth`, then inspect the matching files without changing them. Which built-in tool sequence is BEST?",
    zh: "在 Claude Code 中，你要找出所有檔名符合 `*Controller.ts` 且內容包含 `legacyAuth` Symbol 的 TypeScript 檔案，再查看符合的檔案，但不修改。哪個 Built-in Tool 順序最好？",
    options: [
      { key: "A", en: "Use Glob to find matching filenames, Grep to search their contents, and Read only the relevant files or sections.", zh: "使用 Glob 尋找符合檔名，Grep 搜尋內容，再只 Read 相關檔案或區段。" },
      { key: "B", en: "Use Write to recreate every controller in a temporary directory.", zh: "使用 Write 在暫存目錄重建每個 Controller。" },
      { key: "C", en: "Use Edit on every TypeScript file before searching.", zh: "搜尋前先對每個 TypeScript 檔案使用 Edit。" },
      { key: "D", en: "Use Bash to delete generated files and see which imports fail.", zh: "使用 Bash 刪除產生檔，再觀察哪些 Import 失敗。" }
    ],
    answers: ["A"],
    explanation: "Glob 適合依路徑或檔名 Pattern 找檔案，Grep 適合依文字或 Regex 搜尋內容，Read 則用來查看已縮小範圍的檔案。這個順序採漸進式探索，避免把整個 Codebase 一次載入 Context。任務是唯讀查找，不需要 Write、Edit 或具副作用的 Bash。",
    why: {
      A: "正確。三個唯讀工具分別處理檔名探索、內容搜尋及精確閱讀。",
      B: "Write 會建立或覆寫檔案，與唯讀查找目標無關。",
      C: "尚未定位目標就修改所有檔案，風險高且沒有必要。",
      D: "刪檔是破壞性方法，不能用來取代安全的 Code Search。"
    },
    terms: [["Glob", "依 Pattern 找檔案"], ["Grep", "搜尋檔案內容"], ["Read", "讀取檔案"], ["progressive discovery", "漸進式探索"], ["read-only", "唯讀"]]
  },
  {
    id: 56,
    category: "mcp",
    title: "精確修改後執行測試",
    type: "multiple",
    en: "Claude Code must change two known lines in an existing configuration file and then run the repository's test command. Which TWO tool choices are MOST appropriate?",
    zh: "Claude Code 必須修改現有設定檔中已知的兩行，之後執行 Repository 的 Test Command。哪兩種 Tool Choice 最適合？",
    options: [
      { key: "A", en: "Use Write immediately to replace the entire file without reading it.", zh: "不先讀取，立刻使用 Write 取代整個檔案。" },
      { key: "B", en: "Use Read to verify the current content, then Edit for the targeted replacement.", zh: "使用 Read 確認目前內容，再用 Edit 進行目標式替換。" },
      { key: "C", en: "Use Grep as if it were a file-modification tool.", zh: "把 Grep 當成檔案修改工具使用。" },
      { key: "D", en: "Use Bash for the actual test command after the edit, and evaluate its exit status and output.", zh: "修改後使用 Bash 執行實際 Test Command，並檢查 Exit Status 與輸出。" }
    ],
    answers: ["B", "D"],
    explanation: "對既有檔案的小範圍修改，先 Read 目前內容，再用 Edit 精確替換，能避免覆蓋使用者的其他變更。Bash 適合執行測試、建置及其他 Shell Command，完成後必須依 Exit Status 與輸出判定結果。Write 更適合建立新檔或有意完整覆寫內容，而不是未讀取就取代現有檔案。",
    why: {
      A: "未讀取就完整覆寫可能刪除不相關內容或使用者尚未提交的變更。",
      B: "正確。Read 加 Edit 適合已知位置的安全、目標式修改。",
      C: "Grep 是內容搜尋工具，不能修改檔案。",
      D: "正確。Bash 執行真實測試，Exit Status 提供可驗證結果。"
    },
    terms: [["Read", "讀取檔案"], ["Edit", "目標式編輯"], ["Write", "建立或完整覆寫檔案"], ["Bash", "執行 Shell Command"], ["exit status", "結束狀態"]]
  },
  {
    id: 57,
    category: "context",
    title: "Messages API 會自動記住上一輪嗎？",
    type: "single",
    en: "An application sends one Messages API request in which a user approves a migration plan. On the next request, the application sends only 'Proceed,' and Claude no longer knows which plan was approved. The team assumed the API would remember earlier requests by API key. What is the BEST correction?",
    zh: "應用程式在第一個 Messages API Request 中讓使用者核准遷移計畫。下一個 Request 只送出「繼續」，Claude 因而不知道核准的是哪個計畫。團隊原本假設 API 會依 API Key 自動記住先前 Request。最佳修正方式是什麼？",
    options: [
      { key: "A", en: "Reuse the same API key and model name; the service will reconstruct the prior conversation automatically.", zh: "重用相同 API Key 與 Model Name；服務會自動重建先前對話。" },
      { key: "B", en: "Ask Claude to infer the approved plan from the word 'Proceed.'",
        zh: "讓 Claude 根據「繼續」自行推測已核准的計畫。" },
      { key: "C", en: "Put the approved plan into the tool name so it remains available to all future calls.", zh: "把已核准計畫放進 Tool Name，讓所有未來呼叫都能取得。" },
      { key: "D", en: "Have the application persist the relevant message history or external conversation state and include the approved plan, constraints, and recent turns in each subsequent request.", zh: "由應用程式保存相關 Message History 或外部 Conversation State，並在每個後續 Request 重新提供已核准計畫、限制與近期對話。" }
    ],
    answers: ["D"],
    explanation: "Messages API Request 本身是無狀態的；API Key 用於驗證與計費，不會隱含某段對話記憶。應用程式必須保存 Message History、摘要或結構化外部狀態，並在下一次 Request 明確重送完成推理所需的先前 Context。重送內容可以精簡，但核准目標、限制及不可猜測的關鍵狀態必須保留。",
    why: {
      A: "API Key 不代表 Conversation ID，也不會讓獨立 Request 自動共享歷史。",
      B: "「繼續」沒有足夠資訊可辨識核准版本，猜測可能執行錯誤計畫。",
      C: "Tool Name 是介面識別碼，不是保存每位使用者會話狀態的位置。",
      D: "正確。狀態由應用程式持久保存，並在每次無狀態呼叫時明確提供。"
    },
    terms: [["stateless", "無狀態"], ["Messages API", "訊息 API"], ["message history", "訊息歷史"], ["application state", "應用程式狀態"], ["context replay", "Context 重送"], ["API key", "API 金鑰"]]
  },
  {
    id: 58,
    category: "context",
    title: "Compaction 後如何不中斷工作？",
    type: "multiple",
    en: "A long-running migration agent is approaching its context limit and must compact its conversation. Which TWO practices BEST preserve continuity?",
    zh: "長時間執行的系統遷移 Agent 即將達到 Context 上限，必須壓縮對話。哪兩項做法最能維持工作連續性？",
    options: [
      { key: "A", en: "Preserve the objective, acceptance criteria, constraints, decisions, modified files, exact failures, unresolved risks, and next steps in a structured continuation summary.", zh: "在結構化接續摘要中保留目標、驗收條件、限制、決策、已修改檔案、確切失敗、未解風險與下一步。" },
      { key: "B", en: "Keep only the last assistant sentence because recent text is always sufficient.", zh: "只保留最後一個 Assistant Sentence，因為近期文字一定足夠。" },
      { key: "C", en: "Treat the generated summary as a lossless database and delete all external artifacts.", zh: "把產生的摘要視為無損資料庫，並刪除所有外部成果。" },
      { key: "D", en: "Persist exact critical values and checkpoints outside the context window, then rehydrate them when work resumes.", zh: "在 Context Window 外持久保存確切關鍵值與 Checkpoint，工作恢復時再載入。" }
    ],
    answers: ["A", "D"],
    explanation: "Compaction 應保留能讓下一段工作安全延續的高價值狀態，而不只是一般摘要。精確識別碼、驗證結果、檔案與 Checkpoint 應保存在外部可靠來源，因為自然語言摘要可能遺漏細節。恢復時將這些狀態與結構化摘要一起載入，可避免重做或違反既有決策。",
    why: {
      A: "正確。接續摘要包含完成任務所需的決策、證據與待辦狀態。",
      B: "最後一句通常沒有足夠背景，會遺失限制及已完成工作。",
      C: "摘要是有損壓縮，不能取代精確資料與已產生的 Artifact。",
      D: "正確。外部持久狀態可跨 Context Reset 保存不可猜測的細節。"
    },
    terms: [["compaction", "Context 壓縮"], ["continuation summary", "接續摘要"], ["checkpoint", "檢查點"], ["rehydrate", "重新載入狀態"], ["persistent artifact", "持久成果"]]
  },
  {
    id: 59,
    category: "context",
    title: "需求中的『舊帳號』不明確",
    type: "single",
    en: "A user says, 'Delete my old account.' The system finds two inactive accounts with similar names, and deletion is irreversible. What should the agent do?",
    zh: "使用者說：「刪除我的舊帳號。」系統找到兩個名稱相近的停用帳號，而且刪除不可逆。Agent 應該怎麼做？",
    options: [
      { key: "A", en: "Delete the account that has been inactive the longest.", zh: "刪除停用時間最久的帳號。" },
      { key: "B", en: "Delete both accounts because the user used the plural concept of old data.", zh: "刪除兩個帳號，因為使用者提到的是舊資料概念。" },
      { key: "C", en: "Pause, present the non-sensitive identifiers and consequences, and ask the user to select the exact target before proceeding.", zh: "暫停，顯示不敏感的識別資訊與後果，請使用者選定確切目標後再繼續。" },
      { key: "D", en: "Choose one silently and apologize only if the user notices.", zh: "靜默選一個；若使用者發現再道歉。" }
    ],
    answers: ["C"],
    explanation: "當目標有多種合理解讀，而且操作不可逆時，Agent 不應自行補完關鍵意圖。它應清楚說明歧義、提供足以辨識但不過度暴露的選項，並在執行前取得明確選擇。這是必要的 Clarification，不是無謂地把所有決策推回使用者。",
    why: {
      A: "停用時間不是使用者指定的判準，可能刪除錯誤帳號。",
      B: "使用者沒有明確要求刪除兩個目標，範圍被不當擴大。",
      C: "正確。高影響且有歧義的操作必須先釐清目標與後果。",
      D: "靜默猜測不可逆操作違反使用者意圖，也無法事後完整補救。"
    },
    terms: [["ambiguity", "歧義"], ["clarification", "釐清問題"], ["irreversible action", "不可逆操作"], ["exact target", "確切目標"], ["user intent", "使用者意圖"]]
  },
  {
    id: 60,
    category: "context",
    title: "證據不足時何時升級？",
    type: "multiple",
    en: "An employee-benefits agent finds incomplete records and cannot determine whether an expensive medical claim is eligible. Which TWO behaviors are MOST reliable?",
    zh: "員工福利 Agent 發現紀錄不完整，無法判定一筆高額醫療理賠是否符合資格。哪兩種行為最可靠？",
    options: [
      { key: "A", en: "Approve the claim because helping the user is more important than uncertainty.", zh: "核准理賠，因為協助使用者比不確定性更重要。" },
      { key: "B", en: "State what evidence is missing, ask a targeted clarification when the user can supply it, and avoid presenting an unsupported conclusion.", zh: "指出缺少哪些證據；若使用者能提供便提出針對性問題，且不把無根據判斷說成結論。" },
      { key: "C", en: "Hide uncertainty and choose the most common outcome from past cases.", zh: "隱藏不確定性，依過去最常見結果作決定。" },
      { key: "D", en: "Escalate to an authorized reviewer with a concise packet containing known facts, missing evidence, attempted checks, and the decision required.", zh: "將案件升級給授權 Reviewer，附上已知事實、缺少證據、已執行檢查及待決事項的精簡資料包。" }
    ],
    answers: ["B", "D"],
    explanation: "高風險決策缺少必要證據時，可靠行為是承認限制並優先取得可補充的資訊。若資料仍不足或判斷需要正式授權，Agent 應帶著結構化 Context 升級，而不是只說「無法處理」。良好的 Escalation 讓 Reviewer 能直接接手，不必重新探索全部歷史。",
    why: {
      A: "善意不能取代資格證據與正式授權，高額錯誤可能造成重大損失。",
      B: "正確。它校準不確定性並以最小必要問題嘗試解除歧義。",
      C: "隱藏證據缺口會製造虛假確定性，常見結果也不代表本案正確。",
      D: "正確。結構化升級保留進度，並把決策交給有權限的人。"
    },
    terms: [["escalation", "升級處理"], ["missing evidence", "缺少證據"], ["targeted clarification", "針對性釐清"], ["authorized reviewer", "授權審查者"], ["unsupported conclusion", "無證據結論"]]
  },
  {
    id: 61,
    category: "context",
    title: "Subagent 失敗不能變成功",
    type: "single",
    en: "A test-runner subagent cannot start the integration environment and therefore runs no tests. What should it return to the orchestrator?",
    zh: "Test-runner Subagent 無法啟動 Integration Environment，因此完全沒有執行測試。它應回傳什麼給 Orchestrator？",
    options: [
      { key: "A", en: "A structured failure stating that zero tests ran, the exact blocking error, relevant evidence, what was attempted, and whether a safe retry or human action is needed.", zh: "回傳結構化失敗：零項測試已執行、確切 Blocking Error、相關證據、已嘗試步驟，以及是否需要安全重試或人工處理。" },
      { key: "B", en: "A success result because no failing tests were observed.", zh: "回傳成功，因為沒有觀察到失敗測試。" },
      { key: "C", en: "Only the phrase 'environment issue' with no status or evidence.", zh: "只回傳「環境問題」，不提供狀態或證據。" },
      { key: "D", en: "A fabricated test summary so downstream agents can continue.", zh: "編造測試摘要，讓下游 Agent 能繼續。" }
    ],
    answers: ["A"],
    explanation: "「沒有發現失敗」與「成功完成測試」不是同一件事；測試未執行必須明確標成失敗或阻塞。Subagent 應把狀態、原因、證據、嘗試過的方法與下一步傳回 Orchestrator。如此上層才不會依假成功結果進行部署或發布。",
    why: {
      A: "正確。它保留失敗語意與診斷 Context，讓上層能安全決策。",
      B: "零項測試不能推導出品質通過，這是典型的靜默失敗。",
      C: "資訊不足會迫使 Orchestrator 重做調查或錯誤重試。",
      D: "編造結果會污染整條 Agent Chain，並讓驗證關卡失效。"
    },
    terms: [["error propagation", "錯誤傳播"], ["blocked status", "阻塞狀態"], ["zero tests", "零項測試"], ["orchestrator", "協調者"], ["silent failure", "靜默失敗"]]
  },
  {
    id: 62,
    category: "context",
    title: "跨 Agent 的未知操作狀態",
    type: "multiple",
    en: "A payment worker times out after submitting a request, so it does not know whether the external service completed the charge. Which TWO behaviors should the multi-agent workflow use?",
    zh: "Payment Worker 送出 Request 後逾時，因此不知道外部服務是否已完成扣款。多 Agent 工作流程應採用哪兩種行為？",
    options: [
      { key: "A", en: "Report success because the request left the worker process.", zh: "因為 Request 已離開 Worker Process，所以回報成功。" },
      { key: "B", en: "Report failure and immediately create a different payment request without checking status.", zh: "回報失敗，且不檢查狀態就立即建立另一筆付款。" },
      { key: "C", en: "Propagate an `unknown` operation state with the correlation or operation ID and the evidence available at timeout.", zh: "傳播 `unknown` 操作狀態，包含 Correlation／Operation ID 與逾時當下可用證據。" },
      { key: "D", en: "Have the orchestrator stop dependent steps, reconcile status or retry only through a safe mechanism, and escalate if ambiguity remains.", zh: "由 Orchestrator 停止相依步驟，先核對狀態或只透過安全機制重試；若仍不明則升級處理。" }
    ],
    answers: ["C", "D"],
    explanation: "Timeout 只代表 Worker 沒收到結果，不代表外部操作一定失敗或成功，因此必須保留 `unknown` 狀態。Correlation ID 與現有證據讓 Orchestrator 能查詢或核對原操作，並阻止下游步驟建立在假設上。只有能確認安全時才重試，否則應交由人工處理。",
    why: {
      A: "Request 已送出不等於外部服務已成功 Commit。",
      B: "新付款可能造成重複扣款，且掩蓋原操作的未知狀態。",
      C: "正確。它忠實保留不確定性與跨 Agent 追蹤資訊。",
      D: "正確。上層以 Gate、Reconciliation 與 Escalation 防止錯誤擴散。"
    },
    terms: [["unknown state", "未知狀態"], ["error propagation", "錯誤傳播"], ["correlation ID", "關聯識別碼"], ["reconciliation", "狀態核對"], ["dependent step", "相依步驟"]]
  },
  {
    id: 63,
    category: "context",
    title: "大型 Codebase 如何縮小範圍？",
    type: "single",
    en: "Claude Code must understand how authentication flows through a repository with 30,000 files. Loading the entire repository would overwhelm the main context. What is the BEST first approach?",
    zh: "Claude Code 必須理解 Authentication 如何流經一個含 30,000 個檔案的 Repository。把整個 Repository 載入會淹沒 Main Context。最佳起始方式是什麼？",
    options: [
      { key: "A", en: "Read every file alphabetically before forming a question.", zh: "在形成問題前，依字母順序讀取每個檔案。" },
      { key: "B", en: "Ask Claude to infer the architecture from the repository name.", zh: "讓 Claude 根據 Repository Name 推測架構。" },
      { key: "C", en: "Map the repository structure, use Glob and Grep to identify entry points and symbols, then Read targeted files and expand only along relevant dependencies.", zh: "先建立 Repository 結構概觀，使用 Glob 與 Grep 找出 Entry Point 和 Symbol，再 Read 目標檔案，只沿相關相依關係擴展。" },
      { key: "D", en: "Copy every source file into one giant prompt in random order.", zh: "把每個 Source File 以隨機順序複製到一個巨大 Prompt。" }
    ],
    answers: ["C"],
    explanation: "大型 Codebase 應採漸進式探索：先看目錄、設定與入口，再以 Symbol Search 找到關聯檔案，最後沿 Call Path 或 Import 擴展。這能讓 Context 保持精簡且保留架構關係，而不是只依檔案順序堆疊文字。調查中還應記錄已確認的路徑與仍待驗證的假設。",
    why: {
      A: "依字母讀取大量檔案既浪費 Context，也不反映程式相依關係。",
      B: "Repository Name 無法提供可驗證的實際控制流程。",
      C: "正確。結構探索、搜尋與目標閱讀能逐步建立高訊號架構圖。",
      D: "隨機的大量內容會造成 Context Pollution，且難以追蹤來源。"
    },
    terms: [["large codebase", "大型程式庫"], ["entry point", "入口點"], ["symbol search", "符號搜尋"], ["dependency", "相依關係"], ["context pollution", "Context 污染"]]
  },
  {
    id: 64,
    category: "context",
    title: "大型程式庫如何使用 Subagent？",
    type: "multiple",
    en: "A monorepo contains independent authentication, billing, and notification services. The lead agent needs an architecture report without filling its context with every search and file read. Which TWO practices are BEST?",
    zh: "Monorepo 包含彼此獨立的 Authentication、Billing 與 Notification Service。Lead Agent 需要架構報告，但不能讓每次搜尋與檔案讀取塞滿自己的 Context。哪兩項做法最好？",
    options: [
      { key: "A", en: "Delegate each independent service to a scoped subagent with a clear question, relevant paths, and a required summary format.", zh: "把每個獨立 Service 委派給範圍明確的 Subagent，提供清楚問題、相關 Path 與必要摘要格式。" },
      { key: "B", en: "Have every subagent return its complete transcript and every file it read.", zh: "要求每個 Subagent 回傳完整 Transcript 與讀過的所有檔案。" },
      { key: "C", en: "Require concise findings with file or symbol evidence, interfaces, dependencies, uncertainties, and unresolved questions for the lead agent to synthesize.", zh: "要求回傳精簡 Findings，包含 File／Symbol 證據、介面、相依性、不確定性與待解問題，再由 Lead Agent 整合。" },
      { key: "D", en: "Let several subagents edit the same shared files while they are still exploring.", zh: "讓多個 Subagent 在探索期間同時編輯相同 Shared File。" }
    ],
    answers: ["A", "C"],
    explanation: "彼此獨立的模組適合放進不同 Subagent Context，讓大量搜尋與閱讀停留在 Worker 端。Lead Agent 只接收具證據的精簡摘要，再比較跨服務介面與相依性。若回傳完整 Transcript 或讓多人同時修改同檔案，會失去 Context Isolation 並增加衝突。",
    why: {
      A: "正確。清楚 Scope 與輸出合約讓各 Subagent 專注於獨立領域。",
      B: "完整 Transcript 會把被隔離的高容量內容重新灌回 Main Context。",
      C: "正確。摘要保留可查證證據與不確定性，同時降低 Token 負擔。",
      D: "探索階段共享寫入會造成 Merge Conflict 與責任不清。"
    },
    terms: [["context isolation", "Context 隔離"], ["subagent", "子 Agent"], ["monorepo", "單一大型 Repository"], ["evidence-backed summary", "有證據摘要"], ["synthesis", "整合"]]
  },
  {
    id: 65,
    category: "context",
    title: "低信心的高額核准",
    type: "single",
    en: "An agent recommends approving a $200,000 exception, but its evidence is incomplete and similar cases in evaluation data are often misclassified. What is the BEST next step?",
    zh: "Agent 建議核准一筆 20 萬美元的例外案件，但證據不完整，而且 Evaluation Data 顯示類似案例經常被誤判。最佳下一步是什麼？",
    options: [
      { key: "A", en: "Approve automatically because the agent used a confident tone.", zh: "自動核准，因為 Agent 語氣很有信心。" },
      { key: "B", en: "Raise the displayed confidence score until it exceeds the release threshold.", zh: "提高顯示的 Confidence Score，直到超過 Release Threshold。" },
      { key: "C", en: "Hide the missing evidence so the reviewer is not biased.", zh: "隱藏缺少的證據，以免 Reviewer 受到偏見影響。" },
      { key: "D", en: "Route the case to an authorized human reviewer with the recommendation, supporting evidence, missing information, uncertainty, and possible impact clearly shown.", zh: "將案件交給授權 Human Reviewer，清楚呈現建議、支持證據、缺少資訊、不確定性與可能影響。" }
    ],
    answers: ["D"],
    explanation: "Human Review 的需求應由任務風險、證據品質與經實測的可靠度共同決定，而不是看模型語氣是否自信。高金額且證據不全的例外案件應交由有權限的人作最後決定。Review Packet 必須讓人看見支持與反對證據、缺口及預期影響。",
    why: {
      A: "流暢、自信的文字不代表機率已校準或證據充分。",
      B: "修改顯示分數不會改善模型在相似案例上的真實正確率。",
      C: "隱藏證據缺口會妨礙 Reviewer 作出知情決定。",
      D: "正確。高風險、低可靠度決策需要透明且具授權的人工審查。"
    },
    terms: [["human review", "人工審查"], ["confidence calibration", "信心校準"], ["high-stakes decision", "高風險決策"], ["evidence gap", "證據缺口"], ["review packet", "審查資料包"]]
  },
  {
    id: 66,
    category: "context",
    title: "如何設定 Human Review 門檻？",
    type: "multiple",
    en: "A team is designing confidence-based routing for an agent that classifies safety incidents. Which TWO practices are MOST reliable?",
    zh: "團隊正為安全事件分類 Agent 設計 Confidence-based Routing。哪兩項做法最可靠？",
    options: [
      { key: "A", en: "Treat any numerical confidence emitted by the model as a calibrated probability without testing it.", zh: "未經測試就把模型產生的任何數字信心視為已校準機率。" },
      { key: "B", en: "Choose auto-accept, clarification, and human-review thresholds from representative evaluation results and the cost of each error type.", zh: "根據代表性 Evaluation Result 與各類錯誤成本，設定自動接受、釐清及 Human Review Threshold。" },
      { key: "C", en: "Show reviewers the relevant evidence, alternative interpretations, and uncertainty, and record their final decision for audit and future evaluation.", zh: "向 Reviewer 顯示相關證據、替代解讀與不確定性，並記錄最終決定供稽核及後續評估。" },
      { key: "D", en: "Use one universal threshold for every category, severity, and business consequence.", zh: "所有分類、嚴重度與商業後果都使用同一個通用 Threshold。" }
    ],
    answers: ["B", "C"],
    explanation: "Confidence Routing 必須以實際 Eval 表現校準，並考量 False Positive 與 False Negative 在各風險層級的不同成本。Reviewer 需要可查證證據與替代解讀，而不是只看單一分數。記錄人工決定還能用來持續檢查門檻是否合理。",
    why: {
      A: "模型自報分數不一定與真實正確率一致，必須以資料校準。",
      B: "正確。Eval 與風險成本能把門檻連結到真實失敗模式。",
      C: "正確。透明證據與 Audit Trail 支援有效監督和後續改善。",
      D: "不同錯誤的影響不同，單一門檻可能過度自動化高風險案例。"
    },
    terms: [["confidence threshold", "信心門檻"], ["calibration", "校準"], ["false positive", "偽陽性"], ["false negative", "偽陰性"], ["audit trail", "稽核軌跡"]]
  },
  {
    id: 67,
    category: "context",
    title: "Synthesizer 把保留語氣洗成事實",
    type: "single",
    en: "A research subagent reports, 'The new process may reduce latency, but this is a low-confidence inference from one chart; the source never states the conclusion directly.' The synthesizer rewrites it as, 'The new process reduces latency.' Which design BEST prevents this failure?",
    zh: "Research Subagent 回報：「新流程可能降低延遲，但這只是根據一張圖表作出的低信心推論；來源從未直接陳述此結論。」Synthesizer 卻改寫成：「新流程會降低延遲。」哪種設計最能防止這種失敗？",
    options: [
      { key: "A", en: "Require each finding to carry claim-level source IDs, evidence spans, a direct-versus-derived flag, confidence and limitations; prevent the synthesizer from promoting a derived claim to fact without new evidence.", zh: "要求每項 Finding 攜帶 Claim-level Source ID、Evidence Span、Direct／Derived Flag、Confidence 與限制；沒有新證據時，禁止 Synthesizer 把 Derived Claim 提升為事實。" },
      { key: "B", en: "Remove hedging from all subagent reports so the final prose sounds consistent.", zh: "移除所有 Subagent Report 的保留語氣，讓最終文字聽起來一致。" },
      { key: "C", en: "Keep only the conclusion text and discard evidence metadata to reduce token usage.", zh: "只保留結論文字並丟棄 Evidence Metadata，以減少 Token。" },
      { key: "D", en: "Treat any claim repeated by the same subagent in two messages as independently corroborated.", zh: "同一 Subagent 在兩則訊息重複某 Claim，就把它視為已獲獨立佐證。" }
    ],
    answers: ["A"],
    explanation: "跨 Agent 傳遞 Finding 時，Provenance 不能只停留在整份報告層級，而應附著於個別 Claim。`derived`、低信心、Evidence Span 與限制等 Metadata 必須一路保留到最終輸出；Synthesizer 只能在取得額外直接證據後提高確定性。否則摘要與潤稿會逐層洗掉 Hedge，將合理推論錯誤呈現為已證實事實。",
    why: {
      A: "正確。Claim-level Metadata 讓 Synthesizer 繼承證據強度，而不是只繼承流暢結論。",
      B: "刪除 Hedge 會製造虛假確定性，掩蓋原 Agent 的證據限制。",
      C: "沒有 Evidence 與 Derived Flag，最終 Agent 無法驗證或正確校準主張。",
      D: "同一來源的重複不是獨立 Corroboration，也不會增加證據品質。"
    },
    terms: [["claim-level provenance", "主張層級來源脈絡"], ["derived claim", "推導主張"], ["evidence span", "證據片段"], ["hedge", "保留語氣"], ["confidence preservation", "信心程度保留"], ["corroboration", "獨立佐證"]]
  },
  {
    id: 68,
    category: "context",
    title: "研究報告如何表達不確定性？",
    type: "multiple",
    en: "Several research agents return findings from sources of uneven quality. Some claims are directly supported, some are reasonable inferences, and one major claim has no source. Which TWO synthesis practices are BEST?",
    zh: "數個 Research Agent 從品質不一的來源回傳 Findings。有些 Claim 有直接支持、有些只是合理 Inference，另有一個重要 Claim 完全沒有來源。哪兩種整合做法最好？",
    options: [
      { key: "A", en: "Maintain a claim-to-source map, cite direct support, label inferences separately, and preserve source quality and date metadata.", zh: "維護 Claim-to-Source Map、引用直接支持、分開標示 Inference，並保留來源品質與日期 Metadata。" },
      { key: "B", en: "Remove citations so all findings appear equally certain.", zh: "移除 Citation，讓所有 Findings 看起來同樣確定。" },
      { key: "C", en: "Repeat the unsupported claim in several sections so it appears corroborated.", zh: "在多個章節重複無來源 Claim，讓它看起來受到交叉支持。" },
      { key: "D", en: "Mark the unsupported claim as unresolved, seek additional evidence or exclude it, and surface material disagreements rather than forcing consensus.", zh: "把無來源 Claim 標為未解，尋找額外證據或排除，並呈現重大分歧，而非強迫形成共識。" }
    ],
    answers: ["A", "D"],
    explanation: "可靠的 Multi-source Synthesis 應讓讀者分辨直接事實、模型推論與尚未證實的主張，且每項關鍵結論都能追溯到實際來源。多個 Agent 重複同一無根據說法不構成獨立佐證。證據不足或來源衝突時，應保留不確定性、繼續查證或省略該結論。",
    why: {
      A: "正確。Claim-level Provenance 與類型標示讓報告可驗證且不誇大證據。",
      B: "移除 Citation 會隱藏來源品質差異並製造虛假確定性。",
      C: "重複不是獨立證據，還可能把單一錯誤放大成 Agent 共識。",
      D: "正確。它把未解問題與分歧透明呈現，避免無證據定論。"
    },
    terms: [["claim-to-source map", "主張與來源對照"], ["direct support", "直接支持"], ["inference", "推論"], ["uncertainty", "不確定性"], ["corroboration", "交叉佐證"], ["unresolved claim", "未解主張"]]
  }
];
