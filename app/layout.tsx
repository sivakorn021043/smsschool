// app/layout.tsx
import "./globals.css";        // ← แก้ตรงนี้ !!! ไม่ใช่ "@/styles/globals.css"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "โรงเรียนบ้านทรายมูล",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-gray-50">
        <Header />
        <main className="min-h-[70vh] pt-20">  {/* 🔥 เพิ่มตรงนี้ */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}