import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="bg-[var(--bg)] text-[var(--text)]">
      <Sidebar />

      <div className="ml-60">
        <Navbar />

        <div className="pt-20 px-6 h-screen overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Layout;
