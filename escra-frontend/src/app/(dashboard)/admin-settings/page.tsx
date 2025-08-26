'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import { TbCameraCog, TbActivity, TbBuildingEstate, TbShoppingBagEdit, TbWorld, TbBuildingCommunity, TbBallAmericanFootball, TbTool, TbWallet, TbLock, TbKey, TbApiApp, TbDevicesX, TbKeyOff, TbWalletOff, TbPlug, TbPlugOff, TbApiOff, TbWebhookOff, TbApiAppOff } from 'react-icons/tb';
import { HiChevronDown, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineKey, HiOutlineDuplicate, HiStatusOffline } from 'react-icons/hi';
import { MdOutlineGeneratingTokens, MdWebhook, MdOutlineSportsFootball, MdOutlineMovieFilter, MdOutlineHealthAndSafety, MdCancelPresentation } from 'react-icons/md';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { PiEjectBold, PiPowerBold, PiLockKeyBold, PiMinusSquareBold } from 'react-icons/pi';
import { LuConstruction, LuBriefcaseBusiness } from 'react-icons/lu';
import { GrMoney, GrUserWorker } from 'react-icons/gr';
import { VscLaw } from 'react-icons/vsc';
import { LiaToolsSolid } from 'react-icons/lia';
import { HiOutlineChip } from 'react-icons/hi';
import { CgAddR, CgRemoveR } from 'react-icons/cg';
import { HiOutlineQrcode } from 'react-icons/hi';
import { IconType } from 'react-icons';
import { Logo } from '@/components/common/Logo';
import { useNotifications } from '@/context/NotificationContext';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'company', label: 'Company' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'api', label: 'API' },
  { key: 'webhooks', label: 'Webhooks' },
  { key: 'billing', label: 'Billing' },
];

const USER_ROLES = ['Viewer', 'Signer', 'Editor', 'Creator', 'Admin'];
const DOCUMENT_LANGUAGES = ['English', 'Spanish', 'French', 'Italian'];
const SIGNATURE_SETTINGS = ['Draw', 'Type', 'Upload'];
const SIGNING_CERTIFICATE_OPTIONS = ['Yes', 'No'];
const WEBHOOK_TRIGGERS = [
  'document.created',
  'document.signed',
  'document.completed',
  'document.deleted',
  'signature.requested',
  'signature.completed',
  'user.invited',
  'user.removed'
];

interface IndustryOption {
  value: string;
  label: string;
  icon: IconType;
}

const COMPANY_TYPES = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'llc', label: 'Limited Liability Company (LLC)' },
  { value: 'other', label: 'Other' }
];

