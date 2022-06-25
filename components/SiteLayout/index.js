import Link from 'next/link'

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
      <nav>
        <ul>
          <li>
            <Link href='/'>
              <a>News</a>
            </Link>
          </li>
          <li>
            <Link href='/newest'>
              <a>Newest</a>
            </Link>
          </li>
          <li>
            <Link href='/ask'>
              <a>Ask</a>
            </Link>
          </li>
          <li>
            <Link href='/show'>
              <a>Show</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const Footer = () => (
  <footer>
    Footer
  </footer>
);
 
export default SiteLayout;