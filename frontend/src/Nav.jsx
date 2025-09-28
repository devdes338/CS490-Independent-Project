function Nav() {
    return(
        <nav className="nav">
            <a href="/" className="title">Sakila Rentals</a>
            <ul>
                <li><a href="./Films">Films</a></li>
                <li><a href="./Customer">Customer</a></li>
            </ul>
        </nav>
    );
};

export default Nav;