// Türkiye İl ve İlçe Verileri
export const turkeyData = {
  "01": {
    name: "Adana",
    districts: {
      "0101": "Aladağ",
      "0102": "Ceyhan",
      "0103": "Çukurova",
      "0104": "Feke",
      "0105": "İmamoğlu",
      "0106": "Karaisalı",
      "0107": "Karataş",
      "0108": "Kozan",
      "0109": "Pozantı",
      "0110": "Saimbeyli",
      "0111": "Sarıçam",
      "0112": "Seyhan",
      "0113": "Tufanbeyli",
      "0114": "Yumurtalık",
      "0115": "Yüreğir"
    }
  },
  "02": {
    name: "Adıyaman",
    districts: {
      "0201": "Besni",
      "0202": "Çelikhan",
      "0203": "Gerger",
      "0204": "Gölbaşı",
      "0205": "Kahta",
      "0206": "Merkez",
      "0207": "Samsat",
      "0208": "Sincik",
      "0209": "Tut"
    }
  },
  "03": {
    name: "Afyonkarahisar",
    districts: {
      "0301": "Başmakçı",
      "0302": "Bayat",
      "0303": "Bolvadin",
      "0304": "Çay",
      "0305": "Çobanlar",
      "0306": "Dazkırı",
      "0307": "Dinar",
      "0308": "Emirdağ",
      "0309": "Evciler",
      "0310": "Hocalar",
      "0311": "İhsaniye",
      "0312": "İscehisar",
      "0313": "Kızılören",
      "0314": "Merkez",
      "0315": "Sandıklı",
      "0316": "Sinanpaşa",
      "0317": "Sultandağı",
      "0318": "Şuhut"
    }
  },
  "34": {
    name: "İstanbul",
    districts: {
      "3401": "Adalar",
      "3402": "Arnavutköy",
      "3403": "Ataşehir",
      "3404": "Avcılar",
      "3405": "Bağcılar",
      "3406": "Bahçelievler",
      "3407": "Bakırköy",
      "3408": "Başakşehir",
      "3409": "Bayrampaşa",
      "3410": "Beşiktaş",
      "3411": "Beykoz",
      "3412": "Beylikdüzü",
      "3413": "Beyoğlu",
      "3414": "Büyükçekmece",
      "3415": "Çatalca",
      "3416": "Çekmeköy",
      "3417": "Esenler",
      "3418": "Esenyurt",
      "3419": "Eyüpsultan",
      "3420": "Fatih",
      "3421": "Gaziosmanpaşa",
      "3422": "Güngören",
      "3423": "Kadıköy",
      "3424": "Kağıthane",
      "3425": "Kartal",
      "3426": "Küçükçekmece",
      "3427": "Maltepe",
      "3428": "Pendik",
      "3429": "Sancaktepe",
      "3430": "Sarıyer",
      "3431": "Silivri",
      "3432": "Sultanbeyli",
      "3433": "Sultangazi",
      "3434": "Şile",
      "3435": "Şişli",
      "3436": "Tuzla",
      "3437": "Ümraniye",
      "3438": "Üsküdar",
      "3439": "Zeytinburnu"
    }
  },
  "06": {
    name: "Ankara",
    districts: {
      "0601": "Akyurt",
      "0602": "Altındağ",
      "0603": "Ayaş",
      "0604": "Bala",
      "0605": "Beypazarı",
      "0606": "Çamlıdere",
      "0607": "Çankaya",
      "0608": "Çubuk",
      "0609": "Elmadağ",
      "0610": "Etimesgut",
      "0611": "Evren",
      "0612": "Gölbaşı",
      "0613": "Güdül",
      "0614": "Haymana",
      "0615": "Kahramankazan",
      "0616": "Kalecik",
      "0617": "Keçiören",
      "0618": "Kızılcahamam",
      "0619": "Mamak",
      "0620": "Nallıhan",
      "0621": "Polatlı",
      "0622": "Pursaklar",
      "0623": "Sincan",
      "0624": "Şereflikoçhisar",
      "0625": "Yenimahalle"
    }
  }
};

// Mahalle verileri (örnek olarak birkaç ilçe için)
export const neighborhoods = {
  "3401": [ // Adalar
    "Büyükada Mah.",
    "Heybeliada Mah.",
    "Burgazada Mah.",
    "Kınalıada Mah.",
    "Sedefadası Mah."
  ],
  "3430": [ // Sarıyer
    "Ayazağa Mah.",
    "Bahçeköy Mah.",
    "Büyükdere Mah.",
    "Emirgan Mah.",
    "Ferahevler Mah.",
    "İstinye Mah.",
    "Kilyos Mah.",
    "Maslak Mah.",
    "Reşitpaşa Mah.",
    "Rumeli Kavağı Mah.",
    "Tarabya Mah.",
    "Yeniköy Mah.",
    "Zekeriyaköy Mah."
  ],
  "3423": [ // Kadıköy
    "19 Mayıs Mah.",
    "Acıbadem Mah.",
    "Bostancı Mah.",
    "Caferağa Mah.",
    "Caddebostan Mah.",
    "Erenköy Mah.",
    "Fenerbahçe Mah.",
    "Göztepe Mah.",
    "Hasanpaşa Mah.",
    "Koşuyolu Mah.",
    "Moda Mah.",
    "Osmanağa Mah.",
    "Rasimpaşa Mah.",
    "Suadiye Mah."
  ]
};

export const getAllProvinces = () => {
  return Object.entries(turkeyData).map(([code, data]) => ({
    code,
    name: data.name
  }));
};

export const getDistrictsByProvince = (provinceCode: string) => {
  const province = turkeyData[provinceCode as keyof typeof turkeyData];
  if (!province) return [];
  
  return Object.entries(province.districts).map(([code, name]) => ({
    code,
    name
  }));
};

export const getNeighborhoodsByDistrict = (districtCode: string) => {
  return neighborhoods[districtCode as keyof typeof neighborhoods] || [];
};