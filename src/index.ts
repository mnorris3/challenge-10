import inquirer from "inquirer";
import {
  getRoles,
  getManagers,
  getDepartmentTable,
  getDepartments,
  employees,
  addEmployeee,
  addRoleToDB,
  init,
  getAllRoles,
  addDeptToDB,
  updateRole,
} from "./db/index.js";

async function viewEmpl() {
  // displays all employees, displaying ID, first and last name, title, dept, salary, and manager
  await employees();
  startCli();
}

async function addEmpl() {
  // Asks for first and last name, what role the have, and who their manager is
  const roles = await getRoles();

  const managers = await getManagers();

  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the emplyee's first name?",
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the emplyee's last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the emplyee's role?",
        choices: roles,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers,
      },
    ])
    .then(async (response) => {
      await addEmployeee(
        response.firstName,
        response.lastName,
        response.role,
        response.manager
      );
      startCli();
    });
}

async function updateEmpl() {
  // Asks which employee you want to update and what role you want to assign them to
  const employee = await getManagers();

  const roles = await getRoles();

  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Which employee's role do you want to update?",
        choices: employee,
      },
      {
        type: "list",
        name: "role",
        message: "Which role do you want to assign?",
        choices: roles,
      },
    ])
    .then(async (results) => {
      await updateRole(results.employee, results.role);
      startCli();
    });
}

async function viewRole() {
  // displays all roles, displaying role ID, title, dept, salary
  await getAllRoles();
  startCli();
}

async function addRole() {
  // Asks for name of new role, salary for role, and which dept it is under
  const dept = await getDepartments();

  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "What is the name of the new role",
      },
      {
        type: "list",
        name: "dept",
        message: "Which department does this role belong to?",
        choices: dept,
      },
      {
        type: "input",
        name: "salary",
        message: "What is the Salary of this role?",
      },
    ])
    .then(async (response) => {
      await addRoleToDB(response.title, response.dept, response.salary);
      startCli();
    });
}

async function viewDept() {
  // displays all depts, displaying only dept names and ID
  await getDepartmentTable();
  startCli();
}

async function addDept() {
  // Asks for the name of new dept
  inquirer
    .prompt([
      {
        type: "input",
        name: "deptName",
        message: "What is the name of the new department",
      },
    ])
    .then(async (results) => {
      await addDeptToDB(results.deptName);

      startCli();
    });
}

function startCli(): void {
  inquirer
    .prompt([
      {
        type: "list",
        name: "OpeningPrompt",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Exit",
        ],
      },
    ])
    .then((answers) => {
      if (answers.OpeningPrompt === "View All Employees") {
        viewEmpl();
      } else if (answers.OpeningPrompt === "Add Employee") {
        addEmpl();
      } else if (answers.OpeningPrompt === "Update Employee Role") {
        updateEmpl();
      } else if (answers.OpeningPrompt === "View All Roles") {
        viewRole();
      } else if (answers.OpeningPrompt === "Add Role") {
        addRole();
      } else if (answers.OpeningPrompt === "View All Departments") {
        viewDept();
      } else if (answers.OpeningPrompt === "Add Department") {
        addDept();
      } else if (answers.OpeningPrompt === "Exit") {
        console.log("Exiting");
        process.exit(0);
      }
    });
}

init();
startCli();
