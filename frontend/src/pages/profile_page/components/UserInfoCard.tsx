interface UserInfoCardProps {
  about: string | null;
}

export default function UserInfoCard({ about }: UserInfoCardProps) {
  return (
    <div className="p-4 h-full bg-zinc-950/30 rounded-xl border border-zinc-800">
      <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
        About
      </p>
      <p className="text-zinc-300 leading-relaxed text-sm">{about}</p>
    </div>
  );
}
