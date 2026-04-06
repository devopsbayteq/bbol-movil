# 27. Crear middleware para control de tiempo (timestamp/expiración)

**Prioridad**: Alta

**Historia padre**: #29065

## Descripción
Validar timestamp del request (header) contra ventana permitida (p.ej. ±300s) para prevenir replay. Integrar con el middleware de integridad: si timestamp fuera de ventana, rechazar antes de procesar. Configurar tolerancia por ambiente.
