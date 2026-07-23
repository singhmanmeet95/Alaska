import { useNavigate } from "react-router-dom";
import { Check, X, Bell } from "lucide-react";

interface RequestUser {
  id: string;
  name: string;
  username: string;
  profile_image?: string;
}

interface ConnectionRequest {
  id: string;
  requester: RequestUser;
}

interface ConnectionRequestsModalProps {
  requests: ConnectionRequest[];
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export function ConnectionRequestsModal({
  requests,
  onClose,
  onAccept,
  onReject,
}: ConnectionRequestsModalProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md font-sans p-4 animate-fade-in">
      <div
        className="bg-card/90 backdrop-blur-xl border border-border/50 rounded-[var(--radius-3xl)] w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden transform animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50 shrink-0 bg-background/50">
          <div className="flex items-center gap-3 text-primary font-semibold">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-headline text-foreground">
              Connection Requests
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/50 hover:text-foreground p-2 bg-background/50 hover:bg-background rounded-full transition-all duration-300 hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-background/30 to-background/10">
          {requests.length === 0 ? (
            <div className="text-foreground/50 font-body text-base py-16 text-center glass-panel rounded-[var(--radius-2xl)]">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              No new connection requests.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="glass-panel border border-border/50 rounded-[var(--radius-2xl)] p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer group flex-1 min-w-0"
                    onClick={() => {
                      onClose();
                      navigate(`/user/${req.requester.id}`);
                    }}
                  >
                    {req.requester.profile_image ? (
                      <img
                        src={req.requester.profile_image}
                        alt={req.requester.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-primary/50 transition-colors shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-headline border-2 border-transparent group-hover:border-primary/50 shrink-0">
                        {req.requester.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="text-foreground font-headline text-base group-hover:text-primary transition-colors truncate">
                        {req.requester.name}
                      </span>
                      <span className="text-foreground/50 font-body text-xs truncate">
                        @{req.requester.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    <button
                      onClick={() => onAccept(req.id)}
                      className="p-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300 hover:scale-110"
                      title="Accept"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      className="p-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 hover:scale-110"
                      title="Reject"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
