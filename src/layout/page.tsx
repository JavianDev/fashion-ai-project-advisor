import { Header, Footer } from ".";

const Layout = async ({ children }: any) => {
  return (
    <div className="min-h-[100vh] flex flex-col justify-between w-full bg-background text-foreground">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
