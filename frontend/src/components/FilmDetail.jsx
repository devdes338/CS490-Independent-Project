import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function FilmDetail({ film }) {
    return(
        <div>
            <h2>{film.title}</h2>
            <h3>{film.name}</h3>
            <p>{film.description}</p>
        </div>
    );
}

export default FilmDetail;