import { DISTRICT_SPECIALTIES } from '../data/districtSpecialties';
import { DistrictRecord, Language, REGION_LABELS } from '../types/gujarat';
import { SpeechSegment } from './speechUtils';

export function buildDistrictNarrationSegments(
  district: DistrictRecord,
  lang: Language
): SpeechSegment[] {
  const specialty = DISTRICT_SPECIALTIES[district.id];
  const regionName = REGION_LABELS[district.region][lang];
  const isAreaMissing = district.areaSqKm === 'માહિતી ઉપલબ્ધ નથી';

  if (lang === 'gu') {
    const areaText = isAreaMissing
      ? 'ક્ષેત્રફળની વિગત હાલ ઉપલબ્ધ નથી.'
      : `કુલ ક્ષેત્રફળ ${district.areaSqKm} ચોરસ કિલોમીટર છે.`;

    const segments: SpeechSegment[] = [
      {
        id: 'intro',
        label: 'પરિચય અને મુખ્ય મથક',
        text: `જિલ્લો ક્રમાંક ${district.number}, ${district.nameGu}. મુખ્ય મથક: ${district.headquarters.gu}. ${district.description.gu}`,
      },
    ];

    if (specialty) {
      segments.push({
        id: 'specialty',
        label: '૩D નકશાની મુખ્ય વિશેષતા',
        text: `મુખ્ય વિશેષતા: ${specialty.title.gu}. ${specialty.subtitle.gu}.`,
      });
    }

    segments.push(
      {
        id: 'geo',
        label: 'ભૌગોલિક ઓળખ અને ક્ષેત્રફળ',
        text: `ભૌગોલિક ઓળખ: ${regionName}. ${district.geoLocation.gu}. ${areaText}`,
      },
      {
        id: 'rivers',
        label: 'મુખ્ય નદીઓ',
        text: `મુખ્ય નદીઓ: ${district.rivers.gu}.`,
      },
      {
        id: 'crops',
        label: 'મુખ્ય પાક',
        text: `મુખ્ય પાક: ${district.crops.gu}.`,
      },
      {
        id: 'industries',
        label: 'ઉદ્યોગો',
        text: `ઉદ્યોગો: ${district.industries.gu}.`,
      },
      {
        id: 'attractions',
        label: 'જોવાલાયક સ્થળો',
        text: `જોવાલાયક સ્થળો: ${district.attractions.gu}.`,
      },
      {
        id: 'history',
        label: 'ઐતિહાસિક માહિતી',
        text: `ઐતિહાસિક માહિતી: ${district.history.gu}`,
      }
    );

    return segments;
  }

  if (lang === 'hi') {
    const areaText = isAreaMissing
      ? 'क्षेत्रफल की जानकारी उपलब्ध नहीं है।'
      : `कुल क्षेत्रफल ${district.areaSqKm} वर्ग किलोमीटर है।`;

    const segments: SpeechSegment[] = [
      {
        id: 'intro',
        label: 'परिचय एवं मुख्यालय',
        text: `जिला क्रमांक ${district.number}, ${district.nameHi}। जिला मुख्यालय: ${district.headquarters.hi}। ${district.description.hi}`,
      },
    ];

    if (specialty) {
      segments.push({
        id: 'specialty',
        label: 'प्रमुख विशेषता',
        text: `प्रमुख विशेषता: ${specialty.title.hi}। ${specialty.subtitle.hi}।`,
      });
    }

    segments.push(
      {
        id: 'geo',
        label: 'भौगोलिक स्थिति एवं क्षेत्रफल',
        text: `भौगोलिक स्थिति: ${regionName}। ${district.geoLocation.hi}। ${areaText}`,
      },
      {
        id: 'rivers',
        label: 'प्रमुख नदियाँ',
        text: `प्रमुख नदियाँ: ${district.rivers.hi}।`,
      },
      {
        id: 'crops',
        label: 'प्रमुख फसलें',
        text: `प्रमुख फसलें: ${district.crops.hi}।`,
      },
      {
        id: 'industries',
        label: 'उद्योग',
        text: `उद्योग: ${district.industries.hi}।`,
      },
      {
        id: 'attractions',
        label: 'दर्शनीय स्थल',
        text: `दर्शनीय स्थल: ${district.attractions.hi}।`,
      },
      {
        id: 'history',
        label: 'ऐतिहासिक महत्व',
        text: `ऐतिहासिक महत्व: ${district.history.hi}`,
      }
    );

    return segments;
  }

  const areaText = isAreaMissing
    ? 'Area details are currently not available.'
    : `Total area is ${district.areaSqKm} square kilometers.`;

  const segments: SpeechSegment[] = [
    {
      id: 'intro',
      label: 'Overview & Headquarters',
      text: `District number ${district.number}, ${district.nameEn}. District headquarters: ${district.headquarters.en}. ${district.description.en}`,
    },
  ];

  if (specialty) {
    segments.push({
      id: 'specialty',
      label: '3D Map Specialty',
      text: `Key specialty: ${specialty.title.en}. ${specialty.subtitle.en}.`,
    });
  }

  segments.push(
    {
      id: 'geo',
      label: 'Geography & Area',
      text: `Geographical location: ${regionName}. ${district.geoLocation.en}. ${areaText}`,
    },
    {
      id: 'rivers',
      label: 'Important Rivers',
      text: `Important rivers: ${district.rivers.en}.`,
    },
    {
      id: 'crops',
      label: 'Major Crops',
      text: `Major crops: ${district.crops.en}.`,
    },
    {
      id: 'industries',
      label: 'Industries',
      text: `Key industries: ${district.industries.en}.`,
    },
    {
      id: 'attractions',
      label: 'Tourist Attractions',
      text: `Tourist attractions: ${district.attractions.en}.`,
    },
    {
      id: 'history',
      label: 'Historical Importance',
      text: `Historical importance: ${district.history.en}`,
    }
  );

  return segments;
}
