
const getLocalUsers = () => {
  const users = localStorage.getItem('app_users');
  return users ? JSON.parse(users) : [
    { id: '1', name: 'Admin Principal', email: 'ksadmin@local.com', role: 'ADMIN_ROLE' }
  ];
};

const saveLocalUsers = (users) => {
  localStorage.setItem('app_users', JSON.stringify(users));
};

export const getUsers = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLocalUsers()), 300); // Simulamos el tiempo de carga
  });
};

export const getUserById = async (id) => {
  return new Promise((resolve) => {
    const users = getLocalUsers();
    resolve(users.find(u => u.id === id) || null);
  });
};

export const createUser = async (userData) => {
  return new Promise((resolve) => {
    const users = getLocalUsers();
    const newUser = { 
      ...userData, 
      id: Math.random().toString(36).substr(2, 9),
      _id: Math.random().toString(36).substr(2, 9)
    };
    users.push(newUser);
    saveLocalUsers(users);
    resolve(newUser);
  });
};

export const updateUser = async (id, userData) => {
  return new Promise((resolve) => {
    const users = getLocalUsers();
    const index = users.findIndex(u => u.id === id || u._id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      saveLocalUsers(users);
      resolve(users[index]);
    } else {
      resolve(null);
    }
  });
};

export const deleteUser = async (id) => {
  return new Promise((resolve) => {
    let users = getLocalUsers();
    users = users.filter(u => u.id !== id && u._id !== id);
    saveLocalUsers(users);
    resolve({ success: true });
  });
};