import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "react-hot-toast";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang={locale} dir={dir} className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Navbar user={user} />
          <main className="flex-grow">
            {children}
          </main>
          <Toaster position="bottom-right" />
          {/* Footer would go here */}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
