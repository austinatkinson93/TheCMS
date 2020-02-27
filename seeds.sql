-- Inserted a set of records into the table
INSERT INTO department (name)
VALUES ("Development Team");
INSERT INTO Department (name)
VALUES ("management");
INSERT INTO role (title, salary, department_id)
VALUES ("Technitian", 32000, 5 );
INSERT INTO role (title, salary, department_id)
VALUES ("developer", 63000, 8 );
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES ("Conney", "Jones", 1, 5);
INSERT INTO Employee (first_name, last_name, role_id, manager_id)
VALUES ("john", "doe", 1, 5);