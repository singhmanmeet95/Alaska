import { Mail, Shield, CheckCircle, XCircle } from "lucide-react";

interface UserInfoCardProps {
  email: string;
  emailVerified: Date | null | undefined;
  about: string | null;
  mfaEnabled: boolean;
}

export default function UserInfoCard({
  email,
  emailVerified,
  about,
  mfaEnabled,
}: UserInfoCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-indigo-400" />
        </div>
        Account Information
      </h2>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                Email Address
              </p>
              <p className="text-zinc-200 font-medium">{email}</p>
            </div>
          </div>
          {emailVerified ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Verified
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              Unverified
            </div>
          )}
        </div>

        {/* MFA Status */}
        <div className="flex items-center justify-between p-4 bg-zinc-950/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
                Two-Factor Auth
              </p>
              <p className="text-zinc-200 font-medium">
                {mfaEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          {mfaEnabled ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Active
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              Inactive
            </div>
          )}
        </div>

        {/* About */}
        {about && (
          <div className="p-4 bg-zinc-950/30 rounded-xl border border-zinc-800">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium mb-2">
              About
            </p>
            <p className="text-zinc-300 leading-relaxed text-sm">{about}</p>
          </div>
        )}
      </div>
    </div>
  );
}
