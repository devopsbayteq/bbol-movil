# Maestro E2E Tests

Tests funcionales end-to-end para BBApp usando [Maestro](https://maestro.mobile.dev/).

## Prerequisitos

### Instalar Maestro

**macOS / Linux:**

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

**Windows:**

Maestro requiere WSL2 en Windows. Instalar dentro de WSL:

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

Verificar la instalacion:

```bash
maestro --version
```

### Dispositivo USB en Windows + WSL (muy importante)

Si instalaste Maestro **dentro de WSL** y tu celular esta conectado por USB al PC, Maestro dira **0 devices** porque el `adb` de Linux en WSL **no ve** el USB del host Windows.

**Opcion recomendada:** ejecutar los tests desde **PowerShell o CMD en Windows** (no desde la terminal WSL), con Maestro instalado de forma que use el mismo `adb` que Android Studio:

1. En Windows, instala Maestro con el instalador oficial si existe, o usa un `maestro` que apunte al SDK de Android de Windows.
2. Antes de correr Maestro: `adb devices` en **PowerShell** debe listar tu telefono como `device`.
3. Ejecuta: `maestro test .maestro\flows\auth\login-success.yaml` desde la carpeta del repo en Windows.

**Si quieres seguir usando solo WSL:** debes enlazar el cliente `adb` de WSL al servidor `adb` que corre en Windows (el que ya ve el USB). Con el servidor `adb` iniciado en Windows (`adb start-server`), en WSL suele funcionar:

```bash
export ADB_SERVER_SOCKET=tcp:$(grep nameserver /etc/resolv.conf | awk '{print $2}'):5037
adb devices   # debe mostrar el mismo dispositivo que en Windows
maestro test .maestro/flows/auth/login-success.yaml
```

Si `adb devices` en WSL sigue vacio, en Windows ejecuta una vez `adb kill-server` y `adb start-server`, y revisa la documentacion de Microsoft sobre **ADB y WSL2** (a veces hace falta que el firewall permita el puerto 5037).

### Emulador / Simulador

- **Android:** tener un emulador corriendo o dispositivo conectado via `adb`.
- **iOS (solo macOS):** tener un simulador abierto.

### App instalada

La app debe estar compilada e instalada en el emulador/simulador antes de ejecutar los tests:

```bash
# Android
npm run android

# iOS
npm run ios
```

## Estructura

```
.maestro/
  config.yaml              # Configuracion global (appId, nombre)
  flows/
    auth/
      login-success.yaml              # Login + OTP + inicio (movimientos)
      login-success-compact-second-session.yaml # Tras primer login: modo compacto (sin alias)
      login-credentials-opens-otp.yaml   # Solo hasta pantalla OTP
      login-otp-invalid.yaml          # PIN incorrecto en OTP
      login-invalid-credentials.yaml  # Credenciales invalidas
      logout.yaml                     # Logout y retorno a login
      session-persisted-relaunch.yaml # Tras reinicio, pantalla de login
    transactions/
      transactions-list-visible.yaml  # Verificar pantalla de transacciones
  subflows/
    ensure-login-screen.yaml        # Cierra sesion si hace falta (luego "Otro usuario" si aplica)
    ensure-login-screen-keep-device-bound.yaml # Logout sin forzar formulario completo (modo compacto)
    ensure-login-email-field-visible.yaml # "Otro usuario" + espera campo usuario (primer ingreso E2E)
    ensure-authenticated.yaml         # Sesion existente o login+OTP mock
    complete-demo-otp.yaml          # Post-OTP: alias/modal/biometria opcionales + Inicio
  fixtures/                # Datos de prueba (futuro)
  README.md
```

## Ejecutar tests

### Todos los flujos (incluye subcarpetas `auth/`, `transactions/`)

```bash
maestro test --flatten .maestro/flows/
```

### Un flujo especifico

```bash
maestro test .maestro/flows/auth/login-success.yaml
```

### Con Maestro Studio (modo interactivo)

```bash
maestro studio
```

Maestro Studio abre una interfaz visual donde puedes explorar la jerarquia de elementos de la app, probar selectores y construir flujos de forma interactiva.

## Credenciales de prueba

Usuario y contraseña (sin correo). En modo mock coinciden con `MockAuthDataSource`:

| Campo     | Valor            |
|-----------|------------------|
| Usuario   | usuario-demo12   |
| Contraseña | 123456          |

El usuario debe tener entre **12 y 16** caracteres (letras, números, `.`, `-`, `_`). Los flujos Maestro usan **usuario-demo12** por defecto.

## Flujo de login (app real)

1. **Primer ingreso en el dispositivo** (sin `DEVICE_BOUND_*` o tras pulsar **Otro usuario**): formulario completo (usuario + contraseña) → OTP → **RegisterAlias** → modal de registro → oferta biométrica (si aplica) → Inicio. Los flujos que llaman a `ensure-login-email-field-visible.yaml` fuerzan este modo para poder escribir `usuario-demo12`.
2. **Siguientes ingresos en el mismo dispositivo** (sesión cerrada pero vínculo conservado): **modo compacto** (saludo + solo contraseña). El OTP navega con `skipRegisterAlias`: no aparece la pantalla de alias. Para E2E usar `login-success-compact-second-session.yaml` y `ensure-login-screen-keep-device-bound.yaml`. En `npm run test:e2e` el archivo va **justo después** de `login-success.yaml` y **antes** de `login-validation-fields.yaml` (ese flujo hace `clearState`) y de `logout.yaml` (fuerza formulario completo con `ensure-login-email-field-visible`).
3. **`complete-demo-otp.yaml`** cubre ambos casos: espera opcional a `register-alias-screen` y pasos condicionales; si no hay primer ingreso, continúa hacia Inicio.

## Solucion de problemas

### `CLEAR_APP_USER_DATA` / `pm clear` al usar `clearState: true`

En varios dispositivos, la depuracion USB **no permite** borrar datos de la app (`pm clear`). Por eso los flujos usan `launchApp` **sin** `clearState`. Si necesitas empezar siempre desde sesion cerrada, borra datos de BBApp manualmente en Ajustes > Apps, o ejecuta antes un flujo que haga logout.

Si tu ROM lo permite, puedes volver a anadir `clearState: true` bajo `launchApp` en los YAML que quieras aislar.

## Convenciones

- Un archivo por flujo principal.
- Nombres orientados a intencion de usuario (ej: `login-success.yaml`, no `test-1.yaml`).
- Los flujos usan `testID` para localizar elementos cuando es posible.
- Cada flujo tiene un objetivo unico y legible.
- Los flujos deben cubrir comportamiento observable por el usuario, no detalles internos.

## Selectores usados

| testID               | Elemento                        |
|----------------------|---------------------------------|
| login-email-input    | Campo de texto de usuario (login) |
| login-password-input | Campo de texto de contraseña    |
| login-change-user    | Enlace "Otro usuario" (modo compacto) |
| login-submit         | Botón "Ingresar"                |
| login-error          | Mensaje de error en login       |
| register-alias-screen | Pantalla registro de alias      |
| register-alias-input | Campo alias                     |
| register-alias-continue | Continuar tras alias       |
| device-registration-success-continue | Modal registro dispositivo |
| biometric-offer-screen | Oferta de biometría          |
| biometric-offer-skip | Omitir oferta biométrica      |
| home-screen          | Contenedor pestaña Inicio       |
| otp-screen           | Pantalla OTP / PIN              |
| otp-error            | Mensaje de error en OTP         |
| transactions-screen  | Contenedor pantalla transacciones |
| logout-button        | Botón "Salir"                   |
