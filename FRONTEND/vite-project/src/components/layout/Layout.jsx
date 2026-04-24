import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
   
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">

      
      <Sidebar />

  
      <div className="flex-1 flex flex-col">

        
        <div className="border-b border-[var(--border)] bg-[var(--card)]">
          <Navbar />
        </div>

        
        <div className="flex-1 p-6">
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;