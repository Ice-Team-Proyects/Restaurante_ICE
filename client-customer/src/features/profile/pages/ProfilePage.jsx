import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { User, Mail, Phone, Calendar, KeyRound, AlertTriangle, Flame } from "lucide-react";
import PageHeader from "../../../shared/components/ui/PageHeader";
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

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfileRequest();
        setProfile(res.data);
      } catch {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los datos del perfil.", confirmButtonColor: "#ea580c" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onPasswordSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      Swal.fire({ icon: "error", title: "Error", text: "Las contraseñas nuevas no coinciden.", confirmButtonColor: "#ea580c" });
      return;
    }
    try {
      await changePasswordRequest({ oldPassword: data.oldPassword, newPassword: data.newPassword });
      Swal.fire({ icon: "success", title: "¡Contraseña actualizada!", text: "Tu contraseña se ha cambiado correctamente.", confirmButtonColor: "#15803d" });
      reset();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Error al actualizar.", confirmButtonColor: "#ea580c" });
    }
  };

  const handleDeleteAccount = () => {
    Swal.fire({
      title: "¿Eliminar tu cuenta?",
      text: "Esta acción es permanente y perderás todas tus reservaciones.",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#dc2626", cancelButtonColor: "#9ca3af",
      confirmButtonText: "Sí, continuar", cancelButtonText: "Cancelar",
    }).then((r) => {
      if (!r.isConfirmed) return;
      Swal.fire({
        title: "¿Estás COMPLETAMENTE seguro?",
        text: "No hay marcha atrás.",
        icon: "warning", showCancelButton: true,
        confirmButtonColor: "#dc2626", cancelButtonColor: "#9ca3af",
        confirmButtonText: "Sí, eliminar definitivamente", cancelButtonText: "No, cancelar",
      }).then(async (final) => {
        if (!final.isConfirmed) return;
        try {
          await deleteAccountRequest();
          Swal.fire({ icon: "success", title: "Cuenta eliminada", confirmButtonColor: "#15803d" })
            .then(() => { logout(); navigate("/login"); });
        } catch (err) {
          Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "No se pudo eliminar.", confirmButtonColor: "#ea580c" });
        }
      });
    });
  };

  const inputClass = "w-full px-4 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-main-orange bg-bg-light";

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-orange" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <PageHeader icon={User} title="Mi Perfil" subtitle="Administra los detalles de tu cuenta y seguridad" />

      {/* Tarjeta de perfil — navbar dividido */}
      <div className="bg-white rounded-2xl overflow-hidden border border-dashed flex flex-col md:flex-row" style={{ borderColor: "#f0997b" }}>
        {/* Bloque sólido izquierdo */}
        <div className="md:w-1/3 p-8 flex flex-col items-center justify-center" style={{ background: "#7f1d1d" }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.1)" }}>
            <Flame size={40} className="text-orange-300" />
          </div>
          <h2 className="text-lg font-semibold text-white text-center">{profile?.name} {profile?.surname}</h2>
          <span className="text-[10px] mt-2 px-3 py-1 rounded-full font-semibold uppercase tracking-wider" style={{ background: "rgba(255,255,255,0.15)", color: "#fde0d0" }}>
            Cliente Preferido
          </span>
        </div>

        {/* Detalles de cuenta */}
        <div className="flex-1 p-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Información de cuenta</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { icon: User, label: "Usuario", value: profile?.username },
              { icon: Mail, label: "Correo", value: profile?.email },
              { icon: Phone, label: "Teléfono", value: profile?.phone || "—" },
              { icon: Calendar, label: "Registro", value: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-2xl" style={{ background: "#fef7ed" }}>
                <Icon size={16} className="text-main-orange mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-400 block">{label}</span>
                  <span className="font-semibold text-gray-700">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cambiar contraseña */}
        <div className="bg-white rounded-2xl p-6 border border-dashed" style={{ borderColor: "#f0997b" }}>
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-1">
            <KeyRound size={16} className="text-main-orange" />
            Actualizar Seguridad
          </h3>
          <p className="text-xs text-gray-400 mb-4">Mantén tu contraseña actualizada</p>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-3">
            <input type="password" placeholder="Contraseña actual" {...register("oldPassword", { required: true })} className={inputClass} />
            <input type="password" placeholder="Contraseña nueva (mín. 8 caracteres)" {...register("newPassword", { required: true, minLength: 8 })} className={inputClass} />
            <input type="password" placeholder="Confirmar contraseña nueva" {...register("confirmPassword", { required: true })} className={inputClass} />
            <button type="submit" className="w-full py-2.5 rounded-full text-white font-semibold text-sm transition hover:opacity-90" style={{ background: "#ea580c" }}>
              Actualizar contraseña
            </button>
          </form>
        </div>

        {/* Zona de peligro */}
        <div className="bg-white rounded-2xl p-6 border border-dashed" style={{ borderColor: "#fca5a5" }}>
          <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2 mb-1">
            <AlertTriangle size={16} />
            Zona de Peligro
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Si decides borrar tu cuenta, toda tu información, reservaciones activas y accesos serán eliminados de forma permanente.
          </p>
          <button onClick={handleDeleteAccount}
            className="w-full py-2.5 rounded-full border text-red-600 font-semibold text-sm transition hover:bg-red-50"
            style={{ borderColor: "#fca5a5" }}>
            Eliminar mi cuenta
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">* Requiere dos pasos de confirmación</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
