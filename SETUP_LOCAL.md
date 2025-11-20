# Configuración Local - EasyWork

## Pasos para ejecutar localmente en Visual Studio Code

### 1. Descarga el proyecto
- Haz click en el botón de descargar en Replit
- Descomprime la carpeta en tu computadora

### 2. Instala Node.js (si no lo tienes)
- Descarga desde: https://nodejs.org/ (LTS)
- Instala normalmente

### 3. Abre en VS Code
- Abre Visual Studio Code
- Arrastra la carpeta del proyecto a VS Code (o File → Open Folder)

### 4. Crea el archivo .env
En la **raíz del proyecto** (donde está package.json):
- Presiona: **Ctrl+Shift+P** (o Cmd+Shift+P en Mac)
- Escribe: "New File"
- Dale nombre: `.env`

**Copia y pega esto en el archivo:**
```
DATABASE_URL=postgresql://neondb_owner:npg_IxsiSo5gbW6B@ep-rough-term-a633vyfb.us-west-2.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=RoyDev_SuperSecure_EasyWork_2026_Academia
```

**Guarda el archivo** (Ctrl+S)

### 5. Instala las dependencias
Abre la terminal en VS Code: **Ctrl+`**

Ejecuta:
```bash
npm install
```

### 6. Ejecuta la aplicación
```bash
npm run dev
```

Verás algo como:
```
Local:        http://localhost:5173
```

### 7. Abre en el navegador
Copia y pega la URL en tu navegador:
```
http://localhost:5173
```

¡Listo! Tu aplicación EasyWork está corriendo localmente. ✨

---

## Notas importantes
- El archivo `.env` **NO se sube a Git** (está en .gitignore)
- Solo existe en tu computadora
- Nunca compartas el DATABASE_URL con nadie
- Si cambias la contraseña de PostgreSQL, actualiza el DATABASE_URL
