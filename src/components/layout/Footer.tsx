import { DevTinderLogo } from "@/components/common/Icons";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-base-200/80 bg-base-100/60 backdrop-blur-xs text-base-content/70 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Left: Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <DevTinderLogo className="w-5 h-5 opacity-90" />
          <span className="font-bold text-sm tracking-tight text-base-content">DevTinder</span>
          <span className="hidden sm:inline text-base-content/30">•</span>
          <span className="text-base-content/60">
            Connecting developers worldwide to discover &amp; collaborate
          </span>
        </div>

        {/* Right: Tech & Year */}
        <div className="flex items-center gap-4 text-base-content/60 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>All systems nominal</span>
          </div>
          <span className="text-base-content/30">•</span>
          <span>© {new Date().getFullYear()} DevTinder</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
