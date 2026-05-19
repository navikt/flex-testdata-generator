const naviktTailwindPreset = require('@navikt/ds-tailwind')

module.exports = {
    presets: [naviktTailwindPreset],
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
}
