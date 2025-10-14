const STORAGE_KEY = 'banking_users'
const CURRENT_USER_KEY = 'banking_current_user'

export function getUsers(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  }catch(_){
    return []
  }
}

export function saveUsers(users){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function findUserByEmail(email){
  const users = getUsers()
  return users.find(u => u.email.toLowerCase() === String(email).toLowerCase()) || null
}

export function createUser({email, password, fullName}){
  const users = getUsers()
  const exists = users.some(u => u.email.toLowerCase() === String(email).toLowerCase())
  if (exists){
    throw new Error('An account with this email already exists')
  }
  const newUser = { email, password, fullName }
  users.push(newUser)
  saveUsers(users)
  return newUser
}

export function validateCredentials(email, password){
  const user = findUserByEmail(email)
  if (!user) return false
  return user.password === password
}

export function updatePassword(email, newPassword){
  const users = getUsers()
  const idx = users.findIndex(u => u.email.toLowerCase() === String(email).toLowerCase())
  if (idx === -1){
    throw new Error('No account found with that email')
  }
  users[idx] = { ...users[idx], password: newPassword }
  saveUsers(users)
}

export function setCurrentUser(email){
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email }))
}

export function getCurrentUser(){
  try{
    const raw = localStorage.getItem(CURRENT_USER_KEY)
    return raw ? JSON.parse(raw) : null
  }catch(_){
    return null
  }
}

export function clearCurrentUser(){
  localStorage.removeItem(CURRENT_USER_KEY)
}



