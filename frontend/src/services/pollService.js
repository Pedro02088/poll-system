import api from './api'

export const pollService = {
  list: () => api.get('/polls'),
  get: (id, voterToken) => api.get(`/polls/${id}`, { params: voterToken ? { voter_token: voterToken } : {} }),
  create: (data) => api.post('/polls', data),
  update: (id, data) => api.put(`/polls/${id}`, data),
  remove: (id) => api.delete(`/polls/${id}`),
  vote: (id, optionId, voterToken) =>
    api.post(`/polls/${id}/vote`, { option_id: optionId, ...(voterToken ? { voter_token: voterToken } : {}) }),
}
