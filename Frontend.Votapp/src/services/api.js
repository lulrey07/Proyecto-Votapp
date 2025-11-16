import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 15000,
})

export async function fetchSummary() {
  const { data } = await api.get('/summary')
  return data
}

export default api


