# Secure-CICD-Pipeline

Pipeline CI/CD orientado a seguridad para una aplicación Node.js, integrando análisis automatizado de código, dependencias, secretos, imágenes Docker y seguridad dinámica.

El objetivo del proyecto es demostrar cómo integrar controles de seguridad dentro del ciclo de desarrollo para detectar vulnerabilidades automáticamente, bloquear el pipeline cuando corresponde y verificar posteriormente su corrección.

## Objetivos

- Integrar seguridad en un pipeline CI/CD.
- Automatizar la detección de vulnerabilidades.
- Aplicar controles de seguridad sobre código, dependencias, secretos, contenedores y aplicación en ejecución.
- Utilizar GitHub Actions como plataforma de automatización.
- Documentar findings, evidencias, correcciones y re-tests.
- Aplicar un ciclo completo de gestión de vulnerabilidades.

## Tecnologías

### Aplicación

- Node.js
- Express
- JavaScript
- npm
- Docker

### Seguridad

- Semgrep — SAST
- npm audit — SCA
- Gitleaks — Secret Scanning
- Trivy — Container Scanning
- OWASP ZAP — DAST

### CI/CD

- GitHub Actions
- Git
- GitHub

## Arquitectura del proyecto

```text
Secure-CICD-Pipeline/
│
├── README.md
│
├── app/
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── src/
│   │   └── server.js
│   └── tests/
│       └── server.test.js
│
├── .github/
│   └── workflows/
│       └── security-pipeline.yml
│
├── security/
│   ├── semgrep/
│   │   └── semgrep.yml
│   ├── zap/
│   │   └── zap-config.md
|   |   └── rules.tsv
│   └── gitleaks/
│       └── README.md
│
├── reports/
│   ├── sast/
│   ├── sca/
│   ├── secrets/
│   ├── container/
│   └── dast/
│
├── docs/
│   ├── architecture.md
│   ├── security-pipeline.md
│   └── vulnerability-management.md
│
└── evidence/
    └── screenshots/
```

## Pipeline de seguridad

Cada push o Pull Request contra `main` ejecuta el pipeline:

```text
Git Push / Pull Request
          ↓
Application Tests
          ↓
SAST — Semgrep
          ↓
SCA — npm audit
          ↓
Secret Scanning — Gitleaks
          ↓
Docker Build
          ↓
Container Scanning — Trivy
          ↓
DAST — OWASP ZAP
          ↓
Security Result
```

Los controles están integrados en `.github/workflows/security-pipeline.yml`.

## Controles implementados

| Control | Herramienta | Objetivo | Estado |
|---|---|---|---|
| SAST | Semgrep | Analizar código fuente | ✅ |
| SCA | npm audit | Analizar dependencias | ✅ |
| Secret Scanning | Gitleaks | Detectar secretos expuestos | ✅ |
| Container Scanning | Trivy | Analizar imagen Docker | ✅ |
| DAST | OWASP ZAP | Analizar la aplicación en ejecución | ✅ |

## Findings investigados

Durante el desarrollo se realizaron pruebas controladas para demostrar el funcionamiento de los controles.

### SEM-001 — Dangerous `eval()`

Semgrep detectó el uso de `eval()` en `app/src/server.js`.

```text
Rule:
security.semgrep.javascript-dangerous-eval

Location:
app/src/server.js:111
```

El pipeline fue bloqueado, el hallazgo se documentó y posteriormente se eliminó la ejecución dinámica de código.




[Informe:](reports/sast/SEM-001-dangerous-eval.md)


### SCA-001 — Lodash

Se introdujo de forma controlada `lodash@4.17.20` para validar el control SCA.

Resultado inicial:

```text
1 high severity vulnerability
```

La dependencia fue actualizada y el re-test terminó con:

```text
found 0 vulnerabilities
```

Informe:


[](reports/sca/SCA-001-lodash.md)


### SEC-001 — Secret Scanning

Se introdujo un token sintético de laboratorio para comprobar la detección mediante Gitleaks.

Gitleaks detectó el valor y bloqueó el pipeline.

Posteriormente el archivo de prueba fue eliminado y se realizó un re-test limpio.

Informe:


[](reports/secrets/SEC-001-gitleaks-secret.md)


### CON-001 — Container Scanning

Trivy detectó inicialmente:

```text
7 HIGH
0 CRITICAL
```

en dependencias Node.js incluidas en la imagen.

Se modificó la imagen de runtime para reducir la superficie de ataque y eliminar los componentes vulnerables detectados.

El re-test terminó sin vulnerabilidades bloqueantes.

Informe:


[](reports/container/CON-001-trivy-node-dependencies.md)


### DAST-001 — X-Content-Type-Options

OWASP ZAP detectó la ausencia de:

```text
X-Content-Type-Options: nosniff
```

La regla `10021` fue configurada como `FAIL`, provocando el bloqueo del pipeline.

Se añadió la cabecera de seguridad a la aplicación y posteriormente ZAP quedó limpio.

Informe:


[](reports/dast/DAST-001-zap-missing-x-content-type-options.md)


## Gestión de vulnerabilidades

Todos los findings se trataron siguiendo el mismo ciclo:

```text
Detectar
   ↓
Investigar
   ↓
Documentar
   ↓
Corregir
   ↓
Re-test
   ↓
Verificar
   ↓
Cerrar
```

La metodología completa está documentada en:

```text
docs/vulnerability-management.md
```

## Evidencias

Las capturas de los análisis y re-tests se almacenan en:

```text
evidence/screenshots/
```

Las evidencias permiten demostrar tanto los hallazgos iniciales como el resultado posterior a las correcciones.

## Documentación

- `docs/architecture.md` — arquitectura técnica del proyecto.
- `docs/security-pipeline.md` — funcionamiento del pipeline y controles.
- `docs/vulnerability-management.md` — proceso de gestión de vulnerabilidades.

## Resultado

El proyecto demuestra la integración de controles de seguridad automatizados en un flujo CI/CD, incluyendo:

```text
Code Security
Dependency Security
Secret Security
Container Security
Application Security
```

El pipeline puede bloquear una modificación cuando un control de seguridad configurado como bloqueante detecta un problema y permite verificar posteriormente la corrección mediante un nuevo análisis.
