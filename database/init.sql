-- Script principal que ejecuta todo lo necesario para iniciar la base de datos
SOURCE /docker-entrypoint-initdb.d/schema/01_create_database.sql;
SOURCE /docker-entrypoint-initdb.d/schema/02_create_tables.sql;
SOURCE /docker-entrypoint-initdb.d/schema/03_insert_data.sql;

SOURCE /docker-entrypoint-initdb.d/procedures/01_obtener_transferencias.sql;
SOURCE /docker-entrypoint-initdb.d/procedures/02_buscar_por_entidad.sql;
