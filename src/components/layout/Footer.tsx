export const Footer = () => {
  return (
    <footer className="footer bg-base-300 text-base-content items-center p-4 mt-auto border-t border-base-200">
      <aside className="grid-flow-col items-center">
        <span className="text-xl">👩‍💻</span>
        <p>DevTinder © {new Date().getFullYear()} - Connecting Developers Worldwide</p>
      </aside>
    </footer>
  );
};

export default Footer;
