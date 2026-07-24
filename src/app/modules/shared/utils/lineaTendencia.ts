export const calcularLineaTendencia = (datos: number[]) => {
  const n = datos.length;
  if (n <= 1) {
    return {
      lineaTendencia: datos.slice(),
      m: 0,
      b: datos[0] || 0,
    };
  }
  let sumaX = 0,
    sumaY = 0,
    sumaXY = 0,
    sumaXX = 0;

  // Asumimos que las etiquetas son índices numéricos (0, 1, 2, ...)
  for (let i = 0; i < n; i++) {
    sumaX += i;
    sumaY += datos[i];
    sumaXY += i * datos[i];
    sumaXX += i * i;
  }

  // Calcular pendiente (m) e intersección (b)
  const m = (n * sumaXY - sumaX * sumaY) / (n * sumaXX - sumaX * sumaX);
  const b = (sumaY - m * sumaX) / n;

  // Generar puntos para la línea de tendencia
  const lineaTendencia = [];
  for (let i = 0; i < n; i++) {
    lineaTendencia.push(m * i + b);
  }
  // Devuelvo también los valores de m y b junto con la línea de tendencia
  return {
    lineaTendencia,
    m,
    b,
  };
};
