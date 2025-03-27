USE transferenciasdb;

DELIMITER $$

CREATE PROCEDURE ObtenerTransferencias()
BEGIN
    SELECT * FROM transferencias;
END $$

DELIMITER ;
