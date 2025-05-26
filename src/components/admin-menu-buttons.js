// src/app/components/AdminMenu.jsx
import Link from 'next/link';

const AdminMenu = () => {
  // Base styles for all buttons
  const buttonBaseStyle = "px-4 py-2 rounded-md font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  // Style for active/functional buttons
  const activeButtonStyle = `${buttonBaseStyle} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`;
  
  // Style for disabled/placeholder buttons
  const placeholderButtonStyle = `${buttonBaseStyle} bg-gray-400 text-gray-700 cursor-not-allowed opacity-70 hover:bg-gray-400`;

  const handlePlaceholderClick = (featureName) => {
    alert(`${featureName} - Funcionalidad no implementada aún.`);
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex items-center space-x-4">
        <Link href="/admin-add-lugar" passHref>
          <button className={activeButtonStyle}>
            Lugares
          </button>
        </Link>

        <button
          type="button"
          className={placeholderButtonStyle}
          onClick={() => handlePlaceholderClick('Comunicaciones')}
          title="Funcionalidad no implementada aún"
        >
          Comunicaciones
        </button>

        <button
          type="button"
          className={placeholderButtonStyle}
          onClick={() => handlePlaceholderClick('Roles')}
          title="Funcionalidad no implementada aún"
        >
          Roles
        </button>
      </div>
    </nav>
  );
};

export default AdminMenu;