DROP DATABASE IF EXISTS employeeManagementSystem_DB;
CREATE DATABASE employeeManagementSystem_DB;

USE employeeManagementSystem_DB;

CREATE TABLE department(
  id INT NOT NULL AUTO_INCREMENT,
  dep_name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INT NOT NULL AUTO_INCREMENT,
  departmentId INT,
  title VARCHAR(100) NOT NULL,
  salary INT(10) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT NOT NULL AUTO_INCREMENT,
  managerId INT,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id INT,
  PRIMARY KEY (id)
);

SELECT emp.id, emp.first_name, emp.last_name, rol.title, dep.dep_name, rol.salary, CONCAT(mgr.first_name, ' ', mgr.last_name) AS Manager
FROM employee AS emp
LEFT JOIN role as rol ON emp.role_id = rol.id 
LEFT JOIN employee as mgr ON emp.managerId = mgr.id 
LEFT JOIN department as dep ON dep.Id = rol.departmentId  