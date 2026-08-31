# ANCLA Consejería Bíblica — Manual de Desarrollo y Despliegue

> **Guía Técnica de Onboarding y Colaboración**  
> Documento oficial para desarrolladores y colaboradores del proyecto.

---

## 1. Visión General del Proyecto

**ANCLA Consejería Bíblica** es una aplicación web progresiva orientada a pastores, líderes y consejeros bíblicos. La plataforma centraliza:
- **Estudios Doctrinales Exegéticos**: Análisis profundo de problemas del corazón con 4 pilares exegéticos (términos originales en griego/hebreo, contexto histórico, principio teológico y aplicación pastoral).
- **Glosario Teológico de Obras Maestras**: 3 niveles de navegación (Pecados Raíz → Obras Clásicas Recomendadas → Citas y Pasajes Exactos con Lector Zen).
- **Metodología Pastoral Oficial**: Sistema estructurado en 4 fases y 13 dimensiones bíblicas con preguntas de diagnóstico, checklist de fruto y descarga en PDF.
- **Gestión Privada de Expedientes**: Bitácora cronológica de sesiones, control de tareas de santificación y aislamiento de datos por consejero.

---

## 2. Stack Tecnológico

| Capa / Módulo | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript (~5.7) | Arquitectura modular con tipado estricto y componentes reutilizables. |
| **Build Tool & Bundler** | Vite 6 | Compilación ultrarrápida, HMR (Hot Module Replacement) instantáneo. |
| **Estilos & UI** | Tailwind CSS v3 | Sistema de diseño Glassmorphism oscuro sobrio y responsive. |
| **Tipografía** | Playfair Display & Plus Jakarta Sans | Fuentes optimizadas para lectura solemne y legibilidad de interfaz. |
| **Iconografía** | Lucide React | Iconos vectoriales ligeros y consistentes. |
| **Autenticación** | Firebase Authentication | Login seguro con Google OAuth (Single-Tenant). |
| **Base de Datos** | Cloud Firestore | Base de datos NoSQL en tiempo real con reglas de seguridad estrictas. |
| **Generación de Reportes** | jsPDF & html2canvas | Exportación de estudios, metodología y guías en formato PDF. |
| **Hosting & Despliegue** | Firebase Hosting | Servidor serverless con CDN global y soporte para SPA. |

---

## 3. Requisitos Previos

Asegúrate de tener instaladas las siguientes herramientas en tu entorno de trabajo:
1. **Node.js**: Versión `18.x` o `20.x LTS` recomendada (`node -v`).
2. **npm**: Versión `9.x` o `10.x` (`npm -v`).
3. **Git**: Para control de versiones sincronizado con GitHub (`git --version`).
4. **Firebase CLI**: Instalable globalmente mediante:
   ```bash
   npm install -g firebase-tools
   ```

---

## 4. Puesta en Marcha en Local (Paso a Paso)

### Paso 1: Clonar el repositorio
```bash
git clone https://github.com/MayitoApps/consejeria-app.git
cd consejeria-app
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno (`.env`)
Crea un archivo llamado `.env` en la raíz del proyecto (puedes tomar como base el archivo `.env.example`):
```env
VITE_FIREBASE_API_KEY=AIzaSyBmTFMmsPmd4ApTzsGOUIw8GCzUXyPtoc4
VITE_FIREBASE_AUTH_DOMAIN=anclaconsejo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=anclaconsejo
VITE_FIREBASE_STORAGE_BUCKET=anclaconsejo.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=63423105940
VITE_FIREBASE_APP_ID=1:63423105940:web:d98ab54187f8883e0b5d81
```

> ⚠️ **Nota Importante**: Todas las variables consumidas por el cliente en Vite deben llevar el prefijo `VITE_` para ser accesibles mediante `import.meta.env`.

### Paso 4: Iniciar el servidor de desarrollo local
```bash
npm run dev
```
La aplicación estará disponible de inmediato en: **`http://localhost:5173`** con recarga en vivo activada.

---

## 5. Estructura del Código Fuente

