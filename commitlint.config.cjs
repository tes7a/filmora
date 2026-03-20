module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'refactor', 'chore', 'docs', 'test']],
    'subject-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
  },
};
