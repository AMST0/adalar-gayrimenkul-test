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

// PDF Raporu Oluştur
export const generatePropertyPDF = async (property: PropertyForShare): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - margin * 2;
    const leftColX = margin;
    const rightColX = pageWidth / 2 + 2; // small gutter

    // Arka plan bantları / modern vurgu
    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.rect(0, 0, pageWidth, 30, 'F');
    pdf.setFillColor(15, 23, 42); // slate-900 footer bar
    pdf.rect(0, pageHeight - 18, pageWidth, 18, 'F');

    // Logo veya başlık
    let logoLoaded = false;
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = COMPANY_LOGO;
      await new Promise((res, rej) => { logoImg.onload = res; logoImg.onerror = rej; });
      pdf.addImage(logoImg, 'PNG', margin, 8, 28, 14);
      logoLoaded = true;
    } catch { /* ignore */ }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 38); // red-600
    pdf.text('ARSA DEĞER / BİLGİ RAPORU', logoLoaded ? margin + 34 : margin, 14);
    pdf.setFontSize(10);
    pdf.setTextColor(71, 85, 105); // slate-500
    pdf.text(new Date().toLocaleDateString('tr-TR'), logoLoaded ? margin + 34 : margin, 21);

    // Baş ana görsel (sol kolon üst)
    let currentYLeft = 36;
    if (property.images && property.images[0]) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = property.images[0];
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        const targetW = (contentWidth / 2) - 4;
        const maxH = 55;
        let w = targetW; let h = w * (img.height / img.width);
        if (h > maxH) { h = maxH; w = h * (img.width / img.height); }
        pdf.setDrawColor(226, 232, 240); // border
        pdf.roundedRect(leftColX, currentYLeft, targetW, h, 2, 2, 'S');
        const imgX = leftColX + (targetW - w) / 2;
        const imgY = currentYLeft + (h - h) / 2;
        pdf.addImage(img, 'JPEG', imgX, imgY, w, h);
        currentYLeft += h + 6;
      } catch {
        // ignore image fail
      }
    }

    // Özellik başlığı
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 41, 59); // slate-800
    pdf.text('ÖZET BİLGİLER', leftColX, currentYLeft);
    currentYLeft += 6;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);

    const infoPairs: [string,string][] = [
      ['Başlık', property.title],
      ['Konum', property.location],
      ['Büyüklük', `${property.size?.toLocaleString('tr-TR')} m²`],
      ['Tür', property.property_type],
      ['İmar', property.zoning || '—'],
  ['Ada', property.island || '—'],
      ['Yol', property.road_access ? 'Var' : 'Yok'],
      ['Elektrik', property.electricity ? 'Var' : 'Yok'],
      ['Su', property.water ? 'Var' : 'Yok'],
    ];
    infoPairs.forEach(([k,v]) => {
      pdf.setFont('helvetica','bold');
      pdf.text(`${k}:`, leftColX, currentYLeft);
      pdf.setFont('helvetica','normal');
      pdf.text(String(v), leftColX + 28, currentYLeft);
      currentYLeft += 5;
    });

    // Fiyat kartı
    const formattedPrice = new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:0}).format(property.price);
    pdf.setFillColor(248, 250, 252); // slate-50
    pdf.roundedRect(leftColX, currentYLeft + 2, (contentWidth/2)-4, 16, 2, 2, 'F');
    pdf.setFont('helvetica','bold');
    pdf.setTextColor(185, 28, 28); // red-700
    pdf.setFontSize(14);
    pdf.text(formattedPrice, leftColX + 4, currentYLeft + 13);
    currentYLeft += 24;

    // Danışman bilgileri (sol alt blok)
    if (property.agent) {
      pdf.setFontSize(11);
      pdf.setTextColor(30,41,59);
      pdf.setFont('helvetica','bold');
      pdf.text('DANIŞMAN', leftColX, currentYLeft);
      currentYLeft += 6;
      pdf.setFontSize(9);
      pdf.setFont('helvetica','normal');
      pdf.text(property.agent.name, leftColX, currentYLeft); currentYLeft += 5;
      pdf.text(property.agent.phone, leftColX, currentYLeft); currentYLeft += 5;
      pdf.text(property.agent.email, leftColX, currentYLeft); currentYLeft += 8;
    }

    // Sağ kolon: Açıklama ve ek detaylar
    let currentYRight = 36;
    pdf.setFont('helvetica','bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30,41,59);
    pdf.text('AÇIKLAMA', rightColX, currentYRight);
    currentYRight += 6;
    pdf.setFont('helvetica','normal');
    pdf.setFontSize(9);
    pdf.setTextColor(55,65,81);
    if (property.description) {
      const wrapped = pdf.splitTextToSize(property.description, (contentWidth/2)-6);
      pdf.text(wrapped, rightColX, currentYRight);
      currentYRight += wrapped.length * 4 + 6;
    } else {
      pdf.text('Açıklama bulunmuyor.', rightColX, currentYRight);
      currentYRight += 10;
    }

    // Ek teknik satırlar (varsa)
    const extra: [string,string|undefined][] = [
      ['Tapu', property.deed_status],
      ['Sahil', property.coastline ? `${property.coastline} m` : undefined]
    ];
    extra.forEach(([k,v])=>{
      if(!v) return;
      pdf.setFont('helvetica','bold'); pdf.text(`${k}:`, rightColX, currentYRight);
      pdf.setFont('helvetica','normal'); pdf.text(String(v), rightColX + 24, currentYRight); currentYRight += 5;
    });

    // Alt açıklama / footer metni
    pdf.setFontSize(7);
    pdf.setFont('helvetica','normal');
    pdf.setTextColor(241,245,249); // very light for dark bar contrast
    pdf.text('Adalar Gayrimenkul • www.adalargayrimenkul.com • Bu rapor bilgilendirme amaçlıdır.', pageWidth/2, pageHeight-10, { align:'center' });

    pdf.save(`${property.title.replace(/[^a-zA-Z0-9]/g,'_')}_rapor.pdf`);
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