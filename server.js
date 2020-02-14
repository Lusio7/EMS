const mysql = require("mysql");
const inquirer = require("inquirer")

const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "testtest",
    database: "employeeManagementSystem_DB"
});

connection.connect(function (err) {
    if (err) throw err;

    initialize();
});

const addDept = () => {
    inquirer
        .prompt([
            {
                name: "title",
                type: "input",
                message: "What is the title of this new department?"
            }
        ])
        .then(answer => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    dep_name: answer.title,
                },
                err => {
                    if (err) throw err;
                    console.log("Your new department was created successfully!");
                    initialize();
                }
            );
        })
}

const addRole = () => {

    connection.query("SELECT * FROM department", (err, rows) => {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of this new role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "How much will this role make?"
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department is the role a part of?",
                    choices: function () {
                        return rows.map(rows => {
                            return { name: rows.dep_name, value: rows.id, short: rows.dep_name }
                        })
                    }
                }
            ])
            .then(answer => {
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary
                    },
                    err => {
                        if (err) throw err;
                        console.log("Your new role was created successfully!");
                        initialize();
                    }
                );
            })
    })
}



const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, role) => {
        if (err) throw err;
        connection.query("SELECT * FROM employee", (err, employee) => {
            if (err) throw err;
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the new employee's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the new employee's last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "what is this new employees role?",
                    name: "roleId",
                    choices: function () {
                        return role.map(role => {
                            return { name: role.title, value: role.id, short: role.title }
                        })
                    }
                },
                {
                    type: "list",
                    message: "Who is this new employee's manager?",
                    name: "managerId",
                    choices: function () {
                        return employee.map(emp => {
                            return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id, short: `${emp.first_name} ${emp.last_name}` }
                        })
                    }
                }
            ]).then(answer => {
                let query = connection.query(
                    "INSERT INTO employee (first_name, last_name, role_id, managerId) VALUES (?, ?, ?, ?)",
                    [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
                    (err, res) => {
                        if (err) throw err;

                        initialize();
                    }
                );
                console.log(query.sql)
            })
        })
    })
}

const viewDepartment = () => {
    connection.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;

        console.table(res);
        initialize();
    })
}

const viewRoles = () => {
    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;

        console.table(res);
        initialize();
    })
}

const viewEmployees = () => {
    connection.query(`SELECT emp.id, emp.first_name, emp.last_name, rol.title, dep.dep_name, rol.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS Manager
    FROM employee AS emp
    LEFT JOIN role as rol ON emp.role_id = rol.id 
    LEFT JOIN employee as mgr ON emp.managerId = mgr.id 
    LEFT JOIN department as dep ON dep.Id = rol.departmentId`, (err, res) => {
        if (err) throw err;

        console.table(res);
        initialize();
    })
}

const updateEmployee = () => {

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        connection.query(`SELECT * FROM employee`, (err, res) => {
            if (err) throw err;

            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which employee's role would you like to update?",
                        name: "updateEmp",
                        choices: function () {
                            return employee.map(emp => {
                                return { name: `${emp.first_name} ${emp.last_name}`, value: emp.id, short: `${emp.first_name} ${emp.last_name}`}
                            })
                        }
                    },
                    {
                        type: "list",
                        message: "What is this employee's new role?",
                        name: "roleId",
                        choices: function () {
                            return role.map(role => {
                                return { name: role.title, value: role.id, short: role.title }
                            })
                        }
                    }
                ]).then(answers => {
                    connection.query(`UPDATE employee SET employee.id = ? WHERE ?`, [answers.roleId, answer.updateEmp])
                })
        })

    })


}
const initialize = () => {
    inquirer
        .prompt({
            name: "startQuestion",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Role", "Add Employee", "View Departments", "View Roles", "View Employees", "Update Employee Roles"]
        }).then(function (answer) {
            if (answer.startQuestion === "Add Department") {
                console.log(`You Selected ${answer.startQuestion}`);
                addDept();
            }
            else if (answer.startQuestion === "Add Role") {
                console.log(`You Selected ${answer.startQuestion}`);
                addRole();
            }
            else if (answer.startQuestion === "Add Employee") {
                console.log(`You Selected ${answer.startQuestion}`);
                addEmployee();
            }
            else if (answer.startQuestion === "View Departments") {
                console.log(`You Selected ${answer.startQuestion}`);
                viewDepartment();
            }
            else if (answer.startQuestion === "View Roles") {
                console.log(`You Selected ${answer.startQuestion}`);
                viewRoles();
            }
            else if (answer.startQuestion === "View Employees") {
                console.log(`You Selected ${answer.startQuestion}`);
                viewEmployees();
            }
            else if (answer.startQuestion === "Update Employee Roles") {
                console.log(`You Selected ${answer.startQuestion}`);

            }
            else {
                connection.end();
            }
        });
};