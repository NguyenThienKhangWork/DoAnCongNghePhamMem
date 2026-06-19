module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink': '#0D1B2A',
        'sakura': '#FF6B9D',
        'sakura-light': '#FFB3CC',
        'violet': '#7B2FBE',
        'violet-light': '#C084FC',
        'star': '#FFD700',
        'sky': '#1A1A3E',
        'sky-mid': '#2D1B69',
        'cloud': '#F8F0FF',
        'card-bg': '#1E1E3A',
        'card-border': 'rgba(255, 107, 157, 0.2)',
      },
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
