CREATE TABLE IF NOT EXISTS meals (

  idMeal SERIAL PRIMARY KEY,
  strMeal VARCHAR(45) NOT NULL, 
  strCategory VARCHAR(45),
  strArea VARCHAR(45),
  strTags VARCHAR(45)[]

);