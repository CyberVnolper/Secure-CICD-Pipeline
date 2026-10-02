# SCA-001 — Dependencia vulnerable: lodash

## 1. Identificación

- **ID:** SCA-001
- **Tipo:** SCA (Software Composition Analysis)
- **Herramienta:** npm audit
- **Paquete afectado:** lodash
- **Versión instalada:** 4.17.20
- **Severidad máxima:** High
- **Estado:** Abierto
- **Fecha de detección:** 2026-10-02

## 2. Ubicación

- **Dependencia:** `lodash`
- **Versión instalada:** `4.17.20`
- **Ubicación en el proyecto:** `app/node_modules/lodash`
- **Archivo de configuración:** `app/package.json`
- **Lockfile:** `app/package-lock.json`

## 3. Descripción

El análisis de dependencias mediante `npm audit` ha detectado una vulnerabilidad de severidad alta en la versión instalada de `lodash`.

El resultado indica que las versiones de `lodash` hasta `4.17.23` presentan vulnerabilidades conocidas. El análisis identifica varias advisories relacionadas con problemas de inyección de código, Regular Expression Denial of Service (ReDoS) y prototype pollution.

La dependencia vulnerable fue introducida de forma controlada en el laboratorio para comprobar el funcionamiento del control SCA.

## 4. Resultado del análisis

Comando ejecutado:

```text
npm audit
```

Resultado obtenido:

```text
# npm audit report

lodash  <=4.17.23
Severity: high

Command Injection in lodash
Regular Expression Denial of Service (ReDoS) in lodash
lodash vulnerable to Code Injection via `_.template` imports key names
lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit`
Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit`

1 high severity vulnerability

To address all issues, run:
  npm audit fix --force
```

El análisis también indica que existe una actualización disponible para solucionar el problema.

## 5. Impacto

El impacto depende de las funciones de `lodash` utilizadas por la aplicación y de si datos controlados externamente pueden llegar a dichas funciones vulnerables.

Las vulnerabilidades identificadas pueden estar relacionadas con ejecución de código, ReDoS o prototype pollution, por lo que mantener una versión afectada de la dependencia introduce un riesgo de seguridad en la cadena de software.

## 6. Causa

La causa del hallazgo es la utilización de una versión vulnerable de la dependencia `lodash`:

```text
lodash@4.17.20
```

La versión instalada pertenece al rango de versiones afectadas indicado por `npm audit`.

## 7. Evidencia

La evidencia del hallazgo corresponde a la ejecución de `npm audit` realizada durante la fase SCA.

Captura asociada:


![Evidencia de sca](../../evidence/screenshots/05-npm-audit-vulnerable.png)


La captura debe mostrar el paquete afectado, la severidad `high` y el resultado de `1 high severity vulnerability`.

## 8. Acción correctiva

La acción correctiva consistirá en actualizar `lodash` a una versión no afectada por las vulnerabilidades detectadas.

La actualización deberá comprobarse posteriormente mediante:

```text
npm test
npm audit
```

Además, se volverá a ejecutar el pipeline de GitHub Actions para verificar el resultado del control SCA dentro de CI/CD.

## 9. Verificación posterior

La dependencia vulnerable `lodash@4.17.20` fue actualizada a `lodash@4.18.1`.

Tras la actualización se ejecutaron los tests de la aplicación:

```text
Tests: 6
Passed: 6
Failed: 0
```

Posteriormente se ejecutó de nuevo el análisis de dependencias:

```text
npm audit
```

Resultado:

```text
found 0 vulnerabilities
```

La vulnerabilidad detectada inicialmente ya no aparece en el análisis.

### Evidencias del re-test


![](../../evidence/screenshots/06-npm-audit-clean.png)

## 10. Estado

**Cerrado — dependencia actualizada y vulnerabilidad verificada como solucionada mediante re-test.**

