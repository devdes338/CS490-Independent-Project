import "../styling/ActorDetail.css"

function ActorDetail({ actor, firstName, lastName }) {
    const listFilms = actor.map(film =>
        <div key={film.film_id} className="actor-top-film">
            {film.title}
        </div>
    );

    return(
        <div className="actor-top-films-name">
            <h2 className="name">{firstName} {lastName} Top Films</h2>
            <div className="actor-top-films">
                {listFilms}
            </div>
        </div>
    );
};


export default ActorDetail;