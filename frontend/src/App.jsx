import Nav from "./Nav";
import Home from "./pages/Home";
import Films from "./pages/Films";
import Customer from "./pages/Customer";
import './styling/App.css';

function App() {
  let Component;
  switch(window.location.pathname) {
    case "/":
      Component = Home;
      break;
    case "/Films":
      Component = Films;
      break;
    case "/Customer":
      Component = Customer;
      break;
  }
  return (
    <>
      <Nav/>
      <div className="container">
        <Component/>
      </div>
    </>
  );
};

export default App
