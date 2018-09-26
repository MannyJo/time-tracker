CREATE TABLE "projects" (
	"id" SERIAL PRIMARY KEY,
	"project" VARCHAR(100) NOT NULL
);

CREATE TABLE "entries" (
	"id" SERIAL PRIMARY KEY,
	"entry" VARCHAR(255) NOT NULL,
	"project_id" INTEGER NOT NULL REFERENCES "projects",
	"work_date" DATE NOT NULL,
	"work_hour" NUMERIC(8, 2) NOT NULL
);