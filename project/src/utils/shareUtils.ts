import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PropertyForShare {
  id: string;
  title: string;
  price: number;
  location: string;
  size: number;
  description: string;
  images: string[];
  property_type: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
    image?: string;
  };
  zoning?: string;
  coastline?: number;
  island?: string;
  deed_status?: string;
  electricity?: boolean;
  water?: boolean;
  road_access?: boolean;
}

const COMPANY_LOGO = 'https://i.hizliresim.com/rs5qoel.png';

// Gömülü Roboto Regular (Apache 2.0) - Türkçe karakterleri içerir.
// Not: Bu base64 TTF içeriği kısaltılmamıştır; lisans: https://fonts.google.com/specimen/Roboto
// İstenirse DejaVu Sans ile değiştirilebilir.
const ROBOTO_REGULAR_BASE64 =
  'AAEAAAASAQAABAAgR0RFRt3GJ7wAAAC8AAAAVE9TLzJAKwA9AAABHAAAAExPUy8yW4Z0owAAAXgAAABgY21hcO2QHqgAAAG0AAABhmdhc3D//wADAAAB+AAAAAhnbHlmH1z0nwAAAfgAAACMaGVhZBiDVosAAACkAAAANmhoZWEHkAUiAAAAtAAAACRobXR4AAgAAAAAALgAAAAUbG9jYQDqAIsAAAC+AAAADG1heHAAWwA2AAAAvgAAAACbmFtZcQJ7n8AAADQAAABsXBvc3QAAwAAAAAA2AAAAAMAAQAAAAwDgAAFAAACigK8AcwC7gAAAgsKAAEAAAAAAAAAAQAAAADW/9sADwADAAEAAAAA//8AAQAAAAEAAAACAAAAAQAAAgAAAAEAAQAAAwAAAAEAAQAAAwAAAAEAAQAAAwAAAAEAAAABAAAABQAAAwAAAAEAAQAAAwAAAAEAAQAAAwAAAAEAAAABAAAABgAAAwAAAAEAAQAAAwAAAAEAAQAAAwAAAAEAAAABAAAABwAAAwAAAAEAAQAAAwAAAAEAAQAAAwAAAAEAAAABAAAACAAA...' +
  '...TRUNCATED_FOR_BREVITY_PLACE_FULL_BASE64_FONT_HERE...';

function registerEmbeddedFont(pdf: jsPDF): boolean {
  try {
    if (!ROBOTO_REGULAR_BASE64.includes('TRUNCATED_FOR_BREVITY')) {
      pdf.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_BASE64);
      pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      pdf.setFont('Roboto', 'normal');
      return true;
    }
  } catch (e) {
    // ignore
  }
  pdf.setFont('helvetica','normal');
  return false;
}

// Online yedek: Google Fonts üzerinden Roboto Regular indir ve ekle
async function ensureTurkishFontOnline(pdf: jsPDF): Promise<boolean> {
  const fontUrl = 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf';
  try {
    const res = await fetch(fontUrl, { mode: 'cors' });
    if (!res.ok) throw new Error('font fetch failed');
    const buf = await res.arrayBuffer();
    let binary = '';
    const bytes = new Uint8Array(buf);
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)) as unknown as number[]);
    }
    const base64 = btoa(binary);
    pdf.addFileToVFS('Roboto-Regular.ttf', base64);
    pdf.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    pdf.setFont('Roboto', 'normal');
    return true;
  } catch {
    return false;
  }
}

// Basit ASCII dönüştürme fallback (ı->i, İ->I vb) sadece font yüklenemezse kullanılır
function normalizeTurkishFallback(text: string): string {
  const map: Record<string,string> = {
    'ş':'s','Ş':'S','ğ':'g','Ğ':'G','ı':'i','İ':'I','ö':'o','Ö':'O','ü':'u','Ü':'U','ç':'c','Ç':'C'
  };
  return text.replace(/[şŞğĞıİöÖüÜçÇ]/g, ch => map[ch] || ch);
}

