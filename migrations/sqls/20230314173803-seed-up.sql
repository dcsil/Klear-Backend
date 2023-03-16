/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS staff (
    staff_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    email varchar(100) NOT NULL,
    password varchar(100) NOT NULL,
    PRIMARY KEY (staff_id)
);

CREATE TABLE IF NOT EXISTS students (
    student_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(20) NOT NULL,
    last_name varchar(20) NOT NULL,
    age int NOT NULL,
    contact_number varchar(20),
    contact_name varchar(20),
    PRIMARY KEY (student_id)
);

CREATE TABLE IF NOT EXISTS activities (
    activity_id int NOT NULL AUTO_INCREMENT,
    event varchar(100) NOT NULL,
    date DATETIME NOT NULL,
    student_id int NOT NULL,
    PRIMARY KEY (activity_id),
    CONSTRAINT FK_StudentActivity FOREIGN KEY (student_id)
    REFERENCES students(student_id)
);

CREATE TABLE IF NOT EXISTS incidents (
    incident_id int NOT NULL AUTO_INCREMENT,
    event varchar(100) NOT NULL,
    date DATETIME NOT NULL, 
    status BOOLEAN, 
    resolved_user int, 
    PRIMARY KEY (incident_id),
    CONSTRAINT FK_StaffIncident FOREIGN KEY (resolved_user)
    REFERENCES staff(staff_id)
);

CREATE TABLE IF NOT EXISTS student_incidents (
    student_id int NOT NULL,
    incident_id int NOT NULL,
    PRIMARY KEY (student_id, incident_id),
    CONSTRAINT FK_StudentIncident FOREIGN KEY (student_id)
    REFERENCES students(student_id),
    CONSTRAINT FK_IncidentStudent FOREIGN KEY (incident_id)
    REFERENCES incidents(incident_id)
);
