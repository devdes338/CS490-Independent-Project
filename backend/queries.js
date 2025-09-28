export const topRentedFilms = `select film.film_id, film.title, category.name, film_text.description,count(rental.rental_id) as rented
from sakila.film
inner join sakila.film_category on film.film_id=film_category.film_id
inner join sakila.category on film_category.category_id=category.category_id
inner join sakila.inventory on film.film_id=inventory.film_id
inner join sakila.rental on inventory.inventory_id=rental.inventory_id
inner join sakila.film_text on film.film_id=film_text.film_id
group by film.film_id, category.name
order by rented desc
limit 5;
`;

export const topActors = `select actor.actor_id, actor.first_name, actor.last_name, count(film_actor.film_id) as film_count
from sakila.actor
inner join sakila.film_actor on actor.actor_id=film_actor.actor_id
group by actor.actor_id
order by film_count desc
limit 5;
`;

export const actorTopFilms = `select film.film_id, film.title, count(rental.rental_id) as rented
from sakila.film
inner join sakila.inventory on film.film_id=inventory.film_id
inner join sakila.rental on inventory.inventory_id=rental.inventory_id
inner join sakila.film_actor on film.film_id=film_actor.film_id
where film_actor.actor_id = ?
group by film.film_id
order by rented desc
limit 5;`;