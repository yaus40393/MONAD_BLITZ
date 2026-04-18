export const metadata = {
  title: 'MachineChain',
  description: 'Parametric industrial insurance on Monad',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
