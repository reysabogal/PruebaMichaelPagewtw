Consultas

-- Validar JSON
SELECT * FROM Tasks WHERE ISJSON(AdditionalData) = 1;

-- Obtener prioridad
SELECT JSON_VALUE(AdditionalData, '$.priority') AS Priority
FROM Tasks;

-- Filtrar por prioridad
SELECT * FROM Tasks
WHERE JSON_VALUE(AdditionalData, '$.priority') = 'High';