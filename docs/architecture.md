# Arquitectura — Secure-CICD-Pipeline

## 1. Objetivo

Este documento describe la arquitectura técnica del proyecto `Secure-CICD-Pipeline` y la relación entre la aplicación, el contenedor Docker y los controles de seguridad integrados en GitHub Actions.

## 2. Componentes

### Aplicación

La aplicación está desarrollada con Node.js y Express.

Se encuentra en:

```text
app/
```

Componentes principales:

```text
app/
├── package.json
├── package-lock.json
├── Dockerfile
├── src/
│   └── server.js
└── tests/
    └── server.test.js
```

### GitHub Actions

El pipeline se encuentra en:

```text
.github/workflows/security-pipeline.yml
```

GitHub Actions ejecuta automáticamente los controles definidos cuando se produce un `push` o un Pull Request dirigido a `main` o `master`.

### Seguridad

Las configuraciones específicas de las herramientas se encuentran en:

```text
security/
├── semgrep/
├── zap/
└── gitleaks/
```

## 3. Flujo de ejecución

La arquitectura lógica del pipeline es:

```text
                    GitHub Repository
                           │
                 Push / Pull Request
                           │
                           ▼
                ┌─────────────────────┐
                │    GitHub Actions   │
                └──────────┬──────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
           Tests        Semgrep       npm audit
             │            SAST             SCA
             │             │               │
             └─────────────┼───────────────┘
                           │
                           ▼
                       Gitleaks
                    Secret Scanning
                           │
                           ▼
                     Docker Build
                           │
                           ▼
                        Trivy
                  Container Scanning
                           │
                           ▼
                     Start Container
                           │
                           ▼
                      OWASP ZAP
                          DAST
                           │
                           ▼
                  Pipeline Result
```

## 4. Aplicación y contenedor

El Dockerfile utiliza una imagen de Node.js basada en Alpine.

La imagen se construye mediante:

```text
docker build -t secure-cicd-app:${{ github.sha }} ./app
```

La aplicación se ejecuta dentro del contenedor mediante:

```text
node src/server.js
```

El puerto utilizado por la aplicación es:

```text
3000
```

## 5. Container Scanning

Después del build, Trivy analiza la imagen generada:

```text
secure-cicd-app:${{ github.sha }}
```

Se analizan:

```text
OS vulnerabilities
Library vulnerabilities
```

El pipeline está configurado para bloquearse ante vulnerabilidades:

```text
HIGH
CRITICAL
```

## 6. DAST

Para el análisis dinámico, la imagen Docker se ejecuta temporalmente:

```text
Docker Container
      ↓
127.0.0.1:3000
      ↓
OWASP ZAP
```

ZAP analiza la aplicación en ejecución mediante un baseline scan.

Se utiliza una configuración personalizada:

```text
security/zap/zap-config.md
```

La regla `10021` se configura como bloqueante:

```text
10021    FAIL    X-Content-Type-Options Header Missing
```

Mientras que otras alertas del baseline que no forman parte de los release blockers definidos en este laboratorio se configuran como `IGNORE`.

## 7. Seguridad por capas

El proyecto aplica defensa en profundidad:

```text
Código
  ↓
Semgrep

Dependencias
  ↓
npm audit

Secretos
  ↓
Gitleaks

Imagen
  ↓
Trivy

Aplicación en ejecución
  ↓
OWASP ZAP
```

Cada capa analiza una parte diferente del ciclo de desarrollo.

## 8. Evidencias

Las evidencias visuales del funcionamiento de la arquitectura se almacenan en:

```text
evidence/screenshots/
```

Los informes individuales se encuentran en:

```text
reports/
├── sast/
├── sca/
├── secrets/
├── container/
└── dast/
```

## 9. Resultado

La arquitectura permite integrar seguridad desde el análisis del código hasta el análisis dinámico de la aplicación.

El objetivo no es utilizar una única herramienta, sino combinar varios controles independientes para reducir el riesgo en diferentes etapas del ciclo de desarrollo.
