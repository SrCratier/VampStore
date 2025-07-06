// netlify/edge-functions/set-currency.js

export default async (request, context) => {

  // Obtiene la respuesta original de la página
  const response = await context.next();
  
  // Si la ruta no es para la página principal, no hagas nada
  if (request.url.endsWith('/') === false && request.url.includes('/index.html') === false) {
    return response;
  }

  // Obtiene el código del país del visitante. Si no se detecta, usa 'US' por defecto.
  const countryCode = context.geo.country?.code || 'US';

  // Mapeo de códigos de país a los códigos de moneda de tu tienda
  const countryToCurrency = {
    'MX': 'Mx',
    'PE': 'PEN',
    'AR': 'ARS',
    'CO': 'COP',
    'VE': 'VES',
    'CL': 'CLP',
    // Puedes añadir países de la UE aquí si quieres que vean EUR
    'ES': 'EUR', 
    'FR': 'EUR',
    'DE': 'EUR',
  };

  // Determina la moneda a usar. Si el país no está en el mapa, usa USD.
  const currency = countryToCurrency[countryCode] || 'USD';

  // Lee el contenido HTML de la página
  const page = await response.text();

  // Prepara el script que se inyectará en la página
  // Esto crea una variable global que tu script principal podrá leer
  const injectedScript = `<script>window.VAMP_DEFAULT_CURRENCY = "${currency}";</script>`;

  // Reemplaza el </body> con nuestro script + </body>
  const updatedPage = page.replace('</body>', `${injectedScript}</body>`);

  // Devuelve la página modificada al usuario
  return new Response(updatedPage, response);
};