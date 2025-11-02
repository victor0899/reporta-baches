# 🧪 Plan de Testing - Reporta Baches MVP

**Fecha de inicio:** 2025-01-11
**Versión:** MVP 1.0
**Plataforma de prueba:** iOS/Android (Expo Go)

---

## Estado General de Testing

| Test | Estado | Fecha | Notas |
|------|--------|-------|-------|
| Test 1: Autenticación | 🔄 En progreso | 2025-01-11 | Test 1.1 ✅ completado |
| Test 2: Crear Reportes | ⏳ Pendiente | - | - |
| Test 3: Detección Duplicados | ⏳ Pendiente | - | - |
| Test 4: Confirmar Reportes | ⏳ Pendiente | - | - |
| Test 5: Marcar Resueltos | ⏳ Pendiente | - | - |
| Test 6: ProfileScreen | ⏳ Pendiente | - | - |
| Test 7: Flujo End-to-End | ⏳ Pendiente | - | - |

**Leyenda:**
- ⏳ Pendiente
- 🔄 En progreso
- ✅ Completado
- ❌ Fallido
- ⚠️ Completado con issues

---

## Test 1: Autenticación y Registro
**Objetivo:** Validar el flujo de registro e inicio de sesión

### 1.1 Registro de nuevo usuario
**Pasos:**
1. Abrir la app
2. Click en "Registrarse"
3. Ingresar nombre: `Test User`
4. Ingresar email: `test@example.com`
5. Ingresar contraseña: `Test123456`
6. Click en "Registrarse"

**Criterios de éxito:**
- [x] El registro se completa sin errores
- [x] Se navega automáticamente al mapa principal
- [x] El usuario aparece autenticado

**Estado:** ✅ Completado (2025-01-11)
**Resultado:**
```
- Registro completado exitosamente
- Navegación al mapa funcionó correctamente
- Issue #1 (photoUrl undefined) fue encontrado y resuelto
- Tras el fix, el registro funciona sin errores
```

**Issues encontrados:**
- Issue #1: photoUrl undefined (✅ Resuelto)

---

### 1.2 Cerrar sesión y volver a entrar
**Pasos:**
1. Ir a la pestaña "Perfil"
2. Click en "Cerrar sesión"
3. Confirmar en el Alert
4. Click en "Iniciar sesión"
5. Ingresar email: `test@example.com`
6. Ingresar contraseña: `Test123456`

**Criterios de éxito:**
- [x] La sesión se cierra correctamente
- [x] Se vuelve a la pantalla de bienvenida
- [x] El login funciona con las credenciales correctas
- [x] Los datos del usuario persisten (nombre, email)

**Estado:** ✅ Completado (2025-01-11)
**Resultado:**
```
- Cerrar sesión funcionó correctamente
- Navegación a pantalla de bienvenida exitosa
- Login con credenciales guardadas funcionó
- Datos del usuario persistieron correctamente (nombre, email)
- Todo el flujo funcionó sin errores
```

**Issues encontrados:**
- Ninguno

---

### 1.3 Modo Invitado
**Pasos:**
1. Desde la pantalla de bienvenida
2. Click en "Continuar como invitado"

**Criterios de éxito:**
- [ ] Se navega al mapa principal
- [ ] El usuario puede ver reportes existentes
- [ ] En perfil muestra "Modo Invitado"

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## Test 2: Crear Reportes
**Objetivo:** Validar creación de reportes con foto y GPS

### 2.1 Crear reporte como usuario registrado
**Precondición:** Usuario registrado con sesión iniciada

**Pasos:**
1. En el mapa, click en "+ Nuevo Reporte"
2. Click en "📷 Tomar Foto" (o "🖼️ Galería")
3. Tomar/seleccionar foto
4. Seleccionar categoría: "Baches" 🕳️
5. Agregar descripción: "Bache grande en la esquina"
6. Agregar punto de referencia: "Frente a Super Selectos"
7. Click en "Crear Reporte"

