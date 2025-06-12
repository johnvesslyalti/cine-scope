import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
                <header className="sticky top-0 z-50 bg-black shadow-md">
                    <Navbar />
                </header>
                <main>
                    { children }
                </main>
                <footer>
                    <Footer />
                </footer>
                </ThemeProvider>
            </body>
        </html>
    )
}