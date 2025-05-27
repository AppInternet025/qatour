import React, { useState, useEffect } from 'react';

import UploadForm from "./UploadForm"
import { useSearchParams } from "next/navigation";

export default function Comentarios(){
    const [newComment, setNewComment] = useState('');
    const handleCommentSubmit = () => {
      if (!newComment.trim()) return;
      setNewComment('');
    }
  
    const searchParams = useSearchParams();
    
        const selectedCity = JSON.parse(searchParams.get('selectedCity'))

    return(
        <div>
        <UploadForm/>
              <ul>
                
                  <li>🗨️ Comentario testing</li>
                
              </ul>
              <br />
              <input 
                type="text"
             
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario"
              />
              
              <button onClick={handleCommentSubmit}>Enviar</button>
              </div>
    )
}