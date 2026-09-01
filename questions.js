const categories = {
  agent: { name: "Agent 架構與流程", short: "Agent 架構", color: "#dfff49", weight: "27%" },
  mcp: { name: "Tool 與 MCP", short: "Tool／MCP", color: "#5ee7dd", weight: "18%" },
  code: { name: "Claude Code 工作流程", short: "Claude Code", color: "#ff9f7f", weight: "20%" },
  prompt: { name: "Prompt 與結構化輸出", short: "Prompt／JSON", color: "#b9a6ff", weight: "20%" },
  context: { name: "Context 與可靠性", short: "Context／評估", color: "#ffda68", weight: "15%" }
};

const originalQuestions = [
  {
    id: 1,
    category: "agent",
    title: "大型合約如何分工？",
    type: "single",
    en: "A legal team uses Claude to review a large contract. The contract can be divided into independent sections such as privacy, payment, and termination. Different specialists should review each section, and their findings must be combined into one final report. Which architecture is MOST appropriate?",
    zh: "法務團隊使用 Claude 審查大型合約。合約可以分成隱私、付款及終止條款等互不相依的部分，由不同專家分別審查，最後整合成一份報告。哪種架構最適合？",
    options: [
      { key: "A", en: "One model reviews every section in a fixed sequence.", zh: "一個模型依固定順序逐段審查。" },
      { key: "B", en: "An orchestrator assigns sections to specialized workers and combines the results.", zh: "由協調者分派給不同專家，再整合結果。" },
      { key: "C", en: "One model repeatedly rewrites the entire contract.", zh: "讓模型反覆重寫整份合約。" },
      { key: "D", en: "One unrestricted agent accesses every legal and business system.", zh: "讓單一 Agent 不受限制地存取所有系統。" }
    ],
    answers: ["B"],
    explanation: "各部分彼此獨立，最適合使用 orchestrator–workers 架構。協調者負責拆分與分派任務，各專家可以平行審查，最後再由協調者合併結果。這同時提升速度、專業度與權限隔離。",
    why: {
      A: "可以完成工作，但只能依序處理，沒有善用平行化及專業分工。",
      B: "正確。協調者負責分派，專業工作者各自處理獨立部分，再整合結果。",
      C: "Evaluator–optimizer 適合反覆改善同一輸出，不適合拆分獨立章節。",
      D: "單一 Agent 權限過大，增加誤操作與資料暴露風險。"
    },
    terms: [["orchestrator", "協調者"], ["specialized worker", "專業工作者"], ["independent", "互不相依"], ["synthesize", "整合"]]
  },
  {
    id: 2,
    category: "agent",
    title: "有相依性的部署步驟",
    type: "single",
    en: "A deployment workflow must first build an application artifact. It must then scan that exact artifact for security issues. Deployment may begin only if the scan passes. How should the steps be executed?",
    zh: "部署流程必須先建置應用程式成品，再掃描該成品是否有安全問題；只有掃描通過後才能部署。應如何執行？",
    options: [
      { key: "A", en: "Run all steps at the same time.", zh: "同時執行所有步驟。" },
      { key: "B", en: "Run the steps sequentially with validation gates.", zh: "依序執行，並在步驟之間設置驗證關卡。" },
      { key: "C", en: "Ask several agents whether the artifact probably exists.", zh: "讓多個 Agent 討論成品是否可能存在。" },
      { key: "D", en: "Run the steps in a random order.", zh: "隨機執行各步驟。" }
    ],
    answers: ["B"],
    explanation: "建置、掃描與部署有明確相依關係：建置 → 掃描 → 驗證通過 → 部署。後一步需要前一步的真實結果，因此必須依序執行；驗證關卡可阻止不安全成品進入正式環境。",
    why: {
      A: "掃描開始時成品可能尚未完成，部署開始時也可能尚未通過掃描。",
      B: "正確。相依工作必須依序進行，並以真實驗證結果決定是否繼續。",
      C: "討論無法取代實際成品與安全掃描結果。",
      D: "隨機順序破壞工作相依性，重試也無法補救錯誤架構。"
    },
    terms: [["artifact", "建置成品"], ["sequentially", "依序地"], ["dependency", "相依關係"], ["validation gate", "驗證關卡"]]
  },
  {
    id: 3,
    category: "agent",
    title: "服務台問題如何分流？",
    type: "single",
    en: "A university help desk receives password, payroll, and network questions. Each category requires different knowledge and different tool permissions. What is the BEST design?",
    zh: "大學服務台會收到密碼、薪資及網路問題。每種類型需要不同知識與工具權限。最好的設計是什麼？",
    options: [
      { key: "A", en: "Send every request to every specialist.", zh: "每個問題都傳給所有專家。" },
      { key: "B", en: "Use a router to classify requests, send them to scoped specialists, and provide a fallback.", zh: "使用 Router 分類，交給權限受限的專家，並提供備援處理。" },
      { key: "C", en: "Give one general agent full access to every system.", zh: "讓一個通用 Agent 完整存取所有系統。" },
      { key: "D", en: "Route requests using only one keyword.", zh: "只使用一個關鍵字進行分類。" }
    ],
    answers: ["B"],
    explanation: "Router 先判斷問題類型，再交給具有相應知識與最小權限的專家。若分類信心不足，應轉交人工或安全的通用流程，而不是勉強判斷。",
    why: {
      A: "浪費資源，也可能讓不相關 Agent 看到敏感資料。",
      B: "正確。分類、分派、權限隔離及 fallback 都有明確責任。",
      C: "權限過度集中；回答網路問題時不應同時擁有薪資系統權限。",
      D: "單一關鍵字規則太脆弱，複合問題很容易被錯誤分類。"
    },
    terms: [["router", "分流元件"], ["classify", "分類"], ["scoped", "範圍受限"], ["fallback", "備援方案"], ["least privilege", "最小權限"]]
  },
  {
    id: 4,
    category: "agent",
    title: "如何可靠地反覆改善公告？",
    type: "multiple",
    en: "Claude writes public product announcements. Every announcement must satisfy a brand rubric and a legal checklist. Which TWO practices make an evaluator-optimizer workflow reliable?",
    zh: "Claude 負責撰寫公開公告，每份公告都必須符合品牌評分標準及法律檢查清單。哪兩項做法能讓評估與改善流程更可靠？",
    options: [
      { key: "A", en: "One component writes a draft; another evaluates it against explicit criteria.", zh: "一個元件寫草稿，另一個依明確標準評估。" },
      { key: "B", en: "Set an acceptance score and a maximum number of revisions.", zh: "設定驗收分數及最大修改次數。" },
      { key: "C", en: "Continue revising forever until Claude says it is perfect.", zh: "持續修改，直到 Claude 說內容完美。" },
      { key: "D", en: "Allow the evaluator to publish immediately.", zh: "允許評估者直接發布。" }
    ],
    answers: ["A", "B"],
    explanation: "可靠的 evaluator–optimizer 需要兩件事：以明確 rubric 評估，而不是憑感覺；以及設定可測量的停止條件。例如達到 90 分即通過，最多修改三次，仍未通過便轉人工。",
    why: {
      A: "正確。產生者與評估者分工，評估者依客觀標準給回饋。",
      B: "正確。驗收門檻和次數上限可防止成本失控與無限循環。",
      C: "「完美」不是可測量標準，而且可能永遠不停止。",
      D: "評估與對外發布應分離，高風險內容仍需最終授權。"
    },
    terms: [["rubric", "評分標準"], ["evaluator", "評估者"], ["optimizer", "改善者"], ["acceptance threshold", "驗收門檻"], ["revision", "修訂"]]
  },
  {
    id: 5,
    category: "agent",
    title: "斷線後如何避免重複收費？",
    type: "multiple",
    en: "An agent processes grant applications in several stages. The service may restart, and one tool charges a fee each time it is called. Which TWO designs prevent lost progress and duplicate charges?",
    zh: "Agent 分階段處理補助申請。服務可能中途重新啟動，而且其中一個工具每呼叫一次都會收費。哪兩項設計能避免進度遺失與重複收費？",
    options: [
      { key: "A", en: "Save the verified result after every completed stage.", zh: "每完成一個階段，就保存已驗證的結果。" },
      { key: "B", en: "Use an idempotency key for each operation with side effects.", zh: "對會改變外部系統的操作使用冪等鍵。" },
      { key: "C", en: "Restart the entire process with a new ID after every failure.", zh: "每次失敗都換新編號並從頭開始。" },
      { key: "D", en: "Depend only on Claude’s conversation context.", zh: "只依靠 Claude 的對話 Context 記憶。" }
    ],
    answers: ["A", "B"],
    explanation: "Checkpoint 保存每個已完成階段，重新啟動後可從中斷點繼續。Idempotency key 則代表同一個業務操作；相同請求即使重送，也只會產生一次外部效果。",
    why: {
      A: "正確。已驗證的進度被持久保存，不必全部重做。",
      B: "正確。相同冪等鍵的重試應回傳原結果，而不是再次扣款。",
      C: "新識別碼會被視為新操作，更容易重複收費。",
      D: "Context 不是永久資料庫，程序重啟或壓縮後可能遺失。"
    },
    terms: [["checkpoint", "檢查點"], ["persist", "持久保存"], ["idempotency", "冪等性"], ["side effect", "外部副作用"]]
  },
  {
    id: 6,
    category: "mcp",
    title: "工具經常選錯，怎麼改善？",
    type: "single",
    en: "Claude has two tools. search_bookings is described only as “Find stuff,” and cancel_booking as “Handle a booking.” Their inputs are free-form text. Claude frequently selects the wrong tool. Which redesign is BEST?",
    zh: "Claude 有兩個工具，但說明分別只有「找東西」與「處理訂位」，輸入也是任意文字，因此經常選錯。最佳改善方式是什麼？",
    options: [
      { key: "A", en: "Add examples but keep the vague descriptions.", zh: "增加範例，但保留模糊說明。" },
      { key: "B", en: "Give precise descriptions, typed required fields, constraints, and server-side validation.", zh: "提供精確說明、必要的型別欄位、限制條件及伺服器驗證。" },
      { key: "C", en: "Combine them into one unrestricted tool.", zh: "合併成一個不受限制的工具。" },
      { key: "D", en: "Let the server guess missing information.", zh: "讓伺服器猜測遺漏資料。" }
    ],
    answers: ["B"],
    explanation: "Description 幫助 Claude 判斷何時使用工具；JSON Schema 限制參數型別、必填欄位與允許值；伺服器驗證則是最後防線。例如取消訂位必須取得唯一 booking_id，不能由模型猜測。",
    why: {
      A: "範例有幫助，但不能修補模糊的工具邊界與缺乏驗證。",
      B: "正確。同時改善工具選擇、參數品質及執行前安全檢查。",
      C: "通用任意文字工具會失去型別限制並擴大權限。",
      D: "猜測唯一識別碼可能取消錯誤訂位。"
    },
    terms: [["description", "工具說明"], ["input schema", "輸入結構"], ["required field", "必填欄位"], ["server-side validation", "伺服器端驗證"]]
  },
  {
    id: 7,
    category: "mcp",
    title: "如何安全寄送薪資報表？",
    type: "multiple",
    en: "An MCP tool can read every company folder and email payroll reports to any address. It sends immediately without showing the final recipient or attachment. Which TWO controls most directly reduce risk?",
    zh: "某 MCP 工具能讀取公司所有資料夾，並把薪資報表寄給任何地址，而且寄送前不顯示收件人或附件。哪兩項控制最能降低風險？",
    options: [
      { key: "A", en: "Limit the service account to the payroll folder and approved recipients.", zh: "限制服務帳號只能讀取薪資資料夾及寄給核准收件人。" },
      { key: "B", en: "Display the exact recipient and attachment, then require confirmation.", zh: "顯示實際收件人及附件，並要求明確確認。" },
      { key: "C", en: "Keep broad permissions and write “Be careful” in the prompt.", zh: "保留廣泛權限，只在 Prompt 中寫「請小心」。" },
      { key: "D", en: "Give the service password to Claude.", zh: "將服務密碼交給 Claude。" }
    ],
    answers: ["A", "B"],
    explanation: "最小權限把風險限制在程式與帳號層，即使模型受到 Prompt Injection，也無法讀取其他資料夾。高風險操作前還要顯示實際收件人與附件，由授權人員確認資料真正要送去哪裡。",
    why: {
      A: "正確。服務帳號只擁有必要資料夾與收件人範圍。",
      B: "正確。確認畫面必須顯示真正即將執行的參數。",
      C: "自然語言提醒是軟性指示，不能取代權限控制。",
      D: "秘密憑證不應進入模型 Context，會增加外洩風險。"
    },
    terms: [["least privilege", "最小權限"], ["approved recipient", "核准收件人"], ["explicit confirmation", "明確確認"], ["credential", "憑證"]]
  },
  {
    id: 8,
    category: "mcp",
    title: "MCP 三種元件怎麼分？",
    type: "single",
    en: "A support application needs: (1) live ticket retrieval when Claude needs it, (2) a policy manual loaded as read-only context, and (3) a reusable workflow template selected by an operator. Which mapping is correct?",
    zh: "客服系統需要：（1）Claude 有需要時查詢即時工單；（2）將政策手冊作為唯讀 Context；（3）讓操作人員選擇可重複使用的工作範本。正確對應是什麼？",
    options: [
      { key: "A", en: "Ticket retrieval = Tool; manual = Resource; template = Prompt.", zh: "工單查詢＝Tool；手冊＝Resource；範本＝Prompt。" },
      { key: "B", en: "Ticket retrieval = Resource; manual = Prompt; template = Tool.", zh: "工單查詢＝Resource；手冊＝Prompt；範本＝Tool。" },
      { key: "C", en: "Ticket retrieval = Prompt; manual = Tool; template = Resource.", zh: "工單查詢＝Prompt；手冊＝Tool；範本＝Resource。" },
      { key: "D", en: "All three should be Tools.", zh: "三項全部做成 Tool。" }
    ],
    answers: ["A"],
    explanation: "Tool 是模型可呼叫的功能；Resource 是提供 Context 的資料來源；Prompt 是可重複使用、通常由使用者選用的工作範本。即時查詢是動作，政策手冊是資料，工作範本則是 Prompt。",
    why: {
      A: "正確。三種 Primitive 各自對應動作、資料及範本。",
      B: "即時查詢不是被動 Resource；政策手冊也不是工作指示範本。",
      C: "Prompt 不會自行取得即時資料；唯讀手冊也不需要做成動作。",
      D: "全部做成 Tool 會模糊資料、動作與使用者範本的責任邊界。"
    },
    terms: [["Tool", "可執行功能"], ["Resource", "Context 資料來源"], ["Prompt", "可重用工作範本"], ["primitive", "基本元件"]]
  },
  {
    id: 9,
    category: "mcp",
    title: "網路重試造成重複購買",
    type: "multiple",
    en: "A create_shipment tool purchases a shipping label. Sometimes the purchase succeeds, but the network fails before the result reaches the client. A retry buys a second label. Invalid postal codes are also returned as ordinary success text. Which TWO changes are BEST?",
    zh: "create_shipment 工具會購買託運標籤。有時購買已成功，但回應途中斷線，重試後又買了一張。無效郵遞區號也被當成成功結果。哪兩項改善最好？",
    options: [
      { key: "A", en: "Use the same operation ID when retrying the same business operation.", zh: "同一業務操作重試時，使用相同操作編號。" },
      { key: "B", en: "Generate a new operation ID for every retry.", zh: "每次重試都使用新編號。" },
      { key: "C", en: "Return invalid postal codes as explicit tool errors with useful details.", zh: "將無效郵遞區號回報為明確、可處理的工具錯誤。" },
      { key: "D", en: "Return success and let Claude guess whether it failed.", zh: "一律回報成功，讓 Claude 猜測。" }
    ],
    answers: ["A", "C"],
    explanation: "相同 operation_id 讓伺服器辨識重試屬於同一筆購買，已完成時只回傳原結果。業務輸入錯誤則應以明確工具錯誤回傳，提供可採取行動的修正資訊。",
    why: {
      A: "正確。同一操作重試使用相同鍵，避免再次產生付費副作用。",
      B: "新識別碼代表新操作，會繞過去重機制。",
      C: "正確。錯誤應被明確標記並說明如何修正。",
      D: "把失敗偽裝成成功，模型與程式都無法可靠決定下一步。"
    },
    terms: [["operation ID", "操作識別碼"], ["idempotent retry", "冪等重試"], ["tool error", "工具錯誤"], ["duplicate side effect", "重複副作用"]]
  },
  {
    id: 10,
    category: "code",
    title: "團隊共用規則放哪裡？",
    type: "single",
    en: "A team wants every developer’s Claude Code to use the same test commands, folder conventions, and naming rules. The instructions must travel with the repository. Where should they be stored?",
    zh: "團隊希望所有人的 Claude Code 遵循相同測試指令、資料夾及命名規則，而且規則要跟著 Repository 分享。應放在哪裡？",
    options: [
      { key: "A", en: "A developer’s personal ~/.claude/CLAUDE.md.", zh: "某位開發者個人的 ~/.claude/CLAUDE.md。" },
      { key: "B", en: "A project-level CLAUDE.md committed to Git.", zh: "提交到 Git 的專案層級 CLAUDE.md。" },
      { key: "C", en: ".claude/settings.local.json.", zh: ".claude/settings.local.json。" },
      { key: "D", en: "A chat message pasted every session.", zh: "每次工作階段重新貼上的訊息。" }
    ],
    answers: ["B"],
    explanation: "專案 CLAUDE.md 適合記錄測試指令、命名方式、資料夾慣例與專案背景。提交到 Git 後，規則能隨專案分享、接受審查並保留版本歷史。",
    why: {
      A: "屬於個人層級，通常不會跟著 Repository 分享。",
      B: "正確。專案規則和程式碼一起版本控制。",
      C: "通常保存不提交到 Git 的個人專案設定。",
      D: "只適用當次工作階段，容易忘記或使用錯誤版本。"
    },
    terms: [["repository", "程式碼儲存庫"], ["version-controlled", "受版本控制"], ["project-level", "專案層級"], ["convention", "慣例"]]
  },
  {
    id: 11,
    category: "code",
    title: "修改後自動執行格式化",
    type: "single",
    en: "A team requires Prettier to run automatically after every successful Edit or Write operation performed by Claude Code. Which configuration is MOST appropriate?",
    zh: "團隊要求 Claude Code 每次成功編輯或寫入檔案後，自動執行 Prettier。哪個設定最適合？",
    options: [
      { key: "A", en: "Write “Remember to run Prettier” in CLAUDE.md.", zh: "在 CLAUDE.md 寫下「記得執行 Prettier」。" },
      { key: "B", en: "Configure a PostToolUse hook for Edit|Write.", zh: "針對 Edit|Write 設定 PostToolUse Hook。" },
      { key: "C", en: "Configure a notification after every response.", zh: "每次回覆後發出通知。" },
      { key: "D", en: "Create an optional manual Skill.", zh: "建立一個選用的手動 Skill。" }
    ],
    answers: ["B"],
    explanation: "Hook 會在特定生命週期事件發生時確定執行。PostToolUse 代表工具成功使用後，matcher 則將觸發範圍限制為 Edit 或 Write；適合處理格式化等每次都必須發生的自動化。",
    why: {
      A: "自然語言指示有幫助，但不能保證每次都執行。",
      B: "正確。事件驅動、可重複且不依賴模型是否記得。",
      C: "Notification 是通知使用者，不代表檔案修改後執行格式化。",
      D: "需要手動選用，無法保證每次修改後都執行。"
    },
    terms: [["hook", "事件觸發處理"], ["PostToolUse", "工具使用後"], ["matcher", "比對條件"], ["deterministic", "按固定規則執行"]]
  },
  {
    id: 12,
    category: "code",
    title: "只給自己使用的專案設定",
    type: "single",
    en: "One developer wants to allow a local test command only in this repository. Other team members should not inherit it, and the file should stay outside Git. Where should the setting be placed?",
    zh: "某位開發者只想在目前專案允許一條本機測試指令。其他成員不應繼承，而且設定不提交到 Git。應放在哪裡？",
    options: [
      { key: "A", en: ".claude/settings.json", zh: "專案團隊共用設定。" },
      { key: "B", en: ".claude/settings.local.json", zh: "目前專案的個人本機設定。" },
      { key: "C", en: "~/.claude/settings.json", zh: "個人所有專案的全域設定。" },
      { key: "D", en: ".mcp.json", zh: "MCP Server 連線設定。" }
    ],
    answers: ["B"],
    explanation: "settings.local.json 的範圍是「目前專案＋目前使用者」，適合個人權限偏好或本機差異，而且通常不提交 Git。settings.json 則適合團隊共用；使用者目錄設定會影響個人所有專案。",
    why: {
      A: "專案層級共用設定，其他成員可能繼承。",
      B: "正確。只套用目前專案的本機個人覆寫。",
      C: "會影響該使用者的其他專案，範圍過大。",
      D: "用來設定 MCP Server，不是一般本機權限覆寫。"
    },
    terms: [["inherit", "繼承"], ["local override", "本機覆寫"], ["scope", "適用範圍"], ["remain outside Git", "不提交 Git"]]
  },
  {
    id: 13,
    category: "code",
    title: "指引與強制限制如何分開？",
    type: "multiple",
    en: "A repository must (1) teach Claude the team’s coding conventions and (2) prevent a specific production deployment command. Which TWO actions are BEST?",
    zh: "專案必須：（1）告訴 Claude 團隊程式規範；（2）禁止執行特定正式環境部署指令。哪兩項措施最好？",
    options: [
      { key: "A", en: "Put coding conventions in a checked-in CLAUDE.md.", zh: "把程式規範放進提交到 Git 的 CLAUDE.md。" },
      { key: "B", en: "Add a matching permissions.deny rule for the deployment command.", zh: "針對部署指令加入 permissions.deny 規則。" },
      { key: "C", en: "Write “Never deploy” only in CLAUDE.md.", zh: "只在 CLAUDE.md 寫下「禁止部署」。" },
      { key: "D", en: "Create an optional Skill and hope Claude uses it.", zh: "建立選用 Skill，期待 Claude 每次都使用。" }
    ],
    answers: ["A", "B"],
    explanation: "CLAUDE.md 是工作指引，適合告訴模型團隊如何開發。真正不能發生的動作則需要 permissions.deny、阻擋型 Hook 或外部最小權限等強制控制。",
    why: {
      A: "正確。命名與測試慣例屬於可版本控制的專案知識。",
      B: "正確。禁止命令需要可強制執行的安全規則。",
      C: "自然語言提醒不是不可突破的安全邊界。",
      D: "選用功能無法保證危險操作前一定會被執行。"
    },
    terms: [["guidance", "工作指引"], ["enforcement", "強制執行"], ["permissions.deny", "拒絕規則"], ["security boundary", "安全邊界"]]
  },
  {
    id: 14,
    category: "prompt",
    title: "如何分隔指示、範例與資料？",
    type: "single",
    en: "A prompt contains policy instructions, example tickets, and a live customer ticket in one long block. Claude sometimes treats an example as the live ticket. Which change is BEST?",
    zh: "Prompt 把政策指示、範例工單及真正的客戶工單全部放在同一大段文字中，Claude 有時把範例當成真正工單。最佳改善方式是什麼？",
    options: [
      { key: "A", en: "Separate them with descriptive tags such as instructions, examples, and input.", zh: "使用具描述性的標籤分隔指示、範例與實際輸入。" },
      { key: "B", en: "Repeat the entire prompt in uppercase.", zh: "用全部大寫重複整段 Prompt。" },
      { key: "C", en: "Increase temperature.", zh: "提高 Temperature。" },
      { key: "D", en: "Remove all section names.", zh: "移除所有區段名稱。" }
    ],
    answers: ["A"],
    explanation: "描述性 XML 標籤能建立清楚邊界，告訴模型哪些是指示、哪些只是範例、哪一段才是目前真正要處理的輸入。標籤應保持一致且具有意義。",
    why: {
      A: "正確。內容角色與邊界被明確標示。",
      B: "重複及大寫不會解決結構問題，反而浪費 Token。",
      C: "提高隨機性不能修補模糊的 Prompt 結構。",
      D: "失去區段名稱後，範例與真實輸入更難區分。"
    },
    terms: [["XML tags", "XML 標籤"], ["instructions", "指示"], ["examples", "範例"], ["input", "實際輸入"], ["ambiguity", "模糊性"]]
  },
  {
    id: 15,
    category: "prompt",
    title: "改善少見案例的分類",
    type: "single",
    en: "A ticket classifier understands the label definitions but often misclassifies rare cancellation requests. The prompt contains no examples. Which improvement is BEST?",
    zh: "工單分類器理解分類定義，但經常把少見的取消申請分錯。目前 Prompt 沒有範例。哪項改善最好？",
    options: [
      { key: "A", en: "Add several diverse labeled examples, including cancellation edge cases.", zh: "加入數個多樣化、含答案的範例，包括取消申請邊界案例。" },
      { key: "B", en: "Add 30 nearly identical password-reset examples.", zh: "加入 30 個幾乎相同的密碼重設範例。" },
      { key: "C", en: "Show correct labels without their input examples.", zh: "只顯示分類答案，不提供對應輸入。" },
      { key: "D", en: "Replace the definitions with “Be smart.”", zh: "把分類定義改成「聰明一點」。" }
    ],
    answers: ["A"],
    explanation: "Few-shot prompting 讓模型從「輸入與正確輸出如何配對」的範例學習。範例應與任務相關、具多樣性，並特別涵蓋最容易判錯的 edge cases。",
    why: {
      A: "正確。少量但多樣且相關的標記範例能補足分類邊界。",
      B: "大量重複的常見案例無法教會模型辨認取消申請。",
      C: "沒有範例輸入，模型無法理解文字特徵與標籤的關係。",
      D: "模糊鼓勵沒有提供任何分類判準。"
    },
    terms: [["few-shot prompting", "少量範例提示"], ["labeled example", "含正確答案的範例"], ["edge case", "邊界案例"], ["diverse", "多樣化"]]
  },
  {
    id: 16,
    category: "prompt",
    title: "如何保證 JSON 格式？",
    type: "single",
    en: "Every response must be valid JSON containing ticket_id as a string, priority as low, medium, or high, and needs_human as a boolean. Which approach is MOST reliable?",
    zh: "每個回覆都必須是有效 JSON：ticket_id 為字串、priority 只能是 low／medium／high，needs_human 為布林值。哪種方式最可靠？",
    options: [
      { key: "A", en: "Write “Please return valid JSON” in the prompt.", zh: "在 Prompt 寫下「請回傳有效 JSON」。" },
      { key: "B", en: "Use Structured Outputs with a JSON Schema.", zh: "使用 Structured Outputs 與 JSON Schema。" },
      { key: "C", en: "Increase temperature.", zh: "提高 Temperature。" },
      { key: "D", en: "Put ordinary text inside a Markdown code block.", zh: "把普通文字放進 Markdown 程式碼區塊。" }
    ],
    answers: ["B"],
    explanation: "JSON Schema 可以約束必填欄位、型別、列舉值及是否接受額外欄位。Structured Outputs 用 Schema 限制最終輸出，比單純自然語言要求更可靠。",
    why: {
      A: "清楚提示有幫助，但不能保證 Schema 一定符合。",
      B: "正確。使用結構化輸出約束並驗證 JSON 格式。",
      C: "Temperature 控制輸出變化程度，不是格式驗證機制。",
      D: "Code fence 只是顯示格式，內容仍可能不是有效 JSON。"
    },
    terms: [["Structured Outputs", "結構化輸出"], ["JSON Schema", "JSON 結構規則"], ["enum", "限定值清單"], ["boolean", "布林值"], ["parseable", "可由程式解析"]]
  },
  {
    id: 17,
    category: "prompt",
    title: "同時限制工具與最終回答",
    type: "multiple",
    en: "An agent calls a create_case tool and then returns a final JSON summary. The application needs schema-valid tool arguments and a separately structured final response. Which TWO features should it use?",
    zh: "Agent 會先呼叫 create_case 工具，再回傳 JSON 摘要。系統需要工具參數符合 Schema，最終回答也要符合另一份 Schema。應使用哪兩項功能？",
    options: [
      { key: "A", en: "Set strict: true on the tool and define its input_schema.", zh: "在工具設定 strict: true 並定義 input_schema。" },
      { key: "B", en: "Define the final response with Structured Outputs.", zh: "使用 Structured Outputs 定義最終回答。" },
      { key: "C", en: "Provide one JSON example and rely entirely on imitation.", zh: "提供一個 JSON 範例並完全依賴模仿。" },
      { key: "D", en: "Increase max_tokens.", zh: "提高 max_tokens。" }
    ],
    answers: ["A", "B"],
    explanation: "strict: true 與 input_schema 約束工具呼叫參數；Structured Outputs 約束最後回答格式。格式正確仍不代表事實正確，因此 customer_id 是否存在、使用者是否有權操作，仍須由後端驗證。",
    why: {
      A: "正確。控制 Claude 呼叫工具時的參數結構。",
      B: "正確。控制 Claude 最終回覆的 JSON 結構。",
      C: "範例能改善一致性，但不能提供 Schema 保證。",
      D: "max_tokens 只控制輸出長度，不會驗證欄位與型別。"
    },
    terms: [["strict tool use", "嚴格工具使用"], ["input_schema", "工具輸入規則"], ["final response", "最終回覆"], ["semantic validation", "資料意義驗證"]]
  },
  {
    id: 18,
    category: "context",
    title: "如何管理 200 輪長對話？",
    type: "single",
    en: "A support conversation may continue for 200 turns. The agent must remember the verified account ID, confirmed facts, customer promises, and unresolved issues while staying within the context limit. What is the BEST approach?",
    zh: "客服對話可能持續 200 輪。Agent 必須記住已驗證帳號、確認事實、對客戶的承諾及未解決問題，同時不能超過 Context 上限。最佳方法是什麼？",
    options: [
      { key: "A", en: "Keep every message forever in every prompt.", zh: "每次都完整放入所有歷史訊息。" },
      { key: "B", en: "Maintain structured external state plus verified summaries and recent relevant messages.", zh: "使用結構化外部狀態、已驗證摘要及最近相關訊息。" },
      { key: "C", en: "Delete everything every ten turns without a summary.", zh: "每十輪全部刪除，不留下摘要。" },
      { key: "D", en: "Ask Claude to guess missing account information.", zh: "讓 Claude 猜測遺漏資料。" }
    ],
    answers: ["B"],
    explanation: "重要狀態應存放在 Context 之外的可靠儲存空間，例如 verified_account_id、confirmed_facts、promises 與 open_issues。每次只提供經驗證摘要及目前相關訊息，可控制 Token 並保持連續性。",
    why: {
      A: "最終會超過 Context Window，也會讓大量無關訊息分散注意力。",
      B: "正確。外部狀態可靠保存事實，Context 只載入當下必要資訊。",
      C: "會遺失承諾及未完成問題，破壞服務連續性。",
      D: "關鍵身分資料不能猜測，否則可能造成隱私與服務錯誤。"
    },
    terms: [["structured state", "結構化狀態"], ["external state", "外部狀態"], ["verified summary", "已驗證摘要"], ["context limit", "Context 上限"]]
  },
  {
    id: 19,
    category: "context",
    title: "新舊政策互相衝突",
    type: "multiple",
    en: "A knowledge base contains both current and obsolete travel policies. Some documents disagree about the maximum hotel allowance. Which TWO practices improve reliability?",
    zh: "知識庫同時包含現行及失效的差旅政策，而且住宿費上限互相矛盾。哪兩項做法能提升可靠性？",
    options: [
      { key: "A", en: "Store version and effective-date metadata and retrieve the applicable policy.", zh: "保存版本及生效日期，搜尋目前適用的政策。" },
      { key: "B", en: "Cite sources and abstain or escalate when authoritative sources still conflict.", zh: "引用來源；權威文件仍衝突時停止判斷或轉人工。" },
      { key: "C", en: "Put every old and new document into context without labels.", zh: "把新舊文件全部放入 Context，但不標示版本。" },
      { key: "D", en: "Trust whichever document contains the most words.", zh: "相信字數最多的文件。" }
    ],
    answers: ["A", "B"],
    explanation: "Metadata 應包括版本、生效日期、失效日期、適用單位與發布機關，檢索時才能優先選擇適用文件。若同樣具權威性的現行來源仍衝突，模型應坦白無法確認並轉人工。",
    why: {
      A: "正確。版本與日期使檢索系統能辨識現行、適用文件。",
      B: "正確。來源可追溯；證據衝突時不應自行猜測。",
      C: "沒有標示版本會把矛盾內容一起交給模型，造成不一致。",
      D: "文件長度與權威性、時效性及正確性無關。"
    },
    terms: [["obsolete", "已失效"], ["effective date", "生效日期"], ["authoritative", "具權威性"], ["abstain", "證據不足時不作答"], ["escalate", "轉人工"]]
  },
  {
    id: 20,
    category: "context",
    title: "新版 Agent 能不能上線？",
    type: "multiple",
    en: "A team is deciding whether a new agent version is reliable enough for release. Correct answers may use different wording. Which TWO evaluation practices are MOST appropriate?",
    zh: "團隊要判斷新版 Agent 是否足夠可靠，可以正式發布。正確答案可能使用不同措辭。哪兩種評估方式最適合？",
    options: [
      { key: "A", en: "Use a representative test set and task-specific success criteria.", zh: "使用具有代表性的測試集及任務成功標準。" },
      { key: "B", en: "Run variable cases multiple times and compare pass rates and failure patterns.", zh: "對可能變動的案例執行多次，比較通過率及失敗模式。" },
      { key: "C", en: "Require every answer to match one reference sentence character for character.", zh: "要求每個答案逐字符合唯一參考句。" },
      { key: "D", en: "Test one easy example once.", zh: "只測試一個簡單案例一次。" }
    ],
    answers: ["A", "B"],
    explanation: "代表性測試集應涵蓋一般、邊界、錯誤輸入、工具失敗、權限不足及攻擊案例。模型輸出具有變動性，因此需要多次執行，觀察整體通過率與重複出現的失敗模式。",
    why: {
      A: "正確。測試集與成功標準必須反映真實任務風險。",
      B: "正確。多次執行比單次結果更能衡量穩定性。",
      C: "意思正確但措辭不同的答案會被錯誤判定失敗。",
      D: "單一簡單案例無法發現邊界問題與不穩定行為。"
    },
    terms: [["representative test set", "代表性測試集"], ["success criteria", "成功標準"], ["pass rate", "通過率"], ["failure pattern", "失敗模式"], ["release gate", "發布門檻"]]
  }
];
