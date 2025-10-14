export const topRentedFilms = `select film.film_id, film.title, category.name, film.release_year, language.name as lang, film.rating, film.special_features,film_text.description, count(rental.rental_id) as rented
from sakila.film
inner join sakila.film_category on film.film_id=film_category.film_id
inner join sakila.category on film_category.category_id=category.category_id
inner join sakila.language on film.language_id=language.language_id 
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

export const filmSearchResults = `select distinct film.film_id, film.title, cat.name, film.release_year, film.rating, film.special_features, language.name as lang, film_text.description,count(distinct rental.rental_id) as rented
from sakila.film as film
inner join sakila.film_category on film.film_id=sakila.film_category.film_id
inner join sakila.category as cat on sakila.film_category.category_id=cat.category_id
inner join sakila.inventory on film.film_id=inventory.film_id
inner join sakila.rental on inventory.inventory_id=rental.inventory_id
inner join sakila.film_text on film.film_id=film_text.film_id
inner join sakila.film_actor on sakila.film.film_id=sakila.film_actor.film_id
inner join sakila.actor on sakila.film_actor.actor_id=sakila.actor.actor_id
inner join sakila.language on film.language_id=language.language_id
where upper(film.title) like upper(?) or upper(cat.name) like upper(?) or upper(actor.first_name) like upper(?) or upper(actor.last_name) like upper(?)
group by film.film_id, cat.name;`;


export const filmStock = `SELECT 
    f.film_id,
    f.title,
    COUNT(i.inventory_id) AS total_copies,
    COUNT(r.rental_id) AS currently_rented,
    (COUNT(i.inventory_id) - COUNT(r.rental_id)) AS stock
FROM 
    film f
    LEFT JOIN inventory i ON f.film_id = i.film_id
    LEFT JOIN rental r ON i.inventory_id = r.inventory_id 
        AND r.return_date IS NULL
where f.film_id = ?
GROUP BY 
    f.film_id, f.title;`;

export const availableFilm = `select inventory.inventory_id
from sakila.inventory
left join sakila.rental on inventory.inventory_id = rental.inventory_id and rental.return_date is null
where inventory.film_id = ? and rental.rental_id is null
limit 1;`;

export const insertRental = `insert into sakila.rental (rental_date, inventory_id, customer_id, staff_id)
values (now(), ?, ?, 1);`;

export const insertPayment = `insert into sakila.payment (customer_id, staff_id, rental_id, amount, payment_date)
values (?, 1, ?, 4.99, now()
);`;

export const customerList = `select customer.customer_id, customer.first_name, customer.last_name, count(rental.rental_id) as count
from sakila.customer
left join sakila.rental on customer.customer_id=rental.customer_id
group by customer.customer_id
order by count desc;`;

export const customerSearchResults = `select customer.customer_id, customer.first_name, customer.last_name, count(rental.rental_id) as count
from sakila.customer
left join sakila.rental on customer.customer_id=rental.customer_id
where customer.customer_id = ? or customer.first_name like ? or customer.last_name like ?
group by customer.customer_id
order by count desc;`;

export const newCustomer = `insert into sakila.customer (store_id, first_name, last_name, email, address_id)
values (1, ?, ?, ?, 1);`;

export const editCustomer = `update sakila.customer
set first_name = upper(?) , last_name = upper(?) , email = ?
where customer_id = ?;`;

export const customerRented = `select film.film_id, film.title, rental.rental_id, rental.rental_date, rental.return_date
from sakila.rental
inner join inventory on rental.inventory_id = inventory.inventory_id
inner join film on inventory.film_id  = film.film_id
where rental.customer_id = ?
order by rental.rental_date desc;`;

export const returnFilm = `update sakila.rental
set return_date = now()
where rental_id = ?;`;

export const deleteCustomer = `delete from sakila.customer where customer_id = ?;`;