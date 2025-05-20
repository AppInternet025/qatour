import "./globals.css";
import {Providers} from "./Providers";
import Navbar from "../components/Navbar";




export const metadata= {
  title: "Turismo App",
  description: "Guia de turistas",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
        <Navbar/>
        {children}
        </Providers>
      </body>
    </html>
  );
}
