# BBApp — Banco Bolivariano Hackathon

React Native banking app (Clean Architecture) para Android/iOS.

## Tech Stack

| Capa | Librería |
|------|---------|
| UI | React Native 0.84 + React 19 |
| Navegación | React Navigation v7 (native-stack + bottom-tabs) |
| Estado global | React Context (auth/security) + Zustand (tema) |
| HTTP | Axios |
| Almacenamiento seguro | react-native-encrypted-storage |
| Biometría | react-native-biometrics |
| E2E | Maestro |
| Unit tests | Jest |

## Arquitectura

Clean Architecture en tres capas:

```
src/
├── data/          # Repositories, datasources (remote/local), mappers
├── domain/        # Entidades, use cases, validación
├── presentation/  # Screens + ViewModels (custom hooks)
├── navigation/    # React Navigation — stacks y tabs
├── providers/     # AuthProvider, ThemeProvider, SecurityProvider
├── di/            # Contenedor de inyección de dependencias
└── utils/         # Helpers de formato
```

## Estructura de navegación

```
AppNavigator
├── SplashScreen          (fetch de clave pública)
├── LoginStack
│   ├── LoginScreen
│   └── OtpValidationScreen   (mode: 'login')
└── MainTabNavigator
    ├── Inicio     → HomeScreen
    ├── Transferir → TransferStackNavigator
    │   ├── TransferMain          → TransferScreen
    │   ├── TransferReview        → TransferReviewScreen
    │   └── OtpValidationTransfer → OtpValidationScreen (mode: 'transfer')
    └── Movimientos → TransactionsScreen
```

## Comandos

```bash
npm run android       # Corre en Android
npm run ios           # Corre en iOS
npm run test          # Unit tests (Jest)
npm run test:e2e      # E2E tests (Maestro)
npm run lint          # ESLint
```

## Credenciales demo

| Campo | Valor |
|-------|-------|
| Email | `test@gmail.com` |
| Password | `123456` |
| OTP/PIN | `123456` (siempre válido en modo demo) |
| App ID | `com.bbapp` |

## testIDs de referencia

| testID | Pantalla / Componente |
|--------|-----------------------|
| `login-email-input` | LoginScreen — campo email |
| `login-password-input` | LoginScreen — campo contraseña |
| `login-submit` | LoginScreen — botón "Ingresar" |
| `login-error` | LoginScreen — mensaje de error |
| `otp-screen` | OtpValidationScreen — vista raíz |
| `otp-error` | OtpValidationScreen — mensaje de error |
| `transactions-screen` | TransactionsScreen — vista raíz |
| `logout-button` | TransactionsScreen — botón "Salir" |
| `transfer-main-screen` | TransferScreen — vista raíz |
| `transfer-amount-input` | TransferScreen — TextInput monto |
| `transfer-beneficiary-picker` | TransferScreen — card "Para" (segunda) |
| `transfer-concept-input` | TransferScreen — TextInput concepto |
| `transfer-continue-button` | TransferScreen — botón "Continuar" |
| `transfer-review-screen` | TransferReviewScreen — vista raíz |
| `beneficiary-select-modal` | BeneficiarySelectModal — Modal wrapper |
| `beneficiary-first-own-account` | BeneficiarySelectModal — primera cuenta propia |

## Labels de accesibilidad del teclado OTP

Los dígitos usan `accessibilityLabel`: `"Digito 1"` … `"Digito 9"`, `"Digito 0"`.
El borrado usa `accessibilityLabel`: `"Borrar"`.

## Flujos E2E (Maestro)

```
.maestro/
├── config.yaml
├── flows/
│   ├── auth/
│   │   ├── login-success.yaml               # Login completo hasta movimientos
│   │   ├── login-credentials-opens-otp.yaml # Credenciales válidas abren OTP
│   │   ├── login-invalid-credentials.yaml   # Error con credenciales inválidas
│   │   ├── login-otp-invalid.yaml           # PIN incorrecto muestra error
│   │   ├── logout.yaml                      # Cierre de sesión
│   │   └── session-persisted-relaunch.yaml  # Sesión persiste al relanzar
│   ├── transactions/
│   │   └── transactions-list-visible.yaml   # Lista y estados de transacciones
│   └── transfers/
│       ├── transfer-to-review-screen.yaml   # Formulario → pantalla de revisión
│       ├── transfer-validation-messages.yaml # Validaciones del formulario
│       └── transfer-complete-with-otp.yaml  # Transferencia completa con OTP
└── subflows/
    ├── ensure-authenticated.yaml            # Garantiza sesión activa (idempotente)
    ├── ensure-login-screen.yaml             # Garantiza pantalla de login
    ├── complete-demo-otp.yaml               # Ingresa PIN 123456 (flujo login)
    ├── complete-demo-otp-transfer.yaml      # Ingresa PIN 123456 (flujo transferencia)
    └── open-transfer-tab.yaml              # Navega a la pestaña Transferir
```

### Correr tests

```bash
npm run test:e2e
# O individualmente:
maestro test .maestro/flows/auth/login-success.yaml
maestro test .maestro/flows/transfers/transfer-complete-with-otp.yaml
```

## API

Base URL: `https://dev4.bayteq.com:50112/api/v1/`

## Reglas de validación

| Campo | Regla |
|-------|-------|
| Email | Requerido, formato válido, máx. 254 chars |
| Contraseña | 6–128 chars, sin caracteres de control |
| Monto de transferencia | > 0, ≤ saldo disponible, ≤ 999,999,999.99 |
| Concepto | Opcional, máx. 120 chars |

## Notas de implementación

- **Seguridad**: Las credenciales se cifran con clave pública del servidor antes de enviarse. La clave se obtiene en el `SplashScreen` y se cachea en `SecureStorage`.
- **Biometría**: Al hacer login exitoso, se guardan las credenciales cifradas para reutilizarlas con FaceID/Huella.
- **Modo demo**: El OTP `123456` siempre es aceptado. Los datos de transacciones vienen de `MockTransactionDataSource`.
- **DI**: Todos los use cases y repositorios se construyen en `src/di/container.ts`.
- **Temas**: Zustand maneja el modo claro/oscuro/sistema. El hook `useTheme()` provee colores y el hook `useThemeStore()` las acciones.