const INDUSTRIES: IndustryOption[] = [
      { value: 'real_estate', label: 'Real Estate', icon: TbBuildingCommunity },
      { value: 'athletics', label: 'Athletics', icon: TbBallAmericanFootball },
  { value: 'construction', label: 'Construction', icon: LuConstruction },
  { value: 'entertainment', label: 'Entertainment', icon: MdOutlineMovieFilter },
  { value: 'finance', label: 'Finance', icon: GrMoney },
  { value: 'healthcare', label: 'Healthcare', icon: MdOutlineHealthAndSafety },
  { value: 'labor', label: 'Labor', icon: GrUserWorker },
  { value: 'legal', label: 'Legal', icon: VscLaw },
      { value: 'manufacturing', label: 'Manufacturing', icon: TbTool },
  { value: 'retail', label: 'Retail', icon: TbShoppingBagEdit },
  { value: 'supply_chain', label: 'Logistics', icon: TbWorld },
  { value: 'technology', label: 'Technology', icon: HiOutlineChip },
  { value: 'other', label: 'Other', icon: LuBriefcaseBusiness }
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'MX', label: 'Mexico' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'IT', label: 'Italy' },
  { value: 'ES', label: 'Spain' },
  { value: 'AU', label: 'Australia' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'IN', label: 'India' },
  { value: 'BR', label: 'Brazil' },
  { value: 'RU', label: 'Russia' },
  { value: 'KR', label: 'South Korea' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'SE', label: 'Sweden' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'NO', label: 'Norway' },
  { value: 'DK', label: 'Denmark' },
  { value: 'FI', label: 'Finland' },
  { value: 'PL', label: 'Poland' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgium' },
  { value: 'PT', label: 'Portugal' },
  { value: 'IE', label: 'Ireland' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'SG', label: 'Singapore' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'IL', label: 'Israel' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'TH', label: 'Thailand' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'PH', label: 'Philippines' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'AR', label: 'Argentina' },
  { value: 'CL', label: 'Chile' },
  { value: 'CO', label: 'Colombia' },
  { value: 'PE', label: 'Peru' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'EG', label: 'Egypt' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'KE', label: 'Kenya' },
  { value: 'MA', label: 'Morocco' },
  { value: 'TN', label: 'Tunisia' },
  { value: 'DZ', label: 'Algeria' },
  { value: 'GH', label: 'Ghana' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'UG', label: 'Uganda' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'ZW', label: 'Zimbabwe' },
  { value: 'BW', label: 'Botswana' },
  { value: 'NA', label: 'Namibia' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'AO', label: 'Angola' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'SO', label: 'Somalia' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'TD', label: 'Chad' },
  { value: 'NE', label: 'Niger' },
  { value: 'ML', label: 'Mali' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'CI', label: 'Ivory Coast' },
  { value: 'SN', label: 'Senegal' },
  { value: 'GN', label: 'Guinea' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'LR', label: 'Liberia' },
  { value: 'TG', label: 'Togo' },
  { value: 'BJ', label: 'Benin' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'GM', label: 'Gambia' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'LY', label: 'Libya' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'KM', label: 'Comoros' },
  { value: 'KM', label: 'Comoros' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'GA', label: 'Gabon' },
  { value: 'CG', label: 'Republic of the Congo' },
  { value: 'CD', label: 'Democratic Republic of the Congo' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'BI', label: 'Burundi' },
  { value: 'MW', label: 'Malawi' },
  { value: 'SZ', label: 'Eswatini' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'RE', label: 'Reunion' },
  { value: 'YT', label: 'Mayotte' },
  { value: 'SH', label: 'Saint Helena' },
  { value: 'AC', label: 'Ascension Island' },
  { value: 'TA', label: 'Tristan da Cunha' },
  { value: 'IO', label: 'British Indian Ocean Territory' },
  { value: 'TF', label: 'French Southern Territories' },
  { value: 'HM', label: 'Heard Island and McDonald Islands' },
  { value: 'AQ', label: 'Antarctica' },
  { value: 'BV', label: 'Bouvet Island' },
  { value: 'GS', label: 'South Georgia and the South Sandwich Islands' },
  { value: 'FK', label: 'Falkland Islands' },
  { value: 'GF', label: 'French Guiana' },
  { value: 'GY', label: 'Guyana' },
  { value: 'SR', label: 'Suriname' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'PA', label: 'Panama' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'HN', label: 'Honduras' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'BZ', label: 'Belize' },
  { value: 'CU', label: 'Cuba' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'HT', label: 'Haiti' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'VI', label: 'U.S. Virgin Islands' },
  { value: 'VG', label: 'British Virgin Islands' },
  { value: 'AI', label: 'Anguilla' },
  { value: 'AW', label: 'Aruba' },
  { value: 'CW', label: 'Curacao' },
  { value: 'SX', label: 'Sint Maarten' },
  { value: 'BL', label: 'Saint Barthelemy' },
  { value: 'MF', label: 'Saint Martin' },
  { value: 'GP', label: 'Guadeloupe' },
  { value: 'MQ', label: 'Martinique' },
  { value: 'DM', label: 'Dominica' },
  { value: 'LC', label: 'Saint Lucia' },
  { value: 'VC', label: 'Saint Vincent and the Grenadines' },
  { value: 'BB', label: 'Barbados' },
  { value: 'GD', label: 'Grenada' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'KN', label: 'Saint Kitts and Nevis' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'TC', label: 'Turks and Caicos Islands' },
  { value: 'KY', label: 'Cayman Islands' },
  { value: 'BM', label: 'Bermuda' },
  { value: 'GL', label: 'Greenland' },
  { value: 'IS', label: 'Iceland' },
  { value: 'FO', label: 'Faroe Islands' },
  { value: 'SJ', label: 'Svalbard and Jan Mayen' },
  { value: 'AX', label: 'Aland Islands' },
  { value: 'AD', label: 'Andorra' },
  { value: 'MC', label: 'Monaco' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'SM', label: 'San Marino' },
  { value: 'VA', label: 'Vatican City' },
  { value: 'MT', label: 'Malta' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'GR', label: 'Greece' },
  { value: 'HR', label: 'Croatia' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'HU', label: 'Hungary' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'RO', label: 'Romania' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'RS', label: 'Serbia' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'MK', label: 'North Macedonia' },
  { value: 'AL', label: 'Albania' },
  { value: 'XK', label: 'Kosovo' },
  { value: 'MD', label: 'Moldova' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'BY', label: 'Belarus' },
  { value: 'LV', label: 'Latvia' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'EE', label: 'Estonia' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'NP', label: 'Nepal' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'MV', label: 'Maldives' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'LA', label: 'Laos' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'KP', label: 'North Korea' },
  { value: 'MO', label: 'Macau' },
  { value: 'BN', label: 'Brunei' },
  { value: 'TL', label: 'East Timor' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'NC', label: 'New Caledonia' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'TO', label: 'Tonga' },
  { value: 'WS', label: 'Samoa' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'TV', label: 'Tuvalu' },
  { value: 'NR', label: 'Nauru' },
  { value: 'PW', label: 'Palau' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'CK', label: 'Cook Islands' },
  { value: 'NU', label: 'Niue' },
  { value: 'TK', label: 'Tokelau' },
  { value: 'AS', label: 'American Samoa' },
  { value: 'GU', label: 'Guam' },
  { value: 'MP', label: 'Northern Mariana Islands' },
  { value: 'PF', label: 'French Polynesia' },
  { value: 'WF', label: 'Wallis and Futuna' },
  { value: 'TK', label: 'Tokelau' },
  { value: 'NU', label: 'Niue' },
  { value: 'CK', label: 'Cook Islands' },
  { value: 'MH', label: 'Marshall Islands' },
  { value: 'FM', label: 'Micronesia' },
  { value: 'PW', label: 'Palau' },
  { value: 'NR', label: 'Nauru' },
  { value: 'TV', label: 'Tuvalu' },
  { value: 'KI', label: 'Kiribati' },
  { value: 'WS', label: 'Samoa' },
  { value: 'TO', label: 'Tonga' },
  { value: 'SB', label: 'Solomon Islands' },
  { value: 'VU', label: 'Vanuatu' },
  { value: 'NC', label: 'New Caledonia' },
  { value: 'FJ', label: 'Fiji' },
  { value: 'PG', label: 'Papua New Guinea' },
  { value: 'TL', label: 'East Timor' },
  { value: 'BN', label: 'Brunei' },
  { value: 'MO', label: 'Macau' },
  { value: 'KP', label: 'North Korea' },
  { value: 'MN', label: 'Mongolia' },
  { value: 'LA', label: 'Laos' },
  { value: 'KH', label: 'Cambodia' },
  { value: 'MM', label: 'Myanmar' },
  { value: 'MV', label: 'Maldives' },
  { value: 'BT', label: 'Bhutan' },
  { value: 'NP', label: 'Nepal' },
  { value: 'LK', label: 'Sri Lanka' },
  { value: 'BD', label: 'Bangladesh' },
  { value: 'PK', label: 'Pakistan' },
  { value: 'AF', label: 'Afghanistan' },
  { value: 'KG', label: 'Kyrgyzstan' },
  { value: 'TJ', label: 'Tajikistan' },
  { value: 'TM', label: 'Turkmenistan' },
  { value: 'UZ', label: 'Uzbekistan' },
  { value: 'KZ', label: 'Kazakhstan' },
  { value: 'EE', label: 'Estonia' },
  { value: 'LT', label: 'Lithuania' },
  { value: 'LV', label: 'Latvia' },
  { value: 'BY', label: 'Belarus' },
  { value: 'UA', label: 'Ukraine' },
  { value: 'MD', label: 'Moldova' },
  { value: 'XK', label: 'Kosovo' },
  { value: 'AL', label: 'Albania' },
  { value: 'MK', label: 'North Macedonia' },
  { value: 'BA', label: 'Bosnia and Herzegovina' },
  { value: 'ME', label: 'Montenegro' },
  { value: 'RS', label: 'Serbia' },
  { value: 'BG', label: 'Bulgaria' },
  { value: 'RO', label: 'Romania' },
  { value: 'CZ', label: 'Czech Republic' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'HU', label: 'Hungary' },
  { value: 'SI', label: 'Slovenia' },
  { value: 'HR', label: 'Croatia' },
  { value: 'GR', label: 'Greece' },
  { value: 'CY', label: 'Cyprus' },
  { value: 'MT', label: 'Malta' },
  { value: 'VA', label: 'Vatican City' },
  { value: 'SM', label: 'San Marino' },
  { value: 'LI', label: 'Liechtenstein' },
  { value: 'MC', label: 'Monaco' },
  { value: 'AD', label: 'Andorra' },
  { value: 'AX', label: 'Aland Islands' },
  { value: 'SJ', label: 'Svalbard and Jan Mayen' },
  { value: 'FO', label: 'Faroe Islands' },
  { value: 'IS', label: 'Iceland' },
  { value: 'GL', label: 'Greenland' },
  { value: 'BM', label: 'Bermuda' },
  { value: 'KY', label: 'Cayman Islands' },
  { value: 'TC', label: 'Turks and Caicos Islands' },
  { value: 'BS', label: 'Bahamas' },
  { value: 'AG', label: 'Antigua and Barbuda' },
  { value: 'KN', label: 'Saint Kitts and Nevis' },
  { value: 'TT', label: 'Trinidad and Tobago' },
  { value: 'GD', label: 'Grenada' },
  { value: 'BB', label: 'Barbados' },
  { value: 'VC', label: 'Saint Vincent and the Grenadines' },
  { value: 'LC', label: 'Saint Lucia' },
  { value: 'DM', label: 'Dominica' },
  { value: 'MQ', label: 'Martinique' },
  { value: 'GP', label: 'Guadeloupe' },
  { value: 'MF', label: 'Saint Martin' },
  { value: 'BL', label: 'Saint Barthelemy' },
  { value: 'SX', label: 'Sint Maarten' },
  { value: 'CW', label: 'Curacao' },
  { value: 'AW', label: 'Aruba' },
  { value: 'AI', label: 'Anguilla' },
  { value: 'VG', label: 'British Virgin Islands' },
  { value: 'VI', label: 'U.S. Virgin Islands' },
  { value: 'PR', label: 'Puerto Rico' },
  { value: 'DO', label: 'Dominican Republic' },
  { value: 'HT', label: 'Haiti' },
  { value: 'JM', label: 'Jamaica' },
  { value: 'CU', label: 'Cuba' },
  { value: 'BZ', label: 'Belize' },
  { value: 'GT', label: 'Guatemala' },
  { value: 'SV', label: 'El Salvador' },
  { value: 'HN', label: 'Honduras' },
  { value: 'NI', label: 'Nicaragua' },
  { value: 'PA', label: 'Panama' },
  { value: 'CR', label: 'Costa Rica' },
  { value: 'EC', label: 'Ecuador' },
  { value: 'BO', label: 'Bolivia' },
  { value: 'PY', label: 'Paraguay' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'SR', label: 'Suriname' },
  { value: 'GF', label: 'French Guiana' },
  { value: 'FK', label: 'Falkland Islands' },
  { value: 'GS', label: 'South Georgia and the South Sandwich Islands' },
  { value: 'BV', label: 'Bouvet Island' },
  { value: 'AQ', label: 'Antarctica' },
  { value: 'HM', label: 'Heard Island and McDonald Islands' },
  { value: 'TF', label: 'French Southern Territories' },
  { value: 'IO', label: 'British Indian Ocean Territory' },
  { value: 'TA', label: 'Tristan da Cunha' },
  { value: 'AC', label: 'Ascension Island' },
  { value: 'SH', label: 'Saint Helena' },
  { value: 'YT', label: 'Mayotte' },
  { value: 'RE', label: 'Reunion' },
  { value: 'LS', label: 'Lesotho' },
  { value: 'SZ', label: 'Eswatini' },
  { value: 'MW', label: 'Malawi' },
  { value: 'BI', label: 'Burundi' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'CD', label: 'Democratic Republic of the Congo' },
  { value: 'CG', label: 'Republic of the Congo' },
  { value: 'GA', label: 'Gabon' },
  { value: 'GQ', label: 'Equatorial Guinea' },
  { value: 'ST', label: 'Sao Tome and Principe' },
  { value: 'KM', label: 'Comoros' },
  { value: 'ER', label: 'Eritrea' },
  { value: 'LY', label: 'Libya' },
  { value: 'MR', label: 'Mauritania' },
  { value: 'GM', label: 'Gambia' },
  { value: 'CV', label: 'Cape Verde' },
  { value: 'GW', label: 'Guinea-Bissau' },
  { value: 'BJ', label: 'Benin' },
  { value: 'TG', label: 'Togo' },
  { value: 'LR', label: 'Liberia' },
  { value: 'SL', label: 'Sierra Leone' },
  { value: 'GN', label: 'Guinea' },
  { value: 'SN', label: 'Senegal' },
  { value: 'CI', label: 'Ivory Coast' },
  { value: 'BF', label: 'Burkina Faso' },
  { value: 'ML', label: 'Mali' },
  { value: 'NE', label: 'Niger' },
  { value: 'TD', label: 'Chad' },
  { value: 'CF', label: 'Central African Republic' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'SD', label: 'Sudan' },
  { value: 'SO', label: 'Somalia' },
  { value: 'DJ', label: 'Djibouti' },
  { value: 'SC', label: 'Seychelles' },
  { value: 'MU', label: 'Mauritius' },
  { value: 'MG', label: 'Madagascar' },
  { value: 'AO', label: 'Angola' },
  { value: 'MZ', label: 'Mozambique' },
  { value: 'NA', label: 'Namibia' },
  { value: 'BW', label: 'Botswana' },
  { value: 'ZW', label: 'Zimbabwe' },
  { value: 'ZM', label: 'Zambia' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'UG', label: 'Uganda' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'NG', label: 'Nigeria' },
  { value: 'EG', label: 'Egypt' },
  { value: 'ZA', label: 'South Africa' },
  { value: 'VE', label: 'Venezuela' },
  { value: 'PE', label: 'Peru' },
  { value: 'CO', label: 'Colombia' },
  { value: 'CL', label: 'Chile' },
  { value: 'AR', label: 'Argentina' },
  { value: 'ID', label: 'Indonesia' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'PH', label: 'Philippines' },
  { value: 'MY', label: 'Malaysia' },
  { value: 'TH', label: 'Thailand' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'SA', label: 'Saudi Arabia' },
  { value: 'TR', label: 'Turkey' },
  { value: 'IL', label: 'Israel' },
  { value: 'TW', label: 'Taiwan' },
  { value: 'HK', label: 'Hong Kong' },
  { value: 'SG', label: 'Singapore' },
  { value: 'NZ', label: 'New Zealand' },
  { value: 'IE', label: 'Ireland' },
  { value: 'PT', label: 'Portugal' },
  { value: 'BE', label: 'Belgium' },
  { value: 'AT', label: 'Austria' },
  { value: 'PL', label: 'Poland' },
  { value: 'FI', label: 'Finland' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SE', label: 'Sweden' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'KR', label: 'South Korea' },
  { value: 'RU', label: 'Russia' },
  { value: 'BR', label: 'Brazil' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'JP', label: 'Japan' },
  { value: 'AU', label: 'Australia' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'FR', label: 'France' },
  { value: 'DE', label: 'Germany' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'MX', label: 'Mexico' },
  { value: 'CA', label: 'Canada' },
  { value: 'US', label: 'United States' }
];

// Mock activity data
const recentActivityData = [
  {
    date: '7/29/2025, 1:39 PM',
    device: 'Mac OS (10.15.7)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Profile updated'
  },
  {
    date: '7/28/2025, 3:27 PM',
    device: 'Mac OS (10.15.7)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Signed In'
  },
  {
    date: '6/27/2025, 9:44 AM',
    device: 'Mac OS (10.15.7)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Signed In'
  },
  {
    date: '6/27/2025, 9:43 AM',
    device: 'iOS (18.5)',
    browser: 'Brave',
    ipAddress: '24.164.49.187',
    action: 'Signed In'
  }
];

// Mock sessions data
const sessionsData = [
  {
    device: 'Brave (Mac OS)',
    ipAddress: '24.164.49.187',
    lastActive: '1 day ago',
    created: '1 day ago',
    isCurrent: true
  },
  {
    device: 'Safari (iPhone)',
    ipAddress: '24.164.49.187',
    lastActive: '3 hours ago',
    created: '2 days ago',
    isCurrent: false
  },
  {
    device: 'Firefox (Mac OS)',
    ipAddress: '24.164.49.187',
    lastActive: '1 week ago',
    created: '1 week ago',
    isCurrent: false
  }
];

// Mock passkeys data
const passkeysData = [
  {
    name: 'iPhone 15 Pro',
    created: '2 weeks ago',
    lastUsed: '1 day ago'
  },
  {
    name: 'MacBook Pro',
    created: '1 month ago',
    lastUsed: '3 hours ago'
  },
  {
    name: 'iPad Air',
    created: '3 weeks ago',
    lastUsed: '1 week ago'
  }
];

// Mock API tokens data
const apiTokensData = [
  {
    name: 'Production API',
    created: '1 month ago',
    lastUsed: '2 hours ago'
  },
  {
    name: 'Development API',
    created: '2 weeks ago',
    lastUsed: '1 day ago'
  },
  {
    name: 'Testing API',
    created: '1 week ago',
    lastUsed: '3 days ago'
  }
];

// Mock webhooks data
const webhooksData = [
  {
    name: 'Contract Signed Webhook',
    url: 'https://api.example.com/webhooks/contract-signed',
    created: '2 weeks ago',
    lastUsed: '1 day ago'
  },
  {
    name: 'User Invited Webhook',
    url: 'https://api.example.com/webhooks/user-invited',
    created: '1 week ago',
    lastUsed: '3 days ago'
  }
];

// Billing plans data
const billingPlans = [
  {
    name: 'Essential',
    monthlyPrice: 9,
    yearlyPrice: 90,
    description: 'Tamper-proof essential signing tools',
    features: [
      '5 contracts per month',
      '20 GB document storage',
      'Unlimited Recipients',
      '2FA Authentication',
      'KYC verification',
      'Blockchain secured completion'
    ]
  },
  {
    name: 'Pro',
    monthlyPrice: 29,
    yearlyPrice: 290,
    description: 'Enhanced contract capacity, advanced security & granular auditability',
    features: [
      '50 contracts per month',
      '5 custom templates',
      '100 GB document storage',
      'Complete audit trail',
      'KYC/KYB verification',
      'Advanced Analytics',
      'Select third-party integrations'
    ]
  },
  {
    name: 'Growth',
    monthlyPrice: 99,
    yearlyPrice: 990,
    description: 'A shared workspace for your team',
    features: [
      '500 contracts per month',
      'Up to 10 custom templates',
      '750 GB document storage',
      'Includes 3 members',
      'Add more users at $9 per month',
      'Custom branding',
      'Robust third-party integrations'
    ]
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Signing solutions tailored for organizations at scale',
    features: [
      'Unlimited contracts',
      '1 TB+ document storage',
      'Multi-team support',
      'Flexible user licensing',
      'Whitelabeling',
      'Dedicated account manager',
      'Integration Support'
    ]
  }
];

export default function AdminSettingsPage() {
  const { addPasskeyAddedNotification, addPasskeyRemovedNotification, addWalletAddedNotification, addWalletRemovedNotification, addApiTokenAddedNotification, addApiTokenRemovedNotification } = useNotifications();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('Admin');
  const [showUserRoleDropdown, setShowUserRoleDropdown] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [includeSigningCertificate, setIncludeSigningCertificate] = useState('Yes');
  const [showSigningCertificateDropdown, setShowSigningCertificateDropdown] = useState(false);
  const [defaultSignatureSettings, setDefaultSignatureSettings] = useState<string[]>(['Draw', 'Type', 'Upload']);
  const [showSignatureSettingsDropdown, setShowSignatureSettingsDropdown] = useState(false);
  const [showRecentActivity, setShowRecentActivity] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [showPasskeys, setShowPasskeys] = useState(false);
  const [showAddPasskeyModal, setShowAddPasskeyModal] = useState(false);
  const [showEnable2FAModal, setShowEnable2FAModal] = useState(false);
  const [passkeyName, setPasskeyName] = useState('Brave (Mac OS)');
  const [showApiTokens, setShowApiTokens] = useState(false);
  const [showAddApiTokenModal, setShowAddApiTokenModal] = useState(false);
  const [apiTokenName, setApiTokenName] = useState('');
  const [tokenNeverExpire, setTokenNeverExpire] = useState(true);
  const [showTokenExpirationDropdown, setShowTokenExpirationDropdown] = useState(false);
  const [selectedTokenExpiration, setSelectedTokenExpiration] = useState('');
  const [showWebhooks, setShowWebhooks] = useState(false);
  const [showAddWebhookModal, setShowAddWebhookModal] = useState(false);
  const [webhookName, setWebhookName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEnabled, setWebhookEnabled] = useState(true);
  const [webhookSecret, setWebhookSecret] = useState('');
  const [webhookSecretVisible, setWebhookSecretVisible] = useState(false);
  const [webhookTriggers, setWebhookTriggers] = useState<string[]>([]);
  const [showTriggersDropdown, setShowTriggersDropdown] = useState(false);
  const [showOrganizations, setShowOrganizations] = useState(false);
  
  // User ID and wallet state
  const [userId, setUserId] = useState('1234567890');
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<string | null>(null);
                  const [connectedWallets, setConnectedWallets] = useState([
                  { id: '0', provider: 'Escra', name: 'Escra Default Wallet', address: 'ESCR1234567890ABCDEFGHIJKLMNOP', connected: true },
                  { id: '1', provider: 'Pera Wallet', name: 'Mobile Wallet', address: 'ABCD1234EFGH5678IJKL9012MNOP3456', connected: false },
                  { id: '2', provider: 'MyAlgo Wallet', name: 'Backup Wallet', address: 'QRST7890UVWX1234YZAB5678CDEF9012', connected: false }
                ]);
  const [showWallets, setShowWallets] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [selectedWalletProvider, setSelectedWalletProvider] = useState('');
  const [showWalletProviderDropdown, setShowWalletProviderDropdown] = useState(false);
  const [walletName, setWalletName] = useState('');
  
  // Company information state
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [showCompanyTypeDropdown, setShowCompanyTypeDropdown] = useState(false);
  const [businessAddress, setBusinessAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showIndustriesDropdown, setShowIndustriesDropdown] = useState(false);
  const [industrySearchTerm, setIndustrySearchTerm] = useState('');
  
  // Billing state
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  
  // Password visibility states
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  
  // Password actual values
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  // Password display values (for masking)
  const [currentPasswordDisplay, setCurrentPasswordDisplay] = useState('');
  const [newPasswordDisplay, setNewPasswordDisplay] = useState('');
  const [repeatPasswordDisplay, setRepeatPasswordDisplay] = useState('');
  
  // Password input handlers
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (currentPasswordVisible) {
      // When visible, update normally
      setCurrentPassword(inputValue);
      setCurrentPasswordDisplay(inputValue);
    } else {
      // When concealed, handle masking properly
      const currentLength = currentPassword.length;
      const inputLength = inputValue.length;
      
      if (inputLength > currentLength) {
        // Adding characters
        const newChar = inputValue.slice(-1);
        const newPassword = currentPassword + newChar;
        setCurrentPassword(newPassword);
        setCurrentPasswordDisplay(newPassword.replace(/./g, '*'));
      } else if (inputLength < currentLength) {
        // Removing characters
        const newPassword = currentPassword.slice(0, -1);
        setCurrentPassword(newPassword);
        setCurrentPasswordDisplay(newPassword.replace(/./g, '*'));
      }
    }
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (newPasswordVisible) {
      setNewPassword(inputValue);
      setNewPasswordDisplay(inputValue);
    } else {
      const currentLength = newPassword.length;
      const inputLength = inputValue.length;
      
      if (inputLength > currentLength) {
        const newChar = inputValue.slice(-1);
        const newPasswordValue = newPassword + newChar;
        setNewPassword(newPasswordValue);
        setNewPasswordDisplay(newPasswordValue.replace(/./g, '*'));
      } else if (inputLength < currentLength) {
        const newPasswordValue = newPassword.slice(0, -1);
        setNewPassword(newPasswordValue);
        setNewPasswordDisplay(newPasswordValue.replace(/./g, '*'));
      }
    }
  };
  
  const handleRepeatPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (repeatPasswordVisible) {
      setRepeatPassword(inputValue);
      setRepeatPasswordDisplay(inputValue);
    } else {
      const currentLength = repeatPassword.length;
      const inputLength = inputValue.length;
      
      if (inputLength > currentLength) {
        const newChar = inputValue.slice(-1);
        const newRepeatPassword = repeatPassword + newChar;
        setRepeatPassword(newRepeatPassword);
        setRepeatPasswordDisplay(newRepeatPassword.replace(/./g, '*'));
      } else if (inputLength < currentLength) {
        const newRepeatPassword = repeatPassword.slice(0, -1);
        setRepeatPassword(newRepeatPassword);
        setRepeatPasswordDisplay(newRepeatPassword.replace(/./g, '*'));
      }
    }
  };
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const userRoleDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const signingCertificateDropdownRef = useRef<HTMLDivElement>(null);
  const signatureSettingsDropdownRef = useRef<HTMLDivElement>(null);
  const tokenExpirationDropdownRef = useRef<HTMLDivElement>(null);
  const companyTypeDropdownRef = useRef<HTMLDivElement>(null);
  const stateDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const industriesDropdownRef = useRef<HTMLDivElement>(null);
  const walletProviderDropdownRef = useRef<HTMLDivElement>(null);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  // Handle dropdown click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Close user role dropdown if click is outside
      if (userRoleDropdownRef.current && !userRoleDropdownRef.current.contains(target)) {
        setShowUserRoleDropdown(false);
      }
      
      // Close language dropdown if click is outside
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(target)) {
        setShowLanguageDropdown(false);
      }
      
      // Close signing certificate dropdown if click is outside
      if (signingCertificateDropdownRef.current && !signingCertificateDropdownRef.current.contains(target)) {
        setShowSigningCertificateDropdown(false);
      }
      
      // Close signature settings dropdown if click is outside
      if (signatureSettingsDropdownRef.current && !signatureSettingsDropdownRef.current.contains(target)) {
        setShowSignatureSettingsDropdown(false);
      }
      
      // Close token expiration dropdown if click is outside
      if (tokenExpirationDropdownRef.current && !tokenExpirationDropdownRef.current.contains(target)) {
        setShowTokenExpirationDropdown(false);
      }
      
      // Close company type dropdown if click is outside
      if (companyTypeDropdownRef.current && !companyTypeDropdownRef.current.contains(target)) {
        setShowCompanyTypeDropdown(false);
      }
      
      // Close state dropdown if click is outside
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(target)) {
        setShowStateDropdown(false);
      }
      
      // Close country dropdown if click is outside
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
        setShowCountryDropdown(false);
      }
      
      // Close industries dropdown if click is outside
      if (industriesDropdownRef.current && !industriesDropdownRef.current.contains(target)) {
        setShowIndustriesDropdown(false);
      }
      
      // Close wallet provider dropdown if click is outside
      if (walletProviderDropdownRef.current && !walletProviderDropdownRef.current.contains(target)) {
        setShowWalletProviderDropdown(false);
      }
    }

    // Use both mousedown and click events for better coverage
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSignatureSettingToggle = (setting: string) => {
    setDefaultSignatureSettings(prev => 
      prev.includes(setting)
        ? prev.filter(s => s !== setting)
        : [...prev, setting]
    );
  };

  const getSignatureSettingsDisplayText = () => {
    if (defaultSignatureSettings.length === 0) return 'Select signature settings';
    return defaultSignatureSettings.join(', ');
  };

  // Company information handlers
  const handleIndustryToggle = (industryValue: string) => {
    setSelectedIndustries(prev => {
      if (prev.includes(industryValue)) {
        return prev.filter(i => i !== industryValue);
      }
      return [...prev, industryValue];
    });
  };

  const handleStateSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateSearchTerm(e.target.value);
  };

  const handleCountrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountrySearchTerm(e.target.value);
  };

  const handleIndustrySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIndustrySearchTerm(e.target.value);
  };

    // Test function to generate passkey notification toasts
  const generateTestPasskeyToasts = () => {
    // Test passkey added notification
    const testPasskeyName = "Test iPhone 15 Pro";
    
    toast({
      title: "Passkey Added Successfully",
      description: `"${testPasskeyName}" has been added successfully to your account`,
      duration: 5000,
    });
    
    // Add notification for test passkey added
    addPasskeyAddedNotification(testPasskeyName);

    // Test passkey removed notification after a delay
    setTimeout(() => {
      const removedPasskeyName = "Test MacBook Pro";
      
      toast({
        title: "Passkey Removed Successfully",
        description: `"${removedPasskeyName}" has been removed successfully from your account`,
        duration: 5000,
        variant: "voided",
      });
      
      // Add notification for test passkey removed
      addPasskeyRemovedNotification(removedPasskeyName);
    }, 2000); // 2 second delay

    // Test another passkey added notification after a delay
    setTimeout(() => {
      const anotherPasskeyName = "Test iPad Air";
      
      toast({
        title: "Passkey Added Successfully",
        description: `"${anotherPasskeyName}" has been added successfully to your account`,
        duration: 5000,
      });
      
      // Add notification for test passkey added
      addPasskeyAddedNotification(anotherPasskeyName);
    }, 4000); // 4 second delay
  };

  // Test function to generate wallet notification toasts
  const generateTestWalletToasts = () => {
    // Test wallet added notification
    const testWalletName = "Test Pera Wallet";
    
    toast({
      title: "Wallet Added Successfully",
      description: `"${testWalletName}" has been added successfully to your account`,
      duration: 5000,
    });
    
    // Add notification for test wallet added
    addWalletAddedNotification(testWalletName);

    // Test wallet removed notification after a delay
    setTimeout(() => {
      const removedWalletName = "Test MyAlgo Wallet";
      
      toast({
        title: "Wallet Removed Successfully",
        description: `"${removedWalletName}" has been removed successfully from your account`,
        duration: 5000,
        variant: "voided",
      });
      
      // Add notification for test wallet removed
      addWalletRemovedNotification(removedWalletName);
    }, 2000); // 2 second delay

    // Test another wallet added notification after a delay
    setTimeout(() => {
      const anotherWalletName = "Test AlgoSigner";
      
      toast({
        title: "Wallet Added Successfully",
        description: `"${anotherWalletName}" has been added successfully to your account`,
        duration: 5000,
      });
      
      // Add notification for test wallet added
      addWalletAddedNotification(anotherWalletName);
    }, 4000); // 4 second delay
  };

  const scrollToSelectedState = () => {
    if (showStateDropdown && state) {
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-state-value="${state}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const scrollToSelectedCountry = () => {
    if (showCountryDropdown && country) {
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-country-value="${country}"]`);
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Helper function to generate user hash
  const getUserHash = (id: string) => {
    // Generate 10-digit Algorand-style hash from string ID
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Ensure 10 digits by padding with zeros if needed
    const hashStr = Math.abs(hash).toString();
    return hashStr.padStart(10, '0').slice(0, 10);
  };

  // Helper function to get wallet status badge styling (matching signatures table)
  const getWalletStatusBadgeStyle = (wallet: any) => {
    if (wallet.connected) {
      // All connected wallets use the same green color scheme as signatures "Completed" status
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-800 dark:border-green-800';
    } else {
      return 'bg-gray-100 dark:bg-gray-700/30 text-gray-800 dark:text-gray-400 border border-gray-800 dark:border-gray-500';
    }
  };

  return (
    <div className="flex h-screen">
      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
      
      <div className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div>
          {/* Page Title and Subtitle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-6 gap-4">
            <div>
              <h1 className="text-[30px] font-bold text-black dark:text-white mb-1">Settings</h1>
              <p className="text-gray-500 dark:text-gray-400 text-[16px] mt-0">Manage your account & system preferences</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={generateTestPasskeyToasts}
                className="flex items-center justify-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold w-full sm:w-auto"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                🧪 Test Passkey Notifications
              </button>
              <button
                onClick={generateTestWalletToasts}
                className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold w-full sm:w-auto"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                🧪 Test Wallet Notifications
              </button>
            </div>
          </div>
          {/* Divider Line */}
          <hr className="my-3 sm:my-6 border-gray-300 cursor-default select-none" />
          
          {/* Navigation Tabs */}
          <div className="hidden lg:flex gap-1 cursor-default select-none mb-6 -mt-2">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 font-sans flex items-center justify-center ${
                  activeTab === tab.key 
                    ? 'bg-white dark:bg-gray-800 text-teal-500 dark:text-teal-400 min-w-[90px] border-2 border-gray-200 dark:border-gray-700' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-fit border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className={`inline-block transition-all duration-300 ${activeTab === tab.key ? 'opacity-100 mr-1.5' : 'opacity-0 w-0 mr-0'}`} style={{width: activeTab === tab.key ? 16 : 0}}>
                  {activeTab === tab.key && <Logo width={16} height={16} className="pointer-events-none" />}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Scrollable Content Area */}
          <div className="overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden">
            {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Profile Information</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Update your personal details and contact information.</p>
                </div>
                <div className="relative w-28 h-28">
                  <div className="w-28 h-28 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    {avatarImage ? (
                      <img 
                        src={avatarImage} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="w-14 h-14 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    <TbCameraCog className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <form className="space-y-6">
                {/* User ID Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 -mt-4">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">User ID</div>
                    <div className="flex items-center">
                      <span className="text-xs font-mono text-gray-900 dark:text-white truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-default select-none">
                        {getUserHash(userId)}
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer relative group"
                          onClick={() => {
                            navigator.clipboard.writeText(getUserHash(userId));
                            setCopiedUserId(userId);
                            setTimeout(() => setCopiedUserId(null), 1500);
                          }}
                          aria-label="Copy user ID"
                        >
                          <HiOutlineDuplicate className="w-4 h-4" />
                          {copiedUserId === userId ? (
                            <span className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none">
                              Copied!
                            </span>
                          ) : (
                            <span className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              Copy
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* Empty right column for User ID row */}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter first name..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Last Name</label>
                                          <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter last name..." />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Email Address</label>
                                          <input type="email" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter email address..." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Phone Number</label>
                                          <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter phone number..." />
                  </div>
                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">User Role</label>
                    <div className="relative w-full" ref={userRoleDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select a user role..."
                        value={userRole}
                        readOnly
                        onClick={() => setShowUserRoleDropdown(!showUserRoleDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showUserRoleDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {USER_ROLES.map(role => (
                            <button
                              key={role}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${userRole === role ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setUserRole(role);
                                setShowUserRoleDropdown(false);
                              }}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Job Title</label>
                    <input type="text" className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" placeholder="Enter job title..." />
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-2">
                  <button 
                    type="submit" 
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Change Password</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Update your account password to keep your account secure</p>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs font-medium text-black dark:text-white">
                        Current Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentPasswordVisible(!currentPasswordVisible);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                      >
                        {currentPasswordVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter current password"
                      value={currentPasswordVisible ? currentPassword : currentPasswordDisplay}
                      onChange={handleCurrentPasswordChange}
                    />
                  </div>
                  <div>
                    {/* Empty right column on first row */}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs font-medium text-black dark:text-white">
                        New Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setNewPasswordVisible(!newPasswordVisible);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                      >
                        {newPasswordVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter new password"
                      value={newPasswordVisible ? newPassword : newPasswordDisplay}
                      onChange={handleNewPasswordChange}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <label className="text-xs font-medium text-black dark:text-white">
                        Repeat Password
                      </label>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setRepeatPasswordVisible(!repeatPasswordVisible);
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                      >
                        {repeatPasswordVisible ? (
                          <HiOutlineEyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <HiOutlineEye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    <input 
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Repeat new password"
                      value={repeatPasswordVisible ? repeatPassword : repeatPasswordDisplay}
                      onChange={handleRepeatPasswordChange}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4 pt-2">
                  <button 
                    type="submit" 
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Two Factor Authentication Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Two Factor Authentication</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Add an extra layer of security to your account by enabling two-factor authentication</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <TbLock size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">2FA is currently disabled</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Enable two-factor authentication for enhanced security</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowEnable2FAModal(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                >
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Passkeys Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Passkeys</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Use passkeys for secure, passwordless authentication across your devices</p>
              {!showPasskeys && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <TbKey size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{passkeysData.length} passkeys configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your passkeys across devices</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPasskeys(!showPasskeys)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Passkeys
                  </button>
                </div>
              )}
              
              {showPasskeys && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowPasskeys(!showPasskeys)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Passkeys
                    </button>
                    <button 
                      onClick={() => setShowAddPasskeyModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Passkey
                    </button>
                  </div>
                </div>
              )}
              
              {showPasskeys && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {passkeysData.map((passkey, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{passkey.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{passkey.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{passkey.lastUsed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                              <div className="pl-3">
                                <button
                                  onClick={() => {
                                    addPasskeyRemovedNotification(passkey.name);
                                    
                                    // Show toast notification
                                    toast({
                                      title: "Passkey Removed Successfully",
                                      description: `"${passkey.name}" has been removed successfully from your account`,
                                      duration: 5000,
                                      variant: "voided",
                                    });
                                    
                                    // Remove from local state (in a real app, this would call an API)
                                    const newPasskeysData = passkeysData.filter((_, i) => i !== index);
                                    // Note: In a real implementation, you'd update state here
                                  }}
                                  className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center"
                                  title="Remove passkey"
                                >
                                  <TbKeyOff className="text-sm sm:text-base transition-colors" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {passkeysData.length} passkeys.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Activity Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Recent Activity</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Monitor your recent account activity & login attempts</p>
              {!showRecentActivity && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <TbActivity size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">No recent activity</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View your account activity history</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRecentActivity(!showRecentActivity)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    View Activity
                  </button>
                </div>
              )}
              
              {showRecentActivity && (
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => setShowRecentActivity(!showRecentActivity)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Hide Activity
                  </button>
                </div>
              )}
              
              {showRecentActivity && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Browser</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recentActivityData.map((activity, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.device}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.browser}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.ipAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{activity.action}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Sessions Card */}
          {activeTab === 'security' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Active Sessions</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">View & manage active sessions across different devices</p>
              {!showSessions && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <PiPowerBold size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">3 active sessions</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your active sessions across devices</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSessions(!showSessions)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Sessions
                  </button>
                </div>
              )}
              
              {showSessions && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowSessions(!showSessions)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Sessions
                    </button>
                    <button 
                      type="button" 
                      className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold mb-0"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Revoke All
                    </button>
                  </div>
                </div>
              )}
              
              {showSessions && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Device</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">IP Address</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Last Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {sessionsData.map((session, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <span>{session.device}</span>
                                {session.isCurrent && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    Current
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{session.ipAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{session.lastActive}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{session.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <div className="pl-2">
                                <button className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center">
                                  <TbDevicesX className="text-sm sm:text-base transition-colors" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Revoke
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {sessionsData.length} sessions.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wallets Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Wallets</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Manage your connected wallets</p>
              {!showWallets && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <TbWallet size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                                            <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{connectedWallets.length} wallets configured</p>
                          {connectedWallets.find(wallet => wallet.connected) && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary cursor-default select-none">
                              {connectedWallets.find(wallet => wallet.connected)?.name}
                            </span>
                          )}
                        </div>
                  </div>
                  <button 
                    onClick={() => setShowWallets(!showWallets)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Wallets
                  </button>
                </div>
              )}
              
              {showWallets && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowWallets(!showWallets)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Wallets
                    </button>
                    <button 
                      onClick={() => setShowAddWalletModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Wallet
                    </button>
                  </div>
                </div>
              )}
              
              {showWallets && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 h-80 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                                                    <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Address</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-14">Status</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                              </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {connectedWallets.map((wallet) => (
                          <tr key={wallet.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <TbWallet className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <span>{wallet.provider}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              {wallet.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white font-mono">
                              <div className="flex items-center">
                                <span className="text-xs font-mono text-gray-900 dark:text-white truncate hover:whitespace-normal hover:overflow-visible hover:max-w-none transition-all duration-200 cursor-default select-none">
                                  {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                                </span>
                                <div className="relative">
                                  <button
                                    type="button"
                                    className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer relative group"
                                    onClick={() => {
                                      navigator.clipboard.writeText(wallet.address);
                                      setCopiedUserId(wallet.id);
                                      setTimeout(() => setCopiedUserId(null), 1500);
                                    }}
                                    aria-label="Copy wallet address"
                                  >
                                    <HiOutlineDuplicate className="w-4 h-4" />
                                    {copiedUserId === wallet.id ? (
                                      <span className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none font-sans">
                                        Copied!
                                      </span>
                                    ) : (
                                      <span className="absolute -top-1 left-full ml-2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-sans">
                                        Copy
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <span className={`inline-flex items-center justify-center w-28 h-7 px-2 font-semibold rounded-full border ${getWalletStatusBadgeStyle(wallet)}`}>
                                {wallet.connected ? 'Connected' : 'Disconnected'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-1">
                                {wallet.connected ? (
                                  <button className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-orange-500 dark:hover:text-orange-500 relative group flex items-center justify-center">
                                    <TbPlugOff className="text-sm sm:text-base transition-colors" />
                                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                      Disconnect
                                    </span>
                                  </button>
                                ) : (
                                  <button className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-green-500 dark:hover:text-green-500 relative group flex items-center justify-center">
                                    <TbPlug className="text-sm sm:text-base transition-colors" />
                                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                      Connect
                                    </span>
                                  </button>
                                )}
                                <button 
                                  onClick={() => {
                                    addWalletRemovedNotification(wallet.name);
                                    
                                    // Show toast notification
                                    toast({
                                      title: "Wallet Removed Successfully",
                                      description: `"${wallet.name}" has been removed successfully from your account`,
                                      duration: 5000,
                                      variant: "voided",
                                    });
                                    
                                    // Remove from local state (in a real app, this would call an API)
                                    const newConnectedWallets = connectedWallets.filter((_, i) => i !== index);
                                    // Note: In a real implementation, you'd update state here
                                  }}
                                  className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center"
                                >
                                  <TbWalletOff className="text-sm sm:text-base transition-colors" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {connectedWallets.length} wallets.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preferences Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Preferences</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Customize your account preferences and settings.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Default Language</label>
                    <div className="relative w-full" ref={languageDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select default language"
                        value={defaultLanguage}
                        readOnly
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showLanguageDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {DOCUMENT_LANGUAGES.map(language => (
                            <button
                              key={language}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${defaultLanguage === language ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setDefaultLanguage(language);
                                setShowLanguageDropdown(false);
                              }}
                            >
                              {language}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Include Signing Certificate in Envelope</label>
                    <div className="relative w-full" ref={signingCertificateDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select option"
                        value={includeSigningCertificate}
                        readOnly
                        onClick={() => setShowSigningCertificateDropdown(!showSigningCertificateDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showSigningCertificateDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {SIGNING_CERTIFICATE_OPTIONS.map(option => (
                            <button
                              key={option}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${includeSigningCertificate === option ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setIncludeSigningCertificate(option);
                                setShowSigningCertificateDropdown(false);
                              }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-black dark:text-white mb-1">Signature Options</label>
                  <div className="relative w-full" ref={signatureSettingsDropdownRef}>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                      placeholder="Select signature settings"
                      value={getSignatureSettingsDisplayText()}
                      readOnly
                      onClick={() => setShowSignatureSettingsDropdown(!showSignatureSettingsDropdown)}
                    />
                    <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    {showSignatureSettingsDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {SIGNATURE_SETTINGS.map(setting => (
                          <button
                            key={setting}
                            className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center ${defaultSignatureSettings.includes(setting) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            onClick={() => handleSignatureSettingToggle(setting)}
                          >
                            <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                              {defaultSignatureSettings.includes(setting) && (
                                <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            {setting}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button 
                  type="button" 
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Sign Out Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Sign Out</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Sign out of your account and return to the login page.</p>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}

          {/* Delete Account Box */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mt-6">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Delete Account</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Delete your account and all its contents, including completed documents. This action is irreversible and will cancel your subscription, so proceed with caution</p>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold mb-0"
                  style={{ fontFamily: 'Avenir, sans-serif' }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
          {activeTab === 'api' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">API Tokens</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Create & manage API tokens for secure access to your account</p>
              {!showApiTokens && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <TbApiApp size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{apiTokensData.length} API tokens configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your API tokens for secure access</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowApiTokens(!showApiTokens)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Tokens
                  </button>
                </div>
              )}
              
              {showApiTokens && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowApiTokens(!showApiTokens)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Tokens
                    </button>
                    <button 
                      onClick={() => setShowAddApiTokenModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Token
                    </button>
                  </div>
                </div>
              )}
              
              {showApiTokens && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Token Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {apiTokensData.map((token, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{token.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{token.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{token.lastUsed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                              <div className="pl-3">
                                <button
                                  onClick={() => {
                                    addApiTokenRemovedNotification(token.name);
                                    
                                    // Show toast notification
                                    toast({
                                      title: "API Token Removed Successfully",
                                      description: `"${token.name}" has been removed successfully from your account`,
                                      duration: 5000,
                                      variant: "voided",
                                    });
                                    
                                    // Remove from local state (in a real app, this would call an API)
                                    const newApiTokensData = apiTokensData.filter((_, i) => i !== index);
                                    // Note: In a real implementation, you'd update state here
                                  }}
                                  className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center"
                                  title="Remove API token"
                                >
                                  <TbApiAppOff className="text-sm sm:text-base transition-colors" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {apiTokensData.length} API tokens.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'webhooks' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Webhooks</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Create & manage webhooks</p>
              {!showWebhooks && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <MdWebhook size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{webhooksData.length} webhooks configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your webhooks for secure notifications</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowWebhooks(!showWebhooks)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Webhooks
                  </button>
                </div>
              )}
              
              {showWebhooks && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowWebhooks(!showWebhooks)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Webhooks
                    </button>
                    <button 
                      onClick={() => setShowAddWebhookModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Webhook
                    </button>
                  </div>
                </div>
              )}
              
              {showWebhooks && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 h-64 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Webhook Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">URL</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Used</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {webhooksData.map((webhook, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{webhook.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{webhook.url}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{webhook.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{webhook.lastUsed}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                              <div className="pl-3">
                                <button
                                  onClick={() => {
                                    // Handle webhook removal logic here
                                    // In a real app, this would call an API to remove the webhook
                                  }}
                                  className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center"
                                  title="Remove webhook"
                                >
                                  <TbWebhookOff className="text-sm sm:text-base transition-colors" />
                                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded cursor-default select-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing {webhooksData.length} webhooks.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'billing' && (
            <div className="space-y-4">
              {/* Header Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
                <div>
                  <h2 className="text-lg font-bold text-black dark:text-white mb-1">Billing</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 dark:text-gray-400 text-xs">You are currently on the Free Plan.</p>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
                      Manage billing
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Period Toggle */}
              <div className="flex items-center justify-start">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 border-2 border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      billingPeriod === 'monthly'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      billingPeriod === 'yearly'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>

              {/* Pricing Plans */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {billingPlans.map((plan, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-6 shadow-sm flex flex-col min-h-[550px]">
                    <div className="text-center mb-6 h-24">
                      <h3 className="text-lg font-bold text-black dark:text-white mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        {plan.monthlyPrice !== null ? (
                          <>
                            <span className="text-2xl font-bold text-black dark:text-white">${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">USD per {billingPeriod === 'monthly' ? 'month' : 'year'}</span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-black dark:text-white">Custom</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                    </div>
                    
                    <div className="mb-6 flex-grow flex flex-col">
                      <h4 className="text-sm font-semibold text-black dark:text-white mb-3 mt-6">Includes:</h4>
                      <div className="space-y-2 flex-grow">
                        {plan.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {plan.name === 'Essential' ? (
                      <div className="mt-auto space-y-1">
                        <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold border border-gray-200 dark:border-gray-600">
                          30-day Free Trial
                        </button>
                        <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
                          Subscribe
                        </button>
                      </div>
                    ) : (
                      <div className="mt-auto space-y-2">
                        {plan.name === 'Pro' && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            (Everything in the Essential tier + much more)
                          </p>
                        )}
                        {plan.name === 'Growth' && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            (Everything in the Pro tier + much more)
                          </p>
                        )}
                        {plan.name === 'Enterprise' && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            (Everything in the Growth tier + much more)
                          </p>
                        )}
                        <button className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold">
                          {plan.name === 'Enterprise' ? 'Contact Us' : 'Subscribe'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <>
              {/* Company Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm mb-6">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Company Information</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Update your company details and contact information.</p>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Company Name</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter company name..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Company Type</label>
                    <div className="relative w-full" ref={companyTypeDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                        placeholder="Select company type..."
                        value={COMPANY_TYPES.find(t => t.value === companyType)?.label || ''}
                        readOnly
                        onClick={() => setShowCompanyTypeDropdown(!showCompanyTypeDropdown)}
                      />
                      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {showCompanyTypeDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {COMPANY_TYPES.map(type => (
                            <button
                              key={type.value}
                              className={`w-full text-left px-3 py-2 text-xs font-medium ${companyType === type.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                              onClick={() => {
                                setCompanyType(type.value);
                                setShowCompanyTypeDropdown(false);
                              }}
                            >
                              {type.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Business Address</label>
                    <input 
                      type="text" 
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter business address..." 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-black dark:text-white mb-1">City</label>
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                        placeholder="Enter City..." 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black dark:text-white mb-1">State</label>
                      <div className="relative w-full" ref={stateDropdownRef}>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                          placeholder="Select State..."
                          value={stateSearchTerm || US_STATES.find(s => s.value === state)?.label || ''}
                          onChange={handleStateSearch}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !stateSearchTerm) {
                              e.preventDefault();
                              setState('');
                            }
                          }}
                          onFocus={() => {
                            if (!showStateDropdown) {
                              setShowStateDropdown(true);
                            }
                          }}
                        />
                        <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {showStateDropdown && (
                          <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {US_STATES
                              .filter(stateOption => 
                                stateOption.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
                              )
                              .map(stateOption => (
                              <button
                                key={stateOption.value}
                                data-state-value={stateOption.value}
                                className={`w-full text-left px-3 py-2 text-xs font-medium ${state === stateOption.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                onClick={() => {
                                  setState(stateOption.value);
                                  setShowStateDropdown(false);
                                  setStateSearchTerm('');
                                }}
                              >
                                {stateOption.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black dark:text-white mb-1">ZIP Code</label>
                      <input 
                        type="text" 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                        placeholder="Enter ZIP code..." 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-medium text-black dark:text-white mb-1">Country</label>
                      <div className="relative w-full" ref={countryDropdownRef}>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                          placeholder="Select Country..."
                          value={countrySearchTerm || COUNTRIES.find(c => c.value === country)?.label || ''}
                          onChange={handleCountrySearch}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !countrySearchTerm) {
                              e.preventDefault();
                              setCountry('');
                            }
                          }}
                          onFocus={() => {
                            if (!showCountryDropdown) {
                              setShowCountryDropdown(true);
                            }
                          }}
                        />
                        <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {showCountryDropdown && (
                          <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {COUNTRIES
                              .filter(countryOption => 
                                countryOption.label.toLowerCase().includes(countrySearchTerm.toLowerCase())
                              )
                              .map(countryOption => (
                              <button
                                key={countryOption.value}
                                data-country-value={countryOption.value}
                                className={`w-full text-left px-3 py-2 text-xs font-medium ${country === countryOption.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                onClick={() => {
                                  setCountry(countryOption.value);
                                  setShowCountryDropdown(false);
                                  setCountrySearchTerm('');
                                }}
                              >
                                {countryOption.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black dark:text-white mb-1">Phone</label>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                        placeholder="Enter phone number..." 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Website</label>
                    <input 
                      type="url" 
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                      placeholder="Enter website..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Industries</label>
                    <div className="relative w-full" ref={industriesDropdownRef}>
                      <div 
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors text-xs min-h-[40px] flex flex-wrap items-center gap-2 cursor-pointer"
                        onClick={() => setShowIndustriesDropdown(!showIndustriesDropdown)}
                      >
                        <div className="flex flex-wrap gap-2 flex-1">
                          {selectedIndustries.map(industryValue => {
                            const industry = INDUSTRIES.find(i => i.value === industryValue);
                            if (!industry) return null;
                            const IconComponent = industry.icon;
                            return (
                              <span 
                                key={industryValue}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded border border-primary text-xs font-medium"
                              >
                                <IconComponent className="w-3 h-3" />
                                {industry.label}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleIndustryToggle(industryValue);
                                  }}
                                  className="ml-1 hover:text-primary-dark"
                                >
                                  ×
                                </button>
                              </span>
                            );
                          })}
                          {selectedIndustries.length === 0 && (
                            <span className="text-gray-400">Select industries...</span>
                          )}
                        </div>
                        <HiChevronDown className="pointer-events-none w-4 h-4 text-gray-400" />
                      </div>
                      {showIndustriesDropdown && (
                        <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                            <input
                              type="text"
                              placeholder="Search industries..."
                              value={industrySearchTerm}
                              onChange={handleIndustrySearch}
                              className="w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          {INDUSTRIES
                            .filter(industry => 
                              industry.label.toLowerCase().includes(industrySearchTerm.toLowerCase())
                            )
                            .map(industry => {
                              const IconComponent = industry.icon;
                              return (
                                <button
                                  type="button"
                                  key={industry.value}
                                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${selectedIndustries.includes(industry.value) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                  onClick={() => handleIndustryToggle(industry.value)}
                                >
                                  <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                                    {selectedIndustries.includes(industry.value) && (
                                      <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <IconComponent className="w-4 h-4" />
                                  {industry.label}
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 pt-2">
                    <button 
                      type="submit" 
                      className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold mb-0"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>

              {/* Organizations */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-black dark:text-white">Organizations</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Create & manage organizations</p>
              {!showOrganizations && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">1 organization configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your organizations and memberships</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowOrganizations(!showOrganizations)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Organizations
                  </button>
                </div>
              )}
              
              {showOrganizations && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowOrganizations(!showOrganizations)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Organizations
                    </button>
                    <button 
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Create Organization
                    </button>
                  </div>
                </div>
              )}
              
              {showOrganizations && (
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Organization</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
                                <span className="text-white font-semibold text-sm">P</span>
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">Personal</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Your personal organization.</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">Owner</td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">Jun 27, 2025</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Showing 1 organization.
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300">Rows per page</span>
                          <div className="relative">
                            <select className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 pr-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white appearance-none">
                              <option>10</option>
                              <option>20</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
                              <HiChevronDown className="w-3 h-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-700 dark:text-gray-300">
                          Page 1 of 1
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleLeft className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3 rotate-180" />
                          </button>
                          <button className="p-1 text-gray-400 cursor-not-allowed">
                            <HiOutlineChevronDoubleRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
          )}

          {activeTab !== 'profile' && activeTab !== 'api' && activeTab !== 'webhooks' && activeTab !== 'security' && activeTab !== 'billing' && activeTab !== 'company' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-black dark:text-white">{TABS.find(tab => tab.key === activeTab)?.label} (Placeholder)</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Content for the {TABS.find(tab => tab.key === activeTab)?.label} tab will go here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Passkey Modal */}
      {showAddPasskeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Add Passkey</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddPasskeyModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 cursor-default select-none">
                Passkeys allow you to sign in and authenticate using biometrics, password managers, etc.
              </p>
              
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                  Passkey Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={passkeyName}
                  onChange={(e) => setPasskeyName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter passkey name..."
                />
              </div>
              
              <div className="space-y-3 cursor-default select-none">
                <p className="text-gray-600 dark:text-gray-400 text-sm cursor-default select-none">
                  When you click continue, you will be prompted to add the first available authenticator on your system.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm cursor-default select-none">
                  If you do not want to use the authenticator prompted, you can close it, which will then display the next available authenticator.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 cursor-default select-none">
              <button
                onClick={() => setShowAddPasskeyModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle add passkey logic here
                  addPasskeyAddedNotification(passkeyName);
                  
                  // Show toast notification
                  toast({
                    title: "Passkey Added Successfully",
                    description: `"${passkeyName}" has been added successfully to your account`,
                    duration: 5000,
                  });
                  
                  setShowAddPasskeyModal(false);
                  // In a real app, you would also add the passkey to the data here
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
                )}
          </div>

          {/* Add API Token Modal */}
          {showAddApiTokenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Create New Token</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddApiTokenModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                  Token Name
                </label>
                <input
                  type="text"
                  value={apiTokenName}
                  onChange={(e) => setApiTokenName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter new token name..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic cursor-default select-none">
                  Please enter a meaningful name for your token. This will help you identify it later.
                </p>
              </div>
              
              <div className="mb-6 cursor-default select-none">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 cursor-default select-none">
                    Token Expiration Date
                  </label>
                  <div className="flex items-center gap-2 -mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">Never expire</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        tokenNeverExpire ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={() => setTokenNeverExpire(!tokenNeverExpire)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          tokenNeverExpire ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="relative" ref={tokenExpirationDropdownRef}>
                  <input
                    type="text"
                    className={`w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent ${tokenNeverExpire ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="Select expiration date..."
                    value={selectedTokenExpiration}
                    readOnly
                    disabled={tokenNeverExpire}
                    onClick={() => !tokenNeverExpire && setShowTokenExpirationDropdown(!showTokenExpirationDropdown)}
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {showTokenExpirationDropdown && !tokenNeverExpire && (
                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {['1 day', '7 days', '30 days', '90 days', '1 year'].map(option => (
                        <button
                          key={option}
                          className={`w-full text-left px-3 py-2 text-xs font-medium ${selectedTokenExpiration === option ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                          onClick={() => {
                            setSelectedTokenExpiration(option);
                            setShowTokenExpirationDropdown(false);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 cursor-default select-none">
              <button
                onClick={() => setShowAddApiTokenModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create token logic here
                  if (apiTokenName.trim()) {
                    addApiTokenAddedNotification(apiTokenName);
                    
                    // Show toast notification
                    toast({
                      title: "API Token Added Successfully",
                      description: `"${apiTokenName}" has been successfully added to your account`,
                      duration: 5000,
                    });
                    
                    // Reset form
                    setApiTokenName('');
                    setSelectedTokenExpiration('');
                  }
                  setShowAddApiTokenModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                Create Token
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enable 2FA Modal */}
      {showEnable2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Enable Authenticator App</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowEnable2FAModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 cursor-default select-none">
                To enable two-factor authentication, scan the following QR code using your authenticator app.
              </p>
              
              {/* QR Code Placeholder */}
              <div className="flex justify-center mb-6 cursor-default select-none">
                <div className="w-48 h-48 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">QR Code</span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 cursor-default select-none">
                If your authenticator app does not support QR codes, you can use the following code instead:
              </p>
              
              {/* Manual Code Field */}
              <div className="mb-6 cursor-default select-none">
                <input
                  type="text"
                  value="QIBXOTPMRVTTXMN6"
                  readOnly
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg text-xs font-mono"
                />
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 cursor-default select-none">
                Once you have scanned the QR code or entered the code manually, enter the code provided by your authenticator app below.
              </p>
              
              {/* Token Input Fields */}
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 cursor-default select-none">
                  Token
                </label>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5, 6].map((digit) => (
                    <input
                      key={digit}
                      type="text"
                      maxLength={1}
                      className="w-12 h-12 text-center border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-lg font-semibold"
                      placeholder=""
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-1 cursor-default select-none">
              <button
                onClick={() => setShowEnable2FAModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle enable 2FA logic here
                  setShowEnable2FAModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {showAddWebhookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 cursor-default select-none">
            <div className="flex justify-between items-start mb-4 cursor-default select-none">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Create webhook</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 cursor-default select-none">On this page, you can create a new webhook.</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddWebhookModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 cursor-default select-none">
              {/* Webhook URL Section */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-900 dark:text-white cursor-default select-none">
                    Webhook URL *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-900 dark:text-white cursor-default select-none">Enabled</span>
                    <button
                      type="button"
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        webhookEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                      onClick={() => setWebhookEnabled(!webhookEnabled)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          webhookEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="https://your-domain.com/webhook-endpoint"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  URL for where Escra will send webhook events
                </p>
              </div>
              
              {/* Triggers Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Triggers *
                </label>
                <div className="relative" ref={tokenExpirationDropdownRef}>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                    placeholder="Select triggers"
                    value={webhookTriggers.length === 0 ? '' : webhookTriggers.join(', ')}
                    readOnly
                    onClick={() => setShowTriggersDropdown(!showTriggersDropdown)}
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {showTriggersDropdown && (
                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-y-auto">
                      {WEBHOOK_TRIGGERS.map(trigger => (
                        <button
                          key={trigger}
                          className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center ${webhookTriggers.includes(trigger) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                          onClick={() => {
                            setWebhookTriggers(prev => 
                              prev.includes(trigger)
                                ? prev.filter(t => t !== trigger)
                                : [...prev, trigger]
                            );
                          }}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                            {webhookTriggers.includes(trigger) && (
                              <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          {trigger}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  Events that will trigger a webhook be sent to your URL
                </p>
              </div>
              
              {/* Secret Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Secret
                </label>
                <div className="relative">
                  <input
                    type={webhookSecretVisible ? 'text' : 'password'}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                    placeholder="Enter secret (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => setWebhookSecretVisible(!webhookSecretVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer p-1 rounded"
                  >
                    {webhookSecretVisible ? (
                      <HiOutlineEyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <HiOutlineEye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  A secret that will be sent to your URL & used to verify the request has been sent by Escra
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 cursor-default select-none">
              <button
                onClick={() => setShowAddWebhookModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create webhook logic here
                  setShowAddWebhookModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 cursor-default select-none">
            <div className="flex justify-between items-center mb-4 cursor-default select-none">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Add Wallet</h2>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddWalletModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6 cursor-default select-none">
              <div className="text-center mb-6 cursor-default select-none">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 mb-4 cursor-default select-none">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-default select-none">
                    <HiOutlineQrcode className="w-32 h-32 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                      QR code will be generated here
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 cursor-default select-none">
                  Scan this QR code with your mobile wallet to connect it to your account
                </p>
              </div>
              
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter wallet name..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic cursor-default select-none">
                  Give your wallet a meaningful name to help you identify it later
                </p>
              </div>
              
              <div className="mb-6 cursor-default select-none">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 cursor-default select-none">
                  Provider
                </label>
                <div className="relative" ref={walletProviderDropdownRef}>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                    placeholder="Select wallet provider..."
                    value={selectedWalletProvider}
                    readOnly
                    onClick={() => setShowWalletProviderDropdown(!showWalletProviderDropdown)}
                  />
                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  {showWalletProviderDropdown && (
                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {['Pera Wallet', 'MyAlgo', 'AlgoSigner', 'WalletConnect'].map(provider => (
                        <button
                          key={provider}
                          className={`w-full text-left px-3 py-2 text-xs font-medium ${selectedWalletProvider === provider ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                          onClick={() => {
                            setSelectedWalletProvider(provider);
                            setShowWalletProviderDropdown(false);
                          }}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 italic cursor-default select-none">
                  Select your preferred wallet provider to generate the appropriate QR code
                </p>
              </div>
            </div>
            
            <div className="flex justify-end cursor-default select-none">
              <button
                onClick={() => setShowAddWalletModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle add wallet logic here
                  if (walletName && selectedWalletProvider) {
                    addWalletAddedNotification(walletName);
                    
                    // Show toast notification
                    toast({
                      title: "Wallet Added Successfully",
                      description: `"${walletName}" has been added successfully to your account`,
                      duration: 5000,
                    });
                  }
                  setShowAddWalletModal(false);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold ml-1"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Add Wallet
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}