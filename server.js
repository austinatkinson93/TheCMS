
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');
const express = require("express");

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
            message: "What would to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "Update Employee Role"],
            name: "startAnswer"
        }]).then((answer) => {
            switch (answer.startAnswer) {
                case "Add Department":
                    console.log("route: Add Department")
                    addDepartment()
                    break;
                case "Add Role":
                    console.log("route: Add Role")
                    break;
                case "Add Employee":
                    console.log("route: Add Employee")
                    break;
                case "View Departments":
                    console.log("route: View Departments")
                    viewDepartment()
                    break;
                case "View Departments":
                    console.log("route: View Departments")
                    break;
                case "View Roles":
                    console.log("route: View Roles")
                    connection.end()
                    break;
                case "Update Employee Role":
                    console.log("route: Update Employee Role")
                    connection.end()
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
            console.log("Inserting a new Department...\n");
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


function viewDepartment() {
    connection.query("SELECT * FROM department ORDER BY id",
        function (err, res) {
            if (err) throw err;
            console.log('\n')
            console.table(res)
            appStart()

        }
    );

}