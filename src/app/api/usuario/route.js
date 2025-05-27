import { connectToDatabase } from "@/utils/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// API route para Next.js con App Router (no usa req.method)
export async function POST(req) {
  try {
    const { username, email, password, confirmPassword } = await req.json();

    if (!username || !email || !password || !confirmPassword) {
      return Response.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return Response.json({ message: "Las contraseñas deben coincidir" }, { status: 400 });
    }

    await connectToDatabase();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return Response.json({ message: "Usuario ya registrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    return Response.json({ message: "Usuario registrado con éxito" }, { status: 201 });
  } catch (error) {
    console.error("🔥 Error en /api/usuario:", error);
    return Response.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

const USER_ROLES = {
  ADMIN: "admin",
  USER: "usuario",
};

export async function PUT(req, { params }) {
  try {
    const { userId } = params;
    const { newRole } = await req.json(); // Esperamos que 'newRole' sea 'admin' o 'usuario'

    if (!newRole) {
      return NextResponse.json({ message: "El nuevo rol es obligatorio" }, { status: 400 });
    }

    // Validar que el nuevo rol sea uno de los permitidos
    if (!Object.values(USER_ROLES).includes(newRole)) {
      return NextResponse.json({ message: "Rol inválido. Debe ser 'admin' o 'usuario'" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole }, // Actualiza el campo 'role' directamente
      { new: true, runValidators: true } // 'new: true' devuelve el documento actualizado; 'runValidators' asegura que se apliquen las validaciones del esquema (como el `enum`)
    ).select("-password"); // No devolvemos la contraseña

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Rol de usuario actualizado con éxito", user }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error al actualizar el rol del usuario:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}