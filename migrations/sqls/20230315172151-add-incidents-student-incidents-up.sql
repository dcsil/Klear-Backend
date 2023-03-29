/* Replace with your SQL commands */
-- add data into this file 
INSERT INTO staff (staff_id, first_name, last_name, email, password)
VALUES (NULL, "Karen", "Smith", "karen.smith@gmail.com", "$2b$10$ras6/a2FVaMtYKdYdDmI8ew/29auRBZa0zbgM68oXWCYmwhZa452e");

INSERT INTO students (student_id, first_name, last_name, age, contact_number, contact_name)
VALUES (NULL, "Samantha", "King", 1, "6571111111", "John"),
(NULL, "Joe", "Brown", 1, "6471234567", "Bob");

INSERT INTO activities (activity_id, event, date, student_id)
VALUES (NULL, "Eating", CURRENT_TIMESTAMP, 1),
(NULL, "Sleeping", CURRENT_TIMESTAMP, 2);

INSERT INTO incidents (incident_id, event, date, status, resolved_user)
VALUES (NULL, "Fall", CURRENT_TIMESTAMP, NULL, NULL),
(NULL, "Fall", CURRENT_TIMESTAMP, 0, 1);

INSERT INTO student_incidents (student_id, incident_id)
VALUES (1, 1), (1, 2);