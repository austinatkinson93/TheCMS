
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const express = require("express");
const util = require("util");


const app = express();

const PORT = process.env.PORT || 8000;

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    // Your password
    password: "root",
    database: "Employees_db"
});

//turn connection.query into something that returns a promise
const query = util.promisify(connection.query);

connection.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);

    appStart()
});

function appStart(answer) {
    inquirer
        .prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Employees", "View Roles", "Update Employee Role"],
            name: "startAnswer"
        }]).then((answer) => {
            switch (answer.startAnswer) {
                case "Add Department":
                    addDepartment()
                    break;
                case "Add Role":
                    addRole()
                    break;
                case "Add Employee":
                    addEmployee()
                    break;
                case "View Departments":
                    viewDepartment()
                    break;
                case "View Employees":
                    viewEmployee()
                    break;
                case "View Roles":
                    viewRoles()
                    break;
                case "Update Employee Role":
                    updateEmployee()
                    break;
                default:
                    connection.end()
                    break;
            }
        })




}

app.listen(PORT, () => {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});

async function addDepartment() {
    await inquirer
        .prompt([{
            type: "input",
            name: "newDepartment",
            message: "What is the name of the department you would like to add?"
        }]).then(answer => {
            connection.query("INSERT INTO department SET ?",
                {
                    name: answer.newDepartment,
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New Department Inserted!\n");

                }
            );
            appStart()

            // logs the actual query being run
            // console.log(query.sql);
        });
}

async function addRole() {
    await inquirer
        .prompt([{
            type: "input",
            name: "title",
            message: "What is the title of the role you would like to add?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the Salary of this role?"
        },
        {
            type: "input",
            name: "departmentId",
            Message: "What is the department ID for this role?"
        }]).then(answer => {
            connection.query("INSERT INTO role SET ?",
                {
                    title: answer.title,
                    salary: answer.salary,
                    department_id: answer.departmentId
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("New Role Inserted!\n");
                    appStart()

                }
            );

            // logs the actual query being run
            // console.log(query.sql);
        });
}

function addEmployee() {
    connection.query("SELECT * FROM role", (err, res) => {
        let rolelist = res.map(role => {
            return { name: role.title, value: role.id };
        });
        connection.query("SELECT * FROM employee", (err, res) => {
            let managerlist = res.map(manager => {
                return {
                    name: manager.first_name + " " + manager.last_name,
                    value: manager.id
                };
            });
            console.log("asdsddd");
            console.log(rolelist);
            inquirer
                .prompt([
                    {
                        name: "firstname",
                        type: "input",
                        message: "What is your first name"
                    },
                    {
                        name: "lastname",
                        type: "input",
                        message: "What is your last name?"
                    },
                    {
                        name: "roleid",
                        type: "list",
                        message: "What is your role id?",
                        choices: rolelist
                    },
                    {
                        name: "managerid",
                        type: "list",
                        message: "What is your manager id?",
                        choices: managerlist
                    }
                ])
                .then(answer => {
                    connection.query(
                        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)",
                        [
                            answer.firstname,
                            answer.lastname,
                            answer.roleid,
                            answer.managerid
                        ],
                        (err, res) => {
                            if (err) throw err;
                            appStart();
                        }
                    );
                });
        });
    });
}

function viewDepartment() {
    connection.query("SELECT * FROM department",
        function (err, res) {
            if (err) throw err;
            console.log('\n')
            console.table(res)
            appStart()

        }
    );

}

function viewRoles() {
    connection.query("SELECT * FROM role ORDER BY id",
        function (err, res) {
            if (err) throw err;
            console.log('\n')
            console.table(res)
            appStart()

            return JSON.parse(res)
        }
    );

}

function viewEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.log('\n')
        console.table(res)
        appStart()

        return JSON.parse(res)
    });
}



function updateEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        let employeeList = res.map(employee => {
            return { name: employee.first_name, value: employee.id };
        });
        connection.query("SELECT * FROM role", (err, res) => {
            let rolelist = res.map(role => {
                return { name: role.title, value: role.id };
            });
    
            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Which employee would you like to update a role for?",
                        choices: employeeList
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Which role would you like to pick?",
                        choices: rolelist
                    }
                ])
                .then(answer => {
                    connection.query(
                        "UPDATE employee SET role_id = ? WHERE id = ?",
                        [answer.role, answer.employee],
                        err => {
                            if (err) throw err;
                            appStart();
                        }
                    );
                });
        });
    });
}