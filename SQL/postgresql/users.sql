CREATE TABLE users (
	id serial PRIMARY KEY,
	email VARCHAR (255) UNIQUE NOT NULL,
	first_name VARCHAR (255) NOT NULL,
	last_name VARCHAR (255) NOT NULL,
	password VARCHAR (255) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP
);