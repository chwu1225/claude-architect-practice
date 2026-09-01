const storageKey = "claude-architect-practice-v1";
const defaultState = {
  currentIndex: 0,
  language: "bilingual",
  responses: {},
  submitted: {}
};

let state = loadState();
let showSelectionWarning = false;

const questionCard = document.getElementById("questionCard");
const questionMap = document.getElementById("questionMap");
const categoryStrip = document.getElementById("categoryStrip");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const languageToggle = document.getElementById("languageToggle");
const jumpUnanswered = document.getElementById("jumpUnanswered");
const resetButton = document.getElementById("resetButton");
const completionPanel = document.getElementById("completionPanel");
const liveRegion = document.getElementById("liveRegion");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Object.assign({}, defaultState, saved || {});
  } catch (error) {
    return Object.assign({}, defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function arraysEqual(left, right) {
  const a = Array.from(left || []).sort();
  const b = Array.from(right || []).sort();
  return a.length === b.length && a.every(function (value, index) {
    return value === b[index];
  });
}

function isCorrect(question) {
  return Boolean(state.submitted[question.id]) &&
    arraysEqual(state.responses[question.id], question.answers);
}

function getStats() {
  const answered = questions.filter(function (question) {
    return Boolean(state.submitted[question.id]);
  }).length;
  const correct = questions.filter(isCorrect).length;
  return {
    answered: answered,
    correct: correct,
    accuracy: answered ? Math.round((correct / answered) * 100) : null,
    progress: Math.round((answered / questions.length) * 100)
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCategories() {
  categoryStrip.innerHTML = Object.keys(categories).map(function (key) {
    const category = categories[key];
    const active = questions[state.currentIndex].category === key ? " active" : "";
    return '<button class="category-button' + active + '" type="button" data-category="' + key +
      '" style="--category-color:' + category.color + '">' + category.short + "</button>";
  }).join("");

  categoryStrip.querySelectorAll("[data-category]").forEach(function (button) {
    button.addEventListener("click", function () {
      const category = button.getAttribute("data-category");
      const index = questions.findIndex(function (question) {
        return question.category === category;
      });
      goToQuestion(index);
    });
  });
}

function renderMap() {
  questionMap.innerHTML = questions.map(function (question, index) {
    let status = "";
    if (state.submitted[question.id]) {
      status = isCorrect(question) ? " correct" : " wrong";
    }
    if (index === state.currentIndex) {
      status += " current";
    }
    return '<button class="map-button' + status + '" type="button" data-index="' + index +
      '" aria-label="前往第 ' + question.id + ' 題">' + String(question.id).padStart(2, "0") + "</button>";
  }).join("");

  questionMap.querySelectorAll("[data-index]").forEach(function (button) {
    button.addEventListener("click", function () {
      goToQuestion(Number(button.getAttribute("data-index")));
    });
  });
}

function renderStats() {
  const stats = getStats();
  document.getElementById("answeredMetric").textContent = stats.answered;
  document.getElementById("correctMetric").textContent = stats.correct;
  document.getElementById("accuracyMetric").textContent =
    stats.accuracy === null ? "—" : stats.accuracy + "%";
  document.getElementById("progressLabel").textContent = stats.progress + "%";
  document.getElementById("progressFill").style.width = stats.progress + "%";

  if (stats.answered === questions.length) {
    let message = "先不用急著報考，從錯題解析與關鍵單字開始補強。";
    if (stats.correct >= 17) {
      message = "觀念掌握得很穩，可以進入英文限時模擬。";
    } else if (stats.correct >= 13) {
      message = "基礎已建立，建議針對橘色題目再複習一次。";
    }
    completionPanel.className = "completion visible";
    completionPanel.innerHTML = "<h2>完成一輪：答對 " + stats.correct + "／20</h2><p>" + message + "</p>";
  } else {
    completionPanel.className = "completion";
    completionPanel.innerHTML = "";
  }
}

function getOptionClass(question, option) {
  if (!state.submitted[question.id]) {
    return "";
  }
  if (question.answers.includes(option.key)) {
    return " correct-answer";
  }
  const selected = state.responses[question.id] || [];
  if (selected.includes(option.key)) {
    return " wrong-answer";
  }
  return "";
}

function renderQuestion() {
  const question = questions[state.currentIndex];
  const category = categories[question.category];
  const selected = state.responses[question.id] || [];
  const submitted = Boolean(state.submitted[question.id]);
  const inputType = question.type === "multiple" ? "checkbox" : "radio";
  const typeLabel = question.type === "multiple" ? "複選題 · 選兩項" : "單選題";

  const optionHtml = question.options.map(function (option) {
    const checked = selected.includes(option.key) ? " checked" : "";
    const disabled = submitted ? " disabled" : "";
    const disabledClass = submitted ? " disabled" : "";
    const statusClass = getOptionClass(question, option);
    return '<label class="option' + disabledClass + statusClass + '">' +
      '<input type="' + inputType + '" name="question-' + question.id + '" value="' + option.key + '"' +
      checked + disabled + ">" +
      '<span class="option-content">' +
      '<span class="option-key">' + option.key + "</span>" +
      "<span>" +
      '<span class="option-en">' + escapeHtml(option.en) + "</span>" +
      '<span class="option-zh">' + escapeHtml(option.zh) + "</span>" +
      "</span>" +
      "</span>" +
      "</label>";
  }).join("");

  let answerHtml = "";
  if (submitted) {
    const correct = isCorrect(question);
    const whyHtml = question.options.map(function (option) {
      return '<div class="why-item"><span class="why-key">' + option.key +
        '</span><span>' + escapeHtml(question.why[option.key]) + "</span></div>";
    }).join("");
    const termsHtml = question.terms.map(function (term) {
      return '<span class="term"><strong>' + escapeHtml(term[0]) + "</strong> · " +
        escapeHtml(term[1]) + "</span>";
    }).join("");
    answerHtml = '<section class="answer-panel" aria-label="答案解析">' +
      '<div class="answer-result">' +
      '<span class="result-stamp ' + (correct ? "correct" : "wrong") + '">' +
      (correct ? "答對了" : "需要複習") + "</span>" +
      '<span class="correct-answer-text">正確答案：' + question.answers.join("、") + "</span>" +
      "</div>" +
      '<p class="explanation">' + escapeHtml(question.explanation) + "</p>" +
      '<div class="why-grid">' + whyHtml + "</div>" +
      '<div class="terms">' + termsHtml + "</div>" +
      "</section>";
  }

  const actionHtml = submitted
    ? '<button class="secondary-button" id="retryButton" type="button">重新作答這一題</button>'
    : '<button class="primary-button" id="submitButton" type="button">確認答案，查看解析</button>' +
      (showSelectionWarning ? '<span class="selection-warning">請先選擇答案。</span>' : "");

  questionCard.style.setProperty("--category-color", category.color);
  questionCard.className = "question-card" + (state.language === "english" ? " english-only" : "");
  questionCard.innerHTML =
    '<header class="question-head">' +
    '<div class="question-number">' + String(question.id).padStart(2, "0") + "</div>" +
    "<div>" +
    '<p class="question-category">' + category.name + "</p>" +
    '<h2 class="question-title">' + escapeHtml(question.title) + "</h2>" +
    "</div>" +
    '<span class="type-badge">' + typeLabel + "</span>" +
    "</header>" +
    '<div class="question-body">' +
    '<p class="prompt-en" lang="en">' + escapeHtml(question.en) + "</p>" +
    '<p class="prompt-zh">' + escapeHtml(question.zh) + "</p>" +
    '<div class="instruction">' +
    (question.type === "multiple" ? "選出兩項最適合的答案" : "選出一項最適合的答案") +
    "</div>" +
    '<fieldset class="options"><legend class="sr-only">答案選項</legend>' + optionHtml + "</fieldset>" +
    '<div class="action-row">' + actionHtml + "</div>" +
    answerHtml +
    "</div>";

  if (!submitted) {
    questionCard.querySelectorAll("input").forEach(function (input) {
      input.addEventListener("change", function () {
        updateSelection(question, input);
      });
    });
    document.getElementById("submitButton").addEventListener("click", submitAnswer);
  } else {
    document.getElementById("retryButton").addEventListener("click", retryQuestion);
  }

  previousButton.disabled = state.currentIndex === 0;
  nextButton.disabled = state.currentIndex === questions.length - 1;
  languageToggle.textContent =
    state.language === "english" ? "顯示中英對照" : "只看英文題目";
}

function updateSelection(question, input) {
  showSelectionWarning = false;
  if (question.type === "single") {
    state.responses[question.id] = [input.value];
  } else {
    const current = new Set(state.responses[question.id] || []);
    if (input.checked) {
      current.add(input.value);
    } else {
      current.delete(input.value);
    }
    state.responses[question.id] = Array.from(current);
  }
  saveState();
  renderQuestion();
}

function submitAnswer() {
  const question = questions[state.currentIndex];
  const selected = state.responses[question.id] || [];
  if (selected.length === 0) {
    showSelectionWarning = true;
    renderQuestion();
    return;
  }
  state.submitted[question.id] = true;
  showSelectionWarning = false;
  saveState();
  renderAll();
  const correct = isCorrect(question);
  liveRegion.textContent = correct
    ? "第 " + question.id + " 題答對。"
    : "第 " + question.id + " 題需要複習，已顯示詳細解析。";
  setTimeout(function () {
    const answerPanel = questionCard.querySelector(".answer-panel");
    if (answerPanel) {
      answerPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, 80);
}

function retryQuestion() {
  const question = questions[state.currentIndex];
  delete state.responses[question.id];
  delete state.submitted[question.id];
  saveState();
  renderAll();
}

function goToQuestion(index) {
  if (index < 0 || index >= questions.length) {
    return;
  }
  state.currentIndex = index;
  showSelectionWarning = false;
  saveState();
  renderAll();
  window.scrollTo({ top: document.getElementById("quizContent").offsetTop - 14, behavior: "smooth" });
}

function renderAll() {
  renderCategories();
  renderMap();
  renderStats();
  renderQuestion();
}

previousButton.addEventListener("click", function () {
  goToQuestion(state.currentIndex - 1);
});

nextButton.addEventListener("click", function () {
  goToQuestion(state.currentIndex + 1);
});

languageToggle.addEventListener("click", function () {
  state.language = state.language === "english" ? "bilingual" : "english";
  saveState();
  renderQuestion();
});

jumpUnanswered.addEventListener("click", function () {
  const offset = questions.slice(state.currentIndex + 1).findIndex(function (question) {
    return !state.submitted[question.id];
  });
  if (offset >= 0) {
    goToQuestion(state.currentIndex + 1 + offset);
    return;
  }
  const first = questions.findIndex(function (question) {
    return !state.submitted[question.id];
  });
  if (first >= 0) {
    goToQuestion(first);
  } else {
    liveRegion.textContent = "20 題都已作答完成。";
    completionPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

resetButton.addEventListener("click", function () {
  const confirmed = window.confirm("確定要清除 20 題的全部作答與分數嗎？");
  if (!confirmed) {
    return;
  }
  state = Object.assign({}, defaultState, { responses: {}, submitted: {} });
  saveState();
  renderAll();
});

document.addEventListener("keydown", function (event) {
  if (event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  const question = questions[state.currentIndex];
  if (state.submitted[question.id]) {
    if (event.key === "ArrowRight") {
      goToQuestion(Math.min(state.currentIndex + 1, questions.length - 1));
    }
    if (event.key === "ArrowLeft") {
      goToQuestion(Math.max(state.currentIndex - 1, 0));
    }
    return;
  }
  const keyMap = { "1": "A", "2": "B", "3": "C", "4": "D" };
  if (keyMap[event.key]) {
    const input = questionCard.querySelector('input[value="' + keyMap[event.key] + '"]');
    if (input) {
      input.click();
    }
  }
});

renderAll();
