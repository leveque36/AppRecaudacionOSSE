USE transferenciasdb;

DELIMITER $$

CREATE PROCEDURE BuscarTransferenciasPorEntidad(IN entidadBuscar VARCHAR(100))
BEGIN
    SELECT * FROM transferencias
    WHERE entidad = entidadBuscar;
END $$

DELIMITER ;
