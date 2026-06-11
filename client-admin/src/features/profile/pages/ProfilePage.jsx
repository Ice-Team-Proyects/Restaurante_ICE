import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { 
  getProfileRequest, 
  getAllUsersRequest, 
  createUserRequest, 
  updateUserRequest, 
  deleteUserRequest,
  changePasswordRequest
} from '../../../shared/api/api';
import { showSuccess, showError } from '../../../shared/utils/toast';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const { register: passRegister, handleSubmit: passHandleSubmit, reset: passReset } = useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, usersRes] = await Promise.all([
        getProfileRequest(),
        getAllUsersRequest()
      ]);
      setProfile(profRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      showError('Error al cargar datos del perfil o usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      showError('Las contraseñas nuevas no coinciden');
      return;
    }
    try {
      await changePasswordRequest({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      showSuccess('Contraseña cambiada exitosamente');
      passReset();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al cambiar contraseña');
    }
  };

  const handleOpenCreate = () => {
    setSelectedUser(null);
    reset();
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setValue('name', user.name);
    setValue('surname', user.surname);
    setValue('username', user.username);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('role', user.role);
    setValue('password', ''); // No mostrar contraseña anterior
    setModalOpen(true);
  };

  const onUserSubmit = async (data) => {
    try {
      if (selectedUser) {
        // Edit mode
        const res = await updateUserRequest(selectedUser.id, data);
        showSuccess('Usuario actualizado correctamente');
        setUsers(users.map(u => u.id === selectedUser.id ? res.data : u));
      } else {
        // Create mode
        const res = await createUserRequest(data);
        showSuccess('Usuario creado exitosamente');
        setUsers([...users, res.data]);
      }
      setModalOpen(false);
      reset();
    } catch (err) {
      showError(err.response?.data?.message || 'Error al guardar usuario');
    }
  };

  const handleDeleteUser = (id, username) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a eliminar permanentemente al usuario "${username}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUserRequest(id);
          showSuccess('Usuario eliminado exitosamente');
          setUsers(users.filter(u => u.id !== id));
        } catch (err) {
          showError(err.response?.data?.message || 'Error al eliminar usuario');
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      
      {/* ─── PERFIL CARD (Premium) ─── */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* Left Side (Gradient & Photo Placeholder) */}
        <div 
          className="md:w-1/3 p-8 flex flex-col items-center justify-center text-white relative"
          style={{ background: 'linear-gradient(135deg, #ea580c, #dc2626, #7f1d1d)' }}
        >
          <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center text-5xl mb-4 shadow-lg select-none">
            👤
          </div>
          <h2 className="text-2xl font-black">{profile?.name} {profile?.surname}</h2>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold mt-2 border border-white/10">
            {profile?.role === 'ADMIN_ROLE' ? 'Administrador' : 'Cliente'}
          </span>
        </div>

        {/* Right Side (Details & Password Form) */}
        <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-black text-gray-800 border-b pb-2 mb-4">Datos de la Cuenta</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs">Nombre de usuario</span>
                <span className="font-semibold text-gray-700">{profile?.username}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Correo electrónico</span>
                <span className="font-semibold text-gray-700">{profile?.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Teléfono</span>
                <span className="font-semibold text-gray-700">{profile?.phone || '—'}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs">Estado de email</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  profile?.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {profile?.isEmailVerified ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div>
            <h3 className="text-lg font-black text-gray-800 border-b pb-2 mb-4">Cambiar Contraseña</h3>
            <form onSubmit={passHandleSubmit(onPasswordSubmit)} className="space-y-3">
              <div>
                <input 
                  type="password"
                  placeholder="Contraseña actual"
                  {...passRegister('oldPassword', { required: true })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                />
              </div>
              <div>
                <input 
                  type="password"
                  placeholder="Contraseña nueva"
                  {...passRegister('newPassword', { required: true, minLength: 8 })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                />
              </div>
              <div>
                <input 
                  type="password"
                  placeholder="Confirmar contraseña nueva"
                  {...passRegister('confirmPassword', { required: true })}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 rounded-xl text-white font-bold transition duration-300 shadow hover:opacity-90 text-sm"
                style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ─── TABLA DE GESTIÓN DE USUARIOS ─── */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-4">
          <div>
            <h2 className="text-xl font-black text-gray-800">👥 Gestión de Usuarios</h2>
            <p className="text-xs text-gray-400 mt-0.5">Listado general de usuarios de la base de datos real</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl text-white font-bold text-sm shadow hover:scale-[1.02] transition"
            style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
          >
            + Agregar Usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-100 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Nombre / Correo</th>
                <th className="py-3 px-4">Nombre de usuario</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-800 block leading-tight">{u.name} {u.surname}</span>
                    <span className="text-xs text-gray-400 block mt-0.5">{u.email}</span>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-700">{u.username}</td>
                  <td className="py-4 px-4 text-gray-600 font-medium">{u.phone || '—'}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${
                      u.role === 'ADMIN_ROLE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role === 'ADMIN_ROLE' ? 'ADMIN' : 'CLIENTE'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <button 
                      onClick={() => handleOpenEdit(u)}
                      className="text-orange-500 hover:text-orange-700 text-xs font-bold transition"
                    >
                      Editar
                    </button>
                    {u.id !== profile?.id && (
                      <button 
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold transition"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── MODAL AGREGAR / EDITAR USUARIO ─── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 transform transition-all">
            <h3 className="text-xl font-black text-gray-800 border-b pb-3 mb-6">
              {selectedUser ? '✏️ Editar Usuario' : '➕ Agregar Nuevo Usuario'}
            </h3>

            <form onSubmit={handleSubmit(onUserSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Nombre</label>
                  <input 
                    type="text" 
                    {...register('name', { required: true })}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Apellido</label>
                  <input 
                    type="text" 
                    {...register('surname', { required: true })}
                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Nombre de usuario</label>
                <input 
                  type="text" 
                  {...register('username', { required: true })}
                  className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Correo electrónico</label>
                <input 
                  type="email" 
                  {...register('email', { required: true })}
                  className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">
                  Contraseña {selectedUser && '(dejar en blanco para no cambiar)'}
                </label>
                <input 
                  type="password" 
                  {...register('password', { required: !selectedUser, minLength: 8 })}
                  className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Teléfono (8 dígitos)</label>
                <input 
                  type="text" 
                  {...register('phone', { required: true, minLength: 8, maxLength: 8 })}
                  className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Rol</label>
                <select 
                  {...register('role', { required: true })}
                  className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition bg-white"
                >
                  <option value="USER_ROLE">Cliente / Usuario Normal</option>
                  <option value="ADMIN_ROLE">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition text-sm font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-bold text-sm shadow hover:opacity-90 transition"
                  style={{ background: 'linear-gradient(to right, #ea580c, #dc2626)' }}
                >
                  {selectedUser ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProfilePage;
