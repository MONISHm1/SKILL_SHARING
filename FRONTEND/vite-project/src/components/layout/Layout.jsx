import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    // 🔥 CHANGE 1: Add global background + text color
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      {/* 🔥 CHANGE 2: ensure full height + proper background */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 CHANGE 3: Navbar wrapper for border consistency */}
        <div className="border-b border-[var(--border)] bg-[var(--card)]">
          <Navbar />
        </div>

        {/* Content */}
        {/* 🔥 CHANGE 4: use flexible content area */}
        <div className="flex-1 p-6">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;