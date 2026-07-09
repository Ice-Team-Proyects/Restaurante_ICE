import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useForm } from 'react-hook-form';
import { UserCircle, KeyRound, Users, Pencil, Trash2, Plus, X, ChefHat } from 'lucide-react';
import {
  getProfileRequest,
  getAllUsersRequest,
  createUserRequest,
  updateUserRequest,
  deleteUserRequest,
  changePasswordRequest
} from '../../../shared/api/api';
import { showSuccess, showError } from '../../../shared/utils/toast';
import AdminPageHeader from '../../../shared/components/ui/AdminPageHeader';

const inputClass = 'w-full bg-bg-light rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main-orange transition';
const labelClass = 'block text-xs font-semibold text-gray-400 mb-1';

const ProfilePage = () => {
  const [profile, setProfile]       = useState(null);
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();
  const { register: passRegister, handleSubmit: passHandleSubmit, reset: passReset } = useForm();

  /* ── Lógica original intacta ── */
  const loadData = async () => {
    setLoading(true);
    try {
      const [profRes, usersRes] = await Promise.all([getProfileRequest(), getAllUsersRequest()]);
      setProfile(profRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      showError('Error al cargar datos del perfil o usuarios.');
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) { showError('Las contraseñas nuevas no coinciden'); return; }
    try {
      await changePasswordRequest({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      showSuccess('Contraseña cambiada exitosamente');
      passReset();
    } catch (err) { showError(err.response?.data?.message || 'Error al cambiar contraseña'); }
  };

  const handleOpenCreate = () => { setSelectedUser(null); reset(); setModalOpen(true); };
  const handleOpenEdit   = (user) => {
    setSelectedUser(user);
    ['name','surname','username','email','phone','role'].forEach(f => setValue(f, user[f]));
    setValue('password', '');
    setModalOpen(true);
  };

  const onUserSubmit = async (data) => {
    try {
      if (selectedUser) {
        const res = await updateUserRequest(selectedUser.id, data);
        showSuccess('Usuario actualizado correctamente');
        setUsers(users.map(u => u.id === selectedUser.id ? res.data : u));
      } else {
        const res = await createUserRequest(data);
        showSuccess('Usuario creado exitosamente');
        setUsers([...users, res.data]);
      }
      setModalOpen(false); reset();
    } catch (err) { showError(err.response?.data?.message || 'Error al guardar usuario'); }
  };

  const handleDeleteUser = (id, username) => {
    Swal.fire({
      title: '¿Estás seguro?', text: `Vas a eliminar permanentemente al usuario "${username}"`,
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#EF4444', cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await deleteUserRequest(id);
        showSuccess('Usuario eliminado exitosamente');
        setUsers(users.filter(u => u.id !== id));
      } catch (err) { showError(err.response?.data?.message || 'Error al eliminar usuario'); }
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-main-orange" />
    </div>
  );

  const initial = profile?.username?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className="animate-fadeIn space-y-5">
      <AdminPageHeader icon={UserCircle} title="Mi Perfil" subtitle="Información de tu cuenta y gestión de usuarios" />

      {/* ── Perfil + cambiar contraseña ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Tarjeta de perfil estilo isla dividida */}
        <div className="bg-white rounded-2xl overflow-hidden flex">
          <div className="w-1/3 flex flex-col items-center justify-center gap-3 p-6" style={{ background: '#ff5722' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <ChefHat size={32} className="text-white" />
            </div>
            <span className="text-white font-semibold text-sm text-center leading-tight">{profile?.username}</span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
              {profile?.role === 'ADMIN_ROLE' ? 'Admin' : 'Usuario'}
            </span>
          </div>
          <div className="flex-1 p-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Datos de la cuenta</h3>
            <div className="space-y-3 text-sm">
              {[
                { label: 'Usuario',   value: profile?.username },
                { label: 'Correo',    value: profile?.email },
                { label: 'Teléfono', value: profile?.phone || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <span className="text-gray-400 text-xs block">{label}</span>
                  <span className="font-semibold text-gray-700">{value}</span>
                </div>
              ))}
              <div>
                <span className="text-gray-400 text-xs block">Email</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${profile?.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {profile?.isEmailVerified ? 'Verificado' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-4">
            <KeyRound size={16} className="text-main-orange" /> Cambiar Contraseña
          </h3>
          <form onSubmit={passHandleSubmit(onPasswordSubmit)} className="space-y-3">
            <input type="password" placeholder="Contraseña actual"           {...passRegister('oldPassword',     { required: true })}               className={inputClass} />
            <input type="password" placeholder="Contraseña nueva (mín. 8)"  {...passRegister('newPassword',     { required: true, minLength: 8 })}  className={inputClass} />
            <input type="password" placeholder="Confirmar contraseña nueva"  {...passRegister('confirmPassword', { required: true })}               className={inputClass} />
            <button type="submit" className="w-full py-2.5 rounded-xl text-white font-semibold text-sm transition hover:opacity-90" style={{ background: '#ff5722' }}>
              Actualizar Contraseña
            </button>
          </form>
        </div>
      </div>

      {/* ── Gestión de usuarios ── */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#fff0e9' }}>
              <Users size={18} style={{ color: '#ff5722' }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Gestión de Usuarios</p>
              <p className="text-xs text-gray-400">Listado general de usuarios del sistema</p>
            </div>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-main-orange text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            <Plus size={15} /> Agregar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                {['Nombre / Correo', 'Usuario', 'Teléfono', 'Rol', 'Estado', ''].map(h => (
                  <th key={h} className="pb-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-bg-light/60 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-gray-800 block leading-tight">{u.name} {u.surname}</span>
                    <span className="text-xs text-gray-400">{u.email}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{u.username}</td>
                  <td className="py-3.5 px-4 text-gray-600">{u.phone || '—'}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider ${u.role === 'ADMIN_ROLE' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'ADMIN_ROLE' ? 'Admin' : 'Cliente'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${u.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {u.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenEdit(u)} className="p-1.5 rounded-xl bg-bg-light text-gray-500 hover:text-main-orange transition" aria-label="Editar">
                        <Pencil size={13} />
                      </button>
                      {u.id !== profile?.id && (
                        <button onClick={() => handleDeleteUser(u.id, u.username)} className="p-1.5 rounded-xl bg-bg-light text-gray-500 hover:text-red-500 transition" aria-label="Eliminar">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal agregar / editar usuario ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-7">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-800">
                {selectedUser ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl bg-bg-light text-gray-500 hover:text-gray-700 transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onUserSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Nombre</label><input type="text" {...register('name', { required: true })} className={inputClass} /></div>
                <div><label className={labelClass}>Apellido</label><input type="text" {...register('surname', { required: true })} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Nombre de usuario</label><input type="text" {...register('username', { required: true })} className={inputClass} /></div>
              <div><label className={labelClass}>Correo electrónico</label><input type="email" {...register('email', { required: true })} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Contraseña {selectedUser && '(dejar en blanco para no cambiar)'}</label>
                <input type="password" {...register('password', { required: !selectedUser, minLength: 8 })} className={inputClass} />
              </div>
              <div><label className={labelClass}>Teléfono (8 dígitos)</label><input type="text" {...register('phone', { required: true, minLength: 8, maxLength: 8 })} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Rol</label>
                <select {...register('role', { required: true })} className={`${inputClass} bg-bg-light`}>
                  <option value="USER_ROLE">Cliente / Usuario Normal</option>
                  <option value="ADMIN_ROLE">Administrador</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100 mt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-bg-light text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90" style={{ background: '#ff5722' }}>
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
