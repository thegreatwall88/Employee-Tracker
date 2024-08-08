const { Pool } = require('pg');
const inquirer = require('inquirer');

class Handler {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            password: 'Mkgk1988-',
            host: 'localhost',
            database: 'company_db'
        });
        this.pool.connect()
            .then(() => console.log('Connected to the company_db database!'))
            .catch(err => console.error('Connection error', err.stack));
    }

    async query(sql, params = []) {
        try {
            const res = await this.pool.query(sql, params);
            return res;
        } catch (err) {
            console.error('Query error:', err);
            throw err;
        }
    }

    async viewAllDepartments() {
        try {
            const sql = 'SELECT * FROM department'
            const res = await this.query(sql);
            console.table(res.rows);
        } catch (err) {
            console.error('Error viewing departments:', err);
        }
    }

    async viewAllRoles() {
        try {
            const sql = `
                SELECT role.id, role.title, department.name AS department, role.salary 
                FROM role 
                JOIN department ON role.department_id = department.id
            `;
            const res = await this.query(sql);
            console.table(res.rows);
        } catch (err) {
            console.error('Error viewing roles:', err);
        }
    }

    async viewAllEmployees() {
        try {
            const sql = `
                SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                FROM employee 
                JOIN role ON employee.role_id = role.id 
                JOIN department ON role.department_id = department.id 
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id
            `;
            const res = await this.query(sql);
            console.table(res.rows);
        } catch (err) {
            console.error('Error viewing employees:', err);
        }
    }

    async addDepartment() {
        try {
            const { name } = await inquirer.prompt({
                type: 'input',
                name: 'name',
                message: 'Enter the name of the department:'
            });
            await this.query('INSERT INTO department (name) VALUES ($1)', [name]);
            console.log(`Added ${name} to the database`);
        } catch (err) {
            console.error('Error adding department:', err);
        }
    }

    async addRole() {
        try {
            const departments = await this.query('SELECT * FROM department');
            const departmentChoices = departments.rows.map(row => ({ name: row.name, value: row.id }));

            const { title, salary, department_id } = await inquirer.prompt([
                { type: 'input', name: 'title', message: 'Enter the title of the role:' },
                { type: 'input', name: 'salary', message: 'Enter the salary of the role:' },
                { type: 'list', name: 'department_id', message: 'Select the department:', choices: departmentChoices }
            ]);

            await this.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
            console.log(`Added ${title} to the database`);
        } catch (err) {
            console.error('Error adding role:', err);
        }
    }

    async addEmployee() {
        try {
            const roles = await this.query('SELECT * FROM role');
            const roleChoices = roles.rows.map(row => ({ name: row.title, value: row.id }));

            const employees = await this.query('SELECT * FROM employee');
            const managerChoices = employees.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));

            const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
                { type: 'input', name: 'first_name', message: 'Enter the first name of the employee:' },
                { type: 'input', name: 'last_name', message: 'Enter the last name of the employee:' },
                { type: 'list', name: 'role_id', message: 'Select the role:', choices: roleChoices },
                { type: 'list', name: 'manager_id', message: 'Select the manager:', choices: [{ name: 'None', value: null }, ...managerChoices] }
            ]);

            await this.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
                [first_name, last_name, role_id, manager_id]);
            console.log(`Added ${first_name} ${last_name} to the database`);
        } catch (err) {
            console.error('Error adding employee:', err);
        }
    }

    async updateEmployeeRole() {
        try {
            const employees = await this.query('SELECT * FROM employee');
            const employeeChoices = employees.rows.map(row => ({ name: `${row.first_name} ${row.last_name}`, value: row.id }));

            const roles = await this.query('SELECT * FROM role');
            const roleChoices = roles.rows.map(row => ({ name: row.title, value: row.id }));

            const { employee_id, role_id } = await inquirer.prompt([
                { type: 'list', name: 'employee_id', message: 'Select the employee to update:', choices: employeeChoices },
                { type: 'list', name: 'role_id', message: 'Select the new role:', choices: roleChoices }
            ]);

            await this.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
            console.log(`Updated employee's role`);
        } catch (err) {
            console.error('Error updating employee role:', err);
        }
    }
}

module.exports = Handler;
