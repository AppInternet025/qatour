"use client"; // Asegura que el componente se maneje del lado del cliente

import React, { useState } from "react";

const UploadForm = () => {
  // Estado de las imágenes seleccionadas, previsualización y mensajes
  const [idComentario, setIdComentario] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState("");
  const [showChooseButton, setShowChooseButton] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // SIMULACIÓN: Generar un ID de comentario mock para testing
  const generateMockCommentId = () => {
    // Simula el comentarioId con caracteress)
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 24; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Función para manejar la selección de archivos
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validImages = [];
    const previews = [];

    // Validar cada archivo
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setMessage("Solo se permiten archivos de imagen.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // Tamaño máximo de 5MB
        setMessage("La imagen es demasiado pesada. Máximo 5MB.");
        return;
      }
      validImages.push(file);
      previews.push(URL.createObjectURL(file)); // Previsualizar la imagen
    });

    if (validImages.length === 0) {
      setMessage("No hay archivos válidos para subir.");
    } else {
      setImages(validImages);
      setPreviewImages(previews);
      setShowConfirmation(true);
      setMessage("");
      setShowChooseButton(false);
    }
  };

  // Función para cancelar el proceso de subida
  const handleCancel = () => {
    setImages([]);
    setPreviewImages([]);
    setShowConfirmation(false);
    setShowChooseButton(true);
    setMessage("");
  };

  // Función para guardar cada foto en la base de datos
  const saveFotoToDatabase = async (urlCloudinary, commentId) => {
    try {
      const response = await fetch('/api/fotos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idComentario: commentId,
          urlCloudinary: urlCloudinary
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar en la base de datos');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error al guardar foto en la base de datos:", error);
      throw error;
    }
  };

  // Función para confirmar y subir las imágenes a Cloudinary
  const handleConfirmUpload = async () => {
    if (images.length === 0) {
      setMessage("Selecciona al menos una imagen válida para subir.");
      return;
    }

    // Generar o usar ID de comentario*
    const currentCommentId = idComentario || generateMockCommentId();
    
    setIsUploading(true);
    setMessage("Subiendo imágenes...");

    try {
      let fotosGuardadas = 0;
      
      // Subir cada imagen por separado
      for (let i = 0; i < images.length; i++) {
        // Subir a Cloudinary
        const formData = new FormData();
        formData.append("file", images[i]);
        formData.append("upload_preset", "hxlmnpnj");

        setMessage(`Subiendo imagen ${i + 1} de ${images.length}`);

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/drzxn88tz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(`Error al subir imagen ${i + 1} a Cloudinary`);
        }

        const cloudinaryData = await res.json();
        
        // Guardar en MongoDB
        setMessage(`Guardando imagen ${i + 1} de ${images.length}`);
        
        await saveFotoToDatabase(cloudinaryData.secure_url, currentCommentId);
        
        // Añadir a la lista de imágenes subidas
        setUploadedImages((prev) => [...prev, cloudinaryData.secure_url]);
        fotosGuardadas++;
      }

      // Mensaje de subida ,exito
      setMessage(`✅ ${fotosGuardadas} foto${fotosGuardadas > 1 ? 's' : ''} subida${fotosGuardadas > 1 ? 's' : ''} y guardada${fotosGuardadas > 1 ? 's' : ''} correctamente`);
      
      // Limpiar formulario
      setImages([]);
      setPreviewImages([]);
      setShowConfirmation(false);
      setShowChooseButton(true);
      
      // Actualizar el ID del comentario si fue generado*
      if (!idComentario) {
        setIdComentario(currentCommentId);
      }
      
      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.error("Error en el proceso de subida:", error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // UI principal
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      {/* SIMULACIÓN: Input para ID de comentario */}
      
    {false && (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">
        ID Comentario (Simulación):
        </label>
      <input
        type="text"
        value={idComentario}
        onChange={(e) => setIdComentario(e.target.value)}
        placeholder="Deja vacío para generar automáticamente"
        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    <p className="text-xs text-gray-500 mt-1">
      Este ID vendrá automáticamente del componente de comentarios 
    </p>
    </div>
)}


      {/* Input para seleccionar archivos */}
      {showChooseButton && (
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={isUploading}
          className="mb-6 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-lg file:bg-gray-700 file:text-white file:border-none hover:file:bg-gray-800 file:cursor-pointer disabled:opacity-50"
        />
      )}
      
      {/* Confirmación para subir imágenes */}
      {showConfirmation && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-sm">
          <p className="text-lg font-semibold text-center text-gray-700 mb-4">
            ¿Deseas subir estas imágenes?
          </p>
          
          <div className="grid grid-cols-3 gap-3 justify-center mb-4">
            {previewImages.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`preview-${index}`}
                  className="w-20 h-20 object-cover rounded-md border border-gray-300"
                />
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-around">
            <button
              onClick={handleCancel}
              disabled={isUploading}
              className="bg-red-500 text-white px-6 py-2 text-sm rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmUpload}
              disabled={isUploading}
              className="bg-blue-700 text-white px-6 py-2 text-sm rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Subiendo...
                </>
              ) : (
                "Aceptar"
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Mensajes de estado */}
      {message && (
        <div className={`mt-4 p-3 rounded-md text-sm text-center ${
          message.includes('❌') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : message.includes('✅') 
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {message}
        </div>
      )}

      {/* Imágenes subidas */}
      {uploadedImages.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Imágenes subidas ({uploadedImages.length}):
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {uploadedImages.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`uploaded-${i}`}
                className="w-full aspect-square object-cover rounded border border-gray-300 cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => window.open(url, '_blank')}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;