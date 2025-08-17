// script.js
const translations = {
    es: {
        title: "Descargar Videos de YouTube 4K",
        placeholder: "Busca o pega el enlace aquí...",
        start: "Start →",
        description: "Descarga de videos online rápida y sin complicaciones\nMyTube es una plataforma gratuita que te permite obtener videos y audios de YouTube con la mejor calidad disponible, directamente desde tu navegador. Convierte y guarda tus contenidos favoritos en formatos como MP4, MP3, WEBM, M4A, en resoluciones que van desde 360p hasta 4K, sin instalar programas ni extensiones. Funciona de forma fluida tanto en computadoras como en dispositivos móviles, ofreciendo una experiencia veloz, segura y sencilla para guardar miles de videos en pocos clics.",
        howTo: "Cómo funciona MyTube",
        steps: [
            "Copia el enlace del video de YouTube y pégalo en la barra de búsqueda de MyTube.",
            "Presiona el botón \"Iniciar\" para comenzar la conversión.",
            "Elige el formato y la calidad que prefieras (MP3 para audio o MP4 para video).",
            "Pulsa \"Descargar\" y guarda el archivo directamente en tu dispositivo."
        ]
    },
    en: {
        title: "Download YouTube Videos 4K",
        placeholder: "Search or paste the link here...",
        start: "Start →",
        description: "Fast and hassle-free online video download\nMyTube is a free platform that allows you to get videos and audios from YouTube with the best available quality, directly from your browser. Convert and save your favorite content in formats like MP4, MP3, WEBM, M4A, in resolutions from 360p to 4K, without installing programs or extensions. It works smoothly on both computers and mobile devices, offering a fast, secure, and simple experience to save thousands of videos in a few clicks.",
        howTo: "How MyTube Works",
        steps: [
            "Copy the YouTube video link and paste it into MyTube's search bar.",
            "Press the \"Start\" button to begin the conversion.",
            "Choose the format and quality you prefer (MP3 for audio or MP4 for video).",
            "Click \"Download\" and save the file directly to your device."
        ]
    },
    fr: {
        title: "Télécharger des Vidéos YouTube 4K",
        placeholder: "Recherchez ou collez le lien ici...",
        start: "Start →",
        description: "Téléchargement de vidéos en ligne rapide et sans complications\nMyTube est une plateforme gratuite qui vous permet d'obtenir des vidéos et des audios de YouTube avec la meilleure qualité disponible, directement depuis votre navigateur. Convertissez et enregistrez vos contenus préférés dans des formats comme MP4, MP3, WEBM, M4A, en résolutions allant de 360p à 4K, sans installer de programmes ni d'extensions. Fonctionne de manière fluide sur les ordinateurs et les appareils mobiles, offrant une expérience rapide, sécurisée et simple pour enregistrer des milliers de vidéos en quelques clics.",
        howTo: "Comment fonctionne MyTube",
        steps: [
            "Copiez le lien de la vidéo YouTube et collez-le dans la barre de recherche de MyTube.",
            "Appuyez sur le bouton \"Start\" pour commencer la conversion.",
            "Choisissez le format et la qualité que vous préférez (MP3 pour l'audio ou MP4 pour la vidéo).",
            "Cliquez sur \"Télécharger\" et enregistrez le fichier directement sur votre appareil."
        ]
    },
    pt: {
        title: "Baixar Vídeos do YouTube 4K",
        placeholder: "Pesquise ou cole o link aqui...",
        start: "Start →",
        description: "Download de vídeos online rápido e sem complicações\nMyTube é uma plataforma gratuita que permite obter vídeos e áudios do YouTube com a melhor qualidade disponível, diretamente do seu navegador. Converta e salve seus conteúdos favoritos em formatos como MP4, MP3, WEBM, M4A, em resoluções de 360p a 4K, sem instalar programas ou extensões. Funciona de forma fluida em computadores e dispositivos móveis, oferecendo uma experiência rápida, segura e simples para salvar milhares de vídeos em poucos cliques.",
        howTo: "Como funciona o MyTube",
        steps: [
            "Copie o link do vídeo do YouTube e cole na barra de pesquisa do MyTube.",
            "Pressione o botão \"Start\" para iniciar a conversão.",
            "Escolha o formato e a qualidade que preferir (MP3 para áudio ou MP4 para vídeo).",
            "Clique em \"Baixar\" e salve o arquivo diretamente no seu dispositivo."
        ]
    },
    de: {
        title: "YouTube-Videos 4K herunterladen",
        placeholder: "Suchen oder den Link hier einfügen...",
        start: "Start →",
        description: "Schneller und unkomplizierter Online-Video-Download\nMyTube ist eine kostenlose Plattform, mit der Sie Videos und Audios von YouTube in der besten verfügbaren Qualität direkt aus Ihrem Browser herunterladen können. Konvertieren und speichern Sie Ihre Lieblingsinhalte in Formaten wie MP4, MP3, WEBM, M4A, in Auflösungen von 360p bis 4K, ohne Programme oder Erweiterungen zu installieren. Funktioniert reibungslos auf Computern und mobilen Geräten und bietet eine schnelle, sichere und einfache Erfahrung, um Tausende von Videos mit wenigen Klicks zu speichern.",
        howTo: "So funktioniert MyTube",
        steps: [
            "Kopieren Sie den YouTube-Video-Link und fügen Sie ihn in die Suchleiste von MyTube ein.",
            "Drücken Sie die Schaltfläche \"Start\", um die Konvertierung zu beginnen.",
            "Wählen Sie das gewünschte Format und die Qualität (MP3 für Audio oder MP4 für Video).",
            "Klicken Sie auf \"Herunterladen\" und speichern Sie die Datei direkt auf Ihrem Gerät."
        ]
    }
};

