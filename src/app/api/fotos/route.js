import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../utils/mongodb';
import Foto from '../../../models/Foto';

// POST: Guardar nuevas fotos
export async function POST(request) {
  try {
    const body = await request.json();
    const { idComentario, urlCloudinary } = body;

    // Validaciones básicas
    if (!idComentario) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID de comentario es requerido' 
        },
        { status: 400 }
      );
    }

    if (!urlCloudinary) {
      return NextResponse.json(
        { 
          success: false,
          error: 'URL de Cloudinary es requerida' 
        },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDatabase();

    // Crear y guardar la foto
    const nuevaFoto = new Foto({
      idComentario,
      urlCloudinary
    });

    const fotoGuardada = await nuevaFoto.save();

    console.log('📸 Foto guardada en MongoDB:', fotoGuardada);

    return NextResponse.json({
      success: true,
      message: 'Foto guardada correctamente',
      data: fotoGuardada
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error en API de fotos:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// GET: Obtener fotos por comentario
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idComentario = searchParams.get('idComentario');

    if (!idComentario) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID de comentario es requerido' 
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const fotos = await Foto.find({ idComentario });

    return NextResponse.json({
      success: true,
      data: fotos
    });

  } catch (error) {
    console.error('❌ Error al obtener fotos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}