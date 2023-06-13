import '../styles/nav.css';
import Links from "./links"

function Navbar() {
  return (
    <nav>
        <a href="/">
          <h2 id="nav-logo">New Website</h2>
        </a>
        <Links id="nav-items" />
    </nav>
  );
}

export default Navbar;
