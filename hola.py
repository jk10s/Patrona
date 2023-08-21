from selenium import webdriver

import time


# Configurar el controlador del navegador (en este caso, Chrome)
driver = webdriver.Chrome()

# Abrir la página web
url = "https://www.rivalo.co/en/online-casino/LOBBY"
driver.get(url)

time.sleep(10)
script = """
const casinoSliderElement = document.querySelector('body#svelte .main-content.full-width.svelte-m7793x main.svelte-m7793x .wrapper.svelte-gjbsso .casino-lobby-widget casino-lobby').shadowRoot.querySelector('div[part="CasinoLobby"] .WidgetsSection casino-categories-slider').shadowRoot.querySelector('div[part="CustomStylingContainer"] div[part="CasinoCategoriesContainer"] casino-slider');
const tragamonedasLink = Array.from(casinoSliderElement.shadowRoot.querySelectorAll('a')).find(link => link.textContent.includes('Tragamonedas'));
if (tragamonedasLink) {
    tragamonedasLink.click();
    return "Se ha hecho clic en 'Tragamonedas' correctamente.";
} else {
    return "No se encontró el enlace 'Tragamonedas'";
}
"""

result = driver.execute_script(script)
time.sleep(10)
print(result)