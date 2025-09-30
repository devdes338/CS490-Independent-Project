import FilmFive from "../components/FilmFive";
import ActorFive from "../components/ActorFive";
import "../styling/Home.css";

function Home() {
    return(
        <div className="home-layout">
            <FilmFive />
            <ActorFive />
        </div>
    );

}

export default Home;