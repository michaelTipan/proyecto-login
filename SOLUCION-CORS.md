# 🔧 Solución al Error de CORS

## ⚠️ Problema Detectado

El error muestra que el backend está enviando `Access-Control-Allow-Origin: http://localhost:3000` en lugar de `http://localhost:4200`.

## ✅ Solución Aplicada

He actualizado `backend/src/index.js` con:
- Configuración explícita de CORS para `http://localhost:4200`
- Métodos HTTP permitidos
- Headers permitidos
- Log para verificar la configuración

## 🚀 Pasos para Solucionar

### **PASO 1: Detener el servidor backend**
Si el servidor está corriendo, deténlo con `Ctrl + C` en la terminal donde está ejecutándose.

### **PASO 2: Reiniciar el servidor backend**
```bash
cd backend
npm start
```

### **PASO 3: Verificar en la consola**
Deberías ver estos mensajes:
```
puerto 3000
CORS configurado para origin: http://localhost:4200
Servidor escuchando en el puerto 3000
```

Si ves `CORS configurado para origin: http://localhost:3000`, entonces hay una variable de entorno `CORS_ORIGIN` que está sobrescribiendo el valor. En ese caso:

### **PASO 4 (Solo si es necesario): Verificar variables de entorno**
Si tienes un archivo `.env` en la carpeta `backend`, verifica que no tenga:
```
CORS_ORIGIN=http://localhost:3000
```

Si existe, cámbialo a:
```
CORS_ORIGIN=http://localhost:4200
```

O elimina esa línea para usar el valor por defecto.

### **PASO 5: Probar nuevamente**
1. Asegúrate de que el frontend esté corriendo en `http://localhost:4200`
2. Intenta registrar un usuario nuevamente
3. El error de CORS debería desaparecer

## 🔍 Verificación

Después de reiniciar, en la consola del backend deberías ver:
```
CORS configurado para origin: http://localhost:4200
```

Si ves esto, el CORS está configurado correctamente.

## 📝 Nota Importante

**Los cambios en el código del backend NO se aplican hasta que reinicies el servidor.**

Si usas `nodemon`, debería reiniciarse automáticamente. Si no, debes detener y volver a iniciar el servidor manualmente.

