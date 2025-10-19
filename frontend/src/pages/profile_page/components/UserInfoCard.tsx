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
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        Account Information
      </h2>

      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Email Address</p>
              <p className="text-gray-800 font-semibold">{email}</p>
            </div>
          </div>
          {emailVerified ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Verified
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              <XCircle className="w-4 h-4" />
              Unverified
            </div>
          )}
        </div>

        {/* MFA Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Two-Factor Authentication
              </p>
              <p className="text-gray-800 font-semibold">
                {mfaEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>
          {mfaEnabled ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              <CheckCircle className="w-4 h-4" />
              Active
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              <XCircle className="w-4 h-4" />
              Inactive
            </div>
          )}
        </div>

        {/* About */}
        {about && (
          <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <p className="text-sm text-gray-500 font-medium mb-2">About</p>
            <p className="text-gray-700 leading-relaxed">{about}</p>
          </div>
        )}
      </div>
    </div>
  );
}
