INSERT INTO department(name) VALUES 
("Engineering"), 
("Machining"), 
("Welding"), 
("Tooling");

INSERT INTO role (title, salary, department_id) VALUES
("Manager", 100000, 1),
("Engineer", 80000, 2),
("Machinist", 85000, 2),
("Welder", 95000, 2),
("Toolcrib Attendant", 75000, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
('Gabby', 'Lopira', 1, null),
('Wilton', 'Lemon', 1, 1),
('Drasco', 'Nori', 2, 2),
('Freddie', 'Hazardry', 3, 2),
('Pruscetta', 'Milano', 3, 2),
('Tommy', 'Wagoner', 3, 2),
('Leon', 'Castle', 4, 2),
('Quinton', 'Teally', 4, 2),
('Patray', 'Domico', 5, 2);