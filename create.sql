create table player
(
	id serial primary key,
	username varchar(20) unique not null check (char_length(username)>=5),
	rating smallint default(1000) not null,
	password bytea not null,
	salt bytea not null
);

create table refreshtoken
(
	player_id int not null references player(id),
	token_str text not null,
	is_used bool default(false) not null,
	emitted timestamp default current_timestamp not null,
	primary key(player_id, token_str)
);

create table friend_relation(
	friend_one int references player(id),
	friend_two int references player(id),
	is_accepted boolean default(false) not null,
	primary key (friend_one, friend_two)
);

create type text_language as enum('russian', 'english');

create table text_to_type
(
	id serial primary key,
	text text not null unique check(text != ''),
	text_language text_language not null,
	text_length smallint
);

create type game_type as enum('casual', 'ranked', 'training');

create type game_status as enum('not_started', 'in_progress','finished');

create table game
(
	id serial primary key,
	type game_type not null,
	status game_status not null default('not_started'),
	date_time timestamp default current_timestamp not null,
	text_id int references text_to_type(id) not null
);

create type player_status as enum ('not_connected', 'left', 'afk', 'finished');

create table player_game_stats
(
	game_id int references game(id),
	player_id int references player(id),
	status player_status not null default('not_connected'),
	rating smallint,
	rating_gain smallint,
	wpm smallint,
	cpm smallint,
	accuracy numeric(5,2),
	typing_time int,
	primary key(game_id, player_id)
);


drop table player_game_stats;
drop type player_status;
drop table game;
drop type game_status;
drop type game_type;
drop table text_to_type;
drop type text_language;
drop table friend_relation;
drop table refreshtoken;
drop table player;
