const fs = require('fs');
const path = require('path');
const locales = ['en', 'fr', 'ar'];

const additions = {
  en: {
    Home: {
      heroBadge: "Tunisia's #1 Peer-to-Peer Car Rental",
      heroTitle1: "Rent a Car,",
      heroTitle2: "Your Way.",
      heroSubtitle: "Browse hundreds of cars from trusted local owners. Fast, affordable, and flexible car rental across Tunisia.",
      browseBtn: "Browse Cars Now",
      listBtn: "List Your Car",
      trustVerified: "Verified Owners",
      trustRating: "4.9 avg rating",
      trustRenters: "2,000+ renters",
      statCars: "Listed Cars",
      statRenters: "Happy Renters",
      statCities: "Cities",
      statRating: "Avg Rating",
      whyLabel: "Why Karhba",
      featuresTitle1: "Built for the way",
      featuresTitle2: "you move",
      featuresSubtitle: "The smartest way to rent or list a car in Tunisia.",
      feat1Title: "Wide Selection",
      feat1Desc: "From economy to luxury, find the perfect car for any occasion across Tunisia.",
      feat2Title: "Safe & Secure",
      feat2Desc: "All owners are verified and every rental is covered by our protection policy.",
      feat3Title: "Nationwide Coverage",
      feat3Desc: "Available in Tunis, Sfax, Sousse, and 25+ other cities.",
      feat4Title: "Instant Booking",
      feat4Desc: "Book in minutes and get confirmation immediately from the car owner.",
      ctaTitle: "Ready to hit the road?",
      ctaSubtitle: "Join thousands of Tunisians already using Karhba for smarter, easier car rental.",
      ctaStart: "Get Started Free",
      ctaBrowse: "Browse Cars"
    },
    Profile: {
      title: "Profile",
      settings: "Settings",
      subtitle: "Manage your fleet and account info",
      fullName: "Full Name",
      ownerName: "Owner Name",
      email: "Email Address",
      accountType: "Account Type",
      accountDesc: "Car Owner / Rental Business",
      readyEarn: "Ready to start earning? Upload your first car to Karhba and reach thousands of renters.",
      addFirst: "Add Your First Car"
    },
    Stats: {
      backDash: "Back to Dashboard",
      title: "Business Statistics",
      subtitle: "Detailed overview of your rental business performance.",
      revenue: "Total Revenue",
      days: "Total Days Rented",
      avgPrice: "Avg. Price / Day",
      trips: "Completed Trips",
      breakdown: "Booking Status Breakdown",
      accepted: "Accepted / Completed",
      pending: "Pending Requests",
      cancelled: "Cancelled / Rejected",
      tnd: "TND",
      daysSuffix: "days"
    }
  },
  fr: {
    Home: {
      heroBadge: "Le n°1 de la location de voitures entre particuliers en Tunisie",
      heroTitle1: "Louez une voiture,",
      heroTitle2: "À votre façon.",
      heroSubtitle: "Parcourez des centaines de voitures de propriétaires locaux de confiance. Location rapide, abordable et flexible dans toute la Tunisie.",
      browseBtn: "Parcourir les voitures",
      listBtn: "Ajouter votre voiture",
      trustVerified: "Propriétaires vérifiés",
      trustRating: "Note moyenne 4.9",
      trustRenters: "2 000+ locataires",
      statCars: "Voitures listées",
      statRenters: "Locataires satisfaits",
      statCities: "Villes",
      statRating: "Note moyenne",
      whyLabel: "Pourquoi Karhba",
      featuresTitle1: "Conçu pour votre façon",
      featuresTitle2: "de vous déplacer",
      featuresSubtitle: "La façon la plus intelligente de louer ou de lister une voiture en Tunisie.",
      feat1Title: "Large Sélection",
      feat1Desc: "De l'économique au luxe, trouvez la voiture parfaite pour chaque occasion en Tunisie.",
      feat2Title: "Sûr et Sécurisé",
      feat2Desc: "Tous les propriétaires sont vérifiés et chaque location est couverte par notre politique de protection.",
      feat3Title: "Couverture Nationale",
      feat3Desc: "Disponible à Tunis, Sfax, Sousse et dans plus de 25 autres villes.",
      feat4Title: "Réservation Instantanée",
      feat4Desc: "Réservez en quelques minutes et obtenez une confirmation immédiate du propriétaire.",
      ctaTitle: "Prêt à prendre la route ?",
      ctaSubtitle: "Rejoignez des milliers de Tunisiens qui utilisent déjà Karhba pour une location plus intelligente et plus facile.",
      ctaStart: "Commencer Gratuitement",
      ctaBrowse: "Parcourir les voitures"
    },
    Profile: {
      title: "Profil",
      settings: "Paramètres",
      subtitle: "Gérez votre flotte et les informations de votre compte",
      fullName: "Nom complet",
      ownerName: "Nom du propriétaire",
      email: "Adresse e-mail",
      accountType: "Type de compte",
      accountDesc: "Propriétaire de voiture / Entreprise de location",
      readyEarn: "Prêt à commencer à gagner ? Ajoutez votre première voiture sur Karhba et touchez des milliers de locataires.",
      addFirst: "Ajouter votre première voiture"
    },
    Stats: {
      backDash: "Retour au tableau de bord",
      title: "Statistiques de l'entreprise",
      subtitle: "Aperçu détaillé des performances de votre entreprise de location.",
      revenue: "Revenus totaux",
      days: "Total des jours loués",
      avgPrice: "Prix moyen / Jour",
      trips: "Trajets terminés",
      breakdown: "Répartition du statut des réservations",
      accepted: "Accepté / Terminé",
      pending: "Demandes en attente",
      cancelled: "Annulé / Refusé",
      tnd: "TND",
      daysSuffix: "jours"
    }
  },
  ar: {
    Home: {
      heroBadge: "رقم 1 في تأجير السيارات بين الأفراد في تونس",
      heroTitle1: "استأجر سيارة،",
      heroTitle2: "على طريقتك.",
      heroSubtitle: "تصفح مئات السيارات من ملاك محليين موثوقين. تأجير سريع، بأسعار معقولة، ومرن في جميع أنحاء تونس.",
      browseBtn: "تصفح السيارات الآن",
      listBtn: "أضف سيارتك",
      trustVerified: "ملاك تم التحقق منهم",
      trustRating: "متوسط التقييم 4.9",
      trustRenters: "+2,000 مستأجر",
      statCars: "السيارات المدرجة",
      statRenters: "مستأجرين سعداء",
      statCities: "المدن",
      statRating: "متوسط التقييم",
      whyLabel: "لماذا كرهبة",
      featuresTitle1: "مصمم لطريقة",
      featuresTitle2: "تنقلك",
      featuresSubtitle: "أذكى طريقة لاستئجار أو إضافة سيارة في تونس.",
      feat1Title: "تشكيلة واسعة",
      feat1Desc: "من الاقتصادية إلى الفاخرة، ابحث عن السيارة المثالية لأي مناسبة في جميع أنحاء تونس.",
      feat2Title: "آمن وموثوق",
      feat2Desc: "تم التحقق من جميع الملاك وتغطية كل إيجار بسياستنا للحماية.",
      feat3Title: "تغطية وطنية",
      feat3Desc: "متوفر في تونس، صفاقس، سوسة وأكثر من 25 مدينة أخرى.",
      feat4Title: "حجز فوري",
      feat4Desc: "احجز في دقائق واحصل على تأكيد فوري من مالك السيارة.",
      ctaTitle: "مستعد للانطلاق؟",
      ctaSubtitle: "انضم إلى آلاف التونسيين الذين يستخدمون كرهبة بالفعل لتأجير أذكى وأسهل.",
      ctaStart: "ابدأ مجاناً",
      ctaBrowse: "تصفح السيارات"
    },
    Profile: {
      title: "الملف الشخصي",
      settings: "الإعدادات",
      subtitle: "إدارة أسطولك ومعلومات حسابك",
      fullName: "الاسم الكامل",
      ownerName: "اسم المالك",
      email: "البريد الإلكتروني",
      accountType: "نوع الحساب",
      accountDesc: "مالك سيارة / شركة تأجير",
      readyEarn: "مستعد للبدء في الربح؟ أضف سيارتك الأولى إلى كرهبة وتواصل مع آلاف المستأجرين.",
      addFirst: "أضف سيارتك الأولى"
    },
    Stats: {
      backDash: "العودة إلى لوحة القيادة",
      title: "إحصائيات الأعمال",
      subtitle: "نظرة عامة مفصلة على أداء عملك في التأجير.",
      revenue: "إجمالي الأرباح",
      days: "إجمالي الأيام المؤجرة",
      avgPrice: "متوسط السعر / اليوم",
      trips: "الرحلات المكتملة",
      breakdown: "تفصيل حالة الحجوزات",
      accepted: "مقبول / مكتمل",
      pending: "الطلبات المعلقة",
      cancelled: "ملغى / مرفوض",
      tnd: "دينار",
      daysSuffix: "أيام"
    }
  }
};

locales.forEach(locale => {
  const filePath = path.join(__dirname, 'messages', locale + '.json');
  let data = {};
  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  data.Home = { ...data.Home, ...additions[locale].Home };
  data.Profile = { ...data.Profile, ...additions[locale].Profile };
  data.Stats = { ...data.Stats, ...additions[locale].Stats };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Updated ' + locale + '.json');
});
