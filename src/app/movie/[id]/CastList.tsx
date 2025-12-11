export default function CastList({ cast }: { cast: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {cast.map((member) => (
        <div key={member.id} className="text-center">
          <div className="font-bold">{member.name}</div>
          <div className="text-sm text-gray-400">{member.character}</div>
        </div>
      ))}
    </div>
  );
}
