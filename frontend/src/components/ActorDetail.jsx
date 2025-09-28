import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function ActorDetail({ actor }) {
    const listFilms = actor.map(film =>
        <div key={film.film_id}>
            {film.title}
        </div>
    );

    return(
        <>
            {listFilms}
        </>
    );
};


export default ActorDetail;