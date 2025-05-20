import "./globals.css";
import {Providers} from "./Providers";
import Navbar from "../components/Navbar";




export const metadata= {
  title: "eWave [ Epic Media Wave ]",
  description: "Marketing Projects Manager",
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
