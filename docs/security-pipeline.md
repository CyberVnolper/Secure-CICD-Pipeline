# Security Pipeline

## 1. Objetivo

El pipeline automatiza pruebas funcionales y controles de seguridad sobre la aplicación antes de considerar una modificación como válida dentro del repositorio.

El workflow principal es:

```text
.github/workflows/security-pipeline.yml
```

## 2. Eventos

El workflow se ejecuta mediante:

```yaml
push:
  branches:
    - main
    - master

pull_request:
  branches:
    - main
    - master

workflow_dispatch:
```

Esto permite ejecutar los controles automáticamente ante cambios en el código y también manualmente.

## 3. Flujo

```text
Tests
  ↓
SAST
  ↓
SCA
  ↓
Secret Scanning
  ↓
Docker Build
  ↓
Container Scanning
  ↓
DAST
  ↓
Resultado final
```

## 4. Application Tests

El primer job ejecuta los tests de Node.js:

```text
npm ci
npm test
```

El proyecto dispone actualmente de seis pruebas:

```text
Tests: 6
Passed: 6
Failed: 0
```

El objetivo es evitar que modificaciones incorrectas continúen hacia los controles posteriores.

## 5. SAST — Semgrep

Semgrep analiza:

```text
app/src
```

utilizando las reglas personalizadas de:

```text
security/semgrep/semgrep.yml
```

La ejecución utiliza:

```text
--error
```

por lo que un finding bloqueante provoca un código de salida diferente de cero.

Durante el proyecto se detectó:

```text
security.semgrep.javascript-dangerous-eval
```

Una vez corregido el código, el re-test terminó con:

```text
Findings: 0
exit code: 0
```

## 6. SCA — npm audit

El job SCA instala las dependencias mediante:

```text
npm ci
```

y ejecuta:

```text
npm audit --audit-level=high
```

Durante la validación del control se introdujo de forma controlada una versión vulnerable de `lodash`.

El análisis detectó:

```text
1 high severity vulnerability
```

Después de actualizar la dependencia, el re-test terminó con:

```text
found 0 vulnerabilities
```

## 7. Secret Scanning — Gitleaks

Gitleaks analiza el repositorio completo utilizando:

```text
fetch-depth: 0
```

para disponer del historial necesario para el análisis.

La acción utilizada es:

```text
gitleaks/gitleaks-action@v3
```

Durante la validación se introdujo un secreto sintético de laboratorio.

Gitleaks lo detectó y bloqueó el pipeline.

Tras eliminar el archivo de prueba, el re-test fue limpio.

## 8. Container Scanning — Trivy

El job construye la imagen:

```text
secure-cicd-app:${{ github.sha }}
```

y posteriormente la analiza mediante Trivy.

La política del pipeline analiza:

```text
vuln-type:
  os,library

severity:
  HIGH,CRITICAL

ignore-unfixed:
  true

exit-code:
  1
```

El `exit-code: 1` convierte las vulnerabilidades detectadas dentro del nivel configurado en un bloqueo del job.

Durante la validación inicial se encontraron:

```text
HIGH: 7
CRITICAL: 0
```

Las vulnerabilidades estaban relacionadas con componentes Node.js incluidos en la imagen.

Tras modificar la imagen de runtime, Trivy quedó limpio.

## 9. DAST — OWASP ZAP

El job DAST realiza:

```text
Docker Build
      ↓
Start Application
      ↓
Health Check
      ↓
OWASP ZAP Baseline
```

La aplicación se publica en:

```text
http://127.0.0.1:3000
```

La configuración personalizada se encuentra en:

```text
security/zap/zap-config.md
```

La regla:

```text
10021
```

se configura como:

```text
FAIL
```

para convertir la ausencia de `X-Content-Type-Options` en un release blocker.

Durante la validación inicial ZAP detectó:

```text
WARN-NEW: 6
PASS: 61
```

La alerta seleccionada para la prueba de bloqueo fue:

```text
X-Content-Type-Options Header Missing [10021]
```

Después de convertirla a `FAIL`, ZAP produjo:

```text
FAIL-NEW: 1
```

Tras añadir la cabecera:

```text
X-Content-Type-Options: nosniff
```

el re-test fue limpio.

## 10. Política de bloqueo

Los controles están diseñados para impedir que un finding configurado como bloqueante continúe por el pipeline.

Ejemplos:

```text
Semgrep
Finding blocking
    ↓
Pipeline FAIL

npm audit
High vulnerability
    ↓
Pipeline FAIL

Gitleaks
Secret detected
    ↓
Pipeline FAIL

Trivy
HIGH / CRITICAL
    ↓
Pipeline FAIL

OWASP ZAP
FAIL rule matched
    ↓
Pipeline FAIL
```

## 11. Evidencias

Las evidencias visuales se encuentran en:

```text
evidence/screenshots/
```

Los informes de findings se encuentran en:

```text
reports/
```

Cada finding documenta tanto el resultado inicial como su posterior re-test.

## 12. Resultado final

Los cinco controles de seguridad han sido integrados y probados:

```text
✅ SAST — Semgrep
✅ SCA — npm audit
✅ Secret Scanning — Gitleaks
✅ Container Scanning — Trivy
✅ DAST — OWASP ZAP
```

El pipeline permite detectar, bloquear, corregir y volver a verificar problemas de seguridad dentro del mismo flujo CI/CD.
