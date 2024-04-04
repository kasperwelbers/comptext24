interface Props {
  program: Record<string, string | number>[];
}
export default function Program({ program }: Props) {
  return (
    <div className="relative mb-24 scroll-mt-28">
      <h2 className="text-4xl font-bold text-primary mb-8">Program</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {program.map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-md">
            <h3 className="text-xl font-bold text-primary">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.time}</p>
            <p className="text-base text-gray-800">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
