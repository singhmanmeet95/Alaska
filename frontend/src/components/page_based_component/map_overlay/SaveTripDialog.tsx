export interface SaveTripDialogProps {
  onFinalSubmit: (saveToDb: boolean) => void;
}

export function SaveTripDialog({ onFinalSubmit }: SaveTripDialogProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-fade-in-up">
        <h3 className="text-lg font-headline text-foreground">Save Trip?</h3>
        <p className="font-body-sm text-[12px] text-foreground/70 leading-relaxed">
          Do you want us to put your data in the database too, so other people
          can match with you on this route?
        </p>
        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={() => onFinalSubmit(false)}
            className="px-4 py-2 bg-background hover:bg-card border border-border text-foreground font-button text-[12px] rounded-[var(--radius-pill)] transition-colors"
          >
            No, just search
          </button>
          <button
            onClick={() => onFinalSubmit(true)}
            className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground font-button text-[12px] rounded-[var(--radius-pill)] transition-colors"
          >
            Yes, save it
          </button>
        </div>
      </div>
    </div>
  );
}
