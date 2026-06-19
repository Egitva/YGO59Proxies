fetch('https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Decode%20Talker')
  .then(response => response.json())
  .then(data => console.log(data[0].card_images[0].imege_url))
  .catch(error => console.error('Ошибка:', error));

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF(); // по умолчанию A4, портрет, мм

  // Способ 1: Картинка по URL (должна быть с CORS или base64)
  const imgUrl = data[0].card_images[0].imege_url; // или локальная

  // Загружаем картинку как base64
  function getBase64Image(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // для внешних изображений
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg')); // или 'image/png'
      };
      img.src = url;
    });
  }

  const imgData = await getBase64Image(imgUrl);

  // Добавляем картинку: (data, format, x, y, width, height)
  doc.addImage(imgData, 'JPEG', 20, 20, 170, 100); // подбери размеры под себя

  // Добавляем текст
  doc.text('Пример PDF с картинкой', 20, 15);

  // Добавляем вторую картинку на новой странице
  doc.addPage();
  doc.addImage(imgData, 'JPEG', 10, 20, 190, 120);

  // Сохраняем файл
  doc.save('мой-документ-с-картинками.pdf');
}
