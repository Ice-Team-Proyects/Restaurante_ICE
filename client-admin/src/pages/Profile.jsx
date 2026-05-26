import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, createUser, updateUser } from '../services/userService';

const Profile = ({ currentUser, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER_ROLE' });
  const [editingId, setEditingId] = useState(null);

  const isAdmin = currentUser?.role === 'ADMIN_ROLE' || currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [currentUser, isAdmin]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editingId) {
      await updateUser(editingId, formData);
      setEditingId(null);
    } else {
      await createUser(formData);
    }
    setFormData({ name: '', email: '', password: '', role: 'USER_ROLE' });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditingId(user._id || user.id);
    setFormData({ name: user.name || '', email: user.email || '', password: '', role: user.role || 'USER_ROLE' });
  };

  const handleDeleteUserAdmin = async (id) => {
    await deleteUser(id);
    fetchUsers();
  };

  const handleDeleteMyAccount = async () => {
    await deleteUser(currentUser._id || currentUser.id);
    onLogout();
  };

  return (
    /* AQUI ESTA EL ARREGLO DEL SCROLL: h-[calc(100vh-80px)] overflow-y-auto pb-20 */
    <div className="p-8 bg-[#faf8f5] h-[calc(100vh-80px)] overflow-y-auto pb-20">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Información Personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="block text-sm font-semibold text-gray-500 mb-1">Nombre completo</span>
              <span className="text-gray-800 font-medium">{currentUser?.name || 'No especificado'}</span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500 mb-1">Correo electrónico</span>
              <span className="text-gray-800 font-medium">{currentUser?.email}</span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-500 mb-1">Tipo de cuenta</span>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Gestión de usuarios</h2>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                {users.length} usuarios
              </span>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
              <h3 className="text-md font-semibold mb-4 text-gray-700">{editingId ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
              <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                <div className="flex flex-col flex-1 min-w-[200px]">
                  <label className="text-sm text-gray-600 mb-1">Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2.5 focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28]" required />
                </div>
                <div className="flex flex-col flex-1 min-w-[200px]">
                  <label className="text-sm text-gray-600 mb-1">Correo</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2.5 focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28]" required />
                </div>
                {!editingId && (
                  <div className="flex flex-col flex-1 min-w-[200px]">
                    <label className="text-sm text-gray-600 mb-1">Contraseña</label>
                    <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2.5 focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28]" required={!editingId} />
                  </div>
                )}
                <div className="flex flex-col min-w-[150px]">
                  <label className="text-sm text-gray-600 mb-1">Rol</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="border border-gray-300 rounded-md p-2.5 bg-white focus:outline-none focus:border-[#f05a28] focus:ring-1 focus:ring-[#f05a28]">
                    <option value="USER_ROLE">Usuario</option>
                    <option value="ADMIN_ROLE">Administrador</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-[#f05a28] text-white px-5 py-2.5 rounded-md hover:bg-[#d94f22] transition-colors font-medium cursor-pointer">
                    {editingId ? 'Actualizar' : 'Agregar'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'USER_ROLE' }); }} className="bg-gray-500 text-white px-5 py-2.5 rounded-md hover:bg-gray-600 transition-colors font-medium cursor-pointer">
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full text-left border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="py-4 px-6 font-semibold">Nombre</th>
                    <th className="py-4 px-6 font-semibold">Correo</th>
                    <th className="py-4 px-6 font-semibold">Rol</th>
                    <th className="py-4 px-6 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-800 font-medium">{user.name || 'Sin nombre'}</td>
                        <td className="py-4 px-6 text-gray-600">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN_ROLE' || user.role === 'admin' ? 'bg-[#f05a28] text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => handleEdit(user)} className="text-gray-500 hover:text-[#f05a28] font-medium transition-colors cursor-pointer">
                              Editar
                            </button>
                            <button onClick={() => handleDeleteUserAdmin(user._id || user.id)} className="text-red-500 hover:text-red-700 font-medium transition-colors cursor-pointer">
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        No hay usuarios registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-red-50 p-8 rounded-lg shadow-sm border border-red-100 mt-8">
          <h2 className="text-xl font-bold mb-2 text-red-700">Zona de peligro</h2>
          <p className="text-red-600 mb-6 text-sm">Desactiva tu cuenta permanentemente. Esta acción no se puede deshacer.</p>
          <button onClick={handleDeleteMyAccount} className="bg-white border border-red-300 text-red-600 font-semibold py-2.5 px-6 rounded-md hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
            Eliminar mi cuenta
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;