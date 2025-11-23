// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-8">
      <div className="max-w-7xl mx-auto px-4 text-center">
        © {new Date().getFullYear()} โรงเรียนบ้านทรายมูล — สพฐ.
      </div>
    </footer>
  );
}
