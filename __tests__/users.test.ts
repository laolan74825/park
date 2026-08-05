// __tests__/users.test.ts - 测试文件
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest'
import { server } from '@/mocks/server'
import { userDb } from '@/mocks/dataStore.ts'
import type { ApiResponse, User, DeleteResult, BatchDeleteResult } from '@/types/types'

const API_BASE = 'http://localhost/api'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  // 重置数据库
  userDb.reset([
    { name: '张三', email: 'zhangsan@example.com', role: 'admin', password: '123456', token: '123456', avatar: '' },
    { name: '李四', email: 'lisi@example.com', role: 'user', password: '123456', token: '123456', avatar: '' },
    { name: '王五', email: 'wangwu@example.com', role: 'user', password: '123456', token: '123456', avatar: '' },
  ])
})
afterAll(() => server.close())

describe('用户 CRUD 仿真操作', () => {
  describe('查询', () => {
    it('GET /api/users 返回全部用户', async () => {
      const res = await fetch(`${API_BASE}/users`)
      const json = (await res.json()) as ApiResponse<User[]>

      expect(json.success).toBe(true)
      expect(json.data).toHaveLength(3)
      expect(json.total).toBe(3)
    })

    it('GET /api/users/:id 返回指定用户', async () => {
      const res = await fetch(`${API_BASE}/users/1`)
      const json = (await res.json()) as ApiResponse<{ user: User }>

      expect(json.success).toBe(true)
      expect(json.data?.user.name).toBe('张三')
    })

    it('GET /api/users/:id 不存在返回 404', async () => {
      const res = await fetch(`${API_BASE}/users/999`)
      expect(res.status).toBe(404)
    })
  })

  describe('创建', () => {
    it('POST /api/users 创建新用户', async () => {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '赵六',
          email: 'zhaoliu@example.com',
          role: 'user',
        }),
      })
      const json = (await res.json()) as ApiResponse<{ user: User }>

      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
      expect(json.data?.user.name).toBe('赵六')
      expect(json.data?.user.id).toBeDefined()
    })

    it('POST /api/users 缺少必填项返回 400', async () => {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      })
      expect(res.status).toBe(400)
    })
  })

  describe('更新', () => {
    it('PUT /api/users/:id 更新用户信息', async () => {
      const res = await fetch(`${API_BASE}/users/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '张三（已修改）' }),
      })
      const json = (await res.json()) as ApiResponse<{ user: User }>

      expect(json.success).toBe(true)
      expect(json.data?.user.name).toBe('张三（已修改）')
      expect(json.data?.user.email).toBe('zhangsan@example.com') // 未修改字段保留
    })
  })

  describe('删除（核心测试）', () => {
    it('DELETE /api/users/:id 真实删除并返回被删数据', async () => {
      // 1. 初始 3 条
      const before = await fetch(`${API_BASE}/users`).then((r) => r.json()) as ApiResponse<User[]>
      expect(before.data).toHaveLength(3)

      // 2. 删除 ID=1
      const delRes = await fetch(`${API_BASE}/users/1`, { method: 'DELETE' })
      const delJson = (await delRes.json()) as ApiResponse<DeleteResult>

      expect(delJson.success).toBe(true)
      expect(delJson.data?.deleted.name).toBe('张三')
      expect(delJson.data?.remainingCount).toBe(2)

      // 3. 验证真实删除：再次查询只剩 2 条
      const after = await fetch(`${API_BASE}/users`).then((r) => r.json()) as ApiResponse<User[]>
      expect(after.data).toHaveLength(2)
      expect(after.data?.find((u) => u.id === '1')).toBeUndefined()

      // 4. 再次删除同一 ID 返回 404
      const again = await fetch(`${API_BASE}/users/1`, { method: 'DELETE' })
      expect(again.status).toBe(404)
    })

    it('DELETE /api/users 批量删除', async () => {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ['1', '2'] }),
      })
      const json = (await res.json()) as ApiResponse<BatchDeleteResult>

      expect(json.success).toBe(true)
      expect(json.data?.deletedIds).toEqual(['1', '2'])
      expect(json.data?.failedIds).toEqual([])
      expect(json.data?.remainingCount).toBe(1)
    })
  })

  describe('数据库状态', () => {
    it('调试接口返回正确统计', async () => {
      const res = await fetch(`${API_BASE}/users/stats/debug`)
      const json = (await res.json()) as ApiResponse<{ stats: { total: number; ids: string[] } }>

      expect(json.data?.stats.total).toBe(3)
      expect(json.data?.stats.ids).toEqual(['1', '2', '3'])
    })
  })
})
