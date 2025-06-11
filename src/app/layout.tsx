import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang='en' suppressHydrationWarning={true}>
            <head>
                <title>Cine Scope</title>
            </head>
            <body>
                <ThemeProvider
                    attribute={"class"}
                    defaultTheme='system'
                    enableSystem={true}
                    disableTransitionOnChange={true}
                >
                <main>
                    { children }
                </main>
                </ThemeProvider>
            </body>
        </html>
    )
}