CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL
);

CREATE TABLE extras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  precio INT NOT NULL
);

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
);

CREATE TABLE cotizaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  servicio_id INT,
  extras TEXT,
  total INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO servicios (nombre, precio) VALUES 
('Diseño Web', 30000),

INSERT INTO extras (nombre, precio) VALUES 
('Landing page', 25000), 
('Sitio multipágina', 40000), 
('Tienda online', 55000), 
('Mantenimiento mensual', 10000);