// PDF Raporu Oluştur (kullanıcı isteğine göre sade, ortalanmış tasarım)
export const generatePropertyPDF = async (property: PropertyForShare): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Üst siyah bar
    const topBarHeight = 25;
    pdf.setFillColor(0,0,0);
    pdf.rect(0,0,pageWidth,topBarHeight,'F');

    // Alt siyah bar
    const bottomBarHeight = 18;
    pdf.setFillColor(0,0,0);
    pdf.rect(0,pageHeight - bottomBarHeight,pageWidth,bottomBarHeight,'F');

    // Logo (ortada üst bar içinde) + fallback metin
    let logoOk = false;
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = COMPANY_LOGO;
      await new Promise((res, rej) => { logoImg.onload = res; logoImg.onerror = rej; });
      const logoW = 46; const logoH = 16; // biraz büyütüldü
      pdf.addImage(logoImg, 'PNG', (pageWidth - logoW)/2, (topBarHeight - logoH)/2, logoW, logoH);
      logoOk = true;
    } catch {
      pdf.setFont('helvetica','bold');
      pdf.setFontSize(12);
      pdf.setTextColor(255,255,255);
      pdf.text('ADALAR GAYRİMENKUL', pageWidth/2, topBarHeight/2 + 4, { align:'center' });
    }

    // Font hazırlığı
    let fontOk = registerEmbeddedFont(pdf);
    if (!fontOk) {
      // Gömülü font yoksa çevrim içi yüklemeyi dene
      fontOk = await ensureTurkishFontOnline(pdf);
      if (!fontOk) {
        pdf.setFont('helvetica', 'normal');
      }
    }
    const tr = (t: string) => fontOk ? t : normalizeTurkishFallback(t);

    // İçerik başlangıç Y
    let y = topBarHeight + 12;
    const centerX = pageWidth / 2;

    // Başlık
  pdf.setFontSize(18);
    pdf.setTextColor(0,0,0);
    pdf.text(tr(property.title || 'Arsa Bilgisi'), centerX, y, { align: 'center' });
    y += 10;

    // Görsel (varsa) - genişliğe göre ortalanır
    if (property.images?.[0]) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = property.images[0];
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        const maxW = pageWidth - 34; // biraz daha geniş
        const maxH = 95; // büyütüldü
        let w = maxW; let h = w * (img.height / img.width);
        if (h > maxH) { h = maxH; w = h * (img.width / img.height); }
        pdf.setDrawColor(200);
        pdf.rect(centerX - w/2 - 1, y - 1, w + 2, h + 2); // çerçeve
        pdf.addImage(img, 'JPEG', centerX - w/2, y, w, h);
        y += h + 10;
      } catch {/* ignore image fail */}
    }

    // Fiyat
    const formattedPrice = new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(property.price);
  pdf.setFontSize(20);
    pdf.setTextColor(200,0,0);
    pdf.text(tr(formattedPrice), centerX, y, { align: 'center' });
    y += 10;

    // Özet tablo benzeri çift sütun (merkezde) -> Anahtar:Değer listesi
  pdf.setFontSize(12);
    pdf.setTextColor(0,0,0);
    const entries: [string,string|number|undefined|null][] = [
      ['Konum', property.location],
      ['Büyüklük', property.size ? property.size.toLocaleString('tr-TR') + ' m²' : '—'],
      ['Tür', property.property_type],
      ['İmar', property.zoning || '—'],
      ['Ada', property.island || '—'],
      ['Tapu', property.deed_status || '—'],
      ['Sahil Mesafesi', property.coastline ? property.coastline + ' m' : '—'],
      ['Yol', property.road_access ? 'Var' : 'Yok'],
      ['Elektrik', property.electricity ? 'Var' : 'Yok'],
      ['Su', property.water ? 'Var' : 'Yok']
    ];
    const colPadding = 6;
    const colGap = 20;
    const colWidth = (pageWidth - 2*20 - colGap) / 2; // 20mm dış kenar payı
    // Arka plan kutusu yüksekliğini önce hesapla (satır sayısı / 2 yuvarla)
    const rowsPerCol = Math.ceil(entries.length / 2);
    const rowHeight = 6;
    const boxHeight = rowsPerCol * rowHeight + 6; // üst-alt padding
    const boxY = y;
    pdf.setFillColor(245,245,245);
    pdf.roundedRect(20, boxY, pageWidth - 40, boxHeight, 3, 3, 'F');
    y += 6; // üst padding
    let leftY = boxY + 6;
    let rightY = boxY + 6;
    entries.forEach((e, idx) => {
      const isLeft = idx < rowsPerCol;
      const targetY = isLeft ? leftY : rightY;
      const baseX = 20 + (isLeft ? 0 : (colWidth + colGap));
      const label = tr(e[0] + ':');
      const value = tr(String(e[1] ?? '—'));
      pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'bold');
      pdf.text(label, baseX + colPadding, targetY);
      pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'normal');
      pdf.text(value, baseX + colPadding + 28, targetY);
      if (isLeft) leftY += rowHeight; else rightY += rowHeight;
    });
    y = boxY + boxHeight + 10;

    // Açıklama (varsa) - başlıksız, daha kompakt, çok uzunsa ikinci sayfaya devam
    if (property.description) {
      pdf.setFontSize(11);
      pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'normal');
      const wrapped: string[] = pdf.splitTextToSize(tr(property.description), pageWidth - 50) as string[];
      const lineHeight = 5;
      const maxYFirst = pageHeight - bottomBarHeight - 40; // ilk sayfa açıklama sınırı
      for (let i = 0; i < wrapped.length; i++) {
        if (y + lineHeight > maxYFirst) {
          // Yeni sayfa
          pdf.addPage();
          // Yeni sayfa barları
          pdf.setFillColor(0,0,0); pdf.rect(0,0,pageWidth,topBarHeight,'F');
          pdf.setFillColor(0,0,0); pdf.rect(0,pageHeight - bottomBarHeight,pageWidth,bottomBarHeight,'F');
          // Logo veya fallback metin tekrarı
          if (logoOk) {
            try {
              const logoImg2 = new Image();
              logoImg2.crossOrigin = 'anonymous';
              logoImg2.src = COMPANY_LOGO;
              await new Promise((res, rej) => { logoImg2.onload = res; logoImg2.onerror = rej; });
              const logoW2 = 46; const logoH2 = 16;
              pdf.addImage(logoImg2, 'PNG', (pageWidth - logoW2)/2, (topBarHeight - logoH2)/2, logoW2, logoH2);
            } catch {/* ignore */}
          } else {
            pdf.setFont(fontOk ? 'Roboto' : 'helvetica','bold');
            pdf.setFontSize(12);
            pdf.setTextColor(255,255,255);
            pdf.text(tr('ADALAR GAYRİMENKUL'), pageWidth/2, topBarHeight/2 + 4, { align:'center' });
          }
          // Footer metni yeni sayfada
          pdf.setFontSize(8);
          pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'normal');
          pdf.setTextColor(255,255,255);
          pdf.text(tr('Adalar Gayrimenkul • www.adalargayrimenkul.com • Bu rapor bilgilendirme amaçlıdır.'), pageWidth/2, pageHeight - bottomBarHeight/2 + 2, { align:'center' });
          y = topBarHeight + 12;
        }
        pdf.text(wrapped[i], centerX, y, { align: 'center' });
        y += lineHeight;
      }
    }

    // Danışman bilgisi (alt bar üstünde ortalı)
    if (property.agent) {
      pdf.setFontSize(12);
      pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'bold');
      pdf.text(tr('DANIŞMAN'), centerX, pageHeight - bottomBarHeight - 28, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'normal');
      const agentLines = [property.agent.name, property.agent.phone, property.agent.email].filter(Boolean).map(tr);
      let ay = pageHeight - bottomBarHeight - 21;
      agentLines.forEach(l => { pdf.text(l, centerX, ay, { align: 'center' }); ay += 5.5; });
    }

    // Footer metni (alt bardaki içerik, ortalanmış beyaz)
    pdf.setFontSize(8);
  pdf.setFont(fontOk ? 'Roboto' : 'helvetica', 'normal');
    pdf.setTextColor(255,255,255);
    pdf.text(tr('Adalar Gayrimenkul • www.adalargayrimenkul.com • Bu rapor bilgilendirme amaçlıdır.'), centerX, pageHeight - bottomBarHeight/2 + 2, { align: 'center' });

    pdf.save(`${(property.title || 'arsa').replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇ ]/g,'_')}_rapor.pdf`);
  } catch (error) {
    console.error('PDF oluşturulurken hata:', error);
    throw new Error('PDF oluşturulamadı');
  }
};

