import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,           // 全局可用 describe/it/expect，不用每个文件 import
    environment: 'jsdom',      // 模拟浏览器环境（DOM API）
    setupFiles: './src/test/setup.ts',  // 测试前置文件（如注册 MSW）
    include: ['__tests__/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'], // 测试文件匹配
  },
  resolve: {
    alias:{
      '@': path.resolve(__dirname, './src'),
    }
  }

})
