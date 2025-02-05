DROP DATABASE IF  EXISTS employee_db;
CREATE DATABASE employee_db;

\c employee_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);


-- SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, m.first_name || ' ' || m.last_name AS manager
-- FROM employee AS e
-- LEFT JOIN role as r ON e.role_id = r.id
-- LEFT JOIN department AS d ON r.department_id = d.id
-- LEFT JOIN employee AS m ON e.manager_id = m.id;

-- SELECT m.first_name || ' ' || m.last_name AS manager
-- FROM employee AS e
-- LEFT JOIN employee AS m ON e.manager_id = m.id;

-- SELECT r.id, r.title, d.name, r.salary
-- FROM role AS r
-- LEFT JOIN department AS d ON r.department_id = d.id;


-- SELECT id
-- FROM employee WHERE (first_name || ' ' || last_name) = $1

-- SELECT id
-- FROM role WHERE title = $1;