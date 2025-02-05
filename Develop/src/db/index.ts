import { pool, connectToDb } from "./connection.js";

export function init() {
  connectToDb();
}

export async function getRoles() {
  const client = await pool.connect();

  try {
    const query = `SELECT title FROM role;`;

    const result = await client.query(query);

    const roleTitles = [];

    for (let i = 0; i < result.rows.length; i++) {
      roleTitles.push(result.rows[i].title);
    }

    return roleTitles;
    // console.log(roleTitles);
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    client.release();
  }
}

export async function getManagers() {
  const client = await pool.connect();

  try {
    const query = `SELECT first_name || ' ' || last_name AS manager FROM employee;`;

    const result = await client.query(query);

    const managerNames = [];

    for (let i = 0; i < result.rows.length; i++) {
      if (result.rows[i].manager != null) {
        managerNames.push(result.rows[i].manager);
      }
    }

    return managerNames;
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    client.release();
  }
}

export async function getDepartments() {
  const client = await pool.connect();

  try {
    const query = `SELECT name AS departments FROM department;`;

    const result = await client.query(query);

    const deptNames = [];

    for (let i = 0; i < result.rows.length; i++) {
      if (result.rows[i].departments != null) {
        deptNames.push(result.rows[i].departments);
      }
    }

    return deptNames;
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    client.release();
  }
}

export async function getAllRoles() {
  const client = await pool.connect();

  try {
    const query = `SELECT r.id, r.title, d.name, r.salary
    FROM role AS r
    LEFT JOIN department AS d ON r.department_id = d.id;`;

    const result = await client.query(query);

    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    client.release();
  }
}

export async function getDepartmentTable() {
  const client = await pool.connect();

  try {
    const query = `SELECT id, name FROM department;`;

    const result = await client.query(query);

    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    client.release();
  }
}

export async function employees() {
  const client = await pool.connect();

  try {
    const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, m.first_name || ' ' || m.last_name AS manager
      FROM employee AS e
      LEFT JOIN role as r ON e.role_id = r.id
      LEFT JOIN department AS d ON r.department_id = d.id
      LEFT JOIN employee AS m ON e.manager_id = m.id;`;

    const result = await client.query(query);
    console.log();
    console.table(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    client.release();
  }
}

async function convertManager(manager: string) {
  const client = await pool.connect();

  let managerID;

  try {
    managerID = await client.query(
      `SELECT id FROM employee WHERE (first_name || ' ' || last_name) = $1;`,
      [manager]
    );
    console.log(manager);

    return managerID.rows[0].id;
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    client.release();
  }
}

async function convertDept(department: string) {
  const client = await pool.connect();

  let departmentID;

  try {
    departmentID = await client.query(
      `SELECT id FROM department WHERE name = $1;`,
      [department]
    );

    return departmentID.rows[0].id;
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    client.release();
  }
}

async function convertRole(role: string) {
  const client = await pool.connect();

  let roleID;

  try {
    roleID = await client.query(`SELECT id FROM role WHERE title = $1;`, [
      role,
    ]);

    // console.log(roleID.rows[0].id);

    return roleID.rows[0].id;
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    client.release();
  }
}

export async function addEmployeee(
  firstName: string,
  lastName: string,
  role: string,
  manager: string
) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);`,
      [
        firstName,
        lastName,
        await convertRole(role),
        await convertManager(manager),
      ]
    );
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    client.release();
  }
}

export async function addRoleToDB(
  title: string,
  department: string,
  salary: number
) {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO role(title, department_id, salary) VALUES ($1, $2, $3);`,
      [title, await convertDept(department), salary]
    );
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    client.release();
  }
}

export async function addDeptToDB(department: string) {
  const client = await pool.connect();
  try {
    await client.query(`INSERT INTO department(name) VALUES ($1);`, [
      department,
    ]);
  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    client.release();
  }
}

export async function updateRole(employee: string, role: string) {
  const client = await pool.connect();

  try {
    await client.query(`UPDATE employee SET role_id = $2 WHERE id = $1;`, [
      await convertManager(employee),
      await convertRole(role),
    ]);
  } catch (error) {
    console.error("Error updating employee:", error);
  } finally {
    client.release();
  }
}