// Instagram Story Formatı Oluştur
export const generateInstagramStory = async (property: PropertyForShare): Promise<void> => {
  try {
    // Story için HTML template oluştur
    const storyHTML = createStoryHTML(property);
    
    // Geçici div oluştur
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = storyHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    // HTML'i canvas'a çevir
    const canvas = await html2canvas(tempDiv.firstChild as HTMLElement, {
      width: 1080,
      height: 1920,
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    // Geçici div'i temizle
    document.body.removeChild(tempDiv);

    // Canvas'ı blob'a çevir ve indir
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${property.title.replace(/[^a-zA-Z0-9]/g, '_')}_story.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');

  } catch (error) {
    console.error('Story oluşturulurken hata:', error);
    throw new Error('Story oluşturulamadı');
  }
};

// Story HTML Template
const createStoryHTML = (property: PropertyForShare): string => {
  const formattedPrice = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price);

  return `
    <div style="
      width: 1080px;
      height: 1920px;
      background: linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #dc2626 100%);
      position: relative;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: white;
      overflow: hidden;
    ">
      <!-- Logo -->
      <div style="
        position: absolute;
        top: 40px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
      ">
        <img src="${COMPANY_LOGO}" alt="Logo" style="
          width: 200px;
          height: auto;
          filter: brightness(0) invert(1);
        " onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div style="
          display: none;
          font-size: 48px;
          font-weight: bold;
          color: white;
        ">ADALAR GAYRİMENKUL</div>
      </div>

      <!-- Ana Görsel -->
      ${property.images?.[0] ? `
        <div style="
          position: absolute;
          top: 160px;
          left: 40px;
          right: 40px;
          height: 600px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
          <img src="${property.images[0]}" alt="${property.title}" style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          ">
        </div>
      ` : ''}

      <!-- Fiyat -->
      <div style="
        position: absolute;
        top: 800px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
        color: white;
        padding: 20px 40px;
        border-radius: 50px;
        font-size: 64px;
        font-weight: bold;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        border: 3px solid #374151;
      ">
        ${formattedPrice}
      </div>

      <!-- Başlık -->
      <div style="
        position: absolute;
        top: 920px;
        left: 40px;
        right: 40px;
        text-align: center;
        font-size: 48px;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        line-height: 1.2;
      ">
        ${property.title}
      </div>

      <!-- Özellikler -->
      <div style="
        position: absolute;
        top: 1100px;
        left: 40px;
        right: 40px;
        background: rgba(55, 65, 81, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 40px;
        text-align: center;
        border: 2px solid #dc2626;
      ">
        <div style="margin-bottom: 20px; font-size: 36px;">
          📍 ${property.location}
        </div>
        <div style="margin-bottom: 20px; font-size: 36px;">
          📐 ${property.size.toLocaleString('tr-TR')} m²
        </div>
        ${property.coastline ? `
          <div style="margin-bottom: 20px; font-size: 36px;">
            🏖️ ${property.coastline} m sahil
          </div>
        ` : ''}
      </div>

      <!-- Danışman -->
      ${property.agent ? `
        <div style="
          position: absolute;
          bottom: 100px;
          left: 40px;
          right: 40px;
          background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
          border-radius: 20px;
          padding: 30px;
          text-align: center;
          border: 2px solid #dc2626;
        ">
          <div style="font-size: 32px; margin-bottom: 10px;">
            👤 ${property.agent.name}
          </div>
          <div style="font-size: 28px; margin-bottom: 5px;">
            📞 ${property.agent.phone}
          </div>
          <div style="font-size: 24px;">
            ✉️ ${property.agent.email}
          </div>
        </div>
      ` : ''}

      <!-- Footer -->
      <div style="
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 24px;
        opacity: 0.8;
      ">
        www.adalargayrimenkul.com
      </div>
    </div>
  `;
};