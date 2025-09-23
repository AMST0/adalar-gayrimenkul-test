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
  // Yeni eklenen özellikler
  ada?: string;
  parsel?: string;
  tapuAlani?: number;
  nitelik?: string;
  mevkii?: string;
  zeminTipi?: string;
  pafta?: string;
}

const COMPANY_LOGO = 'https://i.hizliresim.com/rs5qoel.png';
const COMPANY_INFO = {
  name: 'Realty World - Adalar Gayrimenkul',
  address: 'Adalar, İstanbul',
  phone: '+90 555 123 45 67',
  website: 'www.adalargayrimenkul.com',
  email: 'info@adalargayrimenkul.com'
};

// Görsel yükleyici yardımcı fonksiyonu
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

// PDF Raporu Oluştur - Yeni Tasarım
export const generatePropertyPDF = async (property: PropertyForShare): Promise<void> => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 20;
      pdf.addImage(logoImg, 'PNG', logoX, 10, logoWidth, logoHeight);
    } catch (error) {
      console.warn('Logo yüklenemedi, metin ile devam ediliyor');
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ADALAR GAYRİMENKUL', pageWidth / 2, 20, { align: 'center' });
    }

    let yPosition = 40;

    // Başlık
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text(property.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Fiyat
    pdf.setFontSize(16);
    pdf.setTextColor(220, 38, 127); // Pink color
    const formattedPrice = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price);
    pdf.text(formattedPrice, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    pdf.setTextColor(0, 0, 0); // Reset to black

    // Ana görsel ekle
    if (property.images && property.images.length > 0) {
      try {
        const mainImg = new Image();
        mainImg.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          mainImg.onload = resolve;
          mainImg.onerror = reject;
          mainImg.src = property.images[0];
        });

        const maxWidth = pageWidth - 20;
        const maxHeight = 80;
        const imgAspectRatio = mainImg.width / mainImg.height;
        
        let imgWidth = maxWidth;
        let imgHeight = imgWidth / imgAspectRatio;
        
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * imgAspectRatio;
        }

        const imgX = (pageWidth - imgWidth) / 2;
        pdf.addImage(mainImg, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.warn('Ana görsel yüklenemedi');
      }
    }

    // Özellikler
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ÖZELLİKLER', 10, yPosition);
    yPosition += 10;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    const properties = [
      ['Konum:', property.location],
      ['Büyüklük:', `${property.size.toLocaleString('tr-TR')} m²`],
      ['Tür:', property.property_type],
      ['İmar Durumu:', property.zoning || 'Belirtilmemiş'],
      ['Sahil:', property.coastline ? `${property.coastline} m` : 'Yok'],
      ['Ada:', property.island || 'Belirtilmemiş'],
      ['Tapu Durumu:', property.deed_status || 'Belirtilmemiş'],
      ['Elektrik:', property.electricity ? 'Var' : 'Yok'],
      ['Su:', property.water ? 'Var' : 'Yok'],
      ['Yol:', property.road_access ? 'Var' : 'Yok']
    ];

    properties.forEach(([key, value]) => {
      if (value && value !== 'Belirtilmemiş' && value !== 'Yok') {
        pdf.setFont('helvetica', 'bold');
        pdf.text(key, 10, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(String(value), 60, yPosition);
        yPosition += 7;
      }
    });

    yPosition += 10;

    // Açıklama
    if (property.description) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AÇIKLAMA', 10, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const splitDescription = pdf.splitTextToSize(property.description, pageWidth - 20);
      pdf.text(splitDescription, 10, yPosition);
      yPosition += splitDescription.length * 5 + 10;
    }

    // Danışman bilgileri
    if (property.agent) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DANIŞMAN BİLGİLERİ', 10, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Ad Soyad:', 10, yPosition);
      pdf.text(String(property.agent.name), 60, yPosition);
      yPosition += 7;

      pdf.text('Telefon:', 10, yPosition);
      pdf.text(String(property.agent.phone), 60, yPosition);
      yPosition += 7;

      pdf.text('E-posta:', 10, yPosition);
      pdf.text(String(property.agent.email), 60, yPosition);
      yPosition += 7;
    }

    // Footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Adalar Gayrimenkul - www.adalargayrimenkul.com', pageWidth / 2, footerY, { align: 'center' });

    // PDF'i indir
    pdf.save(`${property.title.replace(/[^a-zA-Z0-9]/g, '_')}_rapor.pdf`);
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