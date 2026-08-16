module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'on-primary': 'var(--color-on-primary)',
                text: 'var(--color-text)',
                muted: 'var(--color-muted)',
                accent: 'var(--color-accent)'
                ,
                purple: {
                    100: 'var(--purple-100)',
                    200: 'var(--purple-200)',
                    500: 'var(--purple-500)',
                    600: 'var(--purple-600)',
                    700: 'var(--purple-700)',
                    800: 'var(--purple-800)'
                },
                blue: {
                    100: 'var(--blue-100)',
                    200: 'var(--blue-200)',
                    500: 'var(--blue-500)',
                    600: 'var(--blue-600)',
                    700: 'var(--blue-700)',
                    800: 'var(--blue-800)'
                },
                green: {
                    100: 'var(--green-100)',
                    200: 'var(--green-200)',
                    500: 'var(--green-500)',
                    600: 'var(--green-600)',
                    700: 'var(--green-700)',
                    800: 'var(--green-800)'
                },
                indigo: {
                    100: 'var(--indigo-100)',
                    200: 'var(--indigo-200)',
                    500: 'var(--indigo-500)',
                    600: 'var(--indigo-600)',
                    700: 'var(--indigo-700)',
                    800: 'var(--indigo-800)'
                }
            }
        }
    },
    plugins: []
};
