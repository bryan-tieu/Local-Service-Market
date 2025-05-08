DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS post;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    user_type TEXT NOT NULL
);

CREATE TABLE task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT (datetime('now', 'localtime')),
  task_title TEXT NOT NULL,
  task_description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  budget INTEGER NOT NULL,
  deadline TIMESTAMP NOT NULL,
  worker_id INTEGER,
  status TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE skill (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency INTEGER NOT NULL,
  years_of_experience INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user (id)
);

CREATE TABLE transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  task_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT (datetime('now', 'localtime')),
  status TEXT NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (sender_id) REFERENCES user (id),
  FOREIGN KEY (receiver_id) REFERENCES user (id),
  FOREIGN KEY (task_id) REFERENCES task (id)
);