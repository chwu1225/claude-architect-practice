const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const files = [
  "questions.js",
  "questions-agent.js",
  "questions-mcp-context.js",
  "questions-code-prompt.js",
  "question-bank.js"
];

const source = files.map(function (file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}).join("\n") + "\nglobalThis.__questions = questions; globalThis.__categories = categories;";

const context = {};
vm.createContext(context);
new vm.Script(source, { filename: "question-bank.bundle.js" }).runInContext(context);

const questions = Array.from(context.__questions);
const categories = context.__categories;
const failures = [];
const expectedCounts = { agent: 27, mcp: 18, code: 20, prompt: 20, context: 15 };
const optionKeys = ["A", "B", "C", "D"];

function check(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

check(questions.length === 100, `Expected 100 questions, found ${questions.length}.`);

const ids = questions.map(function (question) { return question.id; });
check(new Set(ids).size === questions.length, "Question IDs must be unique.");
check(ids.every(function (id, index) { return id === index + 1; }), "Question IDs must be sequential from 1 to 100.");

const normalizedTitles = new Set();
const normalizedPrompts = new Set();

questions.forEach(function (question) {
  const prefix = `Question ${question.id}`;
  check(Object.prototype.hasOwnProperty.call(categories, question.category), `${prefix}: unknown category ${question.category}.`);
  check(["single", "multiple"].includes(question.type), `${prefix}: invalid type ${question.type}.`);
  check(typeof question.title === "string" && question.title.trim().length >= 4, `${prefix}: missing title.`);
  check(typeof question.en === "string" && question.en.trim().length >= 40, `${prefix}: English prompt is too short.`);
  check(typeof question.zh === "string" && question.zh.trim().length >= 20, `${prefix}: Chinese prompt is too short.`);
  check(Array.isArray(question.options) && question.options.length === 4, `${prefix}: exactly four options are required.`);
  check(Array.isArray(question.answers), `${prefix}: answers must be an array.`);
  check(question.type !== "single" || question.answers.length === 1, `${prefix}: a single-choice question needs one answer.`);
  check(question.type !== "multiple" || question.answers.length === 2, `${prefix}: a multiple-response question needs two answers.`);
  check(new Set(question.answers).size === question.answers.length, `${prefix}: answers contain duplicates.`);
  check(question.answers.every(function (answer) { return optionKeys.includes(answer); }), `${prefix}: answer key is invalid.`);
  check(question.answers.join("") === question.answers.slice().sort().join(""), `${prefix}: answer keys must be sorted for consistent display.`);
  check(typeof question.explanation === "string" && question.explanation.trim().length >= 60, `${prefix}: core explanation is shorter than the existing detailed examples.`);
  check(question.why && typeof question.why === "object", `${prefix}: option explanations are missing.`);
  check(Array.isArray(question.terms) && question.terms.length >= 4, `${prefix}: at least four key terms are required.`);

  if (Array.isArray(question.options)) {
    check(question.options.map(function (option) { return option.key; }).join("") === optionKeys.join(""), `${prefix}: options must be ordered A-D.`);
    question.options.forEach(function (option) {
      check(typeof option.en === "string" && option.en.trim().length >= 4, `${prefix}${option.key}: English option is missing.`);
      check(typeof option.zh === "string" && option.zh.trim().length >= 2, `${prefix}${option.key}: Chinese option is missing.`);
      check(question.why && typeof question.why[option.key] === "string" && question.why[option.key].trim().length >= 15, `${prefix}${option.key}: explanation is shorter than the existing detailed examples.`);
      const markedCorrect = question.why && /^正確[。；，]/.test(question.why[option.key]);
      check(question.answers.includes(option.key) === markedCorrect, `${prefix}${option.key}: answer key and option explanation disagree.`);
    });
  }

  if (question.type === "multiple") {
    check(/\bTWO\b/i.test(question.en), `${prefix}: multiple-response English prompt must state TWO.`);
  }

  if (Array.isArray(question.terms)) {
    question.terms.forEach(function (term, index) {
      check(Array.isArray(term) && term.length === 2 && term.every(function (value) {
        return typeof value === "string" && value.trim().length > 0;
      }), `${prefix}: invalid term at index ${index}.`);
    });
  }

  const titleKey = question.title.trim().toLowerCase();
  const promptKey = question.en.replace(/\s+/g, " ").trim().toLowerCase();
  check(!normalizedTitles.has(titleKey), `${prefix}: duplicate title.`);
  check(!normalizedPrompts.has(promptKey), `${prefix}: duplicate English prompt.`);
  normalizedTitles.add(titleKey);
  normalizedPrompts.add(promptKey);
});

Object.keys(expectedCounts).forEach(function (category) {
  const actual = questions.filter(function (question) {
    return question.category === category;
  }).length;
  check(actual === expectedCounts[category], `Category ${category}: expected ${expectedCounts[category]}, found ${actual}.`);
});

if (failures.length > 0) {
  console.error(`Question bank validation failed with ${failures.length} issue(s):`);
  failures.forEach(function (failure) { console.error(`- ${failure}`); });
  process.exit(1);
}

const answerDistribution = optionKeys.reduce(function (counts, key) {
  counts[key] = questions.filter(function (question) {
    return question.answers.includes(key);
  }).length;
  return counts;
}, {});

console.log("Question bank validation passed.");
console.log(`Questions: ${questions.length}`);
console.log(`Categories: ${JSON.stringify(expectedCounts)}`);
console.log(`Answer distribution: ${JSON.stringify(answerDistribution)}`);
