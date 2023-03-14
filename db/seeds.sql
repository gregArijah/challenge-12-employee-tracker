INSERT INTO department(name) VALUES 
("Engineering"), 
("Machining"), 
("Welding"), 
("Tooling");

INSERT INTO role (title, salary, department_id) VALUES
("Manager", 100000, 1),
("Engineer", 80000, 1),
("Machinist", 85000, 2),
("Welder", 95000, 3),
("Toolcrib Attendant", 75000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES
('Gabby', 'Lopira', 1, null),
('Wilton', 'Lemon', 2, 1),
('Drasco', 'Nori', 2, 1),
('Freddie', 'Hazardry', 3, 2),
('Pruscetta', 'Milano', 3, 2),
('Tommy', 'Wagoner', 3, 2),
('Leon', 'Castle', 4, 3),
('Quinton', 'Teally', 4, 3),
('Patray', 'Domico', 5, 2);