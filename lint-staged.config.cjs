const path = require('node:path');

function quote(file) {
  return `"${file}"`;
}

function createWorkspaceEslintCommand(workspaceDir) {
  return (files) => {
    const relativeFiles = files
      .map((file) => path.relative(workspaceDir, file))
      .filter((file) => !file.startsWith('..'));

    if (!relativeFiles.length) {
      return [];
    }

    return [
      `pnpm --dir ${workspaceDir} exec eslint --fix ${relativeFiles.map(quote).join(' ')}`,
      `pnpm exec prettier --check ${files.map(quote).join(' ')}`,
    ];
  };
}

module.exports = {
  'apps/api/**/*.{ts,tsx,js,jsx,mjs,cjs}': createWorkspaceEslintCommand('apps/api'),
  'apps/web/**/*.{ts,tsx,js,jsx,mjs,cjs}': createWorkspaceEslintCommand('apps/web'),
  'apps/docs/**/*.{ts,tsx,js,jsx,mjs,cjs}': createWorkspaceEslintCommand('apps/docs'),
  'packages/ui/**/*.{ts,tsx,js,jsx,mjs,cjs}': createWorkspaceEslintCommand(
    'packages/ui',
  ),
  '*.{json,md,yml,yaml}': (files) => [
    `pnpm exec prettier --check ${files.map(quote).join(' ')}`,
  ],
};
