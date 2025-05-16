import './globals.css'
import { ThemeProvider } from "../../components/ThemeProvider";
import { AuthProvider } from '../../context/authContext';

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Cine Scope</title>
        </head>
        <body>
          <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </AuthProvider>
        </body>
      </html>
    </>
  )
}
