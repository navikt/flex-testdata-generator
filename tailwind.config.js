/* eslint-disable @typescript-eslint/no-var-requires */

const naviktTailwindPreset = require('@navikt/ds-tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [naviktTailwindPreset],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        // Aksel v8 inkluderer sin egen reset i @layer aksel.reset. Tailwinds preflight
        // genererer unlayered CSS (border-width: 0, button background-color osv.) som
        // overstyrer alle @layer uavhengig av specificity, og dermed fjerner
        // Aksel-komponentenes sine styles.
        preflight: false,
    },
}
