USE recaudacion_db;


-- Insertar datos en Convenios
INSERT INTO Convenios (Tasa_de_interes, Dias_de_acreditacion, Descripcion) VALUES
(5.25, 30, 'Convenio estándar 30 días'),
(3.75, 15, 'Convenio rápido 15 días'),
(6.50, 45, 'Convenio extendido 45 días'),
(4.00, 20, 'Convenio especial 20 días');

-- Insertar datos en Entes
INSERT INTO Entes (CUIT_CUIL, Razon_social, Descripcion, Id_Convenio) VALUES
('20-12345678-9', 'Empresa Alpha S.A.', 'Empresa dedicada a la tecnología', 1),
('30-98765432-1', 'Constructora Beta S.R.L.', 'Constructora de viviendas', 2),
('27-45678912-3', 'Servicios Gama', 'Consultoría financiera', 3),
('23-32165498-7', 'Comercial Delta', 'Importadora de productos electrónicos', 1);

-- Insertar datos en Sector
INSERT INTO Sector (Nombre) VALUES
('Finanzas'),
('Construcción'),
('Tecnología'),
('Comercio');

-- Insertar datos en Tipo_transaccion
INSERT INTO Tipo_transaccion (Nombre, Descripcion) VALUES
('Pago de factura', 'Transacción por pago de factura'),
('Depósito', 'Depósito en cuenta bancaria'),
('Transferencia', 'Transferencia bancaria entre cuentas'),
('Préstamo', 'Otorgamiento de préstamo financiero');

-- Insertar datos en Transaccion
INSERT INTO Transaccion (CUIT_CUIL, Fecha_valor, Fecha_devengado, Monto, Id_tpo_transaccion, Id_sector) VALUES
('20-12345678-9', '2024-03-01', '2024-03-02', 150000.50, 1, 3),
('30-98765432-1', '2024-03-05', '2024-03-06', 250000.75, 2, 2),
('27-45678912-3', '2024-03-10', '2024-03-11', 50000.00, 3, 1),
('23-32165498-7', '2024-03-15', '2024-03-16', 100000.25, 4, 4);
