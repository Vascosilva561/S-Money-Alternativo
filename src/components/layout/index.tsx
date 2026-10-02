import Layout from "./layout";

export function DefaultLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="h-screen w-full transition-all duration-300">
      <Layout>
        {children}
      </Layout>
    </div>
  );
}
