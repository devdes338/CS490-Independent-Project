export const topRentedFilms = `select film.film_id, film.title, category.name, count(rental.rental_id) as rented
from sakila.film
inner join sakila.film_category on film.film_id=film_category.film_id
inner join sakila.category on film_category.category_id=category.category_id
inner join sakila.inventory on film.film_id=inventory.film_id
inner join sakila.rental on inventory.inventory_id=rental.inventory_id
group by film.film_id, category.name
order by rented desc
limit 5;
`;