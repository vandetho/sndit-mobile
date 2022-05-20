import Constants from 'expo-constants';

export const TOAST_DURATION = 3000;

export const DISPLAY_CALENDAR_FORMAT = 'MMM dd';
export const DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';
export const DISPLAY_DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DISPLAY_CALENDAR_TIME_FORMAT = 'MMM dd HH:mm';
export const DISPLAY_TIME_FORMAT = 'HH:mm';

export const HOST = Constants.manifest.extra.host;

export enum ROLES {
    OWNER = 'ROLE_OWNER',
    MANAGER = 'ROLE_MANAGER',
    EMPLOYEE = 'ROLE_EMPLOYEE',
}

export const COUNTRY_CODE = {
    AF: {
        name: 'Afghanistan',
        dialCode: '+93',
        code: 'AF',
    },
    AX: {
        name: 'Aland Islands',
        dialCode: '+358',
        code: 'AX',
    },
    AL: {
        name: 'Albania',
        dialCode: '+355',
        code: 'AL',
    },
    DZ: {
        name: 'Algeria',
        dialCode: '+213',
        code: 'DZ',
    },
    AS: {
        name: 'AmericanSamoa',
        dialCode: '+1684',
        code: 'AS',
    },
    AD: {
        name: 'Andorra',
        dialCode: '+376',
        code: 'AD',
    },
    AO: {
        name: 'Angola',
        dialCode: '+244',
        code: 'AO',
    },
    AI: {
        name: 'Anguilla',
        dialCode: '+1264',
        code: 'AI',
    },
    AQ: {
        name: 'Antarctica',
        dialCode: '+672',
        code: 'AQ',
    },
    AG: {
        name: 'Antigua and Barbuda',
        dialCode: '+1268',
        code: 'AG',
    },
    AR: {
        name: 'Argentina',
        dialCode: '+54',
        code: 'AR',
    },
    AM: {
        name: 'Armenia',
        dialCode: '+374',
        code: 'AM',
    },
    AW: {
        name: 'Aruba',
        dialCode: '+297',
        code: 'AW',
    },
    AU: {
        name: 'Australia',
        dialCode: '+61',
        code: 'AU',
    },
    AT: {
        name: 'Austria',
        dialCode: '+43',
        code: 'AT',
    },
    AZ: {
        name: 'Azerbaijan',
        dialCode: '+994',
        code: 'AZ',
    },
    BS: {
        name: 'Bahamas',
        dialCode: '+1242',
        code: 'BS',
    },
    BH: {
        name: 'Bahrain',
        dialCode: '+973',
        code: 'BH',
    },
    BD: {
        name: 'Bangladesh',
        dialCode: '+880',
        code: 'BD',
    },
    BB: {
        name: 'Barbados',
        dialCode: '+1246',
        code: 'BB',
    },
    BY: {
        name: 'Belarus',
        dialCode: '+375',
        code: 'BY',
    },
    BE: {
        name: 'Belgium',
        dialCode: '+32',
        code: 'BE',
    },
    BZ: {
        name: 'Belize',
        dialCode: '+501',
        code: 'BZ',
    },
    BJ: {
        name: 'Benin',
        dialCode: '+229',
        code: 'BJ',
    },
    BM: {
        name: 'Bermuda',
        dialCode: '+1441',
        code: 'BM',
    },
    BT: {
        name: 'Bhutan',
        dialCode: '+975',
        code: 'BT',
    },
    BO: {
        name: 'Bolivia, Plurinational State of',
        dialCode: '+591',
        code: 'BO',
    },
    BA: {
        name: 'Bosnia and Herzegovina',
        dialCode: '+387',
        code: 'BA',
    },
    BW: {
        name: 'Botswana',
        dialCode: '+267',
        code: 'BW',
    },
    BR: {
        name: 'Brazil',
        dialCode: '+55',
        code: 'BR',
    },
    IO: {
        name: 'British Indian Ocean Territory',
        dialCode: '+246',
        code: 'IO',
    },
    BN: {
        name: 'Brunei Darussalam',
        dialCode: '+673',
        code: 'BN',
    },
    BG: {
        name: 'Bulgaria',
        dialCode: '+359',
        code: 'BG',
    },
    BF: {
        name: 'Burkina Faso',
        dialCode: '+226',
        code: 'BF',
    },
    BI: {
        name: 'Burundi',
        dialCode: '+257',
        code: 'BI',
    },
    KH: {
        name: 'Cambodia',
        dialCode: '+855',
        code: 'KH',
    },
    CM: {
        name: 'Cameroon',
        dialCode: '+237',
        code: 'CM',
    },
    CA: {
        name: 'Canada',
        dialCode: '+1',
        code: 'CA',
    },
    CV: {
        name: 'Cape Verde',
        dialCode: '+238',
        code: 'CV',
    },
    KY: {
        name: 'Cayman Islands',
        dialCode: '+345',
        code: 'KY',
    },
    CF: {
        name: 'Central African Republic',
        dialCode: '+236',
        code: 'CF',
    },
    TD: {
        name: 'Chad',
        dialCode: '+235',
        code: 'TD',
    },
    CL: {
        name: 'Chile',
        dialCode: '+56',
        code: 'CL',
    },
    CN: {
        name: 'China',
        dialCode: '+86',
        code: 'CN',
    },
    CX: {
        name: 'Christmas Island',
        dialCode: '+61',
        code: 'CX',
    },
    CC: {
        name: 'Cocos (Keeling) Islands',
        dialCode: '+61',
        code: 'CC',
    },
    CO: {
        name: 'Colombia',
        dialCode: '+57',
        code: 'CO',
    },
    KM: {
        name: 'Comoros',
        dialCode: '+269',
        code: 'KM',
    },
    CG: {
        name: 'Congo',
        dialCode: '+242',
        code: 'CG',
    },
    CD: {
        name: 'Congo, The Democratic Republic of the Congo',
        dialCode: '+243',
        code: 'CD',
    },
    CK: {
        name: 'Cook Islands',
        dialCode: '+682',
        code: 'CK',
    },
    CR: {
        name: 'Costa Rica',
        dialCode: '+506',
        code: 'CR',
    },
    CI: {
        name: "Cote d'Ivoire",
        dialCode: '+225',
        code: 'CI',
    },
    HR: {
        name: 'Croatia',
        dialCode: '+385',
        code: 'HR',
    },
    CU: {
        name: 'Cuba',
        dialCode: '+53',
        code: 'CU',
    },
    CY: {
        name: 'Cyprus',
        dialCode: '+357',
        code: 'CY',
    },
    CZ: {
        name: 'Czech Republic',
        dialCode: '+420',
        code: 'CZ',
    },
    DK: {
        name: 'Denmark',
        dialCode: '+45',
        code: 'DK',
    },
    DJ: {
        name: 'Djibouti',
        dialCode: '+253',
        code: 'DJ',
    },
    DM: {
        name: 'Dominica',
        dialCode: '+1767',
        code: 'DM',
    },
    DO: {
        name: 'Dominican Republic',
        dialCode: '+1849',
        code: 'DO',
    },
    EC: {
        name: 'Ecuador',
        dialCode: '+593',
        code: 'EC',
    },
    EG: {
        name: 'Egypt',
        dialCode: '+20',
        code: 'EG',
    },
    SV: {
        name: 'El Salvador',
        dialCode: '+503',
        code: 'SV',
    },
    GQ: {
        name: 'Equatorial Guinea',
        dialCode: '+240',
        code: 'GQ',
    },
    ER: {
        name: 'Eritrea',
        dialCode: '+291',
        code: 'ER',
    },
    EE: {
        name: 'Estonia',
        dialCode: '+372',
        code: 'EE',
    },
    ET: {
        name: 'Ethiopia',
        dialCode: '+251',
        code: 'ET',
    },
    FK: {
        name: 'Falkland Islands (Malvinas)',
        dialCode: '+500',
        code: 'FK',
    },
    FO: {
        name: 'Faroe Islands',
        dialCode: '+298',
        code: 'FO',
    },
    FJ: {
        name: 'Fiji',
        dialCode: '+679',
        code: 'FJ',
    },
    FI: {
        name: 'Finland',
        dialCode: '+358',
        code: 'FI',
    },
    FR: {
        name: 'France',
        dialCode: '+33',
        code: 'FR',
    },
    GF: {
        name: 'French Guiana',
        dialCode: '+594',
        code: 'GF',
    },
    PF: {
        name: 'French Polynesia',
        dialCode: '+689',
        code: 'PF',
    },
    GA: {
        name: 'Gabon',
        dialCode: '+241',
        code: 'GA',
    },
    GM: {
        name: 'Gambia',
        dialCode: '+220',
        code: 'GM',
    },
    GE: {
        name: 'Georgia',
        dialCode: '+995',
        code: 'GE',
    },
    DE: {
        name: 'Germany',
        dialCode: '+49',
        code: 'DE',
    },
    GH: {
        name: 'Ghana',
        dialCode: '+233',
        code: 'GH',
    },
    GI: {
        name: 'Gibraltar',
        dialCode: '+350',
        code: 'GI',
    },
    GR: {
        name: 'Greece',
        dialCode: '+30',
        code: 'GR',
    },
    GL: {
        name: 'Greenland',
        dialCode: '+299',
        code: 'GL',
    },
    GD: {
        name: 'Grenada',
        dialCode: '+1473',
        code: 'GD',
    },
    GP: {
        name: 'Guadeloupe',
        dialCode: '+590',
        code: 'GP',
    },
    GU: {
        name: 'Guam',
        dialCode: '+1671',
        code: 'GU',
    },
    GT: {
        name: 'Guatemala',
        dialCode: '+502',
        code: 'GT',
    },
    GG: {
        name: 'Guernsey',
        dialCode: '+44',
        code: 'GG',
    },
    GN: {
        name: 'Guinea',
        dialCode: '+224',
        code: 'GN',
    },
    GW: {
        name: 'Guinea-Bissau',
        dialCode: '+245',
        code: 'GW',
    },
    GY: {
        name: 'Guyana',
        dialCode: '+595',
        code: 'GY',
    },
    HT: {
        name: 'Haiti',
        dialCode: '+509',
        code: 'HT',
    },
    VA: {
        name: 'Holy See (Vatican City State)',
        dialCode: '+379',
        code: 'VA',
    },
    HN: {
        name: 'Honduras',
        dialCode: '+504',
        code: 'HN',
    },
    HK: {
        name: 'Hong Kong',
        dialCode: '+852',
        code: 'HK',
    },
    HU: {
        name: 'Hungary',
        dialCode: '+36',
        code: 'HU',
    },
    IS: {
        name: 'Iceland',
        dialCode: '+354',
        code: 'IS',
    },
    IN: {
        name: 'India',
        dialCode: '+91',
        code: 'IN',
    },
    ID: {
        name: 'Indonesia',
        dialCode: '+62',
        code: 'ID',
    },
    IR: {
        name: 'Iran, Islamic Republic of Persian Gulf',
        dialCode: '+98',
        code: 'IR',
    },
    IQ: {
        name: 'Iraq',
        dialCode: '+964',
        code: 'IQ',
    },
    IE: {
        name: 'Ireland',
        dialCode: '+353',
        code: 'IE',
    },
    IM: {
        name: 'Isle of Man',
        dialCode: '+44',
        code: 'IM',
    },
    IL: {
        name: 'Israel',
        dialCode: '+972',
        code: 'IL',
    },
    IT: {
        name: 'Italy',
        dialCode: '+39',
        code: 'IT',
    },
    JM: {
        name: 'Jamaica',
        dialCode: '+1876',
        code: 'JM',
    },
    JP: {
        name: 'Japan',
        dialCode: '+81',
        code: 'JP',
    },
    JE: {
        name: 'Jersey',
        dialCode: '+44',
        code: 'JE',
    },
    JO: {
        name: 'Jordan',
        dialCode: '+962',
        code: 'JO',
    },
    KZ: {
        name: 'Kazakhstan',
        dialCode: '+77',
        code: 'KZ',
    },
    KE: {
        name: 'Kenya',
        dialCode: '+254',
        code: 'KE',
    },
    KI: {
        name: 'Kiribati',
        dialCode: '+686',
        code: 'KI',
    },
    KP: {
        name: "Korea, Democratic People's Republic of Korea",
        dialCode: '+850',
        code: 'KP',
    },
    KR: {
        name: 'Korea, Republic of South Korea',
        dialCode: '+82',
        code: 'KR',
    },
    KW: {
        name: 'Kuwait',
        dialCode: '+965',
        code: 'KW',
    },
    KG: {
        name: 'Kyrgyzstan',
        dialCode: '+996',
        code: 'KG',
    },
    LA: {
        name: 'Laos',
        dialCode: '+856',
        code: 'LA',
    },
    LV: {
        name: 'Latvia',
        dialCode: '+371',
        code: 'LV',
    },
    LB: {
        name: 'Lebanon',
        dialCode: '+961',
        code: 'LB',
    },
    LS: {
        name: 'Lesotho',
        dialCode: '+266',
        code: 'LS',
    },
    LR: {
        name: 'Liberia',
        dialCode: '+231',
        code: 'LR',
    },
    LY: {
        name: 'Libyan Arab Jamahiriya',
        dialCode: '+218',
        code: 'LY',
    },
    LI: {
        name: 'Liechtenstein',
        dialCode: '+423',
        code: 'LI',
    },
    LT: {
        name: 'Lithuania',
        dialCode: '+370',
        code: 'LT',
    },
    LU: {
        name: 'Luxembourg',
        dialCode: '+352',
        code: 'LU',
    },
    MO: {
        name: 'Macao',
        dialCode: '+853',
        code: 'MO',
    },
    MK: {
        name: 'Macedonia',
        dialCode: '+389',
        code: 'MK',
    },
    MG: {
        name: 'Madagascar',
        dialCode: '+261',
        code: 'MG',
    },
    MW: {
        name: 'Malawi',
        dialCode: '+265',
        code: 'MW',
    },
    MY: {
        name: 'Malaysia',
        dialCode: '+60',
        code: 'MY',
    },
    MV: {
        name: 'Maldives',
        dialCode: '+960',
        code: 'MV',
    },
    ML: {
        name: 'Mali',
        dialCode: '+223',
        code: 'ML',
    },
    MT: {
        name: 'Malta',
        dialCode: '+356',
        code: 'MT',
    },
    MH: {
        name: 'Marshall Islands',
        dialCode: '+692',
        code: 'MH',
    },
    MQ: {
        name: 'Martinique',
        dialCode: '+596',
        code: 'MQ',
    },
    MR: {
        name: 'Mauritania',
        dialCode: '+222',
        code: 'MR',
    },
    MU: {
        name: 'Mauritius',
        dialCode: '+230',
        code: 'MU',
    },
    YT: {
        name: 'Mayotte',
        dialCode: '+262',
        code: 'YT',
    },
    MX: {
        name: 'Mexico',
        dialCode: '+52',
        code: 'MX',
    },
    FM: {
        name: 'Micronesia, Federated States of Micronesia',
        dialCode: '+691',
        code: 'FM',
    },
    MD: {
        name: 'Moldova',
        dialCode: '+373',
        code: 'MD',
    },
    MC: {
        name: 'Monaco',
        dialCode: '+377',
        code: 'MC',
    },
    MN: {
        name: 'Mongolia',
        dialCode: '+976',
        code: 'MN',
    },
    ME: {
        name: 'Montenegro',
        dialCode: '+382',
        code: 'ME',
    },
    MS: {
        name: 'Montserrat',
        dialCode: '+1664',
        code: 'MS',
    },
    MA: {
        name: 'Morocco',
        dialCode: '+212',
        code: 'MA',
    },
    MZ: {
        name: 'Mozambique',
        dialCode: '+258',
        code: 'MZ',
    },
    MM: {
        name: 'Myanmar',
        dialCode: '+95',
        code: 'MM',
    },
    NA: {
        name: 'Namibia',
        dialCode: '+264',
        code: 'NA',
    },
    NR: {
        name: 'Nauru',
        dialCode: '+674',
        code: 'NR',
    },
    NP: {
        name: 'Nepal',
        dialCode: '+977',
        code: 'NP',
    },
    NL: {
        name: 'Netherlands',
        dialCode: '+31',
        code: 'NL',
    },
    AN: {
        name: 'Netherlands Antilles',
        dialCode: '+599',
        code: 'AN',
    },
    NC: {
        name: 'New Caledonia',
        dialCode: '+687',
        code: 'NC',
    },
    NZ: {
        name: 'New Zealand',
        dialCode: '+64',
        code: 'NZ',
    },
    NI: {
        name: 'Nicaragua',
        dialCode: '+505',
        code: 'NI',
    },
    NE: {
        name: 'Niger',
        dialCode: '+227',
        code: 'NE',
    },
    NG: {
        name: 'Nigeria',
        dialCode: '+234',
        code: 'NG',
    },
    NU: {
        name: 'Niue',
        dialCode: '+683',
        code: 'NU',
    },
    NF: {
        name: 'Norfolk Island',
        dialCode: '+672',
        code: 'NF',
    },
    MP: {
        name: 'Northern Mariana Islands',
        dialCode: '+1670',
        code: 'MP',
    },
    NO: {
        name: 'Norway',
        dialCode: '+47',
        code: 'NO',
    },
    OM: {
        name: 'Oman',
        dialCode: '+968',
        code: 'OM',
    },
    PK: {
        name: 'Pakistan',
        dialCode: '+92',
        code: 'PK',
    },
    PW: {
        name: 'Palau',
        dialCode: '+680',
        code: 'PW',
    },
    PS: {
        name: 'Palestinian Territory, Occupied',
        dialCode: '+970',
        code: 'PS',
    },
    PA: {
        name: 'Panama',
        dialCode: '+507',
        code: 'PA',
    },
    PG: {
        name: 'Papua New Guinea',
        dialCode: '+675',
        code: 'PG',
    },
    PY: {
        name: 'Paraguay',
        dialCode: '+595',
        code: 'PY',
    },
    PE: {
        name: 'Peru',
        dialCode: '+51',
        code: 'PE',
    },
    PH: {
        name: 'Philippines',
        dialCode: '+63',
        code: 'PH',
    },
    PN: {
        name: 'Pitcairn',
        dialCode: '+872',
        code: 'PN',
    },
    PL: {
        name: 'Poland',
        dialCode: '+48',
        code: 'PL',
    },
    PT: {
        name: 'Portugal',
        dialCode: '+351',
        code: 'PT',
    },
    PR: {
        name: 'Puerto Rico',
        dialCode: '+1939',
        code: 'PR',
    },
    QA: {
        name: 'Qatar',
        dialCode: '+974',
        code: 'QA',
    },
    RO: {
        name: 'Romania',
        dialCode: '+40',
        code: 'RO',
    },
    RU: {
        name: 'Russia',
        dialCode: '+7',
        code: 'RU',
    },
    RW: {
        name: 'Rwanda',
        dialCode: '+250',
        code: 'RW',
    },
    RE: {
        name: 'Reunion',
        dialCode: '+262',
        code: 'RE',
    },
    BL: {
        name: 'Saint Barthelemy',
        dialCode: '+590',
        code: 'BL',
    },
    SH: {
        name: 'Saint Helena, Ascension and Tristan Da Cunha',
        dialCode: '+290',
        code: 'SH',
    },
    KN: {
        name: 'Saint Kitts and Nevis',
        dialCode: '+1869',
        code: 'KN',
    },
    LC: {
        name: 'Saint Lucia',
        dialCode: '+1758',
        code: 'LC',
    },
    MF: {
        name: 'Saint Martin',
        dialCode: '+590',
        code: 'MF',
    },
    PM: {
        name: 'Saint Pierre and Miquelon',
        dialCode: '+508',
        code: 'PM',
    },
    VC: {
        name: 'Saint Vincent and the Grenadines',
        dialCode: '+1784',
        code: 'VC',
    },
    WS: {
        name: 'Samoa',
        dialCode: '+685',
        code: 'WS',
    },
    SM: {
        name: 'San Marino',
        dialCode: '+378',
        code: 'SM',
    },
    ST: {
        name: 'Sao Tome and Principe',
        dialCode: '+239',
        code: 'ST',
    },
    SA: {
        name: 'Saudi Arabia',
        dialCode: '+966',
        code: 'SA',
    },
    SN: {
        name: 'Senegal',
        dialCode: '+221',
        code: 'SN',
    },
    RS: {
        name: 'Serbia',
        dialCode: '+381',
        code: 'RS',
    },
    SC: {
        name: 'Seychelles',
        dialCode: '+248',
        code: 'SC',
    },
    SL: {
        name: 'Sierra Leone',
        dialCode: '+232',
        code: 'SL',
    },
    SG: {
        name: 'Singapore',
        dialCode: '+65',
        code: 'SG',
    },
    SK: {
        name: 'Slovakia',
        dialCode: '+421',
        code: 'SK',
    },
    SI: {
        name: 'Slovenia',
        dialCode: '+386',
        code: 'SI',
    },
    SB: {
        name: 'Solomon Islands',
        dialCode: '+677',
        code: 'SB',
    },
    SO: {
        name: 'Somalia',
        dialCode: '+252',
        code: 'SO',
    },
    ZA: {
        name: 'South Africa',
        dialCode: '+27',
        code: 'ZA',
    },
    SS: {
        name: 'South Sudan',
        dialCode: '+211',
        code: 'SS',
    },
    GS: {
        name: 'South Georgia and the South Sandwich Islands',
        dialCode: '+500',
        code: 'GS',
    },
    ES: {
        name: 'Spain',
        dialCode: '+34',
        code: 'ES',
    },
    LK: {
        name: 'Sri Lanka',
        dialCode: '+94',
        code: 'LK',
    },
    SD: {
        name: 'Sudan',
        dialCode: '+249',
        code: 'SD',
    },
    SR: {
        name: 'Suriname',
        dialCode: '+597',
        code: 'SR',
    },
    SJ: {
        name: 'Svalbard and Jan Mayen',
        dialCode: '+47',
        code: 'SJ',
    },
    SZ: {
        name: 'Swaziland',
        dialCode: '+268',
        code: 'SZ',
    },
    SE: {
        name: 'Sweden',
        dialCode: '+46',
        code: 'SE',
    },
    CH: {
        name: 'Switzerland',
        dialCode: '+41',
        code: 'CH',
    },
    SY: {
        name: 'Syrian Arab Republic',
        dialCode: '+963',
        code: 'SY',
    },
    TW: {
        name: 'Taiwan',
        dialCode: '+886',
        code: 'TW',
    },
    TJ: {
        name: 'Tajikistan',
        dialCode: '+992',
        code: 'TJ',
    },
    TZ: {
        name: 'Tanzania, United Republic of Tanzania',
        dialCode: '+255',
        code: 'TZ',
    },
    TH: {
        name: 'Thailand',
        dialCode: '+66',
        code: 'TH',
    },
    TL: {
        name: 'Timor-Leste',
        dialCode: '+670',
        code: 'TL',
    },
    TG: {
        name: 'Togo',
        dialCode: '+228',
        code: 'TG',
    },
    TK: {
        name: 'Tokelau',
        dialCode: '+690',
        code: 'TK',
    },
    TO: {
        name: 'Tonga',
        dialCode: '+676',
        code: 'TO',
    },
    TT: {
        name: 'Trinidad and Tobago',
        dialCode: '+1868',
        code: 'TT',
    },
    TN: {
        name: 'Tunisia',
        dialCode: '+216',
        code: 'TN',
    },
    TR: {
        name: 'Turkey',
        dialCode: '+90',
        code: 'TR',
    },
    TM: {
        name: 'Turkmenistan',
        dialCode: '+993',
        code: 'TM',
    },
    TC: {
        name: 'Turks and Caicos Islands',
        dialCode: '+1649',
        code: 'TC',
    },
    TV: {
        name: 'Tuvalu',
        dialCode: '+688',
        code: 'TV',
    },
    UG: {
        name: 'Uganda',
        dialCode: '+256',
        code: 'UG',
    },
    UA: {
        name: 'Ukraine',
        dialCode: '+380',
        code: 'UA',
    },
    AE: {
        name: 'United Arab Emirates',
        dialCode: '+971',
        code: 'AE',
    },
    GB: {
        name: 'United Kingdom',
        dialCode: '+44',
        code: 'GB',
    },
    US: {
        name: 'United States',
        dialCode: '+1',
        code: 'US',
    },
    UY: {
        name: 'Uruguay',
        dialCode: '+598',
        code: 'UY',
    },
    UZ: {
        name: 'Uzbekistan',
        dialCode: '+998',
        code: 'UZ',
    },
    VU: {
        name: 'Vanuatu',
        dialCode: '+678',
        code: 'VU',
    },
    VE: {
        name: 'Venezuela, Bolivarian Republic of Venezuela',
        dialCode: '+58',
        code: 'VE',
    },
    VN: {
        name: 'Vietnam',
        dialCode: '+84',
        code: 'VN',
    },
    VG: {
        name: 'Virgin Islands, British',
        dialCode: '+1284',
        code: 'VG',
    },
    VI: {
        name: 'Virgin Islands, U.S.',
        dialCode: '+1340',
        code: 'VI',
    },
    WF: {
        name: 'Wallis and Futuna',
        dialCode: '+681',
        code: 'WF',
    },
    YE: {
        name: 'Yemen',
        dialCode: '+967',
        code: 'YE',
    },
    ZM: {
        name: 'Zambia',
        dialCode: '+260',
        code: 'ZM',
    },
    ZW: {
        name: 'Zimbabwe',
        dialCode: '+263',
        code: 'ZW',
    },
};
