import api from './api'

export const pollService = {
  list: () => api.get('/polls'),
  get: (id) => api.get(`/polls/${id}`),
  create: (data) => api.post('/polls', data),
  update: (id, data) => api.put(`/polls/${id}`, data),
  remove: (id) => api.delete(`/polls/${id}`),
  vote: (id, optionId) => api.post(`/polls/${id}/vote`, { option_id: optionId }),
}
