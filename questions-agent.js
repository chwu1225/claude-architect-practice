const agentQuestions = [
  {
    id: 21,
    category: "agent",
    title: "簡單 FAQ 需要 Agent 嗎？",
    type: "single",
    en: "A benefits portal answers questions from a short, stable policy document. A retrieval-enhanced single Claude call already achieves the required accuracy, and the task never changes external systems. Which architecture is MOST appropriate for the first production release?",
    zh: "員工福利入口網站根據一份簡短且穩定的政策文件回答問題。經測試，加入檢索內容的單次 Claude 呼叫已達到所需準確率，而且任務不會修改外部系統。第一版正式環境最適合採用哪種架構？",
    options: [
      { key: "A", en: "Create an autonomous agent that can repeatedly search, plan, and call tools.", zh: "建立可反覆搜尋、規劃及呼叫工具的自主 Agent。" },
      { key: "B", en: "Create several specialist agents and let them vote on every answer.", zh: "建立多個專家 Agent，讓它們對每個答案投票。" },
      { key: "C", en: "Keep the retrieval-enhanced single call and monitor it against the evaluation set.", zh: "保留加入檢索內容的單次呼叫，並持續用評估集監測。" },
      { key: "D", en: "Add an evaluator-optimizer loop that rewrites every answer until no criticism remains.", zh: "加入評估與改善迴圈，反覆重寫每個答案，直到沒有任何批評。" }
    ],
    answers: ["C"],
    explanation: "架構應從能通過評估的最簡單方案開始；單次呼叫已能完成固定、低風險且無副作用的任務。Agentic 系統通常以較高成本與延遲換取彈性，只有當步驟無法預先決定或必須與環境反覆互動時才值得增加。正式上線後仍應以代表性評估集監測品質，避免政策或流量型態改變而未被察覺。",
    why: {
      A: "自主迴圈適合步驟未知且需要觀察環境後調整的任務。此處沒有這種需求，反而會增加延遲、成本及失敗路徑。",
      B: "多 Agent 投票可增加觀點或信心，但每個簡單問題都使用會造成不必要的運算與整合成本。現有單次呼叫既已達標，就沒有證據支持增加複雜度。",
      C: "正確。它保留已由評估證明有效的簡單架構，同時以持續評估偵測品質退化。",
      D: "Evaluator–optimizer 適合有清楚評分標準且反覆修訂能產生可測量改善的工作。對短 FAQ 每題都迭代到無批評，停止條件模糊且成本過高。"
    },
    terms: [["single-shot", "單次呼叫"], ["retrieval-enhanced", "加入檢索內容"], ["agentic system", "Agentic 系統"], ["side effect", "外部副作用"], ["evaluation set", "評估集"]]
  },
  {
    id: 22,
    category: "agent",
    title: "驗證失敗如何安全交接？",
    type: "single",
    en: "A support agent must verify identity before changing an address or issuing a refund. The verification service returns a mismatch, but the customer asks the agent to continue and explains a complex situation that a human reviewer will need. Which design is BEST?",
    zh: "客服 Agent 在變更地址或退款前必須驗證身分。驗證服務回報資料不符，但客戶要求繼續，並說明一段需要人工審查的複雜情況。最佳設計是什麼？",
    options: [
      { key: "A", en: "Programmatically block both sensitive tools and create a structured handoff containing the request, verified facts, failed check, evidence, and next required action.", zh: "以程式方式阻擋兩個敏感工具，並建立結構化交接，包含申請內容、已驗證事實、失敗檢查、證據及下一個必要動作。" },
      { key: "B", en: "Let the agent bypass verification when the customer's explanation sounds sincere.", zh: "客戶說明聽起來真誠時，允許 Agent 略過驗證。" },
      { key: "C", en: "Give the agent administrator access so the failed verification does not interrupt the workflow.", zh: "給 Agent 管理員權限，使驗證失敗不會中斷工作流。" },
      { key: "D", en: "Discard the conversation and tell the human reviewer only that something failed.", zh: "丟棄整段對話，只告訴人工審查者某件事失敗了。" }
    ],
    answers: ["A"],
    explanation: "不可省略的身分條件需要程式化 prerequisite gate，驗證未通過時不得讓模型自行呼叫退款或地址變更工具。安全失敗不等於把工作全部丟棄；系統應建立結構化 handoff，讓授權人員看到已驗證內容、失敗原因、證據與尚待處理事項。這種設計同時防止繞過控制，也避免客戶向人工人員重述整個問題。",
    why: {
      A: "正確。Gate 在執行層阻止敏感副作用，完整 handoff 又保存人工繼續處理所需的狀態與來源。",
      B: "客戶敘述的可信感不是身分證明，也不能取代驗證服務的結果。讓模型依語氣豁免會造成不一致且可被操控的安全漏洞。",
      C: "提高權限只會擴大驗證失敗後的危害範圍，並沒有解決身分不明問題。權限不足在此是應保留的安全邊界。",
      D: "轉人工方向正確，但沒有結構化 Context，審查者無法知道何項驗證失敗、哪些事實已確認或客戶要求什麼。這會增加重工與錯誤。"
    },
    terms: [["prerequisite gate", "先決條件關卡"], ["structured handoff", "結構化交接"], ["verified facts", "已驗證事實"], ["fail closed", "失敗時保持阻擋"], ["sensitive tool", "敏感工具"]]
  },
  {
    id: 23,
    category: "agent",
    title: "研究摘要的前後相依",
    type: "single",
    en: "A communications team creates a weekly brief by first extracting verified facts, then checking those facts against a source policy, and finally writing the brief from only the approved facts. Each stage depends on the previous output. Which pattern is MOST appropriate?",
    zh: "公關團隊製作每週簡報時，先擷取已驗證事實，再依來源政策檢查事實，最後只使用核准事實撰寫簡報。每一階段都依賴前一階段的輸出。最適合哪種模式？",
    options: [
      { key: "A", en: "Routing, because every stage should receive a different random input.", zh: "使用 Routing，因為每一階段都應收到不同的隨機輸入。" },
      { key: "B", en: "Voting, because all stages should independently draft the final brief.", zh: "使用投票模式，因為所有階段都應各自撰寫最後簡報。" },
      { key: "C", en: "Parallelization, because all three dependent stages should start together.", zh: "使用平行化，因為三個有相依性的階段應同時開始。" },
      { key: "D", en: "Prompt chaining with a validation gate before the writing stage.", zh: "使用 Prompt Chaining，並在撰寫階段前設置驗證關卡。" }
    ],
    answers: ["D"],
    explanation: "Prompt chaining 將容易分解的任務排成固定序列，每次呼叫處理前一階段的結果。事實檢查是撰寫前的必要條件，因此應加入可驗證的 gate，只把通過的事實傳給寫作者。這會增加一些序列延遲，但能讓每個模型呼叫專注在較小且清楚的工作上。",
    why: {
      A: "Routing 是依輸入類別選擇不同處理分支，不是把同一份資料依序加工。這個案例的核心是前後相依，而不是分類分流。",
      B: "Voting 是對同一問題進行多次獨立嘗試，再依門檻整合判斷。它無法表達擷取、驗證、撰寫之間的資料相依關係。",
      C: "後兩步需要前一步的真實輸出，無法安全地同時開始。平行化只適合可以獨立處理的子任務。",
      D: "正確。固定鏈結保留資料順序，驗證關卡能阻止未核准事實流入最終簡報。"
    },
    terms: [["prompt chaining", "Prompt 鏈結"], ["validation gate", "驗證關卡"], ["dependency", "相依關係"], ["approved facts", "核准事實"], ["sequential latency", "序列延遲"]]
  },
  {
    id: 24,
    category: "agent",
    title: "Router 平均分高卻漏案件",
    type: "multiple",
    en: "A ticket router reports 94% overall accuracy after a product launch, yet rare billing disputes are frequently sent to a general FAQ path. User language is also changing over time. Which TWO actions best diagnose and control this routing failure?",
    zh: "產品上線後，工單 Router 的整體準確率為 94%，但少見的帳務爭議經常被送到一般 FAQ 路徑，而且使用者用語正隨時間改變。哪兩項措施最能診斷並控制這種分流失敗？（選 TWO 項）",
    options: [
      { key: "A", en: "Keep the router unchanged because aggregate accuracy is above 90%.", zh: "因為整體準確率高於 90%，所以維持 Router 不變。" },
      { key: "B", en: "Measure a per-class confusion matrix and billing-dispute recall on representative recent data, then update or recalibrate the router.", zh: "使用近期代表性資料測量各類 Confusion Matrix 與帳務爭議 Recall，再更新或重新校準 Router。" },
      { key: "C", en: "Send low-confidence tickets to a randomly selected specialist so every path receives traffic.", zh: "把低信心工單隨機交給專家，讓每條路徑都能收到流量。" },
      { key: "D", en: "Add an abstention threshold with a safe clarification or human fallback, and monitor route outcomes for drift.", zh: "加入 Abstention Threshold 與安全的澄清或人工備援，並監測分流結果是否出現 Drift。" }
    ],
    answers: ["B", "D"],
    explanation: "整體準確率可能被大量常見 FAQ 稀釋，無法顯示少數高風險類別的漏接情況，因此要查看 per-class recall 與 confusion matrix。Router 還需要可以 abstain 的信心門檻；不確定時進入澄清或人工 fallback，而不是強迫分類。持續比較真實結果與近期資料分布，才能發現新產品造成的語言 drift 並重新校準。",
    why: {
      A: "94% 的平均值無法說明每一類都可靠，尤其帳務爭議可能只占很小比例。忽略類別不平衡會讓重要失敗被高流量類別掩蓋。",
      B: "正確。Per-class 指標能定位 Router 把帳務爭議錯送到哪裡，近期資料則可驗證是否因用語改變而退化。",
      C: "隨機分派不會根據專業或風險選擇路徑，還可能把敏感案件交給權限不符的處理者。低信心應走明確的安全 fallback。",
      D: "正確。Abstention 可把不確定性顯性化，Outcome Monitoring 則讓團隊發現門檻或資料分布何時需要調整。"
    },
    terms: [["confusion matrix", "混淆矩陣"], ["per-class recall", "各類召回率"], ["abstention threshold", "拒絕判斷門檻"], ["calibration", "信心校準"], ["distribution drift", "資料分布漂移"], ["outcome monitoring", "結果監測"]]
  },
  {
    id: 25,
    category: "agent",
    title: "平行投票如何提高信心？",
    type: "multiple",
    en: "A safety team reviews the same high-risk message for a subtle policy violation. One review can miss the issue, so the team wants several independent judgments before deciding whether to escalate. Which TWO actions correctly implement the voting form of parallelization?",
    zh: "安全團隊要判斷同一則高風險訊息是否有細微的政策違規。單次審查可能漏掉問題，因此團隊希望取得多個獨立判斷後再決定是否升級處理。哪兩項做法正確實作平行化的 Voting 模式？（選 TWO 項）",
    options: [
      { key: "A", en: "Run reviewers independently and concurrently, using deliberately different review perspectives without exposing earlier votes.", zh: "讓 Reviewer 以刻意不同的審查觀點獨立且同時執行，不向後續 Reviewer 暴露先前投票。" },
      { key: "B", en: "Show every reviewer the first reviewer's conclusion so all outputs converge on the same answer.", zh: "把第一位 Reviewer 的結論顯示給所有 Reviewer，讓輸出收斂成相同答案。" },
      { key: "C", en: "Define an aggregation rule, such as a risk-sensitive vote threshold, and retain dissent and evidence for escalation.", zh: "定義彙整規則，例如依風險調整的投票門檻，並保留不同意見與證據供升級處理。" },
      { key: "D", en: "Treat the longest review as the winning vote regardless of its evidence.", zh: "不論證據為何，都把最長的審查視為勝出投票。" }
    ],
    answers: ["A", "C"],
    explanation: "Voting 與 Sectioning 不同：它讓多個獨立呼叫處理同一問題，以不同觀點或嘗試增加發現細微問題的機會。Reviewer 不應先看到其他答案，否則會產生 anchoring，使看似多票其實是相關錯誤。最後必須依風險事先定義投票門檻，並保留少數意見與證據，而不是只計算沒有理由的票數。",
    why: {
      A: "正確。獨立觀點與同時執行分別提升判斷多樣性並降低等待時間，不暴露先前答案可減少從眾偏誤。",
      B: "先揭露結論會讓後續 Reviewer 被錨定，投票不再是多次獨立證據。多個相同答案可能只是同一個早期錯誤被複製。",
      C: "正確。高風險任務可以使用較敏感的升級門檻，而且保留 dissent 與 evidence 可讓人工了解爭議所在。",
      D: "文字長度與證據品質或政策正確性沒有必然關係。Aggregation 應依預先定義的判準，而不是表面格式。"
    },
    terms: [["voting", "投票模式"], ["independent judgment", "獨立判斷"], ["anchoring", "錨定效應"], ["vote threshold", "投票門檻"], ["dissent", "不同意見"], ["correlated error", "相關性錯誤"]]
  },
  {
    id: 26,
    category: "agent",
    title: "未知檔案如何動態分工？",
    type: "single",
    en: "A code-modernization request may affect an unknown number of files and technologies. The required subtasks cannot be listed before the repository is inspected, and specialized workers must return results for a coherent final change plan. Which pattern is BEST?",
    zh: "程式現代化需求可能影響數量未知的檔案與技術。檢查 Repository 前無法列出所有子任務，而且各專業 Worker 的結果必須整合成一致的變更計畫。最適合哪種模式？",
    options: [
      { key: "A", en: "A fixed parallel workflow that always launches the same four predefined tasks.", zh: "固定平行工作流，每次都啟動相同的四項預定任務。" },
      { key: "B", en: "A router that selects exactly one specialist for the entire modernization effort.", zh: "使用 Router，為整個現代化工作只選一位專家。" },
      { key: "C", en: "An orchestrator that inspects the request, dynamically delegates scoped subtasks, and synthesizes worker results.", zh: "由 Orchestrator 檢查需求、動態分派範圍明確的子任務，再整合 Worker 結果。" },
      { key: "D", en: "One single-shot prompt that guesses the repository structure without inspecting it.", zh: "只用一次 Prompt，在未檢查 Repository 前猜測其結構。" }
    ],
    answers: ["C"],
    explanation: "Orchestrator–workers 適合無法事先預測子任務的複雜工作；中央模型可根據實際 Repository 動態拆分工作。每個 Worker 應收到明確範圍、必要 Context 與受限工具，結果再回到 Orchestrator 做跨檔案整合。它與固定平行化的差異在於，子任務由輸入內容動態決定，而不是預先寫死。",
    why: {
      A: "固定任務適合分解方式已知的情況。若每個 Repository 結構不同，寫死四項工作可能漏掉關鍵技術或執行不相關分析。",
      B: "Routing 通常在多個已知處理路徑中選擇適合的一條。此案例需要同時協調多項動態工作，而不是只選一位專家。",
      C: "正確。Orchestrator 能先觀察實際範圍，再建立專業任務並負責最後的整體一致性。",
      D: "沒有 ground truth 就規劃檔案變更會建立在猜測上。單次回答也缺乏發現新資訊後重新分解的能力。"
    },
    terms: [["orchestrator–workers", "協調者—工作者"], ["dynamic decomposition", "動態任務分解"], ["worker scope", "Worker 工作範圍"], ["synthesis", "整合"], ["repository inspection", "Repository 檢查"]]
  },
  {
    id: 27,
    category: "agent",
    title: "Evaluator 為何無法改善草稿？",
    type: "single",
    en: "An evaluator-optimizer loop has a detailed accuracy, coverage, and citation rubric, but it is not improving. The evaluator repeatedly returns only 'make it better,' and the optimizer rewrites everything without knowing which criterion failed. What is the BEST redesign?",
    zh: "Evaluator–optimizer 迴圈已有詳細的準確性、涵蓋度及引用 Rubric，卻沒有產生改善。Evaluator 每次只回覆「再改好一點」，Optimizer 不知道哪項標準失敗，只能重寫全部內容。最佳重新設計是什麼？",
    options: [
      { key: "A", en: "Increase the revision count while keeping the same vague evaluator response.", zh: "增加修改次數，但維持相同的模糊 Evaluator 回覆。" },
      { key: "B", en: "Let the optimizer declare its own output accepted without another evaluation.", zh: "讓 Optimizer 不經再次評估，自行宣告輸出已通過。" },
      { key: "C", en: "Remove the rubric and ask both components to use their intuition.", zh: "移除 Rubric，要求兩個元件只憑直覺判斷。" },
      { key: "D", en: "Require criterion-level scores, cited defects, and actionable changes; have the optimizer revise failed dimensions and return the result for re-evaluation.", zh: "要求各標準分數、具體缺陷位置及可執行修改；讓 Optimizer 只修正失敗面向，再送回重新評估。" }
    ],
    answers: ["D"],
    explanation: "有 Rubric 不代表回饋一定可執行；Evaluator 必須指出哪項標準失敗、證據在哪裡，以及什麼改變可以通過。Optimizer 應針對失敗面向修訂並保留已通過內容，再交回 Evaluator 測量分數是否真的提升。若回饋只寫「更好」，增加迭代只會放大成本與隨機改寫，形成沒有進展的 refinement loop。",
    why: {
      A: "模糊回饋沒有提供修正方向，多跑幾輪仍可能重複相同問題。迭代數不能補救壞掉的 feedback contract。",
      B: "產生者自行驗收容易保留相同盲點，也破壞 Evaluator 與 Optimizer 的責任分離。修改後仍需要依相同標準重新評估。",
      C: "直覺比現有 Rubric 更難重複與測量，會使團隊無法判斷版本是否改善。問題在回饋粒度，不在於標準太明確。",
      D: "正確。Criterion-level feedback 把評估結果轉成具體修改工作，重新評估則提供可觀察的改善閉環。"
    },
    terms: [["feedback contract", "回饋契約"], ["criterion-level score", "各標準分數"], ["actionable feedback", "可執行回饋"], ["targeted revision", "針對性修改"], ["re-evaluation", "重新評估"], ["stagnation", "迭代停滯"]]
  },
  {
    id: 28,
    category: "agent",
    title: "計畫後仍要看真實結果",
    type: "single",
    en: "An inventory agent creates a reasonable plan to move stock between warehouses. During execution, the transfer tool reports that the destination capacity changed five minutes ago. What should the agent do NEXT?",
    zh: "庫存 Agent 已建立合理的跨倉調貨計畫。執行時，調貨工具回報目的倉庫容量在五分鐘前已經變更。Agent 下一步應怎麼做？",
    options: [
      { key: "A", en: "Ignore the tool result because the original plan was already approved.", zh: "忽略工具結果，因為原始計畫已獲核准。" },
      { key: "B", en: "Repeat the same transfer call until the environment accepts the old plan.", zh: "持續重送相同調貨呼叫，直到環境接受舊計畫。" },
      { key: "C", en: "Treat the tool result as ground truth, update state, and replan or pause if the objective is no longer safely achievable.", zh: "將工具結果視為 Ground Truth，更新狀態；若目標已無法安全達成，就重新規劃或暫停。" },
      { key: "D", en: "Ask a language model to invent a replacement capacity value without another observation.", zh: "在沒有其他觀察資料的情況下，要求模型自行編造替代容量。" }
    ],
    answers: ["C"],
    explanation: "Agentic loop 的核心是 plan、act、observe、adjust，而不是先做一次計畫就盲目執行到底。工具回傳代表目前環境的 ground truth，應寫入狀態並重新檢查限制條件。若無安全替代方案或變更超出已核准範圍，Agent 應停在 checkpoint 並請人判斷。",
    why: {
      A: "計畫是根據先前狀態建立，不會凌駕新的環境事實。忽略容量變更可能造成超載或失敗操作。",
      B: "同樣輸入在限制未改變時只會重複失敗，還可能消耗額度。重試應針對暫時性故障，而不是用來否認有效的業務結果。",
      C: "正確。Agent 應根據觀察結果更新計畫，並在無法安全達成目標時停止或要求人工介入。",
      D: "模型推測不能取代真實庫存系統的資料。編造數值會讓後續決策失去可驗證依據。"
    },
    terms: [["plan–act–observe–adjust", "規劃—行動—觀察—調整"], ["ground truth", "環境真實結果"], ["replanning", "重新規劃"], ["state update", "狀態更新"], ["checkpoint", "檢查點"]]
  },
  {
    id: 29,
    category: "agent",
    title: "付款前的人類核准",
    type: "multiple",
    en: "A procurement agent may research suppliers and prepare an order, but a human must authorize every purchase before money is committed. Which TWO controls provide meaningful human approval?",
    zh: "採購 Agent 可以調查供應商並準備訂單，但每筆購買在承諾付款前都必須由人員授權。哪兩項控制能提供真正有效的人類核准？（選 TWO 項）",
    options: [
      { key: "A", en: "Show the exact supplier, items, total, and payment effect, then require an explicit approve or reject decision.", zh: "顯示確切供應商、品項、總額及付款效果，再要求明確核准或拒絕。" },
      { key: "B", en: "Ask for approval before research begins, when the supplier and total are still unknown.", zh: "在調查開始、供應商與總額仍未知時就要求核准。" },
      { key: "C", en: "Treat the absence of a response for thirty seconds as approval.", zh: "把三十秒內沒有回覆視為已核准。" },
      { key: "D", en: "Keep the purchase tool blocked until the authorization service records the approver and approved parameters.", zh: "在授權服務記錄核准人與核准參數前，保持購買工具不可執行。" }
    ],
    answers: ["A", "D"],
    explanation: "有效核准必須發生在使用者看得到實際待執行動作之後、不可逆副作用之前。介面應顯示供應商、品項與總額，而程式化 gate 應驗證核准記錄和真正執行的參數一致。逾時、模糊同意或過早核准都不能證明人員理解最後交易。",
    why: {
      A: "正確。人員只有看到實際交易內容與效果，才能作出知情的 approve／reject 決定。",
      B: "研究前的概括同意不涵蓋最後選定的供應商、品項或金額。高風險動作需要針對具體參數核准。",
      C: "沉默不能當成同意，尤其涉及付費副作用。逾時應維持阻擋狀態或取消交易。",
      D: "正確。授權服務與程式化 gate 讓模型無法僅靠文字聲稱已獲核准，並留下可稽核紀錄。"
    },
    terms: [["human-in-the-loop", "人類參與決策"], ["informed approval", "知情核准"], ["irreversible action", "不可逆操作"], ["authorization gate", "授權關卡"], ["audit record", "稽核紀錄"]]
  },
  {
    id: 30,
    category: "agent",
    title: "客服 Agent 權限怎麼切？",
    type: "single",
    en: "A support agent answers delivery questions and occasionally requests a refund. It currently runs under an administrator credential that can read payroll records, delete customers, and issue unlimited refunds. Which redesign BEST applies least privilege?",
    zh: "客服 Agent 平常回答配送問題，偶爾申請退款。目前它使用管理員憑證，可讀取薪資資料、刪除客戶並執行無上限退款。哪種重新設計最符合最小權限？",
    options: [
      { key: "A", en: "Keep the administrator credential but add a prompt saying not to misuse it.", zh: "保留管理員憑證，但在 Prompt 中要求不得濫用。" },
      { key: "B", en: "Hide the administrator credential name from the model while retaining all permissions.", zh: "向模型隱藏管理員憑證名稱，但保留全部權限。" },
      { key: "C", en: "Give each subagent the same administrator credential for consistency.", zh: "為了設定一致，把相同管理員憑證交給每個 Subagent。" },
      { key: "D", en: "Use role-scoped identities and tools: delivery read access, bounded refund requests, and no payroll or deletion permission.", zh: "使用依角色限縮的身分與工具：配送唯讀、退款金額受限，且沒有薪資或刪除權限。" }
    ],
    answers: ["D"],
    explanation: "最小權限要求每個元件只具備完成當前角色所需的資料與動作範圍，並在身分、API 與工具層強制執行。配送查詢可使用唯讀權限，退款可限制金額或改成送審請求，薪資與刪除權限則完全不提供。這樣即使 Agent 判斷錯誤或遭 Prompt Injection，最大影響仍被技術邊界限制。",
    why: {
      A: "Prompt 提醒不能縮小憑證實際權限，也不是安全邊界。模型若選錯工具，後端仍會接受高權限操作。",
      B: "隱藏名稱不會改變後端授權能力。真正的 least privilege 必須移除不必要權限，而不是只讓模型看不到名稱。",
      C: "把管理員憑證複製給更多 Agent 會擴大攻擊面與資料暴露。專業分工應搭配各自的 scoped permissions。",
      D: "正確。權限在系統層依角色與動作限縮，將可造成的最大損害控制在必要範圍內。"
    },
    terms: [["least privilege", "最小權限"], ["role-scoped identity", "角色限縮身分"], ["bounded action", "範圍受限操作"], ["prompt injection", "Prompt Injection"], ["blast radius", "最大影響範圍"]]
  },
  {
    id: 31,
    category: "agent",
    title: "跨主機如何 Resume Session？",
    type: "multiple",
    en: "A multi-user Agent SDK service must resume a specific conversation after a process restart, sometimes on a different host. Session transcripts are currently stored only on each worker's local disk, and external files may change while the session is paused. Which TWO practices make resumption reliable?",
    zh: "多使用者 Agent SDK 服務必須在程序重新啟動後 Resume 指定對話，有時會改由另一台主機接手。目前 Session Transcript 只存在各 Worker 的本機磁碟，而且暫停期間外部檔案可能變更。哪兩項做法能讓續作可靠？（選 TWO 項）",
    options: [
      { key: "A", en: "Store only the session ID; assume any host can reconstruct a transcript that is not available to it.", zh: "只保存 Session ID，並假設任何主機都能重建自己無法取得的 Transcript。" },
      { key: "B", en: "Use continue-most-recent for every user instead of tracking which session belongs to whom.", zh: "不追蹤 Session 與使用者的關係，所有人一律使用 Continue Most Recent。" },
      { key: "C", en: "Capture the specific session ID and make its transcript available through a shared SessionStore or an equivalent restored session path and working directory.", zh: "保存指定 Session ID，並透過 Shared SessionStore，或還原相同 Session 路徑與工作目錄，讓 Transcript 可被新主機取得。" },
      { key: "D", en: "After resuming, re-read mutable external data and verify current assumptions because session history does not snapshot the environment.", zh: "Resume 後重新讀取可變外部資料並驗證目前假設，因為 Session History 不會替環境建立快照。" }
    ],
    answers: ["C", "D"],
    explanation: "`resume` 需要指定 Session ID，也需要執行主機實際取得對應 Transcript；只有 ID 而沒有本機檔案或 Shared SessionStore 並不足夠。多使用者服務必須明確對應使用者與 Session，不能依賴目錄中「最近一個」對話。Session 保存的是對話與過去工具結果，不會凍結檔案系統或外部 API，因此續作後要重新驗證會變動的 ground truth。",
    why: {
      A: "Session ID 是索引，不包含 Transcript 本身。若新主機找不到對應儲存內容，SDK 無法恢復原對話歷史。",
      B: "Continue Most Recent 適合單一對話流程，不適合多使用者併發服務。它可能把某位使用者接到另一個人的最近 Session。",
      C: "正確。保存 ID 並提供可共享或正確還原的 Transcript，才能讓不同程序載入同一段對話 Context。",
      D: "正確。過去曾讀取的檔案與服務結果可能已經過期，Resume 後應針對可變依賴重新取得真實狀態。"
    },
    terms: [["session ID", "Session 識別碼"], ["transcript", "對話紀錄"], ["SessionStore", "Session 儲存介面"], ["resume", "指定 Session 續作"], ["working directory", "工作目錄"], ["mutable ground truth", "可變環境事實"]]
  },
  {
    id: 32,
    category: "agent",
    title: "兩台 Worker 同時重複入帳",
    type: "single",
    en: "A queue delivers the same loyalty-credit event to two agent workers at the same time. Both workers perform a separate 'already processed?' read before either writes, so both reads return no and two credits are created. Which redesign BEST closes this concurrency gap?",
    zh: "佇列同時把相同的會員點數事件交給兩台 Agent Worker。兩者都先分開查詢「是否已處理」，而且在任何一方寫入前都得到否定答案，結果建立兩筆點數。哪種重新設計最能修補這個併發缺口？",
    options: [
      { key: "A", en: "Use the stable business-operation key in an atomic claim or unique constraint, create the credit and stored outcome transactionally, and have the losing worker return the existing outcome.", zh: "對穩定的業務操作 Key 使用原子 Claim 或 Unique Constraint，以交易方式建立點數及保存結果，失敗取得者則回傳既有結果。" },
      { key: "B", en: "Keep the separate read and insert, but add a short delay before each insert.", zh: "保留分開的查詢與新增，只在每次新增前加上短暫延遲。" },
      { key: "C", en: "Give each worker a different operation key so neither can see the other's request.", zh: "給每台 Worker 不同的 Operation Key，使彼此看不到對方請求。" },
      { key: "D", en: "Add a prompt telling Claude that duplicate credits are undesirable.", zh: "在 Prompt 中告訴 Claude 不希望產生重複點數。" }
    ],
    answers: ["A"],
    explanation: "Idempotency key 只有在服務端以原子方式主張唯一業務操作時才真正有效；分開的 check-then-act 會留下兩台 Worker 同時通過檢查的 Race Condition。資料層可用 Unique Constraint、原子 Insert 或鎖定交易確保只有一位 Worker 建立點數與保存結果。另一位收到唯一性衝突後應讀取並回傳同一結果，而不是再建立新的副作用。",
    why: {
      A: "正確。唯一性由交易邊界強制執行，即使兩個請求同時抵達，也只有一筆業務效果能成功提交。",
      B: "延遲只改變競爭發生的機率，不能消除兩個 Worker 同時通過查詢的可能。正確性不能依靠時序運氣。",
      C: "不同 Key 會讓去重層把相同事件視為兩項業務操作，保證無法偵測重複。Key 必須源自穩定的業務身分。",
      D: "Prompt 不能協調兩個並行程序，也無法在資料庫層阻止第二次提交。併發正確性需要原子技術控制。"
    },
    terms: [["atomic claim", "原子主張"], ["unique constraint", "唯一性限制"], ["check-then-act", "先查後做"], ["race condition", "競爭條件"], ["transaction boundary", "交易邊界"], ["stable operation key", "穩定操作 Key"]]
  },
  {
    id: 33,
    category: "agent",
    title: "研究 Agent 何時應停止？",
    type: "multiple",
    en: "An open-ended research agent keeps following new links because it can always find another possible source. The team needs useful coverage without unbounded cost or endless execution. Which TWO controls should be implemented?",
    zh: "開放式研究 Agent 不斷追蹤新連結，因為總能再找到另一個可能來源。團隊需要足夠涵蓋範圍，但不能讓成本無上限或永遠執行。應實作哪兩項控制？（選 TWO 項）",
    options: [
      { key: "A", en: "Continue until the model uses the word perfect in its answer.", zh: "持續執行，直到模型在答案中使用「完美」一詞。" },
      { key: "B", en: "Define measurable completion criteria, such as required source diversity and resolved research questions.", zh: "定義可測量的完成條件，例如必要來源多樣性及已解決的研究問題。" },
      { key: "C", en: "Enforce hard limits on turns, elapsed time, or spend, then return partial results or escalate when a limit is reached.", zh: "強制限制回合數、經過時間或費用，達上限時回傳部分結果或轉人工。" },
      { key: "D", en: "Allow each worker to spawn unlimited additional workers without reporting usage.", zh: "允許每個 Worker 無限制建立更多 Worker，而且不回報使用量。" }
    ],
    answers: ["B", "C"],
    explanation: "可靠 Agent 同時需要語意上的完成條件與系統層的安全上限。前者回答「工作何時足夠完整」，後者則在模型無法收斂或外部服務異常時限制最大回合、時間與費用。達到硬上限不應假裝任務成功，而應保存 checkpoint、清楚標示缺口並回傳部分結果或轉人工。",
    why: {
      A: "特定文字不是可靠的任務完成證據，模型可能過早說完美，也可能永遠不用這個詞。停止判斷應連到可驗證成果。",
      B: "正確。來源多樣性、問題清單與驗收門檻讓 Agent 能根據明確任務狀態判斷完成。",
      C: "正確。硬性 budget 是最後安全網，可防止無限迴圈與成本失控，並定義達上限時的處理方式。",
      D: "無限制 fan-out 可能使 Token、工具費用與併發量爆增。Subagent 也必須繼承或受中央預算與可觀測性控制。"
    },
    terms: [["stop condition", "停止條件"], ["completion criteria", "完成標準"], ["hard budget", "硬性預算上限"], ["iteration cap", "迭代上限"], ["partial result", "部分結果"], ["escalation", "轉人工"]]
  },
  {
    id: 34,
    category: "agent",
    title: "主要服務失效怎麼辦？",
    type: "single",
    en: "A customer-support agent normally uses a capable model and a live order tool. During an outage, the order tool is unavailable, so current order status cannot be verified. Which fallback behavior is SAFEST?",
    zh: "客服 Agent 平常使用高能力模型與即時訂單工具。服務中斷期間，訂單工具無法使用，因此不能驗證目前訂單狀態。哪種備援行為最安全？",
    options: [
      { key: "A", en: "Invent a likely order status from the customer's wording so the conversation can continue.", zh: "根據客戶措辭編造可能的訂單狀態，讓對話可以繼續。" },
      { key: "B", en: "Retry indefinitely with no backoff until the tool responds.", zh: "不採用 Backoff，無限重試直到工具回應。" },
      { key: "C", en: "Use an older cached status without disclosing its timestamp or uncertainty.", zh: "使用舊的快取狀態，但不揭露時間或不確定性。" },
      { key: "D", en: "Degrade to verified static guidance, disclose that live status is unavailable, and create a resumable handoff for status-specific help.", zh: "降級為已驗證的靜態指引，說明即時狀態目前不可用，並為需要訂單狀態的問題建立可續接人工交接。" }
    ],
    answers: ["D"],
    explanation: "Fallback 不應把能力降低偽裝成完整成功，而應明確界定仍可安全提供的服務。工具不可用時，Agent 可以回答經驗證的通用政策，但對即時狀態必須坦白無法確認並保存交接所需 Context。重試應有次數、Backoff 與 Circuit Breaker，避免中斷期間放大負載。",
    why: {
      A: "訂單狀態是外部事實，無法由語句推測。編造狀態會把基礎設施故障轉成對客戶的錯誤承諾。",
      B: "無限且無 Backoff 的重試可能形成重試風暴，增加故障服務負載與成本。應有界限地重試並啟動 fallback。",
      C: "快取資料若標明時間可作為有限參考，但隱藏陳舊程度會誤導客戶。高時效資訊不能冒充目前事實。",
      D: "正確。它保留仍可靠的低風險能力，對無法驗證之處誠實降級，並提供不中斷的後續處理。"
    },
    terms: [["graceful degradation", "優雅降級"], ["fallback", "備援處理"], ["backoff", "退避重試"], ["circuit breaker", "斷路器"], ["resumable handoff", "可續接交接"]]
  },
  {
    id: 35,
    category: "agent",
    title: "不同難度用哪個模型？",
    type: "multiple",
    en: "A platform processes millions of routine ticket classifications and a small number of ambiguous cases requiring deep policy reasoning. Using the most capable model for every request meets quality targets but exceeds the budget. Which TWO changes are architecturally sound?",
    zh: "平台每月處理數百萬筆例行工單分類，另有少量模糊案件需要深入政策推理。所有請求都使用最高能力模型雖然品質達標，卻超出預算。哪兩項架構調整合理？（選 TWO 項）",
    options: [
      { key: "A", en: "Benchmark a faster, lower-cost model on routine cases and use it only where the evaluation threshold is met.", zh: "以例行案件評估速度更快、成本較低的模型，只在達到評估門檻的範圍使用。" },
      { key: "B", en: "Move every request to the cheapest model without measuring quality by case type.", zh: "把所有請求都改用最便宜的模型，而且不按案件類型測量品質。" },
      { key: "C", en: "Route ambiguous or low-confidence cases to a more capable model or human path, and monitor routing errors.", zh: "將模糊或低信心案件分流至更高能力模型或人工路徑，並監測分流錯誤。" },
      { key: "D", en: "Choose models only by their context-window size, ignoring latency, price, and task performance.", zh: "只依 Context Window 大小選模型，忽略延遲、價格及任務表現。" }
    ],
    answers: ["A", "C"],
    explanation: "模型選擇應以實際工作負載的品質、延遲與成本評估為依據，而不是把單一模型套用所有情況。例行案例可由通過門檻的高效率模型處理，模糊或低信心案例再升級到能力較強的模型或人工。這種分層 Routing 必須追蹤誤分流率，因為便宜模型若把困難案例錯判成簡單案例，品質仍會下降。",
    why: {
      A: "正確。先用代表性例行資料證明較低成本模型達標，才能在不犧牲要求的前提下降低總成本。",
      B: "全面降級忽略不同案例的能力需求，可能使少量高風險案件嚴重失敗。成本優化仍需受品質門檻約束。",
      C: "正確。能力分層將昂貴推理集中在真正需要的案例，並透過低信心與人工 fallback 控制風險。",
      D: "Context Window 只是模型規格之一，不能代表特定任務的準確率或經濟性。架構選擇需同時評估品質、延遲、成本及功能。"
    },
    terms: [["model routing", "模型分流"], ["evaluation threshold", "評估門檻"], ["low-confidence case", "低信心案例"], ["escalation tier", "升級層級"], ["cost–quality tradeoff", "成本—品質取捨"]]
  },
  {
    id: 36,
    category: "agent",
    title: "工具資料如何統一格式？",
    type: "single",
    en: "Three approved data tools return dates and risk scores in different formats. Every downstream agent must receive the same normalized schema after any of those tools succeeds. Which Agent SDK mechanism is MOST appropriate?",
    zh: "三個已核准的資料工具會以不同格式回傳日期及風險分數。只要其中任何工具成功執行，每個下游 Agent 都必須收到相同的標準化 Schema。最適合使用哪個 Agent SDK 機制？",
    options: [
      { key: "A", en: "A PreToolUse hook that invents normalized results before the tools execute.", zh: "使用 PreToolUse Hook，在工具執行前編造標準化結果。" },
      { key: "B", en: "A prompt reminder asking every downstream agent to guess each tool's date format.", zh: "在 Prompt 中提醒每個下游 Agent 猜測各工具的日期格式。" },
      { key: "C", en: "A matching PostToolUse hook that transforms successful tool results into the canonical schema.", zh: "使用符合條件的 PostToolUse Hook，把成功工具結果轉成標準 Schema。" },
      { key: "D", en: "A session-start hook that runs once before any result exists.", zh: "使用 Session Start Hook，在任何結果產生前只執行一次。" }
    ],
    answers: ["C"],
    explanation: "Agent SDK Hook 能在工具生命週期的確定事件攔截與處理資料。PostToolUse 發生在工具成功執行之後，已取得真實結果，因此適合把異質日期、欄位名稱及風險分數轉成 canonical schema。若需求是阻止未授權工具在執行前發生，才應改用 PreToolUse；資料標準化不能只靠每個模型自行猜測。",
    why: {
      A: "PreToolUse 適合在工具執行前檢查或阻擋呼叫，但此時尚未取得工具結果。沒有原始資料就無法正確做結果標準化。",
      B: "Prompt 解析可能因工具或格式而不一致，也會把同一轉換邏輯複製到每個 Agent。標準化要求應集中在可測試的程式 Hook。",
      C: "正確。PostToolUse 可以針對指定工具的真實成功結果，確定地套用共同轉換與驗證邏輯。",
      D: "Session Start 發生時間太早，而且只在 Session 生命週期開始時觸發。它看不到每次工具呼叫所產生的新結果。"
    },
    terms: [["Agent SDK hook", "Agent SDK 生命週期 Hook"], ["PostToolUse", "工具成功使用後"], ["PreToolUse", "工具使用前"], ["data normalization", "資料標準化"], ["canonical schema", "標準 Schema"]]
  },
  {
    id: 37,
    category: "agent",
    title: "Agent Loop 何時繼續？",
    type: "single",
    en: "A custom agent loop currently stops whenever Claude emits any text. Sometimes a response contains explanatory text plus a tool_use block, so the tool is never executed and the task ends incomplete. Which correction is BEST?",
    zh: "自製 Agent Loop 目前只要 Claude 輸出任何文字就停止。有時回應同時包含說明文字與 tool_use block，導致工具未執行，任務便不完整地結束。最佳修正方式是什麼？",
    options: [
      { key: "A", en: "Stop whenever the first content block has type text.", zh: "只要第一個 Content Block 的 Type 是 text 就停止。" },
      { key: "B", en: "Search the prose for phrases such as task complete and ignore the API metadata.", zh: "在文字中搜尋「任務完成」之類詞句，並忽略 API Metadata。" },
      { key: "C", en: "Always run a fixed fifty iterations, even after Claude has returned a final answer.", zh: "固定執行五十次迭代，即使 Claude 已回傳最終答案也不停止。" },
      { key: "D", en: "Drive control flow from stop_reason: execute and return tool results for tool_use, finish on end_turn, and explicitly handle other stop reasons plus a safety cap.", zh: "依 stop_reason 控制流程：遇到 tool_use 就執行並回傳工具結果；遇到 end_turn 才完成；其他停止原因及安全上限則另行明確處理。" }
    ],
    answers: ["D"],
    explanation: "Messages API 的 `stop_reason` 才是 Agent Loop 的控制訊號，不能把是否出現文字當成任務完成。`tool_use` 表示應執行對應工具、把 `tool_result` 加入對話後繼續；`end_turn` 才通常表示模型已完成這一輪。`max_tokens`、拒絕或其他停止原因需要各自處理，迭代上限則是防失控的安全網，不是正常完成的替代判準。",
    why: {
      A: "Claude 可以在同一回應中先解釋，再發出工具呼叫；第一個 text block 不代表後面沒有 tool_use。這正是案例中過早停止的原因。",
      B: "自然語言詞句不是穩定的控制協定，可能缺少、翻譯或出現在非完成語境。API 已提供結構化 stop_reason，應直接使用。",
      C: "固定五十次會在已完成後繼續花費 Token，也可能重複副作用。迭代 cap 只能作為最大限制，不能取代正確終止訊號。",
      D: "正確。它依正式 API 狀態驅動 tool loop，保留工具結果，並對異常與成本上限採取明確處理。"
    },
    terms: [["agentic loop", "Agentic 迴圈"], ["stop_reason", "停止原因欄位"], ["tool_use", "工具呼叫"], ["tool_result", "工具結果"], ["end_turn", "回合完成"], ["safety cap", "安全上限"]]
  },
  {
    id: 38,
    category: "agent",
    title: "何時應該 Fork Session？",
    type: "single",
    en: "A research session has gathered and verified extensive evidence for one hypothesis. An analyst now wants to explore a competing hypothesis from that exact point while preserving the original session as an unchanged branch for comparison. Which session strategy is BEST?",
    zh: "研究 Session 已針對某個假設蒐集並驗證大量證據。分析人員現在希望從完全相同的狀態探索競爭假設，同時保留原 Session 為未變更分支，以便比較。哪種 Session 策略最好？",
    options: [
      { key: "A", en: "Resume the original session and replace its conclusions with the competing hypothesis.", zh: "Resume 原 Session，並用競爭假設取代原本結論。" },
      { key: "B", en: "Start a completely fresh session and ask the model to guess the earlier evidence.", zh: "建立完全全新的 Session，再要求模型猜測先前證據。" },
      { key: "C", en: "Fork the session at the verified point, then continue the alternative exploration in the new branch.", zh: "在已驗證位置 Fork Session，再於新分支繼續替代探索。" },
      { key: "D", en: "Let two workers write concurrently into the same mutable session transcript.", zh: "讓兩個 Worker 同時寫入同一份可變 Session Transcript。" }
    ],
    answers: ["C"],
    explanation: "Resume 適合沿著同一條 Session 歷史繼續未完成工作；Fork 則複製指定點的狀態，建立可獨立發展的新分支。案例要求兩個假設從相同證據起點分岔，而且原分支保持不變，因此 fork_session 最符合需求。若外部資料自該點後已改變，新分支仍應重新驗證相關 ground truth，而不是把舊工具結果永遠視為有效。",
    why: {
      A: "Resume 會在原本歷史上繼續，可能改變後續內容，無法保留未變更的比較分支。它適合單一路徑續作而非刻意分岔。",
      B: "Fresh session 可以隔離工作，但不會自動擁有先前已驗證狀態。要求模型猜測證據會破壞來源與可靠性。",
      C: "正確。Fork 保留共同的歷史起點，同時讓新分支以不同假設獨立發展，方便最後比較。",
      D: "兩個方向同時改寫同一 Transcript 會混合假設與結果，產生競爭和難以追溯的 Context。分支應有各自的 Session 狀態。"
    },
    terms: [["session resumption", "Session 續作"], ["fork_session", "Session 分岔"], ["branch", "分支"], ["shared starting state", "共同起始狀態"], ["stale tool result", "過期工具結果"]]
  },
  {
    id: 39,
    category: "agent",
    title: "Subagent 定義了卻無法啟動",
    type: "multiple",
    en: "A Claude Agent SDK coordinator defines search and synthesis subagents, but its allowedTools list omits the subagent-spawning tool. Both AgentDefinitions also use the same generic prompt and expose every tool. In the v1.0 exam-guide terminology, which TWO changes correctly configure delegation?",
    zh: "Claude Agent SDK Coordinator 已定義 Search 與 Synthesis Subagent，但 allowedTools 漏掉用來啟動 Subagent 的工具；兩個 AgentDefinition 也共用同一段通用 Prompt，並暴露所有工具。依 v1.0 考試指南用語，哪兩項變更能正確配置委派？（選 TWO 項）",
    options: [
      { key: "A", en: "Mention subagents in the coordinator prompt and assume prose grants access to a spawning tool that is absent from allowedTools.", zh: "只在 Coordinator Prompt 提到 Subagent，並假設文字指示能授予 allowedTools 中不存在的啟動工具。" },
      { key: "B", en: "Include Task in the coordinator's allowedTools so it can invoke subagents, using the tool name specified by the v1.0 blueprint.", zh: "把 Task 加入 Coordinator 的 allowedTools，使其能啟動 Subagent；此為 v1.0 Blueprint 使用的工具名稱。" },
      { key: "C", en: "Give each AgentDefinition a role-specific description, system prompt, and minimal tool set aligned with that subagent's job.", zh: "為每個 AgentDefinition 設定符合職責的 Description、System Prompt 與最小工具集合。" },
      { key: "D", en: "Give both subagents the full parent transcript, identical instructions, and unrestricted tools so either can perform every role.", zh: "把完整 Parent Transcript、相同指示及不受限制的工具交給兩個 Subagent，使任何一個都能執行所有角色。" }
    ],
    answers: ["B", "C"],
    explanation: "Blueprint v1.0 把 Task Tool 列為 Coordinator 啟動 Subagent 的機制，因此只建立 AgentDefinition 還不夠，Coordinator 的 allowedTools 也必須包含 Task。每個 AgentDefinition 應以 Description 說明何時委派、用專屬 System Prompt 定義工作與輸出，並只開放角色需要的工具。新版 Claude Code 文件可能把同一委派入口顯示為 Agent；準備本版考試時應辨識名稱差異，但核心原則仍是明確開放委派工具與限制各 Subagent 的能力面。",
    why: {
      A: "Prompt 只能指導模型如何決策，不能讓未提供的 Tool Definition 出現在可呼叫工具面。缺少委派工具時，Coordinator 即使理解任務也無法真正 Spawn Subagent。",
      B: "正確。v1.0 Blueprint 明列 Coordinator 的 allowedTools 必須包含 Task，否則它看不到或不能使用啟動 Subagent 的正式入口。",
      C: "正確。Role-specific Definition 能改善委派選擇與輸出一致性，最小工具集合則降低跨角色誤用及不必要的權限風險。",
      D: "Subagent 不會自動繼承 Parent Context，而且也不應無差別取得完整 Transcript 與所有工具。應只傳入完成該任務所需的背景、來源及能力。"
    },
    terms: [["Task tool", "v1.0 的 Subagent 啟動工具"], ["allowedTools", "允許使用的工具清單"], ["AgentDefinition", "Subagent 定義"], ["role-specific prompt", "角色專屬 Prompt"], ["tool restriction", "工具限制"], ["delegation", "委派"]]
  },
  {
    id: 40,
    category: "agent",
    title: "Subagent 為何漏掉來源？",
    type: "multiple",
    en: "A coordinator must launch three independent research subagents. The subagents currently return claims without citations because their prompts assume they can see the coordinator's earlier conversation and source list. Which TWO changes fix context passing and reduce unnecessary latency?",
    zh: "Coordinator 必須啟動三個互不相依的研究 Subagent。這些 Subagent 目前只回傳結論而沒有引用，因為它們的 Prompt 假設自己能看到 Coordinator 先前對話與來源清單。哪兩項變更可修正 Context 傳遞並降低不必要延遲？（選 TWO 項）",
    options: [
      { key: "A", en: "Assume every subagent automatically inherits the full parent transcript and all prior tool results.", zh: "假設每個 Subagent 都會自動繼承完整 Parent Transcript 與所有先前工具結果。" },
      { key: "B", en: "Pass each subagent a scoped prompt containing its task and the required source metadata and output contract.", zh: "為每個 Subagent 傳入範圍明確的 Prompt，其中包含任務、必要來源 Metadata 與輸出契約。" },
      { key: "C", en: "Launch one subagent, wait for it to finish, and only then launch the next even though the tasks are independent.", zh: "即使任務互不相依，仍先啟動一個 Subagent，等完成後才啟動下一個。" },
      { key: "D", en: "Invoke the independent subagents in the same orchestration turn and collect all results before synthesis.", zh: "在同一個 Orchestration Turn 呼叫互不相依的 Subagent，收齊結果後再整合。" }
    ],
    answers: ["B", "D"],
    explanation: "Subagent 使用隔離的 Context，不能假設它自動看得到 Parent 的完整對話、工具結果或其他 Subagent 的發現。Coordinator 應在每次 invocation 中明確傳入完成任務所需的最小 Context，並用結構化欄位保留 source URL、日期及引用資訊。三項研究彼此獨立時可在同一輪生成多個呼叫並平行執行，之後再把所有結果交給 synthesis 階段。",
    why: {
      A: "Subagent 的隔離能避免無關 Context 汙染，但也表示所需資料必須明確提供。依賴不存在的隱性繼承正是引用遺失的原因。",
      B: "正確。Scoped prompt 與結構化 output contract 讓 Subagent 取得足夠但不過量的資料，且能把來源一路帶回整合階段。",
      C: "序列啟動會把三個處理時間相加，卻沒有任何資料相依性理由。只有後一項需要前一項結果時才應等待。",
      D: "正確。同一輪發出獨立呼叫可讓它們並行，總延遲接近最慢任務，再由 Coordinator 收斂結果。"
    },
    terms: [["subagent invocation", "Subagent 呼叫"], ["context isolation", "Context 隔離"], ["explicit context passing", "明確 Context 傳遞"], ["output contract", "輸出契約"], ["parallel spawning", "平行建立"], ["source metadata", "來源 Metadata"]]
  },
  {
    id: 41,
    category: "agent",
    title: "報告漏章節該怪誰？",
    type: "single",
    en: "An orchestrator asks three workers to investigate a new market. Every worker accurately completes its assigned task, but the final report omits regulatory risk because the orchestrator never created that subtask. What is the BEST corrective action?",
    zh: "Orchestrator 指派三位 Worker 調查新市場。每位 Worker 都正確完成分配任務，但最終報告漏掉法規風險，因為 Orchestrator 從未建立這項子任務。最佳修正措施是什麼？",
    options: [
      { key: "A", en: "Improve the orchestrator's decomposition and coverage checks, then evaluate whether required dimensions are assigned before synthesis.", zh: "改善 Orchestrator 的任務分解與涵蓋檢查，並在整合前評估必要面向是否都已分派。" },
      { key: "B", en: "Penalize the workers for not completing work they were never assigned.", zh: "處罰 Worker 沒有完成從未分配給它們的工作。" },
      { key: "C", en: "Give every worker an unrestricted prompt to investigate everything without role boundaries.", zh: "給每位 Worker 不受限制的 Prompt，要求不分角色調查所有事項。" },
      { key: "D", en: "Remove the synthesis step and concatenate the incomplete worker outputs.", zh: "移除整合步驟，直接串接不完整的 Worker 輸出。" }
    ],
    answers: ["A"],
    explanation: "多 Agent 系統的失敗要沿著任務分解、Context 傳遞、Worker 執行與整合軌跡找根因。此例 Worker 完成了所有被指派內容，真正缺口發生在 Orchestrator 沒有建立法規任務。修正應加入必要面向的 coverage rubric 或 evaluator，讓整合前能發現尚未分派的研究缺口並補派工作。",
    why: {
      A: "正確。它直接處理上游分解缺陷，並以可評估的涵蓋檢查防止同類遺漏。",
      B: "Worker 無法可靠完成沒有收到的任務與 Context。把上游錯誤歸咎於下游會讓真正原因持續存在。",
      C: "讓所有 Worker 做所有事情會重複成本、稀釋專注度並擴大權限。角色邊界仍應保留，問題在於分派不完整。",
      D: "串接不會補出從未研究的法規內容，也可能留下矛盾與重複。Synthesis 是形成一致報告的重要步驟。"
    },
    terms: [["root-cause tracing", "根因追蹤"], ["task decomposition", "任務分解"], ["coverage check", "涵蓋檢查"], ["upstream failure", "上游失敗"], ["synthesis", "整合"]]
  },
  {
    id: 42,
    category: "agent",
    title: "帳號修復如何安全自動化？",
    type: "multiple",
    en: "An IT remediation agent diagnoses account problems from logs and may eventually disable an account, which can interrupt a user's work. Untrusted ticket text is part of the input. Which TWO architectural controls are MOST important before production deployment?",
    zh: "IT 修復 Agent 會根據日誌診斷帳號問題，最後可能停用帳號，造成使用者工作中斷。輸入中還包含不受信任的工單文字。正式部署前哪兩項架構控制最重要？（選 TWO 項）",
    options: [
      { key: "A", en: "Separate read-only diagnosis from a narrowly scoped executor identity that can disable only the approved account.", zh: "把唯讀診斷與權限受限的執行身分分開，後者只能停用已核准的指定帳號。" },
      { key: "B", en: "Give the diagnostic agent domain-administrator access so it never encounters a permission error.", zh: "給診斷 Agent 網域管理員權限，確保永遠不會遇到權限錯誤。" },
      { key: "C", en: "Require a programmatic approval gate showing evidence and the exact target before the disable operation, and log the decision.", zh: "停用前設置程式化核准關卡，顯示證據與確切目標，並記錄決策。" },
      { key: "D", en: "Rely only on a system-prompt sentence telling the agent to ignore malicious ticket instructions.", zh: "只依靠 System Prompt 中一句話，要求 Agent 忽略工單裡的惡意指令。" }
    ],
    answers: ["A", "C"],
    explanation: "安全架構應把低風險觀察與高風險副作用分離，並使執行憑證只能操作經核准的明確目標。停用帳號前，程式化 gate 要驗證證據、目標與人員授權，完整記錄可供事後查核。Prompt 可協助模型辨識不受信任內容，但不能取代最小權限與核准邊界，因為 Prompt Injection 仍可能影響模型判斷。",
    why: {
      A: "正確。診斷階段不需要寫入權限，而 executor 的目標限縮可大幅縮小錯誤或攻擊的影響範圍。",
      B: "Domain administrator 權限遠超任務需要，任何錯誤工具呼叫都可能影響整個組織。避免權限錯誤不能成為取消最小權限的理由。",
      C: "正確。人員能在副作用前看到確切證據與帳號，程式 gate 和日誌則提供不可跳過且可稽核的控制。",
      D: "System Prompt 是重要指引，但不受信任內容仍可能造成 Prompt Injection。只有文字提醒而沒有權限與 gate，無法形成可靠安全邊界。"
    },
    terms: [["read-only diagnosis", "唯讀診斷"], ["scoped executor", "權限限縮執行者"], ["approval gate", "核准關卡"], ["untrusted input", "不受信任輸入"], ["prompt injection", "Prompt Injection"], ["responsible deployment", "負責任部署"]]
  }
];