**Criterios de éxito:**
- [ ] Los permisos de cámara se solicitan correctamente
- [ ] Los permisos de ubicación se solicitan correctamente
- [ ] La foto se captura y muestra preview
- [ ] Se puede seleccionar categoría (botón se marca en azul)
- [ ] La descripción y referencia se guardan
- [ ] Aparece Alert "¡Éxito! Tu reporte ha sido creado"
- [ ] El modal se cierra y vuelve al mapa
- [ ] Aparece un nuevo marcador en el mapa con emoji 🕳️
- [ ] Al hacer click en el marcador muestra los datos correctos:
  - Foto subida
  - Categoría: Baches
  - Descripción ingresada
  - Punto de referencia
  - Reportado por: [nombre del usuario]
  - Estado: Pendiente (badge naranja)
  - Confirmaciones: 0

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 2.2 Crear reporte como invitado
**Precondición:** Modo invitado activo

**Pasos:**
1. Cerrar sesión y entrar como invitado
2. Repetir pasos de Test 2.1

**Criterios de éxito:**
- [ ] El flujo funciona igual que con usuario registrado
- [ ] El reporte muestra "Reportado por: Usuario anónimo"
- [ ] El reporte aparece en el mapa

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## Test 3: Detección de Duplicados
**Objetivo:** Validar que detecte reportes cercanos (radio 20m)

### 3.1 Intentar crear reporte duplicado
**Precondición:** Al menos 1 reporte existente en el mapa

**Pasos:**
1. Click en "+ Nuevo Reporte"
2. Tomar foto
3. Seleccionar **la misma categoría** que un reporte existente cercano
4. Agregar descripción
5. Click "Crear Reporte"
6. **Importante:** Estar en la **misma ubicación** (dentro de 20m) del reporte existente

**Criterios de éxito:**
- [ ] Aparece Alert: "Reporte Similar Encontrado"
- [ ] El mensaje dice: "Ya existe un reporte de este tipo cerca de esta ubicación..."
- [ ] Muestra 3 botones:
  - "Ver Reporte"
  - "Crear Nuevo"
  - "Cancelar"
- [ ] Al presionar "Ver Reporte" → navega de vuelta al mapa (modal se cierra)
- [ ] Al presionar "Crear Nuevo" → crea el reporte de todas formas
- [ ] Al presionar "Cancelar" → vuelve al formulario

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 3.2 Crear reporte con categoría diferente en misma ubicación
**Pasos:**
1. Crear reporte en la misma ubicación
2. Pero con **categoría diferente** (ej: "Basura" 🗑️ en lugar de "Baches" 🕳️)

**Criterios de éxito:**
- [ ] NO debe aparecer alerta de duplicado
- [ ] El reporte se crea normalmente
- [ ] Ambos marcadores aparecen en el mapa (pueden estar superpuestos)

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## Test 4: Confirmar Reportes Existentes
**Objetivo:** Validar confirmaciones con/sin foto

### 4.1 Confirmar reporte sin foto
**Precondición:** Al menos 1 reporte en el mapa

**Pasos:**
1. Click en un marcador del mapa
2. Se abre el modal de detalles
3. Click en "Confirmar que sigue aquí"
4. Aparece Alert con opciones
5. Seleccionar "Sin Foto"

**Criterios de éxito:**
- [ ] Aparece Alert de confirmación exitosa
- [ ] El modal se cierra
- [ ] Al volver a abrir el reporte:
  - [ ] El contador de confirmaciones incrementó en 1
  - [ ] Aparece tu nombre en la lista "Usuarios que confirmaron"
  - [ ] Se muestra la fecha de confirmación

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 4.2 Confirmar reporte con foto
**Pasos:**
1. Click en otro marcador del mapa
2. Click en "Confirmar que sigue aquí"
3. Seleccionar "Agregar Foto"
4. Tomar una foto
5. Esperar confirmación

**Criterios de éxito:**
- [ ] Se solicita permiso de cámara
- [ ] La foto se captura correctamente
- [ ] Aparece loading mientras sube la foto
- [ ] Aparece Alert de éxito
- [ ] Al reabrir el reporte:
  - [ ] El contador incrementó
  - [ ] Tu nombre aparece en la lista
  - [ ] La foto aparece en la confirmación (thumbnail)

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 4.3 Intentar confirmar como invitado
**Precondición:** Modo invitado activo

