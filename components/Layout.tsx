// components/Layout.tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return <div className="pt-16">{children}</div>; // Adjust `pt-16` based on Navbar height
};

export default Layout;
