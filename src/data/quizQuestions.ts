import { DISTRICTS_DB, DISTRICT_BY_ID } from './districtsDatabase';
import { QuizDifficulty, QuizMode, QuizQuestion } from '../types/gujarat';

export const STATIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 1. District Identification
  {
    id: 'q-id-1',
    mode: 'identification',
    difficulty: 'easy',
    districtId: 'kachchh',
    question: {
      gu: 'ગુજરાતનો સૌથી મોટો જિલ્લો કયો છે?',
      en: 'Which is the largest district of Gujarat by area?',
      hi: 'क्षेत्रफल की दृष्टि से गुजरात का सबसे बड़ा जिला कौन सा है?',
    },
    options: [
      { gu: 'અમદાવાદ', en: 'Ahmedabad', hi: 'अहमदाबाद' },
      { gu: 'કચ્છ', en: 'Kachchh', hi: 'कच्छ' },
      { gu: 'સુરત', en: 'Surat', hi: 'सूरत' },
      { gu: 'રાજકોટ', en: 'Rajkot', hi: 'राजकोट' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'કચ્છ 45,674 ચો.કિ.મી. વિસ્તાર સાથે ગુજરાત અને ભારતનો સૌથી મોટો જિલ્લો છે.',
      en: 'Kachchh is the largest district in Gujarat and India, covering 45,674 sq. km.',
      hi: 'कच्छ 45,674 वर्ग किमी क्षेत्रफल के साथ गुजरात और भारत का सबसे बड़ा जिला है।',
    },
  },
  {
    id: 'q-id-2',
    mode: 'identification',
    difficulty: 'easy',
    districtId: 'dang',
    question: {
      gu: 'ક્ષેત્રફળની દ્રષ્ટિએ ગુજરાતનો સૌથી નાનો જિલ્લો કયો છે?',
      en: 'Which is the smallest district of Gujarat by area?',
      hi: 'क्षेत्रफल की दृष्टि से गुजरात का सबसे छोटा जिला कौन सा है?',
    },
    options: [
      { gu: 'નવસારી', en: 'Navsari', hi: 'नवसारी' },
      { gu: 'પોરબંદર', en: 'Porbandar', hi: 'पोरबंदर' },
      { gu: 'ડાંગ', en: 'Dang', hi: 'डांग' },
      { gu: 'ગાંધીનગર', en: 'Gandhinagar', hi: 'गांधीनगर' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'ડાંગ 1,764 ચો.કિ.મી. વિસ્તાર સાથે ગુજરાતનો સૌથી નાનો જિલ્લો છે; તેનું મુખ્ય મથક આહવા છે.',
      en: 'Dang is the smallest district in Gujarat (1,764 sq. km) with Ahwa as its headquarters.',
      hi: 'डांग 1,764 वर्ग किमी क्षेत्रफल के साथ गुजरात का सबसे छोटा जिला है, जिसका मुख्यालय आहवा है।',
    },
  },
  {
    id: 'q-id-3',
    mode: 'identification',
    difficulty: 'medium',
    districtId: 'vav-tharad',
    question: {
      gu: 'બનાસકાંઠામાંથી વિભાજન કરીને રચાયેલો ગુજરાતનો 34મો જિલ્લો કયો છે?',
      en: 'Which is Gujarat’s 34th district carved out of Banaskantha?',
      hi: 'बनासकांठा से अलग होकर बना गुजरात का 34वां जिला कौन सा है?',
    },
    options: [
      { gu: 'પાટણ', en: 'Patan', hi: 'पाटण' },
      { gu: 'વાવ-થરાદ', en: 'Vav-Tharad', hi: 'वाव-थराद' },
      { gu: 'અરવલ્લી', en: 'Aravalli', hi: 'अरावली' },
      { gu: 'મહીસાગર', en: 'Mahisagar', hi: 'महीसागर' },
    ],
    correctIndex: 1,
    explanation: {
      gu: '1 જાન્યુઆરી 2025ના રોજ બનાસકાંઠામાંથી વાવ-થરાદ જિલ્લો બન્યો, જેનું મુખ્ય મથક થરાદ છે.',
      en: 'Vav-Tharad was formed on 1 January 2025 from Banaskantha, with Tharad as its headquarters.',
      hi: '1 जनवरी 2025 को बनासकांठा से वाव-थराद जिला बनाया गया, जिसका मुख्यालय थराद है।',
    },
  },
  {
    id: 'q-id-4',
    mode: 'identification',
    difficulty: 'easy',
    districtId: 'gandhinagar',
    question: {
      gu: 'ગુજરાત રાજ્યનું પાટનગર કયા જિલ્લામાં આવેલું છે?',
      en: 'Which district houses the state capital of Gujarat?',
      hi: 'गुजरात राज्य की राजधानी किस जिले में स्थित है?',
    },
    options: [
      { gu: 'અમદાવાદ', en: 'Ahmedabad', hi: 'अहमदाबाद' },
      { gu: 'વડોદરા', en: 'Vadodara', hi: 'वडोदरा' },
      { gu: 'ગાંધીનગર', en: 'Gandhinagar', hi: 'गांधीनगर' },
      { gu: 'સુરત', en: 'Surat', hi: 'सूरत' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'ગાંધીનગર સાબરમતી નદીના કિનારે આવેલું ગુજરાતનું આયોજિત પાટનગર છે.',
      en: 'Gandhinagar is Gujarat’s planned capital city located along the Sabarmati River.',
      hi: 'गांधीनगर साबरमती नदी के किनारे स्थित गुजरात की सुनियोजित राजधानी है।',
    },
  },
  {
    id: 'q-id-5',
    mode: 'identification',
    difficulty: 'medium',
    districtId: 'ahmedabad',
    question: {
      gu: 'ભારતનું પ્રથમ યુનેસ્કો વર્લ્ડ હેરિટેજ શહેર કયા જિલ્લામાં આવેલું છે?',
      en: 'India’s first UNESCO World Heritage City is located in which district?',
      hi: 'भारत का पहला यूनेस्को विश्व धरोहर शहर किस जिले में स्थित है?',
    },
    options: [
      { gu: 'પાટણ', en: 'Patan', hi: 'पाटण' },
      { gu: 'વડોદરા', en: 'Vadodara', hi: 'वडोदरा' },
      { gu: 'જૂનાગઢ', en: 'Junagadh', hi: 'जूनागढ़' },
      { gu: 'અમદાવાદ', en: 'Ahmedabad', hi: 'अहमदाबाद' },
    ],
    correctIndex: 3,
    explanation: {
      gu: 'ઐતિહાસિક અમદાવાદ શહેરને 2017માં ભારતનું પ્રથમ યુનેસ્કો વર્લ્ડ હેરિટેજ શહેર જાહેર કરવામાં આવ્યું હતું.',
      en: 'The Historic City of Ahmedabad became India’s first UNESCO World Heritage City in 2017.',
      hi: 'ऐतिहासिक अहमदाबाद शहर को 2017 में भारत का पहला यूनेस्को विश्व धरोहर शहर घोषित किया गया था।',
    },
  },

  // 2. District Headquarters
  {
    id: 'q-hq-1',
    mode: 'headquarters',
    difficulty: 'easy',
    districtId: 'kachchh',
    question: {
      gu: 'કચ્છ જિલ્લાનું મુખ્ય મથક કયું છે?',
      en: 'What is the district headquarters of Kachchh?',
      hi: 'कच्छ जिले का मुख्यालय कौन सा है?',
    },
    options: [
      { gu: 'માંડવી', en: 'Mandvi', hi: 'मांडवी' },
      { gu: 'ગાંધીધામ', en: 'Gandhidham', hi: 'गांधीधाम' },
      { gu: 'ભુજ', en: 'Bhuj', hi: 'भुज' },
      { gu: 'અંજાર', en: 'Anjar', hi: 'अंजार' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'કચ્છ જિલ્લાનું વહીવટી મુખ્ય મથક ભુજ છે.',
      en: 'Bhuj is the administrative headquarters of Kachchh district.',
      hi: 'कच्छ जिले का प्रशासनिक मुख्यालय भुज है।',
    },
  },
  {
    id: 'q-hq-2',
    mode: 'headquarters',
    difficulty: 'medium',
    districtId: 'aravalli',
    question: {
      gu: 'અરવલ્લી જિલ્લાનું મુખ્ય મથક કયું છે?',
      en: 'Which town is the headquarters of Aravalli district?',
      hi: 'अरावली जिले का मुख्यालय कौन सा नगर है?',
    },
    options: [
      { gu: 'શામળાજી', en: 'Shamlaji', hi: 'शामलाजी' },
      { gu: 'મોડાસા', en: 'Modasa', hi: 'मोडासा' },
      { gu: 'ભિલોડા', en: 'Bhiloda', hi: 'भिलोड़ा' },
      { gu: 'બાયડ', en: 'Bayad', hi: 'बायड' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'મોડાસા અરવલ્લી જિલ્લાનું મુખ્ય મથક છે.',
      en: 'Modasa serves as the headquarters of Aravalli district.',
      hi: 'मोडासा अरावली जिले का मुख्यालय है।',
    },
  },
  {
    id: 'q-hq-3',
    mode: 'headquarters',
    difficulty: 'medium',
    districtId: 'gir-somnath',
    question: {
      gu: 'ગીર સોમનાથ જિલ્લાનું મુખ્ય મથક કયું છે?',
      en: 'What is the headquarters of Gir Somnath district?',
      hi: 'गिर सोमनाथ जिले का मुख्यालय कहाँ है?',
    },
    options: [
      { gu: 'ઉના', en: 'Una', hi: 'उना' },
      { gu: 'કોડીનાર', en: 'Kodinar', hi: 'कोडिनार' },
      { gu: 'વેરાવળ', en: 'Veraval', hi: 'वेरावल' },
      { gu: 'તાલાલા', en: 'Talala', hi: 'तालाळा' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'વેરાવળ ગીર સોમનાથ જિલ્લાનું મુખ્ય મથક અને મહત્ત્વનું મત્સ્ય બંદર છે.',
      en: 'Veraval is the headquarters of Gir Somnath district and a major fishing port.',
      hi: 'वेरावल गिर सोमनाथ जिले का मुख्यालय और प्रमुख मत्स्य बंदरगाह है।',
    },
  },
  {
    id: 'q-hq-4',
    mode: 'headquarters',
    difficulty: 'medium',
    districtId: 'devbhumi-dwarka',
    question: {
      gu: 'દેવભૂમિ દ્વારકા જિલ્લાનું મુખ્ય મથક કયું છે?',
      en: 'What is the headquarters of Devbhumi Dwarka district?',
      hi: 'देवभूमि द्वारका जिले का मुख्यालय कौन सा है?',
    },
    options: [
      { gu: 'દ્વારકા', en: 'Dwarka', hi: 'द्वारका' },
      { gu: 'ખંભાળિયા', en: 'Khambhalia', hi: 'खंभालिया' },
      { gu: 'ઓખા', en: 'Okha', hi: 'ओखा' },
      { gu: 'ભાણવડ', en: 'Bhanvad', hi: 'भाणवड' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'દેવભૂમિ દ્વારકા જિલ્લાનું વહીવટી મુખ્ય મથક ખંભાળિયા છે.',
      en: 'Khambhalia is the administrative headquarters of Devbhumi Dwarka district.',
      hi: 'देवभूमि द्वारका जिले का प्रशासनिक मुख्यालय खंभालिया है।',
    },
  },
  {
    id: 'q-hq-5',
    mode: 'headquarters',
    difficulty: 'hard',
    districtId: 'mahisagar',
    question: {
      gu: 'મહીસાગર જિલ્લાનું મુખ્ય મથક કયું છે?',
      en: 'Which town is the headquarters of Mahisagar district?',
      hi: 'महीसागर जिले का मुख्यालय कौन सा है?',
    },
    options: [
      { gu: 'સંતરામપુર', en: 'Santrampur', hi: 'संतरामपुर' },
      { gu: 'બાલાસિનોર', en: 'Balasinor', hi: 'बालासिनोर' },
      { gu: 'કડાણા', en: 'Kadana', hi: 'कडाणा' },
      { gu: 'લુણાવાડા', en: 'Lunawada', hi: 'लूणावाड़ा' },
    ],
    correctIndex: 3,
    explanation: {
      gu: 'લુણાવાડા મહીસાગર જિલ્લાનું મુખ્ય મથક છે.',
      en: 'Lunawada is the district headquarters of Mahisagar.',
      hi: 'लूणावाड़ा महीसागर जिले का मुख्यालय है।',
    },
  },
  {
    id: 'q-hq-6',
    mode: 'headquarters',
    difficulty: 'hard',
    districtId: 'kheda',
    question: {
      gu: 'ખેડા જિલ્લાનું મુખ્ય મથક કયું છે?',
      en: 'What is the headquarters of Kheda district?',
      hi: 'खेड़ा जिले का मुख्यालय कौन सा है?',
    },
    options: [
      { gu: 'ડાકોર', en: 'Dakor', hi: 'डाकोर' },
      { gu: 'કપડવંજ', en: 'Kapadvanj', hi: 'कपड़वंज' },
      { gu: 'નડિયાદ', en: 'Nadiad', hi: 'नडियाद' },
      { gu: 'મહેમદાવાદ', en: 'Mehmedabad', hi: 'महमदाबाद' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'નડિયાદ ખેડા જિલ્લાનું વહીવટી મુખ્ય મથક છે.',
      en: 'Nadiad is the headquarters of Kheda district.',
      hi: 'नडियाद खेड़ा जिले का मुख्यालय है।',
    },
  },

  // 3. River Identification
  {
    id: 'q-riv-1',
    mode: 'rivers',
    difficulty: 'easy',
    districtId: 'narmada',
    question: {
      gu: 'સરદાર સરોવર બંધ કઈ નદી પર અને કયા જિલ્લામાં આવેલો છે?',
      en: 'On which river and in which district is the Sardar Sarovar Dam located?',
      hi: 'सरदार सरोवर बांध किस नदी पर और किस जिले में स्थित है?',
    },
    options: [
      { gu: 'તાપી — તાપી જિલ્લો', en: 'Tapi — Tapi District', hi: 'तापी — तापी जिला' },
      { gu: 'નર્મદા — નર્મદા જિલ્લો', en: 'Narmada — Narmada District', hi: 'नर्मदा — नर्मदा जिला' },
      { gu: 'મહી — મહીસાગર જિલ્લો', en: 'Mahi — Mahisagar District', hi: 'माही — महीसागर जिला' },
      { gu: 'સાબરમતી — ગાંધીનગર જિલ્લો', en: 'Sabarmati — Gandhinagar District', hi: 'साबरमती — गांधीनगर जिला' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'સરદાર સરોવર બંધ નર્મદા જિલ્લાના કેવડિયા (એકતા નગર) ખાતે નર્મદા નદી પર આવેલો છે.',
      en: 'Sardar Sarovar Dam is built on the Narmada River at Ekta Nagar (Kevadia) in Narmada district.',
      hi: 'सरदार सरोवर बांध नर्मदा जिले के एकता नगर (केवड़िया) में नर्मदा नदी पर बना है।',
    },
  },
  {
    id: 'q-riv-2',
    mode: 'rivers',
    difficulty: 'medium',
    districtId: 'surat',
    question: {
      gu: 'સુરત શહેર કઈ મુખ્ય નદીના કિનારે વસેલું છે?',
      en: 'Surat city is situated on the banks of which major river?',
      hi: 'सूरत शहर किस प्रमुख नदी के किनारे बसा है?',
    },
    options: [
      { gu: 'નર્મદા', en: 'Narmada', hi: 'नर्मदा' },
      { gu: 'પૂર્ણા', en: 'Purna', hi: 'पूर्णा' },
      { gu: 'તાપી', en: 'Tapi', hi: 'तापी' },
      { gu: 'મહી', en: 'Mahi', hi: 'माही' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'સુરત શહેર તાપી નદીના કિનારે આવેલું છે, જે અરબી સમુદ્રને મળે છે.',
      en: 'Surat lies along the Tapi River, which flows westward into the Arabian Sea.',
      hi: 'सूरत शहर तापी नदी के किनारे बसा है।',
    },
  },
  {
    id: 'q-riv-3',
    mode: 'rivers',
    difficulty: 'medium',
    districtId: 'morbi',
    question: {
      gu: 'મોરબી શહેર કઈ નદીના કિનારે આવેલું છે?',
      en: 'Morbi city is situated on the banks of which river?',
      hi: 'मोरबी शहर किस नदी के किनारे स्थित है?',
    },
    options: [
      { gu: 'ભાદર', en: 'Bhadar', hi: 'भादर' },
      { gu: 'મચ્છુ', en: 'Machchhu', hi: 'मच्छू' },
      { gu: 'શેત્રુંજી', en: 'Shetrunji', hi: 'शेत्रुंजी' },
      { gu: 'ભોગાવો', en: 'Bhogavo', hi: 'भोगावो' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'મોરબી જિલ્લો અને શહેર મચ્છુ નદીના કિનારે આવેલા છે.',
      en: 'Morbi city is located on the banks of the Machchhu River.',
      hi: 'मोरबी शहर मच्छू नदी के किनारे स्थित है।',
    },
  },
  {
    id: 'q-riv-4',
    mode: 'rivers',
    difficulty: 'medium',
    districtId: 'patan',
    question: {
      gu: 'ઐતિહાસિક પાટણ નગર પ્રાચીન કાળમાં કઈ નદીના કિનારે વસ્યું હતું?',
      en: 'Historic Patan was established on the banks of which river?',
      hi: 'ऐतिहासिक पाटण नगर किस नदी के तट पर बसा था?',
    },
    options: [
      { gu: 'સરસ્વતી', en: 'Saraswati', hi: 'सरस्वती' },
      { gu: 'બનાસ', en: 'Banas', hi: 'बनास' },
      { gu: 'સાબરમતી', en: 'Sabarmati', hi: 'साबरमती' },
      { gu: 'મહી', en: 'Mahi', hi: 'माही' },
    ],
    correctIndex: 0,
    explanation: {
      gu: 'પાટણ અને સિદ્ધપુર પ્રાચીન સરસ્વતી નદીના કિનારે આવેલા છે.',
      en: 'Patan and Siddhpur are located along the Saraswati River in North Gujarat.',
      hi: 'पाटण और सिद्धपुर उत्तर गुजरात में सरस्वती नदी के किनारे स्थित हैं।',
    },
  },
  {
    id: 'q-riv-5',
    mode: 'rivers',
    difficulty: 'hard',
    districtId: 'bhavnagar',
    question: {
      gu: 'પાલિતાણા નજીક વહેતી સૌરાષ્ટ્રની પ્રસિદ્ધ નદી કઈ છે?',
      en: 'Which prominent river of Saurashtra flows near Palitana in Bhavnagar?',
      hi: 'भावनगर में पालिताणा के पास बहने वाली सौराष्ट्र की प्रमुख नदी कौन सी है?',
    },
    options: [
      { gu: 'ઓઝત', en: 'Ozat', hi: 'ओज़त' },
      { gu: 'શેત્રુંજી', en: 'Shetrunji', hi: 'शेत्रुंजी' },
      { gu: 'હિરણ', en: 'Hiran', hi: 'हिरण' },
      { gu: 'આજી', en: 'Aji', hi: 'आजी' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'શેત્રુંજી નદી અમરેલી અને ભાવનગર જિલ્લામાંથી વહે છે અને શેત્રુંજય પર્વત નજીકથી પસાર થાય છે.',
      en: 'The Shetrunji River flows through Amreli and Bhavnagar near the Shatrunjaya Hills of Palitana.',
      hi: 'शेत्रुंजी नदी अमरेली और भावनगर से होकर पालिताणा के पास बहती है।',
    },
  },

  // 4. Tourist Places
  {
    id: 'q-att-1',
    mode: 'attractions',
    difficulty: 'easy',
    districtId: 'patan',
    question: {
      gu: 'યુનેસ્કો વર્લ્ડ હેરિટેજ ‘રાણીની વાવ’ કયા જિલ્લામાં આવેલી છે?',
      en: 'In which district is the UNESCO World Heritage site Rani ki Vav located?',
      hi: 'यूनेस्को विश्व धरोहर स्थल रानी की वाव किस जिले में स्थित है?',
    },
    options: [
      { gu: 'મહેસાણા', en: 'Mehsana', hi: 'मेहसाणा' },
      { gu: 'પાટણ', en: 'Patan', hi: 'पाटण' },
      { gu: 'ગાંધીનગર', en: 'Gandhinagar', hi: 'गांधीनगर' },
      { gu: 'બનાસકાંઠા', en: 'Banaskantha', hi: 'बनासकांठा' },
    ],
    correctIndex: 1,
    explanation: {
      gu: '11મી સદીમાં રાણી ઉદયમતી દ્વારા બંધાવેલી ‘રાણીની વાવ’ પાટણ જિલ્લામાં આવેલી છે.',
      en: 'Built by Queen Udayamati in the 11th century, Rani ki Vav is located in Patan district.',
      hi: '11वीं सदी में रानी उदयमती द्वारा निर्मित रानी की वाव पाटण जिले में स्थित है।',
    },
  },
  {
    id: 'q-att-2',
    mode: 'attractions',
    difficulty: 'easy',
    districtId: 'mehsana',
    question: {
      gu: 'વિશ્વપ્રસિદ્ધ મોઢેરાનું સૂર્યમંદિર કયા જિલ્લામાં આવેલું છે?',
      en: 'The famous Modhera Sun Temple is situated in which district?',
      hi: 'विश्व प्रसिद्ध मोढेरा सूर्य मंदिर किस जिले में स्थित है?',
    },
    options: [
      { gu: 'પાટણ', en: 'Patan', hi: 'पाटण' },
      { gu: 'મહેસાણા', en: 'Mehsana', hi: 'मेहसाणा' },
      { gu: 'સાબરકાંઠા', en: 'Sabarkantha', hi: 'साबरकांठा' },
      { gu: 'બનાસકાંઠા', en: 'Banaskantha', hi: 'बनासकांठा' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'મોઢેરાનું સૂર્યમંદિર મહેસાણા જિલ્લામાં પુષ્પાવતી નદીના કિનારે આવેલું છે.',
      en: 'Modhera Sun Temple is located along the Pushpavati River in Mehsana district.',
      hi: 'मोढेरा सूर्य मंदिर मेहसाणा जिले में पुष्पावती नदी के तट पर स्थित है।',
    },
  },
  {
    id: 'q-att-3',
    mode: 'attractions',
    difficulty: 'medium',
    districtId: 'panchmahal',
    question: {
      gu: 'ચાંપાનેર-પાવાગઢ પુરાતત્વીય ઉદ્યાન (યુનેસ્કો સ્થળ) કયા જિલ્લામાં આવેલું છે?',
      en: 'Champaner-Pavagadh Archaeological Park (UNESCO Site) is located in which district?',
      hi: 'चांपानेर-पावागढ़ पुरातत्व उद्यान (यूनेस्को स्थल) किस जिले में स्थित है?',
    },
    options: [
      { gu: 'દાહોદ', en: 'Dahod', hi: 'दाहोद' },
      { gu: 'વડોદરા', en: 'Vadodara', hi: 'वडोदरा' },
      { gu: 'પંચમહાલ', en: 'Panchmahal', hi: 'पंचमहल' },
      { gu: 'છોટાઉદેપુર', en: 'Chhota Udaipur', hi: 'छोटा उदयपुर' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'ચાંપાનેર-પાવાગઢ પંચમહાલ જિલ્લાના હાલોલ નજીક આવેલું યુનેસ્કો વર્લ્ડ હેરિટેજ સ્થળ છે.',
      en: 'Champaner-Pavagadh is a UNESCO World Heritage Site located in Panchmahal district.',
      hi: 'चांपानेर-पावागढ़ पंचमहल जिले में स्थित एक यूनेस्को विश्व धरोहर स्थल है।',
    },
  },
  {
    id: 'q-att-4',
    mode: 'attractions',
    difficulty: 'medium',
    districtId: 'mahisagar',
    question: {
      gu: 'રૈયોલી ડાયનાસોર ફોસિલ પાર્ક અને મ્યુઝિયમ કયા જિલ્લામાં આવેલું છે?',
      en: 'In which district is the Raiyoli Dinosaur Fossil Park & Museum located?',
      hi: 'रैयोली डायनासोर जीवाश्म पार्क और संग्रहालय किस जिले में स्थित है?',
    },
    options: [
      { gu: 'ખેડા', en: 'Kheda', hi: 'खेड़ा' },
      { gu: 'મહીસાગર', en: 'Mahisagar', hi: 'महीसागर' },
      { gu: 'પંચમહાલ', en: 'Panchmahal', hi: 'पंचमहल' },
      { gu: 'અરવલ્લી', en: 'Aravalli', hi: 'अरावली' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'બાલાસિનોર નજીક રૈયોલી ડાયનાસોર ફોસિલ પાર્ક મહીસાગર જિલ્લામાં આવેલું છે.',
      en: 'Raiyoli Dinosaur Fossil Park near Balasinor is located in Mahisagar district.',
      hi: 'बालासिनोर के पास रैयोली डायनासोर जीवाश्म पार्क महीसागर जिले में स्थित है।',
    },
  },
  {
    id: 'q-att-5',
    mode: 'attractions',
    difficulty: 'easy',
    districtId: 'navsari',
    question: {
      gu: 'મહાત્મા ગાંધીની ઐતિહાસિક દાંડી યાત્રાનું સ્થળ ‘દાંડી’ કયા જિલ્લામાં આવેલું છે?',
      en: 'Dandi, the historic site of Mahatma Gandhi’s Salt March, is in which district?',
      hi: 'महात्मा गांधी के ऐतिहासिक दांडी मार्च का स्थल दांडी किस जिले में है?',
    },
    options: [
      { gu: 'સુરત', en: 'Surat', hi: 'सूरत' },
      { gu: 'વલસાડ', en: 'Valsad', hi: 'वलसाड' },
      { gu: 'ભરૂચ', en: 'Bharuch', hi: 'भरूच' },
      { gu: 'નવસારી', en: 'Navsari', hi: 'नवसारी' },
    ],
    correctIndex: 3,
    explanation: {
      gu: 'દાંડી અને રાષ્ટ્રીય મીઠા સત્યાગ્રહ સ્મારક નવસારી જિલ્લામાં આવેલા છે.',
      en: 'Dandi and the National Salt Satyagraha Memorial are located in Navsari district.',
      hi: 'दांडी और राष्ट्रीय नमक सत्याग्रह स्मारक नवसारी जिले में स्थित हैं।',
    },
  },
  {
    id: 'q-att-6',
    mode: 'attractions',
    difficulty: 'medium',
    districtId: 'vav-tharad',
    question: {
      gu: 'સુઈગામ ખાતે આવેલું ‘નડાબેટ સીમા દર્શન’ હાલ કયા જિલ્લામાં આવે છે?',
      en: 'Nadabet Seema Darshan at Suigam is now located in which district?',
      hi: 'सुईगाम स्थित नडाबेट सीमा दर्शन वर्तमान में किस जिले में आता है?',
    },
    options: [
      { gu: 'બનાસકાંઠા', en: 'Banaskantha', hi: 'बनासकांठा' },
      { gu: 'વાવ-થરાદ', en: 'Vav-Tharad', hi: 'वाव-थराद' },
      { gu: 'કચ્છ', en: 'Kachchh', hi: 'कच्छ' },
      { gu: 'પાટણ', en: 'Patan', hi: 'पाटण' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'જાન્યુઆરી 2025માં સુઈગામ તાલુકો નવા બનેલા વાવ-થરાદ જિલ્લામાં સમાવિષ્ટ થયો છે.',
      en: 'Following the January 2025 reorganization, Suigam taluka (Nadabet) is part of Vav-Tharad district.',
      hi: 'जनवरी 2025 के पुनर्गठन के बाद सुईगाम (नडाबेट) अब वाव-थराद जिले में स्थित है।',
    },
  },

  // 5. Agriculture and Industries
  {
    id: 'q-eco-1',
    mode: 'economy',
    difficulty: 'easy',
    districtId: 'morbi',
    question: {
      gu: 'ભારતની ‘સિરામિક કેપિટલ’ અને ઘડિયાળ ઉદ્યોગ માટે કયો જિલ્લો પ્રસિદ્ધ છે?',
      en: 'Which district is famous as India’s Ceramic Capital and clock manufacturing hub?',
      hi: 'भारत की सिरेमिक राजधानी और घड़ी उद्योग के लिए कौन सा जिला प्रसिद्ध है?',
    },
    options: [
      { gu: 'રાજકોટ', en: 'Rajkot', hi: 'राजकोट' },
      { gu: 'જામનગર', en: 'Jamnagar', hi: 'जामनगर' },
      { gu: 'મોરબી', en: 'Morbi', hi: 'मोरबी' },
      { gu: 'સુરેન્દ્રનગર', en: 'Surendranagar', hi: 'सुरेंद्रनगर' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'મોરબી જિલ્લો સિરામિક ટાઇલ્સ, સેનેટરીવેર અને ઘડિયાળ ઉદ્યોગનું દેશનું સૌથી મોટું કેન્દ્ર છે.',
      en: 'Morbi is India’s largest hub for ceramic tiles, sanitaryware, and wall clocks.',
      hi: 'मोरबी देश में सिरेमिक टाइल्स, सैनिटरीवेयर और घड़ी निर्माण का सबसे बड़ा केंद्र है।',
    },
  },
  {
    id: 'q-eco-2',
    mode: 'economy',
    difficulty: 'easy',
    districtId: 'anand',
    question: {
      gu: 'શ્વેત ક્રાંતિ અને ‘અમૂલ’ ડેરીનું મુખ્ય કેન્દ્ર કયા જિલ્લામાં આવેલું છે?',
      en: 'The White Revolution and Amul Dairy cooperative are centered in which district?',
      hi: 'श्वेत क्रांति और अमूल डेयरी का प्रमुख केंद्र किस जिले में स्थित है?',
    },
    options: [
      { gu: 'ખેડા', en: 'Kheda', hi: 'खेड़ा' },
      { gu: 'આણંદ', en: 'Anand', hi: 'आणंद' },
      { gu: 'મહેસાણા', en: 'Mehsana', hi: 'मेहसाणा' },
      { gu: 'બનાસકાંઠા', en: 'Banaskantha', hi: 'बनासकांठा' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'આણંદ જિલ્લામાં 1946માં અમૂલની સ્થાપના થઈ હતી, જેને ભારતની ‘મિલ્ક કેપિટલ’ કહેવાય છે.',
      en: 'Amul was founded in Anand in 1946, earning Anand the title Milk Capital of India.',
      hi: 'आणंद में 1946 में अमूल की स्थापना हुई थी, जिसे भारत की मिल्क कैपिटल कहा जाता है।',
    },
  },
  {
    id: 'q-eco-3',
    mode: 'economy',
    difficulty: 'easy',
    districtId: 'surat',
    question: {
      gu: 'વિશ્વનું સૌથી મોટું હીરા કટિંગ અને પોલિશિંગ કેન્દ્ર (ડાયમંડ સિટી) કયું છે?',
      en: 'Which district is the world’s largest diamond cutting and polishing center?',
      hi: 'विश्व का सबसे बड़ा हीरा कटिंग एवं पॉलिशिंग केंद्र किस जिले में है?',
    },
    options: [
      { gu: 'ભાવનગર', en: 'Bhavnagar', hi: 'भावनगर' },
      { gu: 'અમદાવાદ', en: 'Ahmedabad', hi: 'अहमदाबाद' },
      { gu: 'સુરત', en: 'Surat', hi: 'सूरत' },
      { gu: 'નવસારી', en: 'Navsari', hi: 'नवसारी' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'સુરત ‘ડાયમંડ સિટી’ તરીકે વિશ્વના આશરે 90% હીરાનું કટિંગ અને પોલિશિંગ કરે છે.',
      en: 'Surat, known as the Diamond City, processes roughly 90% of the world’s cut and polished diamonds.',
      hi: 'सूरत (डायमंड सिटी) विश्व के लगभग 90% हीरों की कटाई और पॉलिशिंग करता है।',
    },
  },
  {
    id: 'q-eco-4',
    mode: 'economy',
    difficulty: 'medium',
    districtId: 'jamnagar',
    question: {
      gu: '‘બ્રાસ સિટી’ (પિત્તળ ઉદ્યોગ) અને વિશ્વની સૌથી મોટી ઓઇલ રિફાઇનરી કયા જિલ્લામાં છે?',
      en: 'Which district is known as Brass City and hosts the world’s largest oil refinery complex?',
      hi: 'ब्रास सिटी (पीतल नगरी) और विश्व की सबसे बड़ी तेल रिफाइनरी किस जिले में स्थित है?',
    },
    options: [
      { gu: 'ભરૂચ', en: 'Bharuch', hi: 'भरूच' },
      { gu: 'જામનગર', en: 'Jamnagar', hi: 'जामनगर' },
      { gu: 'કચ્છ', en: 'Kachchh', hi: 'कच्छ' },
      { gu: 'વડોદરા', en: 'Vadodara', hi: 'वडोदरा' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'જામનગર ભારતની ‘બ્રાસ સિટી’ છે અને અહીં વિશ્વનું સૌથી મોટું રિફાઇનરી સંકુલ આવેલું છે.',
      en: 'Jamnagar is India’s Brass City and houses the world’s largest petroleum refining complex.',
      hi: 'जामनगर को भारत की ब्रास सिटी कहा जाता है और यहाँ विश्व का सबसे बड़ा रिफाइनरी परिसर स्थित है।',
    },
  },
  {
    id: 'q-eco-5',
    mode: 'economy',
    difficulty: 'hard',
    districtId: 'bhavnagar',
    question: {
      gu: 'વિશ્વપ્રસિદ્ધ ‘અલંગ શિપ રિસાયક્લિંગ યાર્ડ’ કયા જિલ્લામાં આવેલું છે?',
      en: 'The famous Alang Ship Recycling Yard is located in which district?',
      hi: 'विश्व प्रसिद्ध अलंग शिप रीसाइक्लिंग यार्ड किस जिले में स्थित है?',
    },
    options: [
      { gu: 'અમરેલી', en: 'Amreli', hi: 'अमरेली' },
      { gu: 'કચ્છ', en: 'Kachchh', hi: 'कच्छ' },
      { gu: 'ભાવનગર', en: 'Bhavnagar', hi: 'भावनगर' },
      { gu: 'ભરૂચ', en: 'Bharuch', hi: 'भरूच' },
    ],
    correctIndex: 2,
    explanation: {
      gu: 'અલંગ જહાજ ભાંગવાનો ઉદ્યોગ ભાવનગર જિલ્લાના દરિયાકિનારે આવેલો છે.',
      en: 'Alang Ship Recycling Yard is located along the coast of Bhavnagar district.',
      hi: 'अलंग जहाज तोड़ने का यार्ड भावनगर जिले के तट पर स्थित है।',
    },
  },
  {
    id: 'q-eco-6',
    mode: 'economy',
    difficulty: 'medium',
    districtId: 'gir-somnath',
    question: {
      gu: 'તાલાલાની વિશ્વપ્રસિદ્ધ ‘કેસર કેરી’ કયા જિલ્લાની ઓળખ છે?',
      en: 'Talala’s GI-tagged Kesar Mango is the pride of which district?',
      hi: 'तालाळा का विश्व प्रसिद्ध केसर आम किस जिले की पहचान है?',
    },
    options: [
      { gu: 'જૂનાગઢ', en: 'Junagadh', hi: 'जूनागढ़' },
      { gu: 'ગીર સોમનાથ', en: 'Gir Somnath', hi: 'गिर सोमनाथ' },
      { gu: 'વલસાડ', en: 'Valsad', hi: 'वलसाड' },
      { gu: 'નવસારી', en: 'Navsari', hi: 'नवसारी' },
    ],
    correctIndex: 1,
    explanation: {
      gu: 'તાલાલા ગીર ગીર સોમનાથ જિલ્લામાં આવેલું છે, જેની કેસર કેરીને GI ટેગ મળેલો છે.',
      en: 'Talala Gir lies in Gir Somnath district and is renowned for GI-tagged Kesar mangoes.',
      hi: 'तालाळा गिर, गिर सोमनाथ जिले में स्थित है जो केसर आम के लिए प्रसिद्ध है।',
    },
  },
];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDynamicDistrictQuestion(
  districtId: string,
  kind: 'findOnMap' | 'headquarters' | 'identification',
  difficulty: QuizDifficulty
): QuizQuestion {
  const target = DISTRICT_BY_ID[districtId];
  const others = shuffle(DISTRICTS_DB.filter((d) => d.id !== districtId)).slice(0, 3);

  if (kind === 'findOnMap') {
    return {
      id: `dyn-map-${districtId}-${Math.random().toString(36).slice(2, 6)}`,
      mode: 'findOnMap',
      difficulty,
      districtId,
      isMapClickChallenge: true,
      question: {
        gu: `3D નકશા પર “${target.nameGu}” (${target.nameEn}) જિલ્લો શોધીને ક્લિક કરો`,
        en: `Locate and click on “${target.nameEn}” (${target.nameGu}) district on the 3D map`,
        hi: `3D मानचित्र पर “${target.nameHi}” (${target.nameEn}) जिले को खोजकर क्लिक करें`,
      },
      options: [],
      correctIndex: 0,
      explanation: {
        gu: `${target.nameGu} જિલ્લો ${target.geoLocation.gu} — મુખ્ય મથક: ${target.headquarters.gu}.`,
        en: `${target.nameEn} is located in ${target.geoLocation.en} — Headquarters: ${target.headquarters.en}.`,
        hi: `${target.nameHi} जिला ${target.geoLocation.hi} — मुख्यालय: ${target.headquarters.hi}.`,
      },
    };
  }

  if (kind === 'headquarters') {
    const allChoices = shuffle([target, ...others]);
    const correctIndex = allChoices.findIndex((d) => d.id === target.id);
    return {
      id: `dyn-hq-${districtId}-${Math.random().toString(36).slice(2, 6)}`,
      mode: 'headquarters',
      difficulty,
      districtId,
      question: {
        gu: `${target.nameGu} જિલ્લાનું મુખ્ય મથક કયું છે?`,
        en: `What is the district headquarters of ${target.nameEn}?`,
        hi: `${target.nameHi} जिले का मुख्यालय क्या है?`,
      },
      options: allChoices.map((d) => d.headquarters),
      correctIndex,
      explanation: {
        gu: `${target.nameGu} જિલ્લાનું વહીવટી મુખ્ય મથક ${target.headquarters.gu} છે.`,
        en: `The administrative headquarters of ${target.nameEn} district is ${target.headquarters.en}.`,
        hi: `${target.nameHi} जिले का मुख्यालय ${target.headquarters.hi} है।`,
      },
    };
  }

  const allChoices = shuffle([target, ...others]);
  const correctIndex = allChoices.findIndex((d) => d.id === target.id);
  return {
    id: `dyn-id-${districtId}-${Math.random().toString(36).slice(2, 6)}`,
    mode: 'identification',
    difficulty,
    districtId,
    question: {
      gu: `મુખ્ય મથક “${target.headquarters.gu}” અને “${target.attractions.gu.split(',')[0]}” કયા જિલ્લામાં આવેલા છે?`,
      en: `Which district has headquarters at ${target.headquarters.en} and features ${target.attractions.en.split(',')[0]}?`,
      hi: `मुख्यालय “${target.headquarters.hi}” और “${target.attractions.hi.split(',')[0]}” किस जिले में स्थित हैं?`,
    },
    options: allChoices.map((d) => ({ gu: d.nameGu, en: d.nameEn, hi: d.nameHi })),
    correctIndex,
    explanation: {
      gu: `સાચો જવાબ ${target.nameGu} છે. ${target.description.gu}`,
      en: `The correct district is ${target.nameEn}. ${target.description.en}`,
      hi: `सही उत्तर ${target.nameHi} है। ${target.description.hi}`,
    },
  };
}

export function generateQuizSession(
  mode: QuizMode,
  count: 10 | 20 | 34,
  difficulty: QuizDifficulty,
  customQuestions: QuizQuestion[]
): QuizQuestion[] {
  const pool: QuizQuestion[] = [];

  if (mode === 'findOnMap') {
    const districts = shuffle(DISTRICTS_DB).slice(0, count);
    return districts.map((d) => buildDynamicDistrictQuestion(d.id, 'findOnMap', difficulty));
  }

  if (mode === 'mapChallenge') {
    const districts = shuffle(DISTRICTS_DB).slice(0, count);
    return districts.map((d, idx) =>
      idx % 2 === 0
        ? buildDynamicDistrictQuestion(d.id, 'findOnMap', difficulty)
        : buildDynamicDistrictQuestion(d.id, 'identification', difficulty)
    );
  }

  // Include matching custom questions first
  const matchingCustom = customQuestions.filter((q) => q.mode === mode || mode === 'identification');
  pool.push(...matchingCustom);

  // Add curated static questions matching the mode
  const matchingStatic = STATIC_QUIZ_QUESTIONS.filter((q) => q.mode === mode);
  pool.push(...shuffle(matchingStatic));

  // Fill up to desired count (10, 20, or 34) using verified district generator without repeating districts where possible
  const usedDistricts = new Set(pool.map((q) => q.districtId));
  const remainingDistricts = shuffle(DISTRICTS_DB.filter((d) => !usedDistricts.has(d.id)));
  const fallbackDistricts = shuffle(DISTRICTS_DB);

  let idx = 0;
  while (pool.length < count) {
    const d = remainingDistricts[idx] ?? fallbackDistricts[idx % fallbackDistricts.length];
    const kind = mode === 'headquarters' ? 'headquarters' : 'identification';
    pool.push(buildDynamicDistrictQuestion(d.id, kind, difficulty));
    idx++;
  }

  return pool.slice(0, count);
}
