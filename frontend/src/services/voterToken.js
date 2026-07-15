const KEY = 'voter_token'

// Identifica um visitante não logado para garantir 1 voto por pessoa em
// enquetes anônimas. Gerado na primeira visita e mantido no localStorage.
export function getVoterToken() {
  let token = localStorage.getItem(KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(KEY, token)
  }
  return token
}
