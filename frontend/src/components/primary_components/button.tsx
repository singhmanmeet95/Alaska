interface ButtonProps {
  onClick?: () => void;
  isSubmitting?: boolean;
  buttonText?: string;
  className?:string;

}

export default function Button({ onClick, isSubmitting, buttonText }:ButtonProps){
  return (
    <button
      onClick={onClick}
      type="submit"
      disabled={isSubmitting}
      className="w-3/4 flex justify-center group items-center text-md p-2 rounded-full bg-red-500 text-white h-10 transition-all duration-500 relative overflow-hidden"
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center space-x-2">
          <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
        </span>
      ) : (
        <>
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          <span className="relative group-hover:text-red-500 transition-colors duration-500">
            {buttonText}
          </span>
        </>
      )}
    </button>
  );
};

