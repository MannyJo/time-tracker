# Time Tracker Project

> NOTE: Do not fork this repository. Instead, create your own repository from scratch.

Trello Board: [https://trello.com/b/WUa7rOxR/time-tracker-sample](https://trello.com/b/WUa7rOxR/time-tracker-sample)

## Features

- Add projects by name
- Track time to projects (task name, date, start time and end time)
- Display a history of all time entries
- Delete existing entries
- Show total hours worked next to each project on the project page

### Database
```
CREATE TABLE "projects" (
	"id" SERIAL PRIMARY KEY,
	"project_name" VARCHAR(100) NOT NULL
);

CREATE TABLE "entries" (
	"id" SERIAL PRIMARY KEY,
	"entry" VARCHAR(255) NOT NULL,
	"project_id" INTEGER NOT NULL REFERENCES "projects",
	"work_date" DATE NOT NULL,
	"work_hour" NUMERIC(8,1) NOT NULL
);
```

### Wireframes

#### Add Time Entry View

![Add Entry Page](image/page-one.png)

#### Manage Projects View

![Add Entry Page](image/page-two.png)

### Database

Start with two tables **projects** & **entries**. When base features are complete, add more tables as needed for stretch goals.

## Stretch Goals

- Ability to edit entries or projects
- Angular Material for design
- Display a chart showing the total number of hours worked for each project
- Ability to select start and end dates to influence what appears on the chart
- Feel free to deviate from this list and add features of your own

### Wireframes

![Add Entry Page](image/page-three.png)
