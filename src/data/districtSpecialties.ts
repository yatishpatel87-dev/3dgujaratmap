import { LocalizedText } from '../types/gujarat';

export type SpecialtyDioramaId =
  | 'ashramCharkha'
  | 'portContainerCrane'
  | 'dairyRevolution'
  | 'buddhistStupa'
  | 'ambajiHills'
  | 'cableBridge'
  | 'palitanaHill'
  | 'salangpurTemple'
  | 'mineralCrystals'
  | 'locomotiveTrain'
  | 'saputaraWaterfall'
  | 'dwarkaTemple'
  | 'akshardhamTemple'
  | 'somnathTemple'
  | 'oilRefinery'
  | 'girnarRopeway'
  | 'whiteRannBhunga'
  | 'dakorTemple'
  | 'dinosaurPark'
  | 'sunTemple'
  | 'clockTowerCeramic'
  | 'statueOfUnity'
  | 'dandiMemorial'
  | 'pavagadhFort'
  | 'raniKiVav'
  | 'kirtiMandir'
  | 'engineeringGear'
  | 'poloForest'
  | 'diamondBourse'
  | 'saltAndCotton'
  | 'hydroDam'
  | 'laxmiVilasPalace'
  | 'mangoOrchard'
  | 'seemaDarshan';

export interface DistrictSpecialtyMeta {
  dioramaId: SpecialtyDioramaId;
  accentColor: string;
  title: LocalizedText;
  subtitle: LocalizedText;
}

