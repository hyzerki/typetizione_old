create table Player
(
	Id serial primary key,
	UserName varchar(20) unique not null check (char_length(UserName)>=5),
	Rating smallint default(1000) not null,
	Password varchar(64) not null,
	Salt varchar(64) not null
);

create table FriendRelation(
	FriendOne serial references Player(Id),
	FriendTwo serial references Player(Id),
	IsAccepted boolean not null,
	primary key (FriendOne, FriendTwo)
);

create type TextLanguage as enum('russian', 'english');

create table Text
(
	Id serial primary key,
	Text text not null unique check(Text != ''),
	TextLanguage TextLanguage not null,
	TextLength smallint
);

create type GameType as enum('casual', 'ranked', 'training');

create table Game
(
	Id bigserial primary key,
	Type GameType not null,
	DateTime timestamp default current_timestamp not null,
	TextId serial references Text(Id) not null
);

create table PlayerGameStats
(
	GameId bigserial references Game(id),
	PlayerId serial references Player(id),
	Rating smallint,
	RatingGain smallint,
	WordsPerMinute smallint,
	Accuracy numeric(3,2),
	TypingTime int,
	primary key(GameId, PlayerId)
);

drop table PlayerGameStats;
drop table Game;
drop type GameType;
drop table Text;
drop type TextLanguage;
drop table FriendRelation;
drop table Player;
