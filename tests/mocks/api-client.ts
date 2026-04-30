import axios from 'axios'

/** Jest-only client: avoids Vite `import.meta.env` in Node. */
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

jest.spyOn(apiClient, 'post').mockResolvedValue({
  data: {
    id: 'mock-lead-id',
    status: 'new',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  status: 201,
  statusText: 'Created',
  headers: {},
  config: {} as never,
} as Awaited<ReturnType<typeof apiClient.post>>)
