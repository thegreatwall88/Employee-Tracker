INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Finance');

-- Insert sample data into role table
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('HR Manager', 60000, 2),
('Accountant', 50000, 3);

-- Insert sample data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, NULL),
('Mike', 'Johnson', 3, NULL),
('Emily', 'Davis', 1, 1);