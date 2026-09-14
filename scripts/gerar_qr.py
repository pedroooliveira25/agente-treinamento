import qrcode

url = "https://docs.google.com/forms/d/e/1FAIpQLSfxVz_0F4T8WCwz3cqNYs-cT-1ggRY9-Nrz379tBoJ1S85K3w/viewform"
qr = qrcode.QRCode(border=2)
qr.add_data(url)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
out = r"C:\Users\Pedro Oliveira\pathbit\manager\projetos\agente-instalacao-treinamento\treinamento\thumbs\qr-licenca.png"
img.save(out)
print("salvo: " + out)
