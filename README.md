
# All To Import – Plataforma de Comercio Electrónico

## 📦 Descripción del Proyecto

**All To Import** es una plataforma de comercio electrónico desarrollada para el cliente *All To Import SAS*. El sistema consta de una página web de tienda en línea para los usuarios finales y una aplicación web interna para la gestión de productos (back-office).

Incluye:
- **Back-end:** API REST desarrollada en .NET Core (C#), con base de datos SQL Server y uso de Entity Framework.
- **Front-end:** Dos aplicaciones en React.js con Chakra UI y Vite (una para los clientes y otra para administración).
- **Integraciones:** Pasarela de pago Mercado Pago y conexión con el sistema de gestión actual del cliente vía Web Service.

> **Nota:** Actualmente, el deploy del back-end y la base de datos no están activos en un entorno en la nube debido a la falta de créditos en Azure. Se recomienda ejecutar el proyecto de forma local utilizando las instrucciones a continuación.

Este proyecto fue realizado como entrega final para la obtención del título de **Analista Programador** en la Universidad ORT Uruguay.

---

## 🛠️ Tecnologías Utilizadas

### Backend:
- .NET Core (C#)
- ASP.NET Core Web API
- SQL Server
- Entity Framework

### Frontend:
- React.js
- Chakra UI
- Vite
- Node.js y npm

---

## 📁 Estructura del Repositorio

| Carpeta               | Descripción                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `/backend`            | Código fuente del back-end. API REST en .NET Core.                          |
| `/frontend_client`    | Aplicación web para los clientes. Tienda online en React.js.                |
| `/frontend_admin`     | Aplicación web administrativa para gestión de productos y usuarios.         |

---

## 🚀 Instalación y Ejecución Local

### ▶️ Backend (.NET Core API)

1. Ir a la carpeta `/backend`
2. Verificar la cadena de conexión en `appsettings.json`
3. Si es necesario, ejecutar migraciones:

   ```bash
   dotnet ef database update
   ```

4. Levantar el servidor:

   ```bash
   dotnet run
   ```

5. La API estará disponible en: `http://localhost:5000` (o similar)

---

### 🛍️ Frontend Cliente (Tienda Web)

1. Ir a la carpeta `/frontend_client`
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador: `http://localhost:5173`

---

### 🛠️ Frontend Admin (Panel de Gestión)

1. Ir a la carpeta `/frontend_admin`
2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Ejecutar en modo desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir en el navegador: `http://localhost:5174` (puede variar)

> ⚠️ Asegurate de que el backend esté corriendo antes de iniciar cualquiera de los frontends.

---

## 📹 Manual de Usuario

Podés ver el video tutorial del sistema en el siguiente enlace:  
🎬 [Ver video del manual de usuario](https://docs.google.com/presentation/d/1d81Rsx3VExgGTTZ_yh5kWn6dGLh0UwlqWvMbnjP905c/edit?slide=id.p#slide=id.p)

También podés agregar capturas como esta (guardalas en la carpeta raíz):

```markdown
[![Pantalla principal de la tienda](./captura1.png)](https://drive.google.com/tu_link_aca)
```

---

## 👩‍💻 Autores

- **Agustina Goñi**
- **Guillermo Montecoral**
- **Leandro Montesdeoca**

**Tutor:** Andrés de Sosa – Universidad ORT Uruguay

---
