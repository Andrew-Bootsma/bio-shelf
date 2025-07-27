// snapshot test

import { Link } from "@tanstack/react-router";

const Header = () => {
  return (
    <nav>
      <Link to={"/"}>
        <h1 className="mx-4 mt-4">BioShelf</h1>
      </Link>
    </nav>
  );
};

export default Header;
