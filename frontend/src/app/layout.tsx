import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "GerenciarTarefas",
  description: "Projeto para o case de estágio da Mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
