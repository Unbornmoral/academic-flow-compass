
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm leading-loose text-muted-foreground text-center md:text-left">
            © 2025 Political Science Companion. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
