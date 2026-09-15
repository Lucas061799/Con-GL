import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

// The point of this config is the pair of rules that would have caught the
// blank pages: using a name that was never imported, in plain code and in JSX.
// Everything else is advisory, so a warning never blocks a build.
export default [
  { ignores: ['dist', 'node_modules'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': 'off',
      'no-empty': 'off',
      // The new compiler rules flag patterns that work here — the scroll refs
      // read during render, the two debounce effects. Left visible, not fatal.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
]
