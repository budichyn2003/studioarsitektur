import type { Config } from "tailwindcss";

const config: Config = {
  // Kita ubah baris content ini jadi lebih "ganas" mendeteksi class Tailwind
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        arch: {
          black: '#2b2b2b',
          white: '#ffffff',
          hover: '#f2f2f7',
          grayText: '#8E8E93',
          grayMenu: '#AEAEB2',
          buttonDark: '#2f2f2f',
        }
      },
    },
  },
  plugins: [],
};
export default config;