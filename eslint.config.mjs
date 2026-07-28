import { defineConfig } from 'eslint/config'
import nextTs from 'eslint-config-next/typescript'
import nextVitals from 'eslint-config-next/core-web-vitals'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
        },
    },
    {
        extends: [prettierRecommended],
        rules: {
            'prettier/prettier': 'warn',
        },
    },
])