**Pasos:**
1. En modo invitado, abrir un reporte
2. Intentar confirmar

**Criterios de éxito:**
- [ ] El botón "Confirmar que sigue aquí" está visible
- [ ] Se puede confirmar normalmente (invitados SÍ pueden confirmar)
- [ ] Aparece como "Usuario anónimo" en las confirmaciones

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## Test 5: Marcar Reportes como Resueltos
**Objetivo:** Validar resolución (solo usuarios registrados)

### 5.1 Intentar resolver como invitado (debe fallar)
**Precondición:** Modo invitado activo

**Pasos:**
1. Abrir un reporte en modo invitado
2. Revisar botones disponibles

**Criterios de éxito:**
- [ ] El botón "Confirmar que sigue aquí" SÍ aparece (verde/azul)
- [ ] El botón "Marcar como Resuelto" NO aparece
- [ ] Solo usuarios registrados ven el segundo botón

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 5.2 Marcar como resuelto (usuario registrado)
**Precondición:** Usuario registrado con sesión iniciada

**Pasos:**
1. Abrir un reporte pendiente
2. Verificar que aparezcan 2 botones:
   - "Confirmar que sigue aquí" (azul)
   - "Marcar como Resuelto" (verde)
3. Click en "Marcar como Resuelto"
4. Aparece Alert: "Debes tomar una foto que demuestre..."
5. Click en "Tomar Foto"
6. Tomar foto de evidencia
7. Esperar confirmación

**Criterios de éxito:**
- [ ] Se solicita permiso de cámara
- [ ] La foto se captura y sube
- [ ] Aparece loading indicator
- [ ] Aparece Alert: "¡Éxito! El reporte ha sido marcado como resuelto"
- [ ] El modal se cierra
- [ ] Al reabrir el reporte:
  - [ ] Estado cambia a "Resuelto" (badge verde)
  - [ ] Aparece banner verde grande: "✓ Problema Resuelto"
  - [ ] Muestra "Resuelto por: [tu nombre]"
  - [ ] Muestra "Fecha de resolución: [fecha]"
  - [ ] Muestra la foto de evidencia
  - [ ] Los botones de acción (Confirmar/Resolver) desaparecen
  - [ ] Ya NO se puede confirmar ni resolver de nuevo

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## Test 6: ProfileScreen - Historial de Reportes
**Objetivo:** Validar visualización de reportes creados/confirmados

### 6.1 Ver información de perfil
**Precondición:** Usuario registrado con sesión iniciada

**Pasos:**
1. Ir a la pestaña "Perfil" (tab inferior)

**Criterios de éxito:**
- [ ] Header azul con texto "Perfil"
- [ ] Muestra nombre del usuario
- [ ] Muestra email del usuario
- [ ] Si es cuenta verificada (municipalidad), muestra badge verde "✓ Cuenta Verificada"
- [ ] Muestra 2 contadores:
  - "Reportes creados: [número]"
  - "Reportes confirmados: [número]"
- [ ] Los números coinciden con la cantidad real de reportes
- [ ] Botón "Cerrar sesión" en rojo al fondo

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 6.2 Ver reportes creados
**Precondición:** Haber creado al menos 1 reporte

**Pasos:**
1. En el perfil, click en el contador "Reportes creados"
2. Esperar que cargue la lista

**Criterios de éxito:**
- [ ] La sección se expande
- [ ] Aparece título "Mis Reportes"
- [ ] Si hay reportes:
  - [ ] Muestra lista de cards con:
    - Foto thumbnail (100x100)
    - Emoji de categoría + nombre
    - Fecha de creación
    - Badge de estado (Pendiente/En proceso/Resuelto)
  - [ ] Los reportes están ordenados correctamente
  - [ ] Al hacer click en un card, abre el modal de detalles
- [ ] Si no hay reportes:
  - [ ] Muestra mensaje: "No has creado reportes aún"

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 6.3 Ver reportes confirmados
**Precondición:** Haber confirmado al menos 1 reporte

