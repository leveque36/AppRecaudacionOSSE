
USE recaudacion_db;

CREATE TABLE Convenios (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Tasa_de_interes DECIMAL(10,2) NULL,
    Dias_de_acreditacion INT NULL,
    Descripcion VARCHAR(255) NULL
);

CREATE TABLE Entes (
    CUIT_CUIL VARCHAR(20) NOT NULL PRIMARY KEY,
    Razon_social VARCHAR(255) NULL,
    Descripcion VARCHAR(255) NULL,
    Id_Convenio INT NULL,
    FOREIGN KEY (Id_Convenio) REFERENCES Convenios(Id)
);

CREATE TABLE Sector (
    Id_sector INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NULL
);

CREATE TABLE Tipo_transaccion (
    Id_tpo_transaccion INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NULL,
    Descripcion VARCHAR(255) NULL
);

CREATE TABLE Transaccion (
    Numero_op INT AUTO_INCREMENT PRIMARY KEY,
    CUIT_CUIL VARCHAR(20) NULL,
    Fecha_valor DATE NULL,
    Fecha_devengado DATE NULL,
    Monto DECIMAL(18,2) NULL,
    Id_tpo_transaccion INT NULL,
    Id_sector INT NULL,
    FOREIGN KEY (CUIT_CUIL) REFERENCES Entes(CUIT_CUIL),
    FOREIGN KEY (Id_sector) REFERENCES Sector(Id_sector),
    FOREIGN KEY (Id_tpo_transaccion) REFERENCES Tipo_transaccion(Id_tpo_transaccion)
);

