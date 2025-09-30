import { useState } from 'react';
import { useEffect} from 'react';
import axios from "axios";
import ActorDetail from './ActorDetail';
import "../styling/ActorFive.css"

function ActorFive() {
  const [actors, setActors] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorName, setActorName] = useState(['','']);

  useEffect (() => {
    axios.get('http://localhost:3000/top-actors').then(res => {
      setActors(res.data);
    }).catch(error => {
      console.error("Failure fetching actors:", error);
    })
  }, []);

  const handleActorClick = (actor) => {
    axios.post('http://localhost:3000/actor-top-films', {actor_id: actor.actor_id}).then(res => {
      //setSelectedActor({...actor, topFilms: res.data});
      setSelectedActor(res.data);
      setActorName([actor.first_name,actor.last_name]);
    }).catch(err => {
      console.error("Failed to fetch actor top films:", err);
    });
  }

  const listActors = actors.map(actor =>
    <div key={actor.actor_id} onClick={() => handleActorClick(actor)} className="top-actor clickable">
      <p>{actor.first_name} {actor.last_name}</p>
      <p>Featured in {actor.film_count} films</p>
    </div>
  );

  return (
    <>
      <h1>Top 5 Actors</h1>
      <div className="actor-five">
          {listActors}
      </div>
      {selectedActor && <ActorDetail actor={selectedActor} firstName={actorName[0]} lastName={actorName[1]}/>}
    </>
  )
};

export default ActorFive;
