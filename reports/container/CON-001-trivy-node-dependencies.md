# CON-001 — Vulnerabilidades en dependencias de la imagen Docker

## 1. Identificación

- **ID:** CON-001
- **Tipo:** Container Scanning
- **Herramienta:** Trivy
- **Severidad máxima:** High
- **Vulnerabilidades detectadas:** 7
- **Críticas:** 0
- **Estado:** Abierto
- **Fecha de detección:** 2026-10-05

## 2. Ubicación

- **Imagen analizada:** `secure-cicd-app:${{ github.sha }}`
- **Dockerfile:** `app/Dockerfile`
- **Tipo de vulnerabilidad:** Dependencias Node.js incluidas en la imagen
- **Scanner:** Trivy
- **Área analizada:** `Node.js (node-pkg)`

## 3. Descripción

Trivy ha analizado la imagen Docker generada por el proyecto y ha detectado siete vulnerabilidades de severidad `HIGH` en dependencias Node.js incluidas en la imagen.

Todas las vulnerabilidades detectadas disponen de una versión corregida indicada por Trivy.

Las vulnerabilidades afectan a las siguientes dependencias:

```text
brace-expansion
ip-address
tar
undici
```

## 4. Resultado del análisis

El análisis de Trivy produjo:

```text
Node.js (node-pkg)

Total: 7 (HIGH: 7, CRITICAL: 0)
```

Detalle de los hallazgos:

| Dependencia | CVE | Severidad | Versión instalada | Versión corregida |
|---|---|---|---|---|
| brace-expansion | CVE-2026-102276 | HIGH | 5.0.7 | 5.0.10 / otras ramas corregidas |
| brace-expansion | CVE-2026-102278 | HIGH | 5.0.7 | 5.0.11 / otras ramas corregidas |
| brace-expansion | CVE-2026-14257 | HIGH | 5.0.7 | 5.0.8 / otras ramas corregidas |
| brace-expansion | CVE-2026-69152 | HIGH | 5.0.7 | 5.0.9 / otras ramas corregidas |
| ip-address | CVE-2026-69192 | HIGH | 10.2.0 | 10.3.1 |
| tar | CVE-2026-73566 | HIGH | 7.5.19 | 7.5.21 |
| undici | CVE-2026-19534 | HIGH | 6.27.0 | 6.28.1 / 7.29.1 / 8.10.2 |

Resultado de la política del pipeline:

```text
HIGH: 7
CRITICAL: 0
exit-code: 1
Pipeline: BLOQUEADO
```

## 5. Impacto

Las vulnerabilidades detectadas pueden afectar a la disponibilidad, integridad o seguridad de la aplicación dependiendo de cómo sean utilizadas las dependencias afectadas.

Entre los problemas identificados aparecen diferentes escenarios de Denial of Service, agotamiento de memoria, parsing inseguro de direcciones IP con posible SSRF y otros comportamientos inseguros asociados a las dependencias.

El impacto exacto debe valorarse según el uso concreto de cada paquete dentro de la aplicación.

## 6. Causa

La causa del hallazgo es la presencia de versiones vulnerables de dependencias Node.js dentro de la imagen Docker generada durante el build.

La imagen utiliza:

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev
```

Como consecuencia, las dependencias de producción definidas por el proyecto quedan incorporadas a la imagen y son analizadas por Trivy.

## 7. Evidencia

La evidencia corresponde a la ejecución de **Container Scanning - Trivy** en GitHub Actions.

Captura asociada:

```text
evidence/screenshots/09-trivy-vulnerable.png
```

La evidencia muestra:

```text
Node.js (node-pkg)
Total: 7 (HIGH: 7, CRITICAL: 0)
```

y el detalle de las siete vulnerabilidades detectadas.

## 8. Acción correctiva

La acción correctiva consistirá en actualizar las dependencias vulnerables a versiones corregidas y regenerar el `package-lock.json`.

Posteriormente se reconstruirá la imagen Docker y se ejecutará nuevamente Trivy.

La corrección deberá comprobar además que los tests de la aplicación siguen pasando correctamente.

## 9. Verificación posterior

Pendiente de realizar.

Después de actualizar las dependencias se deberá:

```text
npm test
docker build
Trivy scan
```

El resultado esperado será:

```text
HIGH: 0
CRITICAL: 0
exit-code: 0
```

La evidencia del re-test se añadirá posteriormente como:

```text
evidence/screenshots/10-trivy-clean.png
```

## 10. Estado

**Abierto — dependencias vulnerables pendientes de actualización y re-test.**
