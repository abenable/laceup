import Loader from "./Loader";
import PulseEffect from "./PulseEffect";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-mono-light/80 dark:bg-mono-dark/80 backdrop-blur-sm z-50">
      <div className="transform -translate-y-8 relative">
        <div className="absolute -inset-4 bg-mono-dark/20 dark:bg-mono-light/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative">
          <Loader size="large" variant="spinner" className="mb-4" />
          <div className="flex items-center gap-2 justify-center">
            <PulseEffect className="w-2 h-2" />
            <PulseEffect className="w-2 h-2 animation-delay-200" />
            <PulseEffect className="w-2 h-2 animation-delay-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = `
  .animation-delay-200 {
    animation-delay: 200ms;
  }
  .animation-delay-400 {
    animation-delay: 400ms;
  }
`;

// Add styles to the document head
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default PageLoader;