**Pasos:**
1. En el perfil, click en el contador "Reportes confirmados"
2. Esperar que cargue la lista

**Criterios de éxito:**
- [ ] La sección se expande
- [ ] Aparece título "Reportes Confirmados"
- [ ] Muestra lista de reportes que el usuario confirmó
- [ ] El formato de cards es igual a "Reportes creados"
- [ ] Al click abre modal de detalles
- [ ] Si no hay confirmaciones: mensaje "No has confirmado reportes aún"

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 6.4 Navegación desde perfil a detalles
**Pasos:**
1. Click en cualquier reporte de "Mis Reportes"
2. Verificar modal

**Criterios de éxito:**
- [ ] Se abre el mismo modal que desde el mapa
- [ ] Muestra todos los detalles completos
- [ ] Los botones de acción funcionan normalmente
- [ ] Al cerrar el modal, vuelve al perfil (no al mapa)

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

### 6.5 Perfil en modo invitado
**Precondición:** Modo invitado activo

**Pasos:**
1. Ir a la pestaña "Perfil" como invitado

**Criterios de éxito:**
- [ ] Muestra texto: "Modo Invitado"
- [ ] Muestra subtexto: "Crea una cuenta para guardar tus reportes"
- [ ] NO muestra estadísticas ni listas de reportes
- [ ] Muestra botón "Volver a inicio" (en lugar de "Cerrar sesión")

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## Test 7: Flujo Completo End-to-End
**Objetivo:** Validar todo el ciclo de vida de un reporte

### 7.1 Setup: Crear 3 usuarios
**Pasos:**
1. Usuario A: Registrar cuenta `usuarioa@test.com` / password: `Test123456`
2. Usuario B: Modo invitado
3. Usuario C: Registrar cuenta `usuarioc@test.com` / password: `Test123456`

**Estado:** ⏳ Pendiente

---

### 7.2 Usuario A crea reporte
**Pasos:**
1. Login como Usuario A
2. Crear reporte de "Baches" con foto
3. Descripción: "Bache end-to-end test"
4. Verificar que aparezca en el mapa

**Criterios de éxito:**
- [ ] Reporte creado exitosamente
- [ ] Visible en el mapa
- [ ] Estado: Pendiente
- [ ] Confirmaciones: 0
- [ ] Creado por: Usuario A

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

---

### 7.3 Usuario B (invitado) confirma el reporte
**Pasos:**
1. Cerrar sesión de Usuario A
2. Entrar como invitado
3. Buscar el reporte de Usuario A en el mapa
4. Confirmar con foto

**Criterios de éxito:**
- [ ] La confirmación se registra
- [ ] Contador sube a 1
- [ ] Aparece "Usuario anónimo" en confirmaciones
- [ ] La foto se muestra

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

---

### 7.4 Usuario C marca como resuelto
**Pasos:**
1. Salir de modo invitado
2. Login como Usuario C
3. Buscar el reporte en el mapa
4. Marcar como resuelto con foto de evidencia

**Criterios de éxito:**
- [ ] El reporte cambia a estado "Resuelto"
- [ ] Banner verde aparece
- [ ] Muestra "Resuelto por: Usuario C"
- [ ] Muestra fecha de resolución
- [ ] Muestra foto de evidencia
- [ ] Los botones de acción desaparecen

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

---

### 7.5 Usuario A verifica el reporte resuelto
**Pasos:**
1. Cerrar sesión de Usuario C
2. Login como Usuario A (creador original)
3. Ir a Perfil → Reportes creados
4. Click en el reporte creado en 7.2

**Criterios de éxito:**
- [ ] El reporte aparece con estado "Resuelto" (badge verde)
- [ ] Se ve 1 confirmación de "Usuario anónimo" (Usuario B)
- [ ] Se ve la evidencia de resolución de Usuario C
- [ ] Se ve el banner verde "✓ Problema Resuelto"
- [ ] Toda la información es consistente

**Estado:** ⏳ Pendiente
**Resultado:**
```
[Aquí se agregarán los resultados]
```

