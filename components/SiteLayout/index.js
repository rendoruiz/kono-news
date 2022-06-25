const SiteLayout = ({ children }) => {
  return (  
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

const Header = () => {
  return (
    <header>
      Header
    </header>
  );
}

const Footer = () => (
  <footer>
    Footer
  </footer>
);
 
export default SiteLayout;