export const DISTRICT_SPECIALTIES: Record<string, DistrictSpecialtyMeta> = {
  ahmedabad: {
    dioramaId: 'ashramCharkha',
    accentColor: '#F59E0B',
    title: {
      gu: 'સાબરમતી આશ્રમ અને ચરખો',
      en: 'Sabarmati Ashram & Charkha',
      hi: 'साबरमती आश्रम और चरखा',
    },
    subtitle: {
      gu: 'યુનેસ્કો વર્લ્ડ હેરિટેજ શહેર',
      en: 'UNESCO World Heritage City',
      hi: 'यूनेस्को विश्व धरोहर शहर',
    },
  },
  amreli: {
    dioramaId: 'portContainerCrane',
    accentColor: '#38BDF8',
    title: {
      gu: 'પીપાવાવ બંદર',
      en: 'Pipavav Port & Coastal Hub',
      hi: 'पीपावाव बंदरगाह',
    },
    subtitle: {
      gu: 'બંદરીય વ્યાપાર અને મગફળી ઉત્પાદન',
      en: 'Maritime Trade & Groundnut Belt',
      hi: 'समुद्री व्यापार और मूंगफली क्षेत्र',
    },
  },
  anand: {
    dioramaId: 'dairyRevolution',
    accentColor: '#E0F2FE',
    title: {
      gu: 'અમૂલ ડેરી — શ્વેત ક્રાંતિ',
      en: 'Amul Dairy — White Revolution',
      hi: 'अमूल डेयरी — श्वेत क्रांति',
    },
    subtitle: {
      gu: 'ભારતની મિલ્ક કેપિટલ',
      en: 'Milk Capital of India',
      hi: 'भारत की मिल्क कैपिटल',
    },
  },
  aravalli: {
    dioramaId: 'buddhistStupa',
    accentColor: '#FBBF24',
    title: {
      gu: 'દેવની મોરી બૌદ્ધ સ્તૂપ અને શામળાજી',
      en: 'Devni Mori Stupa & Shamlaji',
      hi: 'देवनी मोरी बौद्ध स्तूप और शामलाजी',
    },
    subtitle: {
      gu: 'પ્રાચીન બૌદ્ધ સ્થાપત્ય અને ગિરિમાળા',
      en: 'Ancient Buddhist Heritage & Hills',
      hi: 'प्राचीन बौद्ध स्थापत्य और पर्वतमाला',
    },
  },
  banaskantha: {
    dioramaId: 'ambajiHills',
    accentColor: '#F59E0B',
    title: {
      gu: 'અંબાજી શક્તિપીઠ અને બનાસ ડેરી',
      en: 'Ambaji Shaktipeeth & Banas Dairy',
      hi: 'अंबाजी शक्तिपीठ और बनास डेयरी',
    },
    subtitle: {
      gu: 'ગબ્બર પર્વત અને બટાકા-ડેરી હબ',
      en: 'Gabbar Hills & Dairy Cooperative',
      hi: 'गब्बर पर्वत और डेयरी केंद्र',
    },
  },
  bharuch: {
    dioramaId: 'cableBridge',
    accentColor: '#60A5FA',
    title: {
      gu: 'નર્મદા કેબલ બ્રિજ અને અંકલેશ્વર',
      en: 'Narmada Bridge & Industrial Hub',
      hi: 'नर्मदा ब्रिज और औद्योगिक केंद्र',
    },
    subtitle: {
      gu: 'પ્રાચીન ભૃગુકચ્છ અને કેમિકલ કોરિડોર',
      en: 'Ancient Port & Chemical Corridor',
      hi: 'प्राचीन बंदरगाह और रसायन क्षेत्र',
    },
  },
  bhavnagar: {
    dioramaId: 'palitanaHill',
    accentColor: '#FDE68A',
    title: {
      gu: 'પાલિતાણા શેત્રુંજય જૈન તીર્થ',
      en: 'Palitana Shatrunjaya Jain Hills',
      hi: 'पालिताणा शत्रुंजय जैन तीर्थ',
    },
    subtitle: {
      gu: 'મંદિરોનું નગર અને અલંગ બંદર',
      en: 'City of Temples & Alang Yard',
      hi: 'मंदिरों का नगर और अलंग यार्ड',
    },
  },
  botad: {
    dioramaId: 'salangpurTemple',
    accentColor: '#FB923C',
    title: {
      gu: 'સાળંગપુર હનુમાનજી ધામ',
      en: 'Salangpur Dham & Cotton Hub',
      hi: 'सालंगपुर धाम और कपास केंद्र',
    },
    subtitle: {
      gu: 'તીર્થધામ, કપાસ અને હીરા ઉદ્યોગ',
      en: 'Pilgrimage, Cotton & Diamonds',
      hi: 'तीर्थधाम, कपास और हीरा उद्योग',
    },
  },
  'chhota-udaipur': {
    dioramaId: 'mineralCrystals',
    accentColor: '#34D399',
    title: {
      gu: 'ડોલોમાઇટ-ફ્લોરસ્પાર ખનિજ અને પીઠોરા',
      en: 'Fluorspar Minerals & Pithora Art',
      hi: 'फ्लोरस्पार खनिज और पिठोरा कला',
    },
    subtitle: {
      gu: 'ખનિજ સમૃદ્ધિ અને આદિવાસી કલા',
      en: 'Mineral Wealth & Tribal Heritage',
      hi: 'खनिज संपदा और आदिवासी कला',
    },
  },
  dahod: {
    dioramaId: 'locomotiveTrain',
    accentColor: '#F87171',
    title: {
      gu: 'રેલવે લોકોમોટિવ વર્કશોપ',
      en: 'Dahod Railway Locomotive Hub',
      hi: 'दाहोद रेलवे लोकोमोटिव वर्कशॉप',
    },
    subtitle: {
      gu: 'પૂર્વ ગુજરાતનું રેલવે અને વન પ્રવેશદ્વાર',
      en: 'Eastern Railway & Forest Gateway',
      hi: 'पूर्वी रेलवे और वन प्रवेशद्वार',
    },
  },
  dang: {
    dioramaId: 'saputaraWaterfall',
    accentColor: '#10B981',
    title: {
      gu: 'સાપુતારા અને ગીરા ધોધ',
      en: 'Saputara Hills & Gira Waterfall',
      hi: 'सापुतारा और गिरा जलप्रपात',
    },
    subtitle: {
      gu: '૧૦૦% પ્રાકૃતિક ખેતી અને વન પ્રદેશ',
      en: '100% Organic Forest District',
      hi: '100% जैविक वन जिला',
    },
  },
  'devbhumi-dwarka': {
    dioramaId: 'dwarkaTemple',
    accentColor: '#FBBF24',
    title: {
      gu: 'દ્વારકાધીશ જગત મંદિર',
      en: 'Dwarkadhish Jagat Mandir',
      hi: 'द्वारकाधीश जगत मंदिर',
    },
    subtitle: {
      gu: 'પવિત્ર ચાર ધામ અને સુદર્શન સેતુ',
      en: 'Char Dham & Sudarshan Setu',
      hi: 'पवित्र चार धाम और सुदर्शन सेतु',
    },
  },
  gandhinagar: {
    dioramaId: 'akshardhamTemple',
    accentColor: '#FCD34D',
    title: {
      gu: 'અક્ષરધામ અને ગ્રીન કેપિટલ',
      en: 'Akshardham & Green Capital',
      hi: 'अक्षरधाम और हरित राजधानी',
    },
    subtitle: {
      gu: 'ગુજરાતનું પાટનગર અને ગિફ્ટ સિટી',
      en: 'State Capital & GIFT City',
      hi: 'गुजरात की राजधानी और गिफ्ट सिटी',
    },
  },
  'gir-somnath': {
    dioramaId: 'somnathTemple',
    accentColor: '#F59E0B',
    title: {
      gu: 'સોમનાથ જ્યોતિર્લિંગ અને ગીર',
      en: 'Somnath Temple & Gir Lions',
      hi: 'सोमनाथ मंदिर और गिर के शेर',
    },
    subtitle: {
      gu: 'પ્રથમ જ્યોતિર્લિંગ અને એશિયાટિક સિંહ',
      en: 'First Jyotirlinga & Asiatic Lions',
      hi: 'प्रथम ज्योतिर्लिंग और एशियाई शेर',
    },
  },
  jamnagar: {
    dioramaId: 'oilRefinery',
    accentColor: '#F59E0B',
    title: {
      gu: 'વિશ્વની સૌથી મોટી રિફાઇનરી અને બ્રાસ',
      en: 'Mega Refinery & Brass City',
      hi: 'विश्व की सबसे बड़ी रिफाइनरी व ब्रास सिटी',
    },
    subtitle: {
      gu: 'પેટ્રોલિયમ રિફાઇનરી અને પિત્તળ ઉદ્યોગ',
      en: 'Petroleum Refining & Brass Parts',
      hi: 'पेट्रोलियम रिफाइनरी और पीतल उद्योग',
    },
  },
  junagadh: {
    dioramaId: 'girnarRopeway',
    accentColor: '#38BDF8',
    title: {
      gu: 'ગિરનાર પર્વત અને રોપ-વે',
      en: 'Mount Girnar & Ropeway',
      hi: 'गिरनार पर्वत और रोपवे',
    },
    subtitle: {
      gu: 'ગુજરાતનું સૌથી ઊંચું શિખર અને ઉપરકોટ',
      en: 'Gujarat’s Highest Peak & Uparkot',
      hi: 'गुजरात का सर्वोच्च शिखर और ऊपरकोट',
    },
  },
  kachchh: {
    dioramaId: 'whiteRannBhunga',
    accentColor: '#F8FAFC',
    title: {
      gu: 'સફેદ રણ, ભૂંગા અને ઊર્જા પાર્ક',
      en: 'White Rann, Bhunga & Solar Park',
      hi: 'सफेद रण, भुंगा और सौर पार्क',
    },
    subtitle: {
      gu: 'ભારતનો સૌથી મોટો જિલ્લો અને ધોળાવીરા',
      en: 'India’s Largest District & Dholavira',
      hi: 'भारत का सबसे बड़ा जिला और धोलावीरा',
    },
  },
  kheda: {
    dioramaId: 'dakorTemple',
    accentColor: '#FBBF24',
    title: {
      gu: 'ડાકોર રણછોડરાયજી મંદિર',
      en: 'Dakor Ranchhodraiji Temple',
      hi: 'डाकोर रणछोड़रायजी मंदिर',
    },
    subtitle: {
      gu: 'ચરોતર કૃષિ અને ખેડા સત્યાગ્રહ ભૂમિ',
      en: 'Charotar Plains & 1918 Satyagraha',
      hi: 'चरोतर कृषि और खेड़ा सत्याग्रह भूमि',
    },
  },
  mahisagar: {
    dioramaId: 'dinosaurPark',
    accentColor: '#A3E635',
    title: {
      gu: 'રૈયોલી ડાયનાસોર ફોસિલ પાર્ક',
      en: 'Raiyoli Dinosaur Fossil Park',
      hi: 'रैयोली डायनासोर जीवाश्म पार्क',
    },
    subtitle: {
      gu: 'રાજાસોરસ જીવાશ્મિ અને કડાણા બંધ',
      en: 'Rajasaurus Fossils & Kadana Dam',
      hi: 'राजासोरस जीवाश्म और कडाणा बांध',
    },
  },
  mehsana: {
    dioramaId: 'sunTemple',
    accentColor: '#F59E0B',
    title: {
      gu: 'મોઢેરા સૂર્ય મંદિર',
      en: 'Modhera Sun Temple',
      hi: 'मोढेरा सूर्य मंदिर',
    },
    subtitle: {
      gu: 'સોલંકી સ્થાપત્ય અને ઊંઝા મસાલા હબ',
      en: 'Solanki Heritage & Unjha Spices',
      hi: 'सोलंकी स्थापत्य और ऊंझा मसाला मंडी',
    },
  },
  morbi: {
    dioramaId: 'clockTowerCeramic',
    accentColor: '#38BDF8',
    title: {
      gu: 'સિરામિક કેપિટલ અને ઘડિયાળ ટાવર',
      en: 'Ceramic Capital & Clock Tower',
      hi: 'सिरेमिक राजधानी और घड़ी टावर',
    },
    subtitle: {
      gu: 'ટાઇલ્સ, ઘડિયાળ અને મણિમંદિર',
      en: 'Tiles, Wall Clocks & Mani Mandir',
      hi: 'टाइल्स, घड़ी उद्योग और मणि मंदिर',
    },
  },
  narmada: {
    dioramaId: 'statueOfUnity',
    accentColor: '#FB923C',
    title: {
      gu: 'સ્ટેચ્યુ ઓફ યુનિટી અને સરદાર સરોવર',
      en: 'Statue of Unity & Sardar Sarovar',
      hi: 'स्टैच्यू ऑफ यूनिटी और सरदार सरोवर',
    },
    subtitle: {
      gu: 'વિશ્વની સૌથી ઊંચી પ્રતિમા (૧૮૨ મી.)',
      en: 'World’s Tallest Statue (182 m)',
      hi: 'विश्व की सबसे ऊँची प्रतिमा (182 मी.)',
    },
  },
  navsari: {
    dioramaId: 'dandiMemorial',
    accentColor: '#E2E8F0',
    title: {
      gu: 'દાંડી મીઠા સત્યાગ્રહ સ્મારક',
      en: 'Dandi Salt Satyagraha Memorial',
      hi: 'दांडी नमक सत्याग्रह स्मारक',
    },
    subtitle: {
      gu: '૧૯૩૦ દાંડી કૂચ અને ગણદેવી ચીકુ',
      en: '1930 Salt March & Chikoo Orchards',
      hi: '1930 दांडी मार्च और चीकू बागान',
    },
  },
  panchmahal: {
    dioramaId: 'pavagadhFort',
    accentColor: '#F59E0B',
    title: {
      gu: 'ચાંપાનેર-પાવાગઢ (યુનેસ્કો હેરિટેજ)',
      en: 'Champaner-Pavagadh UNESCO Site',
      hi: 'चांपानेर-पावागढ़ यूनेस्को धरोहर',
    },
    subtitle: {
      gu: 'મહાકાળી મંદિર અને ઐતિહાસિક કિલ્લો',
      en: 'Hill Citadel & Archaeological Park',
      hi: 'पहाड़ी दुर्ग और पुरातत्व उद्यान',
    },
  },
  patan: {
    dioramaId: 'raniKiVav',
    accentColor: '#2DD4BF',
    title: {
      gu: 'રાણીની વાવ (યુનેસ્કો) અને પટોળા',
      en: 'Rani ki Vav & Patan Patola',
      hi: 'रानी की वाव और पाटण पटोला',
    },
    subtitle: {
      gu: 'સાત માળનું સ્થાપત્ય અને પટોળા વણાટ',
      en: 'UNESCO Stepwell & Silk Weaving',
      hi: 'यूनेस्को बावड़ी और पटोला बुनाई',
    },
  },
  porbandar: {
    dioramaId: 'kirtiMandir',
    accentColor: '#FDE047',
    title: {
      gu: 'કીર્તિ મંદિર — ગાંધી જન્મસ્થળ',
      en: 'Kirti Mandir — Gandhi Birthplace',
      hi: 'कीर्ति मंदिर — गांधी जन्मस्थान',
    },
    subtitle: {
      gu: 'મહાત્મા ગાંધી સ્મારક અને સુદામાપુરી',
      en: 'Mahatma Gandhi Heritage Site',
      hi: 'महात्मा गांधी स्मारक और सुदामापुरी',
    },
  },
  rajkot: {
    dioramaId: 'engineeringGear',
    accentColor: '#38BDF8',
    title: {
      gu: 'એન્જિનિયરિંગ-કાસ્ટિંગ અને મશીન ટૂલ્સ',
      en: 'Engineering & Machine Tools Hub',
      hi: 'इंजीनियरिंग और मशीन टूल्स हब',
    },
    subtitle: {
      gu: 'રંગીલું રાજકોટ અને ઔદ્યોગિક કેન્દ્ર',
      en: 'Saurashtra Industrial Capital',
      hi: 'सौराष्ट्र का प्रमुख औद्योगिक केंद्र',
    },
  },
  sabarkantha: {
    dioramaId: 'poloForest',
    accentColor: '#34D399',
    title: {
      gu: 'પોળો ફોરેસ્ટ અને ઇડરિયો ગઢ',
      en: 'Polo Forest & Idar Hill Fort',
      hi: 'पोलो फॉरेस्ट और ईडर का किला',
    },
    subtitle: {
      gu: 'પ્રાચીન મંદિર તોરણ અને વન સૌંદર્ય',
      en: 'Ancient Forest Temples & Crags',
      hi: 'प्राचीन वन मंदिर और पहाड़ियाँ',
    },
  },
  surat: {
    dioramaId: 'diamondBourse',
    accentColor: '#67E8F9',
    title: {
      gu: 'ડાયમંડ સિટી અને સિલ્ક સિટી',
      en: 'Diamond City & Silk City',
      hi: 'डायमंड सिटी और सिल्क सिटी',
    },
    subtitle: {
      gu: 'વિશ્વનું ૯૦% હીરા કટિંગ-પોલિશિંગ કેન્દ્ર',
      en: 'Global Diamond Polishing Hub',
      hi: 'विश्व का प्रमुख हीरा तराशने का केंद्र',
    },
  },
  surendranagar: {
    dioramaId: 'saltAndCotton',
    accentColor: '#F8FAFC',
    title: {
      gu: 'ખારાઘોડા મીઠું, કપાસ અને ચોટીલા',
      en: 'Kharaghoda Salt, Cotton & Chotila',
      hi: 'खाराघोड़ा नमक, कपास और चोटीला',
    },
    subtitle: {
      gu: 'ઝાલાવાડ અને તરણેતર લોકસંસ્કૃતિ',
      en: 'Inland Salt Pans & Cotton Belt',
      hi: 'नमक उत्पादन, कपास और तरणेतर मेला',
    },
  },
  tapi: {
    dioramaId: 'hydroDam',
    accentColor: '#38BDF8',
    title: {
      gu: 'ઉકાઈ બંધ (વલ્લભ સાગર)',
      en: 'Ukai Dam (Vallabh Sagar)',
      hi: 'उकाई बांध (वल्लभ सागर)',
    },
    subtitle: {
      gu: 'તાપી નદી જળવિદ્યુત અને સિંચાઈ બંધ',
      en: 'Major Hydroelectric Reservoir',
      hi: 'प्रमुख जलविद्युत एवं सिंचाई बांध',
    },
  },
  vadodara: {
    dioramaId: 'laxmiVilasPalace',
    accentColor: '#F59E0B',
    title: {
      gu: 'લક્ષ્મી વિલાસ પેલેસ — સંસ્કારી નગરી',
      en: 'Laxmi Vilas Palace — Cultural Hub',
      hi: 'लक्ष्मी विलास पैलेस — सांस्कृतिक नगरी',
    },
    subtitle: {
      gu: 'ભવ્ય ગાયકવાડ સ્થાપત્ય અને એમ.એસ.યુ.',
      en: 'Grand Gaekwad Palace & Education',
      hi: 'भव्य गायकवाड़ स्थापत्य और शिक्षा केंद्र',
    },
  },
  valsad: {
    dioramaId: 'mangoOrchard',
    accentColor: '#FBBF24',
    title: {
      gu: 'વલસાડી આફૂસ કેરી અને ઉદવાડા',
      en: 'Valsadi Alphonso Mango & Udvada',
      hi: 'वलसाडी हापुस आम और उदवाड़ा',
    },
    subtitle: {
      gu: 'કેરીના બગીચા અને પારસી પવિત્ર અગ્નિ',
      en: 'Mango Orchards & Sacred Flame',
      hi: 'हापुस आम बागान और उदवाड़ा तीर्थ',
    },
  },
  'vav-tharad': {
    dioramaId: 'seemaDarshan',
    accentColor: '#38BDF8',
    title: {
      gu: 'નડાબેટ સીમા દર્શન અને નર્મદા નહેર',
      en: 'Nadabet Seema Darshan & Canal',
      hi: 'नडाबेट सीमा दर्शन और नर्मदा नहर',
    },
    subtitle: {
      gu: 'ગુજરાતનો ૩૪મો જિલ્લો — દાડમ અને જીરું હબ',
      en: '34th District — Seema Darshan Hub',
      hi: '34वां जिला — सीमा दर्शन एवं कृषि केंद्र',
    },
  },
};
