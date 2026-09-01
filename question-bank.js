const questions = [
  ...originalQuestions,
  ...agentQuestions,
  ...mcpContextQuestions,
  ...codePromptQuestions
].sort(function (left, right) {
  return left.id - right.id;
});
