// components/roles/userRole.js
"use client";

import { useState, useEffect } from "react";
// Importamos las constantes de roles desde su ubicación
import { USER_ROLES } from "./lib/constants"; // ¡Ajusta esta ruta si es diferente!

const userRole = ({ user, onRoleChange, disabled = false }) => {
  // `selectedRole` almacenará el string 'admin' o 'usuario'
  const [selectedRole, setSelectedRole] = useState(user.role || USER_ROLES.USER);
  const [isSaving, setIsSaving] = useState(false);

  // Asegura que el select refleje el rol actual del usuario cuando se actualiza
  useEffect(() => {
    setSelectedRole(user.role || USER_ROLES.USER);
  }, [user.role]);

  const handleRoleChange = async () => {
    // Solo si el rol seleccionado es diferente al rol actual del usuario
    if (selectedRole === user.role) return;

    setIsSaving(true);
    // Llama a la función onRoleChange pasando el ID del usuario y el string del rol seleccionado
    await onRoleChange(user._id, selectedRole);
    setIsSaving(false);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "10px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: disabled ? '#f0f0f0' : 'white',
      }}
    >
      <div>
        <h3>{user.username}</h3>
        <p>{user.email}</p>
        <p>
          Rol actual: <strong>{user.role || 'N/A'}</strong>
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* El select muestra las opciones 'admin' y 'usuario' */}
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          disabled={disabled || isSaving}
          style={{ padding: "8px", borderRadius: "4px", marginRight: "10px" }}
        >
          {/* Mapea los valores de USER_ROLES para crear las opciones del select */}
          {Object.values(USER_ROLES).map((roleName) => (
            <option key={roleName} value={roleName}>
              {roleName.charAt(0).toUpperCase() + roleName.slice(1)} {/* Capitaliza la primera letra */}
            </option>
          ))}
        </select>
        <button
          onClick={handleRoleChange}
          disabled={selectedRole === user.role || disabled || isSaving} // Deshabilita si no hay cambio o está guardando/deshabilitado
          style={{
            padding: "8px 15px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            opacity: selectedRole === user.role || disabled || isSaving ? 0.6 : 1,
          }}
        >
          {isSaving ? "Guardando..." : "Cambiar Rol"}
        </button>
      </div>
    </div>
  );
};

export default userRole;