function setLanguage(lang) {
    const trans = translations[lang];
    document.getElementById('title').innerText = trans.title;
    document.getElementById('url-input').placeholder = trans.placeholder;
    document.getElementById('start-btn').innerText = trans.start;
    document.getElementById('description').innerHTML = trans.description.replace(/\n/g, '<br>');
    document.getElementById('how-to').innerText = trans.howTo;
    const steps = document.getElementById('steps').children;
    trans.steps.forEach((step, i) => steps[i].innerText = step);
}

document.getElementById('language-selector').addEventListener('change', (e) => setLanguage(e.target.value));

setLanguage('es'); // Default

document.getElementById('start-btn').addEventListener('click', async () => {
    const url = document.getElementById('url-input').value;
    if (!url) return alert('Ingresa un enlace válido');

    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const response = await fetch(`/info?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        document.getElementById('video-title').innerText = data.title;
        document.getElementById('thumbnail').src = data.thumbnail;
        const optionsDiv = document.getElementById('format-options');
        optionsDiv.innerHTML = '';

        const uniqueLabels = new Set();

        data.formats.sort((a, b) => {
            const resA = parseInt(a.resolution) || 0;
            const resB = parseInt(b.resolution) || 0;
            return resB - resA;
        });

        data.formats.forEach(f => {
            let label = f.resolution;
            let outputFormat = null;
            if (f.type === 'audio') {
                label = `Audio (${f.subtype.toUpperCase()})`;
                if (f.subtype !== 'mp3' && !uniqueLabels.has('MP3 (Audio)')) {
                    const mp3Btn = document.createElement('button');
                    mp3Btn.innerText = 'MP3 (Audio)';
                    mp3Btn.addEventListener('click', () => downloadFile(url, f.itag, 'mp3', 'MP3 (Audio)'));
                    optionsDiv.appendChild(mp3Btn);
                    uniqueLabels.add('MP3 (Audio)');
                }
            } else {
                label += ` (${f.subtype.toUpperCase()})`;
            }

            if (!uniqueLabels.has(label)) {
                const btn = document.createElement('button');
                btn.innerText = label;
                btn.addEventListener('click', () => downloadFile(url, f.itag, outputFormat, label));
                optionsDiv.appendChild(btn);
                uniqueLabels.add(label);
            }
        });

        document.getElementById('results').style.display = 'block';
    } catch (e) {
        alert('Error: ' + e.message);
    } finally {
        loading.style.display = 'none';
    }
});

async function downloadFile(url, itag, outputFormat, label) {
    const loading = document.getElementById('loading');
    loading.style.display = 'block';

    try {
        const response = await fetch(`/download?url=${encodeURIComponent(url)}&itag=${itag}${outputFormat ? `&output_format=${outputFormat}` : ''}`);
        if (!response.ok) throw new Error(await response.text());

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = `${label.replace(/ /g, '_')}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        a.remove();
    } catch (e) {
        alert('Error en descarga: ' + e.message);
    } finally {
        loading.style.display = 'none';
    }
}

document.getElementById('contact-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('contact-email').style.display = 'block';
});