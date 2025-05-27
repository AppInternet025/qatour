"use client";
import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-slate-900 flex items-center py-3 justify-between px-8 md:px-24 text-white">
      <Link href="/" className="text-xl font-bold hover:text-sky-400">
        Home
      </Link>

      {session?.user ? (
        <div className="relative" ref={menuRef}>
          {/* Botón del menú (avatar + nombre) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={session.user.image || "/default-avatar.png"}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-sky-500"
            />
            <span className="hidden md:inline font-medium">
              {session.user.name.split(" ")[0]} {/* Solo primer nombre */}
            </span>
          </button>

          {/* Menú desplegable */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 bg-white text-gray-800 rounded-lg shadow-xl py-2 w-48 z-50">
              {/* Encabezado (info rápida) */}
              <div className="px-4 py-2 border-b">
                <p className="font-semibold truncate">{session.user.name}</p>
                <p className="text-sm text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>

              {/* Opciones del menú */}
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 hover:bg-slate-100 transition"
              >
                🏠 Dashboard
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 hover:bg-slate-100 transition"
              >
                🗺️ Mis Rutas
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center px-4 py-2 hover:bg-slate-100 transition"
              >
                👤 Mi Perfil
              </Link>
              <button
                onClick={() => {
                  signOut({ callbackUrl: "/" });
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 transition"
              >
                🚪 Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <img src="/google-icon.png" alt="Google" className="w-5 h-5" />
          <span>Sign in Google </span>
        </button>
      )}
    </nav>
  );
}