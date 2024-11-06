import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  // Cấu hình cho backend
  {
    files: ["src/**/*.[js, mjs]"], // Áp dụng cho tất cả các file JS trong project
    languageOptions: {
      sourceType: "commonjs", // CommonJS cho Node.js
      globals: globals.node,  // Định nghĩa các biến toàn cục của Node.js
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      "prettier/prettier": "error", // Lỗi nếu không tuân theo Prettier
    },
  },
  
  prettierConfig, // Kết hợp Prettier với ESLint để đảm bảo format code chuẩn
];
