import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Usando Inter como se solicita/implica por el diseño moderno
import "./globals.css";
import StyledComponentsRegistry from "../lib/AntdRegistry";
import { ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bienvenido - Boxful",
  description: "Prueba Técnica para Boxful",
  icons: {
    icon: '/icons/boxfull.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ margin: 0, padding: 0, backgroundColor: '#585858' }}>
        <StyledComponentsRegistry>
          <ConfigProvider
            locale={esES}
            theme={{
              token: {
                colorPrimary: '#2548c5', // Azul/Indigo de la captura de pantalla
                borderRadius: 6,
                fontFamily: inter.style.fontFamily,
              },
              components: {
                Button: {
                  controlHeight: 40, // Botones más altos como en la captura
                },
                Input: {
                  controlHeight: 40,
                }
              }
            }}
          >
            {children}
          </ConfigProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
