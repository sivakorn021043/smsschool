export default function NewsCard({ item }: any) {
  return (
    <a href={`/news/${item.id}`} className="block bg-white rounded shadow p-3 hover:shadow-lg">
      <img src={item.media?.[0]?.url ?? "/no-image.jpg"} className="w-full h-40 object-cover rounded" alt={item.title} />
      <h3 className="mt-2 font-bold">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.detail?.slice(0, 100)}</p>
    </a>
  );
}
