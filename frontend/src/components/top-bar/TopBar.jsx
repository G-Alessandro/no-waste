import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <header>
      <Link>
        <img src="" alt="" />
        <h1>NoWaste</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/">HOME</Link>
          </li>
          <li>
            <Link to="/finds-stores">FINDS STORES</Link>
          </li>
          <li>
            <Link to="/login">SIGN-IN</Link>
          </li>
          <li>
            <Link to="/registration">SIGN-UP</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