**Issues encontrados:**
- Ninguno

---

## 📋 Checklist de Validación General

### Permisos
- [ ] Permiso de cámara se solicita al tomar foto
- [ ] Permiso de ubicación se solicita al abrir el mapa
- [ ] Los permisos denegados muestran alertas apropiadas
- [ ] Los permisos se recuerdan entre sesiones

### Performance
- [ ] Las imágenes se cargan sin delay excesivo (<3s)
- [ ] El mapa es fluido al hacer zoom/pan
- [ ] Los reportes aparecen en tiempo real sin refresh manual
- [ ] Los contadores se actualizan automáticamente
- [ ] No hay crashes al navegar entre pantallas
- [ ] La app no se congela durante operaciones largas

### UI/UX
- [ ] El botón de recentrar funciona correctamente
- [ ] Los marcadores tienen el emoji correcto de cada categoría
- [ ] Los badges de estado tienen los colores correctos:
  - Pendiente: Naranja (#FFA500)
  - En proceso: Azul (#007AFF)
  - Resuelto: Verde (#34C759)
- [ ] Los timestamps muestran fechas en español (es-SV)
- [ ] Los loading indicators aparecen durante operaciones async
- [ ] Los Alerts tienen mensajes claros en español
- [ ] La navegación es intuitiva
- [ ] Los botones son fáciles de presionar (no muy pequeños)

### Data Integrity
- [ ] Los reportes no se duplican accidentalmente
- [ ] Las fotos no se pierden al subir
- [ ] Los datos del usuario persisten al cerrar/abrir app
- [ ] Los reportes de invitados se guardan correctamente
- [ ] Las confirmaciones no se pueden hacer múltiples veces por el mismo usuario
- [ ] Un reporte resuelto no se puede marcar como resuelto de nuevo

---

## 🐛 Issues Encontrados

### Issue #1 - photoUrl undefined en registro
**Severidad:** 🟡 Media (no bloquea el registro, pero muestra error)
**Test relacionado:** Test 1.1 - Registro de nuevo usuario
**Descripción:** Al registrarse con email/password, Firestore arroja error porque el campo `photoUrl` tiene valor `undefined`
**Pasos para reproducir:**
1. Registrarse con email/password
2. El usuario se crea correctamente en Firebase Auth
3. Al intentar guardar el documento en Firestore muestra error

**Comportamiento esperado:** El registro se completa sin errores
**Comportamiento actual:** Muestra Alert de error: `Unsupported field value: undefined (found in field photoUrl in document users/...)`
**Screenshot/logs:**
```
Error: Function setDoc() called with invalid data.
Unsupported field value: undefined
(found in field photoUrl in document users/NL0CWPAi8pgYZd7jnQ451MP6Qj63)
```
**Causa raíz:** El código asignaba `photoUrl: userCredential.user.photoURL || undefined`, pero Firestore no permite valores `undefined`
**Solución implementada:** Solo incluir el campo `photoUrl` si existe (no incluir el campo si es null/undefined)
**Estado:** ✅ Resuelto (commit: cb20201)

---

### Issue #2 (Template)
**Severidad:** 🔴 Alta / 🟡 Media / 🟢 Baja
**Test relacionado:**
**Descripción:**
**Pasos para reproducir:**
**Comportamiento esperado:**
**Comportamiento actual:**
**Screenshot/logs:**
**Estado:** ⏳ Abierto / 🔄 En progreso / ✅ Resuelto

---

## 📊 Resumen Final de Testing

**Fecha de completado:** [Pendiente]

### Estadísticas
- Tests totales: 7 grupos principales
- Tests pasados: 0
- Tests fallidos: 0
- Tests en progreso: 1 (Test 1.1)
- Tests pendientes: 6
- Issues críticos: 0
- Issues resueltos: 1
- Issues pendientes: 0

### Recomendaciones
```
[Se agregarán después del testing]
```

### Listo para producción?
- [ ] Sí, todos los tests críticos pasaron
- [ ] No, hay issues que resolver

### Próximos pasos
```
[Se agregarán después del testing]
```
