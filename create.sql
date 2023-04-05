create table users
(
	id serial primary key,
	user_name varchar(20) unique not null check (char_length(user_name)>=5),
	rating smallint default(1000) not null,
	password bytea not null,
	salt bytea not null
);

create type text_language as enum('russian', 'english');

create table texts
(
	id serial primary key,
	text text not null unique check(text != ''),
	text_language text_language not null,
	text_length smallint
);

create type game_type as enum('casual', 'ranked', 'training');

create table games
(
	id bigserial primary key,
	type game_type not null,
	date_time timestamp default current_timestamp not null,
	text_id serial references texts(id) not null
);

create table player_game_stats
(
	game_id bigserial references games(id),
	player_id serial references users(id),
	rating smallint,
	rating_gain smallint,
	words_per_minute smallint,
	accuracy numeric(3,2),
	typing_time int,
	primary key(game_id, player_id)
);

drop table player_game_stats;
drop table games;
drop type game_type;
drop table texts;
drop type text_language;
drop table users;
