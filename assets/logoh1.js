window.addEventListener('DOMContentLoaded', () => {
      const logoTextElement = document.getElementById('logo-text');

      const textos = ['ETHEREAL CODE', 'DESARROLLO WEB'];

      let index = 0;
      let charIndex = 0;
      let escribiendo = true;

      function escribirBorrar() {
        const textoActual = textos[index];

        // Aplicar clase blanca solo a "DESARROLLO WEB"
        if (textoActual === 'DESARROLLO WEB') {
          logoTextElement.classList.add('white-text');
        } else {
          logoTextElement.classList.remove('white-text');
        }

        if (escribiendo) {
          if (charIndex <= textoActual.length) {
            logoTextElement.textContent = textoActual.substring(0, charIndex);
            charIndex++;
            setTimeout(escribirBorrar, 100);
          } else {
            escribiendo = false;
            setTimeout(escribirBorrar, 1500);
          }
        } else {
          if (charIndex >= 0) {
            logoTextElement.textContent = textoActual.substring(0, charIndex);
            charIndex--;
            setTimeout(escribirBorrar, 60);
          } else {
            escribiendo = true;
            index = (index + 1) % textos.length;
            setTimeout(escribirBorrar, 500);
          }
        }
      }

      escribirBorrar();
    });