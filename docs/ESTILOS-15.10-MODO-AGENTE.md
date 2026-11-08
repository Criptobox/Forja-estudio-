# Estilos 15.10 — Modo de recomendación simple

## Objetivo
Reducir la carga cognitiva. La persona describe qué quiere crear; Estilos prepara una propuesta y muestra directamente la vista previa. La biblioteca y el editor avanzado dejan de ser el recorrido obligatorio.

## Flujo principal
1. Escribir una descripción breve.
2. Crear propuesta.
3. Revisar la recomendación y la vista previa.
4. Volver a describir la idea si desea otra dirección.
5. Abrir la personalización manual o el editor profesional solo si hace falta.

## Reglas de recomendación actuales
- Gastronomía: propuesta cálida y cercana, con búsqueda, tarjetas de producto y navegación sencilla.
- Finanzas: propuesta fintech limpia, con balance y datos destacados.
- Comercio: propuesta editorial para descubrir productos y comprar.
- Bienestar: propuesta clara y activa, con indicadores y accesos rápidos.
- General: minimalismo cálido y estructura versátil.

La propuesta presenta el estilo visual, una paleta orientativa y la estructura recomendada. Los bloques se seleccionan desde el catálogo existente.

## Honestidad de implementación
Esta entrega utiliza reglas locales deterministas y la biblioteca de componentes. No llama a un modelo de IA ni interpreta instrucciones abiertas más allá de las categorías definidas. El siguiente paso de arquitectura será conectar un agente real que pueda analizar la petición, justificar decisiones, inspeccionar el resultado y aplicar revisiones en lenguaje natural.

## Decisiones de interfaz
- La biblioteca completa se conserva como ruta opcional.
- La personalización de bloques se pliega bajo “Personalizar manualmente”.
- El editor profesional queda plegado bajo “Editor visual profesional”.
- No se eliminan controles ni datos existentes.
