# Configuración de Firebase

## Paso 1: Crear el proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombre del proyecto: `reporta-baches` (o el nombre que prefieras)
4. Desactiva Google Analytics (no es necesario para el MVP)
5. Haz clic en "Crear proyecto"

## Paso 2: Registrar la app

1. En la página principal del proyecto, haz clic en el ícono de **Web** (</>)
2. Nombre de la app: `Reporta Baches`
3. NO marques "Firebase Hosting"
4. Haz clic en "Registrar app"
5. Copia la configuración que aparece (la necesitarás en el siguiente paso)

## Paso 3: Configurar variables de entorno

1. Crea un archivo `.env` en la raíz del proyecto (ya está en .gitignore)
2. Copia el contenido de `.env.example`
3. Reemplaza los valores con los de tu proyecto Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIza...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=reporta-baches.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=reporta-baches
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=reporta-baches.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## Paso 4: Habilitar Authentication

1. En Firebase Console, ve a **Build > Authentication**
2. Haz clic en "Get started"
3. Habilita los siguientes métodos de inicio de sesión:
   - **Email/Password**: Habilítalo
   - **Google**: Habilítalo (requiere configurar OAuth)
   - **Apple**: Habilítalo (solo para producción en iOS)

### Para Google Sign-In:
- Necesitarás configurar las credenciales OAuth en Google Cloud Console
- Sigue las instrucciones que aparecen en Firebase

### Para Apple Sign-In:
- Se configurará más adelante cuando publiques en App Store
- Requiere Apple Developer Account

## Paso 5: Crear Firestore Database

1. En Firebase Console, ve a **Build > Firestore Database**
2. Haz clic en "Create database"
3. Selecciona **"Start in test mode"** (cambiaremos las reglas después)
4. Selecciona ubicación: **us-central1** (o la más cercana)
5. Haz clic en "Enable"

### Configurar índices (opcional, por ahora):
Los índices se pueden agregar más adelante cuando Firebase los solicite durante el desarrollo.

## Paso 6: Configurar Storage

1. En Firebase Console, ve a **Build > Storage**
2. Haz clic en "Get started"
3. Selecciona **"Start in test mode"**
4. Usa la misma ubicación que Firestore
5. Haz clic en "Done"

## Paso 7: Reglas de seguridad (Producción)

### Firestore Rules (actualizar antes de producción):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reports collection
    match /reports/{reportId} {
      // Anyone can read reports
      allow read: if true;

      // Authenticated users can create reports
      allow create: if request.auth != null || request.resource.data.createdBy.isAnonymous == true;

      // Only creator or verified users can update
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.createdBy.userId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isVerified == true);
    }

    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;

      // Users can create their own document
      allow create: if request.auth != null && request.auth.uid == userId;

      // Users can update their own data (except isVerified)
      allow update: if request.auth != null &&
        request.auth.uid == userId &&
        request.resource.data.isVerified == resource.data.isVerified;
    }
  }
}
```

### Storage Rules (actualizar antes de producción):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /reports/{reportId}/{allPaths=**} {
      // Anyone can read
      allow read: if true;

      // Authenticated users can upload
      allow write: if request.auth != null;
    }
  }
}
```

## Paso 8: Verificar configuración

1. Reinicia el servidor de desarrollo de Expo: `pnpm start`
2. Si todo está correcto, Firebase debería inicializarse sin errores

## Notas importantes:

- **NUNCA** hagas commit del archivo `.env` (ya está en .gitignore)
- Las reglas en "test mode" permiten acceso público. **Actualízalas antes de producción**
- Guarda las credenciales de forma segura
- Para producción, considera usar Firebase App Check para mayor seguridad

## Próximos pasos:

Una vez configurado Firebase, podemos continuar con:
- Implementar autenticación
- Crear pantallas de la app
- Integrar el mapa
- Sistema de reportes
