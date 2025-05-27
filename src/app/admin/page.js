"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Importa useSession para obtener la sesión del cliente
import Spinner from "@/components/common/Spinner"; // Asume que tienes un Spinner genérico

// Definimos los roles directamente para el frontend
const USER_ROLES = {
  ADMIN: "admin",
  USER: "usuario",
};

// Componente para la tarjeta de usuario (simplificado aquí para el ejemplo)
const UserRoleCard = ({ user, onRoleChange, disabled = false }) => {
  const [selectedRole, setSelectedRole] = useState(user.role || USER_ROLES.USER);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSelectedRole(user.role || USER_ROLES.USER);
  }, [user.role]);

  const handleRoleChange = async () => {
    if (selectedRole === user.role) return;

    setIsSaving(true);
    await onRoleChange(user._id, selectedRole); // Envía el string del rol
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
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          disabled={disabled || isSaving}
          style={{ padding: "8px", borderRadius: "4px", marginRight: "10px" }}
        >
          {Object.values(USER_ROLES).map((roleName) => (
            <option key={roleName} value={roleName}>
              {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={handleRoleChange}
          disabled={selectedRole === user.role || disabled || isSaving}
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


const AdminRolesPage = () => {
  const { data: session, status } = useSession(); // Usamos useSession de NextAuth.js
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const isAdmin = session?.user?.role === USER_ROLES.ADMIN;
  const authLoading = status === "loading";

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/"); // Redirigir si no es admin o no está autenticado
    }
  }, [authLoading, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    setError(null);
    try {
      const res = await fetch("/api/users"); // Llama a la API que lista usuarios
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Fallo al cargar usuarios.");
      }
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }), // Envía el nuevo rol como un string
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Fallo al actualizar el rol.");
      }

      const updatedData = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? updatedData.user : u))
      );
      alert("Rol actualizado con éxito!");
    } catch (err) {
      console.error("Error updating role:", err);
      alert(`Error al actualizar el rol: ${err.message}`);
    }
  };

  if (authLoading || (!authLoading && !isAdmin)) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        {authLoading ? <Spinner /> : <p>Acceso denegado. Redirigiendo...</p>}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "40px auto", padding: "20px", border: "1px solid #eee", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <Head>
        <title>Admin - Gestión de Roles</title>
      </Head>
      <h1>Gestión de Roles de Usuario</h1>

      {loadingUsers && <Spinner />}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loadingUsers && users.length === 0 && !error && (
        <p>No hay usuarios para mostrar.</p>
      )}

      {!loadingUsers &&
        users.length > 0 &&
        users.map((user) => (
          <UserRoleCard
            key={user._id}
            user={user}
            onRoleChange={handleRoleChange}
            // Deshabilitar la opción de cambiar el propio rol de admin para el usuario actual
            disabled={user._id === session?.user?.id && user.role === USER_ROLES.ADMIN}
          />
        ))}
    </div>
  );
};

export default AdminRolesPage;