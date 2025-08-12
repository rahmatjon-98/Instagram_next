import "./globals.css";
import TranslatorProvider from "@/components/providers/translator-provider";
import ThemeWrapper from "@/components/providers/theme-provider";
import ResponsiveBarWrapper from "@/components/layout/ResponsiveBarWrapper"; // путь к компоненту

export default function RootLayout({ children }) {
  return (
    <TranslatorProvider>
      <html lang="en">
        <body className="h-full">
          <ThemeWrapper>
            <ResponsiveBarWrapper>{children}</ResponsiveBarWrapper>
          </ThemeWrapper>
        </body>
      </html>
    </TranslatorProvider>
  );
}
