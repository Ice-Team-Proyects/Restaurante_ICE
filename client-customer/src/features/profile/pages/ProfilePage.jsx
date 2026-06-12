import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getProfileRequest, changePasswordRequest, deleteAccountRequest } from "../../../shared/api/api";
import { useAuthStore } from "../../auth/store/authStore";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfileRequest();
      setProfile(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos del perfil.",
        confirmButtonColor: "#ea580c"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas nuevas no coinciden.",
        confirmButtonColor: "#ea580c"
      });
      return;
    }
    try {
      await changePasswordRequest({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      });
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        text: "Tu contraseña se ha cambiado correctamente.",
        confirmButtonColor: "#15803d"
      });
      reset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Error al actualizar la contraseña.",
        confirmButtonColor: "#ea580c"
      });
    }
  };

  const handleDeleteAccount = () => {
    // Primera confirmación
    Swal.fire({
      title: "⚠️ ¿Eliminar tu cuenta?",
      text: "Esta acción es permanente y perderás todas tus reservaciones e historial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        // Segunda confirmación
        Swal.fire({
          title: "🛑 ¿Estás COMPLETAMENTE seguro?",
          text: "Por favor, confirma una vez más para borrar tu cuenta definitivamente. No hay marcha atrás.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc2626",
          cancelButtonColor: "#9ca3af",
          confirmButtonText: "Sí, eliminar mi cuenta definitivamente",
          cancelButtonText: "No, cancelar"
        }).then(async (finalResult) => {
          if (finalResult.isConfirmed) {
            try {
              await deleteAccountRequest();
              Swal.fire({
                icon: "success",
                title: "Cuenta eliminada",
                text: "Tu cuenta ha sido eliminada con éxito. Esperamos verte pronto.",
                confirmButtonColor: "#15803d"
              }).then(() => {
                logout();
                navigate("/login");
              });
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "No se pudo eliminar la cuenta.",
                confirmButtonColor: "#ea580c"
              });
            }
          }
        });
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <h1 className="text-3xl font-black text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
        👤 Mi Perfil
      </h1>
      <p className="text-gray-500 text-sm mb-6">Administra los detalles de tu cuenta y seguridad</p>

      {/* Tarjeta de perfil */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        {/* Lado izquierdo - Presentación */}
        <div 
          className="md:w-1/3 p-8 flex flex-col items-center justify-center text-white"
          style={{ background: "linear-gradient(135deg, #7f1d1d, #dc2626, #ea580c)" }}
        >
          <div className="w-28 h-28 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center text-4xl mb-4 shadow-md">
            🍜
          </div>
          <h2 className="text-xl font-bold text-center">{profile?.name} {profile?.surname}</h2>
          <span className="text-[10px] bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider font-bold mt-2">
            Cliente Preferido
          </span>
        </div>

        {/* Lado derecho - Detalles de cuenta */}
        <div className="flex-1 p-8">
          <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Detalles de Perfil</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
              <span className="font-semibold text-gray-700">{profile?.phone || "—"}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs">Fecha de registro</span>
              <span className="font-semibold text-gray-700">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Seguridad e Interacciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Cambiar contraseña */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">🔑 Actualizar Seguridad</h3>
            <p className="text-xs text-gray-400 mb-4">Mantén tu contraseña actualizada para mayor seguridad</p>
          </div>

          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Contraseña actual"
                {...register("oldPassword", { required: true })}
                className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition outline-none"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Contraseña nueva (mín. 8 caracteres)"
                {...register("newPassword", { required: true, minLength: 8 })}
                className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition outline-none"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Confirmar contraseña nueva"
                {...register("confirmPassword", { required: true })}
                className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition outline-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 rounded-xl text-white font-bold text-sm shadow hover:scale-[1.01] active:scale-[0.99] transition duration-300"
              style={{ background: "linear-gradient(to right, #dc2626, #ea580c)" }}
            >
              Actualizar Contraseña
            </button>
          </form>
        </div>

        {/* Borrar cuenta */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-red-700 border-b pb-2 mb-4">🚨 Zona de Peligro</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Si decides borrar tu cuenta, toda tu información, reservaciones activas y accesos serán eliminados de forma inmediata de nuestra base de datos.
            </p>
          </div>

          <div className="space-y-2">
            <button 
              onClick={handleDeleteAccount}
              className="w-full py-2.5 rounded-xl border-2 border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 hover:border-red-300 transition duration-300"
            >
              Eliminar mi cuenta
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              * Esta acción requerirá de dos pasos de confirmación adicionales.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
