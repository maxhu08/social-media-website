import { Navbar } from "~/components/navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full sm:w-[60%] md:w-[40%] mx-auto">
      <Navbar />
      <div className="py-20">{children}</div>
    </div>
  );
};

export default Layout;
