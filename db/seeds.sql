INSERT INTO department (name)
VALUES('Engineering'), 
('Sales'), 
('Finance'), 
('Legal'), 
('Marketing');

INSERT INTO role (title, salary, department)
VALUES('Engineer', 85000, 1), 
('Senior Engineer', 125000, 1), 
('Accountant', 350000, 3), 
('Lawyer', 300000, 4),
('Sales Lead', 10000,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
 ('Jimmy', 'Morty', 2, null), 
 ('Deon', 'Gibson', 1, 1), 
 ('James', 'Smith', 1, 1),
 ('Jamie', 'Brynlee', 1, 1),
 ('Kevin', 'Carrol', 4, null);

