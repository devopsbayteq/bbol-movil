# 26. Crear servicio GET /security/certificate-hash

**Prioridad**: Media

**Historia padre**: #29065

## Descripción
Implementar endpoint que calcule y retorne el hash del certificado (p.ej. SHA-256 thumbprint) usado para firma/cifrado. Soportar rotación por alias/kid y retornar metadata (algoritmo, kid, fecha).
