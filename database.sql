CREATE TABLE "projects" (
    "id" SERIAL PRIMARY KEY,
    "project_name" VARCHAR(100) NOT NULL
);

CREATE TABLE "entries" (
    "id" SERIAL PRIMARY KEY,
    "entry" VARCHAR(255) NOT NULL,
    "project_id" INTEGER NOT NULL REFERENCES "projects",
    "work_date" DATE NOT NULL,
	"start_time" VARCHAR(4) NOT NULL,
	"end_time" VARCHAR(4) NOT NULL,
    "work_hour" NUMERIC(8,1) NOT NULL
);