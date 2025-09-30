import "../styling/FilmDetail.css"

function FilmDetail({ film }) {
    return(
        <div>
            <h2>{film.title}</h2>
            <h3>{film.name}</h3>
            <div className="film-details-a">
                <div className="description-features">
                    <p className="description">{film.description || "No Description Available"}</p><br/>
                    <p className="features"><b>Special Features</b><br/>{film.special_features}</p>
                </div>
                <table className="results-table">
                    <thead>
                        <tr>
                            <td>release year</td>
                            <td>rating</td>
                            <td>language</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{film.release_year}</td>
                            <td>{film.rating}</td>
                            <td>{film.lang}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FilmDetail;