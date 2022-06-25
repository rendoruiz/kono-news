import Header from "./Header";

const SiteLayout = ({ children }) => {
  return (  
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

const Footer = () => (
  <footer>
    Footer
  </footer>
);
 
export default SiteLayout;