const inquirer = require('inquirer');
const Handler = require('./utils/functions');

const handler = new Handler();

const menu = async () => {
    try {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit'
            ]
        });

        switch (action) {
            case 'View all departments':
                await handler.viewAllDepartments();
                break;
            case 'View all roles':
                await handler.viewAllRoles();
                break;
            case 'View all employees':
                await handler.viewAllEmployees();
                break;
            case 'Add a department':
                await handler.addDepartment();
                break;
            case 'Add a role':
                await handler.addRole();
                break;
            case 'Add an employee':
                await handler.addEmployee();
                break;
            case 'Update an employee role':
                await handler.updateEmployeeRole();
                break;
            case 'Exit':
                handler.pool.end();
                console.log('Goodbye!');
                process.exit();
        }

        menu();
    } catch (err) {
        console.error('Error in main menu:', err);
        await handler.pool.end();
        process.exit(1);
    }
};

menu();