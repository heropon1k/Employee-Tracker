const inquirer = require('inquirer');
const pool = require('./db/connection.js');

function main() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'userInput',
                message: 'What would you like to do?',
                choices: [
                    'View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit',
                ]
            }])
        .then((input) => {
            switch (input.userInput) {
                case 'View All Employees':
                    console.log('View All Employees');
                    view_employee();
                    break;
                case 'Add Employee':
                    console.log('Add Employee');
                    add_employee();
                    break;
                case 'Update Employee Role':
                    console.log('Update Employee Role');
                    update_employee();
                    break;
                case 'View All Roles':
                    console.log('View All Roles');
                    view_roles();
                    break;
                case 'Add Role':
                    console.log('Add Role');
                    add_roles();
                    break;
                case 'View All Departments':
                    console.log('View All Departments');
                    view_department();
                    break;
                case 'Add Department':
                    console.log('Add Department');
                    add_department();
                    break;
                case 'Quit':
                    console.log('Quit');
                    process.exit()
            }
        })


}

main();

function view_employee() {
    pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department = department.id;', (err, { rows }) => {
        console.table(rows);
        main();
    })
}

function add_employee() {
    inquirer
        .prompt([
            {
                type: 'text',
                name: 'firstName',
                message: 'What is their first name?',
            },
            {
                type: 'text',
                name: 'lastName',
                message: 'What is their last name?',
            },
        ])
        .then((input) => {
            const firstname = input.firstName;
            const lastname = input.lastName;
            //console.log(firstname + lastname)

            pool.query('SELECT role.title, role.id FROM role', (err, { rows }) => {
                let roles = rows;
                const roles_db = roles.map(({ department, title }) => ({ name: title, value: department }));
                console.log(roles_db)
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'department',
                            message: 'What is their role?',
                            choices: roles_db,
                        }
                    ])

                    .then((roleChoice) => {

                        const role = roleChoice.department;
                        pool.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee', (err, { rows }) => {
                            let manager = rows;
                            console.log(manager)
                            const manager_db = manager.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                            console.log(manager_db)
                            inquirer
                                .prompt([
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: 'Whos is their manager?',
                                        choices: manager_db
                                    }
                                ])
                                .then((managerChoice) => {
                                    pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstname}', '${lastname}', ${role}, ${managerChoice.manager})`)
                                })
                                .then(() => main())
                        })
                    })

            })


        })
}

function update_employee() {
    pool.query('SELECT employee.id, employee.first_name, employee.last_name FROM employee', (err, { rows }) => {
        let employees = rows;
        const employee_db = employees.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer
            .prompt([{
                type: 'list',
                name: 'employee',
                message: 'Who wuld you like to update',
                choices: employee_db
            }])
            .then((employeeChoice) => {
                const employee_update = employeeChoice.employee;
                pool.query('SELECT role.title, role.id FROM role', (err, { rows }) => {
                    let roles = rows;
                    const roles_db = roles.map(({ id, title }) => ({ name: title, value: id }));
                    console.log(roles_db)
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'department',
                                message: 'What is their new role?',
                                choices: roles_db,
                            }
                        ])
                        .then((roleChoice) => {
                            console.log(employee_update)
                            console.log(roleChoice.department)
                            pool.query(`UPDATE employee SET role_id = ${roleChoice.department} WHERE id = ${employee_update}`)
                            console.log('Role updated')
                        })
                        .then(() => main())

                })
            })
    })
}

function view_roles() {
    pool.query('SELECT * FROM role', (err, { rows }) => {
        console.table(rows);
        main();
    })
}

function add_roles() {
    pool.query('SELECT * FROM department', (err, { rows }) => {
        let departments = rows;
        const department_db = departments.map(({ id, name }) => ({ name: name, value: id }));

        inquirer
            .prompt([
                {
                    type: 'text',
                    name: 'add_role',
                    message: 'What is the name of the role?',
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'What is the salary?',
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which deparment does the role belong to?',
                    choices: department_db,
                }
            ])
            .then((input) => {
                pool.query(`INSERT INTO role (title, salary, department) VALUES ('${input.add_role}', ${input.salary}, '${input.department}')`)
                console.log(`${input.add_role} role added`);
            })
            .then(() => main());
    })
}

function view_department() {
    pool.query('SELECT department.id, department.name FROM department', (err, { rows }) => {
        console.table(rows);
        main();
    })
}

function add_department() {
    inquirer
        .prompt([
            {
                type: 'text',
                name: 'add_department',
                message: 'What is the name of the department?',
            }])
        .then((input) => {
            pool.query(`INSERT INTO department (name) VALUES ('${input.add_department}')`)
            console.log(`${input.add_department} department added`)
        })
        .then(() => main());
}
