import antfu from '@antfu/eslint-config'
import VueVine from '@vue-vine/eslint-config'

export default antfu(
  {
    stylistic: {
      indent: 2,
      quotes: 'single',
    },

    typescript: true,
    vue: true,

    jsonc: false,
    yaml: false,

    ignores: [
      '**/fixtures',
    ],
    unocss: true,
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
  },
  {
    rules: {
      'curly': 'off',
      'prefer-const': 'off',
    },
  },
  {
    files: ['**/*.vine.ts'],
    rules: {
      'prefer-template': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
  ...VueVine(),
)
