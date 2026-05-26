// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Adicione esta linha se não estiver usando a pasta src:
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores personalizadas do layout que você enviou
        primaryGreen: {
          light: "#88D66C", // Verde limão/claro do gradiente
          dark: "#15803D",  // Verde esmeralda escuro
        },
        primaryFooter: "#0A1F0D", // Verde escuro quase preto do rodapé
        textDark: "#111827", // Cinza escuro dos textos principais
        textLight: "#6B7280", // Cinza claro dos subtítulos
      },
    },
  },
  plugins: [],
};
export default config;