```
consejeria-app/
├── public/                  # Favicons y assets estáticos públicos
├── src/
│   ├── components/
│   │   ├── advisees/        # Expedientes, sesiones, tareas y modales
│   │   ├── glossary/        # Glosario teológico (3 niveles) y ZenReaderModal
│   │   ├── methodology/     # Metodología de 4 fases y 13 dimensiones
│   │   ├── studies/         # Catálogo de estudios bíblicos y ExegeticalModal
│   │   ├── AuthModal.tsx    # Modal de autenticación con Google
│   │   ├── AuthScreen.tsx   # Pantalla principal de acceso
│   │   ├── Navbar.tsx       # Barra de navegación superior
│   │   └── MobileNav.tsx    # Barra de navegación inferior móvil
│   ├── config/
│   │   └── firebase.ts      # Inicialización del SDK de Firebase
│   ├── context/
│   │   └── AuthContext.tsx  # Estado global de usuario y métodos de autenticación
│   ├── data/                # Bases de datos estáticas (estudios, libros, dimensiones)
│   ├── services/
│   │   └── adviseesService.ts # Métodos Firestore (CRUD y suscripciones onSnapshot)
│   ├── types/
│   │   └── index.ts         # Contratos e interfaces TypeScript
│   ├── App.tsx              # Componente raíz con enrutamiento de pestañas
│   ├── index.css            # Estilos globales, variables y utilidades glass-card
│   └── main.tsx             # Punto de entrada de React
├── firebase.json            # Configuración de Firebase Hosting y Firestore Rules
├── firestore.rules          # Reglas de seguridad de base de datos
├── .firebaserc              # Proyecto activo de Firebase (anclaconsejo)
├── .env.example             # Plantilla de variables de entorno
└── package.json             # Dependencias y scripts de npm
```

---

## 6. Seguridad y Reglas de Base de Datos (Firestore)

Los expedientes pastorales contienen información confidencial. Por ello, la base de datos implementa **aislamiento por usuario autenticado** en `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cada consejero solo tiene acceso a sus propios aconsejados y sesiones
    match /users/{userId}/advisees/{adviseeId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Perfil del consejero
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 7. Compilación y Despliegue en Firebase Hosting

Para publicar nuevas características o correcciones en el servidor de producción:

### 1. Iniciar sesión en Firebase (primera vez en el equipo)
```bash
firebase login
```

### 2. Validar tipos y compilar el bundle de producción
```bash
npm run build
```
*(Este comando ejecuta `tsc -b && vite build` y genera la carpeta optimizada `/dist`)*.

### 3. Desplegar al Hosting de Firebase
```bash
firebase deploy --only hosting
```

* **URL de Producción Oficial**: [https://anclaconsejo.web.app](https://anclaconsejo.web.app)
* **Consola de Firebase**: [anclaconsejo en Firebase Console](https://console.firebase.google.com/project/anclaconsejo/overview)

### 4. (Opcional) Desplegar Reglas de Firestore
Si realizaste modificaciones en `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```

---

## 8. Flujo de Trabajo en Git y Colaboración

1. **Sincronizar cambios antes de programar**:
   ```bash
   git pull origin main
   ```
2. **Verificar compilación local antes de hacer push**:
   ```bash
   npm run build
   ```
3. **Guardar y subir cambios**:
   ```bash
   git add .
   git commit -m "Tipo(alcance): Descripción clara del cambio"
   git push origin main
   ```

---

## 9. Preguntas Frecuentes y Solución de Problemas

* **Problema con scripts en PowerShell (`PSSecurityException`)**:  
  En Windows, si `npm` da error por directivas de seguridad, ejecuta:
  ```powershell
  npm.cmd run dev
  # o bien:
  npm.cmd run build
  ```
* **Error de inicio de sesión con Google**:  
  Comprueba que el dominio `localhost` esté listado en Firebase Console > Authentication > Settings > Authorized Domains.
* **Error 404 al refrescar la página en hosting**:  
  Ya está resuelto mediante la directiva `rewrites` en `firebase.json` que redirige todas las rutas hacia `/index.html`.

---
*Documento generado para el equipo de desarrollo de ANCLA Consejería Bíblica.*
