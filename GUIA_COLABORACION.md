# 🧭 Guía de Trabajo en Equipo para ANCLA Consejería Bíblica

Esta guía rápida describe el flujo de trabajo diario para colaborar en el proyecto **ANCLA Consejería Bíblica** utilizando **Antigravity**, **GitHub** y el servidor local de desarrollo.

---

## 🟢 Paso 1: Al Iniciar Sesión (Sincronizar el Proyecto)

Antes de realizar cualquier cambio, debes actualizar tu carpeta local con los últimos cambios que tu compañero haya subido a GitHub.

### 📋 Prompt para copiar y pegar en tu Antigravity:
```text
Por favor actualiza mi carpeta local descargando los últimos cambios desde GitHub (ejecuta git pull origin main) y asegúrate de que todas las dependencias estén al día.
```

---

## 💻 Paso 2: Probar la Aplicación en Tiempo Real (Servidor Local)

Para ver los cambios que vas haciendo en tu computadora en tiempo real:

1. Abre una ventana de **Símbolo del sistema** (Command Prompt / CMD) o tu terminal favorita.
2. Navega a la carpeta de tu proyecto, por ejemplo:
   ```cmd
   cd C:\Users\TU_USUARIO\OneDrive\Documentos\Consejeria-App
   ```
3. Inicia el servidor de desarrollo ejecutando:
   ```cmd
   npm run dev
   ```
4. Verás en la terminal un enlace como:
   ```text
   ➜  Local:   http://localhost:5173/
   ```
5. Copia esa dirección (`http://localhost:5173/`) y ábrela en tu navegador **Google Chrome**. Cada cambio guardado se reflejará automáticamente al instante.

---

## 🚀 Paso 3: Al Terminar Cambios (Subir a GitHub y Hosting)

Cuando termines tu sesión de trabajo o finalices una función, debes pedirle a Antigravity que guarde todo en GitHub y actualice la versión en vivo en el hosting para que tu compañero y los usuarios siempre tengan la última versión.

### 📋 Prompt para copiar y pegar en tu Antigravity:
```text
Terminé los cambios. Por favor compila el proyecto con npm run build, sube todas las actualizaciones a GitHub (git add, commit y push a la rama main) y despliega la versión al hosting de Firebase.
```

---

## 📌 Resumen del Flujo de Trabajo

| Momento | Acción | Cómo hacerlo |
| :--- | :--- | :--- |
| **Inicio del día** | Descargar cambios | Pegar Prompt 1 en Antigravity |
| **Durante el trabajo** | Ver en tiempo real | Ejecutar `npm run dev` en CMD y abrir `localhost:5173` en Chrome |
| **Final del trabajo** | Guardar y publicar | Pegar Prompt 2 en Antigravity |

---
*ANCLA Consejería Bíblica — Proyecto en Desarrollo*
