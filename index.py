import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import urllib 

contatos_df = pd.read_excel("contatos_atualizado.xlsx")

navegador = webdriver.Chrome()
navegador.get("https://web.whatsapp.com/")
pix = "pix: 53991628888 Mayara, Mercado Pago"


while len(navegador.find_elements(By.ID, "side")) < 1:
    time.sleep(1)

for i, mensagem in enumerate(contatos_df['Mensagem']): 
    pessoa = contatos_df.loc[i, "Pessoa"]
    numero = contatos_df.loc[i, "Número"]
    texto = urllib.parse.quote(f"Boa tarde {pessoa} o valor pra pagar é {mensagem} {pix} (Manda o comprovante faz favor)")
    link = f"https://web.whatsapp.com/send?phone={numero}&text={texto}"
    navegador.get(link)
    
    try:
        WebDriverWait(navegador, 20).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="main"]/footer'))
        )
        
        input_xpath = '//*[@id="main"]/footer/div[1]/div/span/div/div[2]/div[1]/div[2]/div/p/span'
        mensagem_input = WebDriverWait(navegador, 20).until(
            EC.presence_of_element_located((By.XPATH, input_xpath))
        )
        mensagem_input.send_keys(Keys.ENTER)
        
    except Exception as e:
        print(f"Erro ao enviar mensagem para {pessoa}: {e}")

    time.sleep(5)
