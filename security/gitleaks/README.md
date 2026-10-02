# Gitleaks — Secret Scanning

## 1. Objetivo

Gitleaks se utiliza para detectar secretos expuestos en el código y en el repositorio, como:

- API keys
- tokens
- contraseñas
- credenciales
- otros secretos codificados

El objetivo es impedir que información sensible llegue al repositorio mediante el pipeline CI/CD.

## 2. Integración en CI/CD

Gitleaks se ejecuta automáticamente mediante GitHub Actions.

El control está integrado en:

```text
.github/workflows/security-pipeline.yml
```

La ejecución utiliza la GitHub Action oficial:

```text
gitleaks/gitleaks-action@v3
```

La versión v3 utiliza el runtime Node 24. Para repositorios pertenecientes a cuentas personales no es necesaria una licencia de Gitleaks.

## 3. Funcionamiento

El flujo de análisis es:

```text
Git Push
   ↓
GitHub Actions
   ↓
Checkout del repositorio
   ↓
Gitleaks
   ↓
Detección de secretos
   ↓
Pipeline bloqueado o aprobado
```

Cuando Gitleaks detecta un secreto, el job falla para impedir que el código continúe por el pipeline.

## 4. Evidencias

Las evidencias del análisis se almacenan en:

```text
evidence/screenshots/
```

### Finding controlado

```text
evidence/screenshots/07-gitleaks-secret-detected.png
```

### Re-test limpio

```text
evidence/screenshots/08-gitleaks-clean.png
```

## 5. Gestión de vulnerabilidades

El proceso utilizado en el laboratorio es:

```text
Detectar
   ↓
Capturar evidencia
   ↓
Documentar
   ↓
Eliminar el secreto
   ↓
Re-test
   ↓
Verificar resultado limpio
```

## 6. Resultado esperado

Cuando no existen secretos detectables:

```text
✅ Gitleaks scan completed
✅ No leaks found
✅ Exit code 0
```

Cuando se detecta un secreto:

```text
❌ Secret detected
❌ Pipeline blocked
❌ Exit code != 0
```
