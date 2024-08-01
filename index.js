const inquirer = require('inquirer');

const { Pool } = require('pg');

const pool = new Pool(
    {
        user: 'postgres',
        password: 'rootroot',
        host: 'localhost',
        database: 'employee_db'
    },
    console.log('connected to employee_db')
)

pool.connect()

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
                    view_employee(pool);
                    break;
                case 'Add Employee':
                    console.log('Add Employee');
                    add_employee(pool)
                    break;
                case 'Update Employee Role':
                    console.log('Update Employee Role');
                    break;
                case 'View All Roles':
                    console.log('View All Roles');
                    break;
                case 'Add Role':
                    console.log('Add Role');
                    break;
                case 'View All Departments':
                    console.log('View All Departments');
                    view_department(pool);
                    break;
                case 'Add Department':
                    console.log('Add Department');
                    add_department(pool);
                    break;
                case 'Quit':
                    console.log('Quit');
                    process.exit()
            }
        })


}

main();

function view_employee(pool){
    pool.query('SELECT * FROM employee', (err, { rows })=> {
        console.table(rows);
    })
}

function add_employee(pool){
    inquirer
    .prompt([
        {
            type: 'text',
            name: 'first-name',
            message: 'What is their first name?',
        },
        {
            type: 'text',
            name: 'last-name',
            message: 'What is their last name?',
        },
    ])
    .then((input) => {
        const firstname = input.first-name;
        const lastname = input.last-name;


    })
}

function update_employee(){

}

function view_roles(){

}

function add_roles(){

}

function view_department(){
    pool.query('SELECT department.id, department.name FROM department', (err, { rows })=> {
        console.table(rows);
        main()
    })
}

function add_department(pool){
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
