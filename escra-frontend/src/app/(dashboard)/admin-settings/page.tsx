'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaCheck } from 'react-icons/fa';
import { TbCameraCog, TbActivity, TbBuildingEstate, TbShoppingBagEdit, TbWorld, TbBuildingCommunity, TbBallAmericanFootball, TbTool, TbWallet, TbLock, TbKey, TbApiApp, TbDevicesX, TbKeyOff, TbWalletOff, TbPlug, TbPlugOff, TbApiOff, TbWebhookOff, TbApiAppOff, TbForklift, TbWashDryFlat, TbUsers, TbUsersGroup, TbUsersPlus, TbBuildingPlus, TbUserOff, TbBuilding, TbBuildingOff, TbBuildingCog, TbChevronDown, TbChevronUp, TbUserPlus, TbUserCog, TbMailShare, TbUpload, TbBarrierBlock, TbBriefcase, TbStethoscope, TbCoins, TbScale, TbScaleOff, TbTrophy, TbDotsVertical, TbUserMinus, TbUser, TbGavel, TbWallpaperOff } from 'react-icons/tb';
import { HiChevronDown, HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight, HiOutlineKey, HiOutlineDuplicate, HiStatusOffline } from 'react-icons/hi';
import { MdOutlineGeneratingTokens, MdWebhook, MdOutlineSportsFootball, MdOutlineMovieFilter, MdOutlineHealthAndSafety, MdCancelPresentation } from 'react-icons/md';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { PiEjectBold, PiPowerBold, PiLockKeyBold, PiMinusSquareBold } from 'react-icons/pi';
import { LuConstruction, LuBriefcaseBusiness, LuHardHat } from 'react-icons/lu';
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
import { useAuth } from '@/context/AuthContext';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'company', label: 'Organizations' },
  { key: 'policies', label: 'Policies' },
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

const INDUSTRIES = [
  'Real Estate',
  'Logistics',
  'Construction',
  'Corporate',
  'Labor',
  'Healthcare',
  'Finance',
  'Entertainment',
  'Manufacturing',
  'Legal',
  'Athletics',
  'Technology'
];

const INDUSTRY_ICONS = {
  'Real Estate': TbBuildingCommunity,
  'Logistics': TbWorld,
  'Construction': TbBarrierBlock,
  'Corporate': TbBriefcase,
  'Labor': LuHardHat,
  'Healthcare': TbStethoscope,
  'Finance': TbCoins,
  'Entertainment': MdOutlineMovieFilter,
  'Manufacturing': TbForklift,
  'Legal': TbScale,
  'Athletics': TbTrophy,
  'Technology': HiOutlineChip
};

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

// Mock policies data
const policiesData = [
  {
    name: 'Data Retention Policy',
    description: 'Defines how long user data is retained',
    created: '2 weeks ago',
    lastModified: '1 day ago'
  },
  {
    name: 'Privacy Policy',
    description: 'Outlines data collection and usage practices',
    created: '1 week ago',
    lastModified: '3 days ago'
  },
  {
    name: 'Terms of Service',
    description: 'Legal terms governing platform usage',
    created: '3 weeks ago',
    lastModified: '1 week ago'
  }
];

// Mock collaborators data
const collaboratorsData = [
  {
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '2 hours ago',
    avatar: 'JS'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Signer',
    status: 'Active',
    lastActive: '1 day ago',
    avatar: 'SJ'
  },
  {
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'Viewer',
    status: 'Pending',
    lastActive: 'Never',
    avatar: 'MW'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Creator',
    status: 'Active',
    lastActive: '3 hours ago',
    avatar: 'ED'
  }
];

// Billing plans data
const billingPlans = [
  {
    name: 'Essential',
    monthlyPrice: 12,
    yearlyPrice: 9,
    description: 'Tamper-proof essential signing tools',
    features: [
      '5 contracts per month',
      '20 signers per month',
      '20 GB document storage',
      'Unlimited Recipients',
      '2FA Authentication',
      'KYC verification',
      'Blockchain secured completion'
    ]
  },
  {
    name: 'Pro',
    monthlyPrice: 115,
    yearlyPrice: 99,
    description: 'Enhanced contract capacity, advanced security & granular auditability',
    features: [
      '50 contracts per month',
      '200 signers per month',
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
    monthlyPrice: 350,
    yearlyPrice: 299,
    description: 'A shared workspace for your team',
    features: [
      '250 contracts per month',
      '1000 signers per month',
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
      'Scaled signing capacity',
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
  const { addPasskeyAddedNotification, addPasskeyRemovedNotification, addWalletAddedNotification, addWalletRemovedNotification, addApiTokenAddedNotification, addApiTokenRemovedNotification, addWebhookAddedNotification, addWebhookRemovedNotification } = useNotifications();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('Admin');
  const [showUserRoleDropdown, setShowUserRoleDropdown] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showOrganizationActionsDropdown, setShowOrganizationActionsDropdown] = useState<string | null>(null);
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
  
  // Policies state
  const [showPolicies, setShowPolicies] = useState(false);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [policyDescription, setPolicyDescription] = useState('');
  const [policyContent, setPolicyContent] = useState('');
  const [showOrganizations, setShowOrganizations] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [expandedOrganization, setExpandedOrganization] = useState<string | null>(null);
  const [selectedOrganizationFilter, setSelectedOrganizationFilter] = useState<string[]>(['all']);
  const [showOrganizationDropdown, setShowOrganizationDropdown] = useState(false);
  const [configuredOrganization, setConfiguredOrganization] = useState<string | null>(null);
  const organizationDropdownRef = useRef<HTMLDivElement>(null);

  // Mock organizations data
  const organizationsData = [
    {
      id: 'personal',
      name: 'Personal',
      initials: 'ES',
      description: 'Your personal organization.',
      color: 'cyan'
    },
    {
      id: 'company',
      name: 'Acme Corp',
      initials: 'AC',
      description: 'Main company organization.',
      color: 'blue'
    },
    {
      id: 'client',
      name: 'Client Services',
      initials: 'CS',
      description: 'Client-facing organization.',
      color: 'green'
    }
  ];
  
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
  const [organizationIndustrySearchTerm, setOrganizationIndustrySearchTerm] = useState('');
  
  // Organization inline form state
  const [showOrganizationCreateForm, setShowOrganizationCreateForm] = useState(false);
  const [organizationFormStep, setOrganizationFormStep] = useState(1);
  const [organizationFormData, setOrganizationFormData] = useState({
    name: '',
    type: '',
    businessAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    website: '',
    industries: [] as string[]
  });
  const [organizationCollaborators, setOrganizationCollaborators] = useState([
    { 
      name: '', 
      email: '', 
      contractPermissions: [] as string[], 
      showNamesDropdown: false, 
      namesDropdownRef: React.createRef<HTMLDivElement>(), 
      contractRoleInputRef: React.createRef<HTMLDivElement>(), 
      contractRoleDropdownRef: React.createRef<HTMLDivElement>(), 
      namesInputRef: React.createRef<HTMLInputElement>(), 
      showContractRoleDropdown: false 
    }
  ]);
  const [showOrganizationPermissionsDropdown, setShowOrganizationPermissionsDropdown] = useState(false);
  const [organizationRecipientErrors, setOrganizationRecipientErrors] = useState<{[key: string]: boolean}>({});
  const [duplicateOrganizationCollaboratorError, setDuplicateOrganizationCollaboratorError] = useState<string | false>(false);
  const [addedOrganizationCollaborators, setAddedOrganizationCollaborators] = useState<any[]>([]);
  const [isWorkingSolo, setIsWorkingSolo] = useState(false);
  const [showManageOrganizationCollaboratorsModal, setShowManageOrganizationCollaboratorsModal] = useState(false);
  
  // Group inline form state
  const [showGroupCreateForm, setShowGroupCreateForm] = useState(false);
  const [groupFormStep, setGroupFormStep] = useState(1);
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    organization: '',
    description: ''
  });
  const [groupCollaborators, setGroupCollaborators] = useState([
    { 
      name: '', 
      email: '', 
      showNamesDropdown: false, 
      namesDropdownRef: React.createRef<HTMLDivElement>(), 
      namesInputRef: React.createRef<HTMLInputElement>()
    }
  ]);
  const [groupRecipientErrors, setGroupRecipientErrors] = useState<{[key: string]: boolean}>({});
  const [duplicateGroupCollaboratorError, setDuplicateGroupCollaboratorError] = useState<string | false>(false);
  const [addedGroupCollaborators, setAddedGroupCollaborators] = useState<any[]>([]);
  const [showManageGroupCollaboratorsModal, setShowManageGroupCollaboratorsModal] = useState(false);
  const [showGroupOrganizationDropdown, setShowGroupOrganizationDropdown] = useState(false);
  const groupOrganizationDropdownRef = useRef<HTMLDivElement>(null);
  
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
  
  // Organization form refs
  const organizationFormTypeDropdownRef = useRef<HTMLDivElement>(null);
  const organizationFormStateDropdownRef = useRef<HTMLDivElement>(null);
  const organizationFormCountryDropdownRef = useRef<HTMLDivElement>(null);
  const organizationFormIndustriesDropdownRef = useRef<HTMLDivElement>(null);

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
        setIndustrySearchTerm('');
      }
      
      // Close wallet provider dropdown if click is outside
      if (walletProviderDropdownRef.current && !walletProviderDropdownRef.current.contains(target)) {
        setShowWalletProviderDropdown(false);
      }
      
      // Close organization dropdown if click is outside
      if (organizationDropdownRef.current && !organizationDropdownRef.current.contains(target)) {
        setShowOrganizationDropdown(false);
      }
      
      // Close organization actions dropdown if click is outside
      if (showOrganizationActionsDropdown) {
        // Find the currently open dropdown using data attribute
        const openDropdown = document.querySelector(`[data-org-dropdown="${showOrganizationActionsDropdown}"]`);
        
        if (openDropdown && !openDropdown.contains(target)) {
          setShowOrganizationActionsDropdown(null);
        }
      }
    }

    // Use both mousedown and click events for better coverage
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOrganizationActionsDropdown]);

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

  // Test function to generate API token notification toasts
  const generateTestApiTokenToasts = () => {
    // Test API token added notification
    const testTokenName = "Test Production API";
    
    toast({
      title: "API Token Added Successfully",
      description: `"${testTokenName}" has been added successfully to your account`,
      duration: 5000,
    });
    
    // Add notification for test API token added
    addApiTokenAddedNotification(testTokenName);

    // Test API token removed notification after a delay
    setTimeout(() => {
      const removedTokenName = "Test Development API";
      
      toast({
        title: "API Token Removed Successfully",
        description: `"${removedTokenName}" has been removed successfully from your account`,
        duration: 5000,
        variant: "destructive",
      });
      
      // Add notification for test API token removed
      addApiTokenRemovedNotification(removedTokenName);
    }, 2000); // 2 second delay

    // Test another API token added notification after a delay
    setTimeout(() => {
      const anotherTokenName = "Test Testing API";
      
      toast({
        title: "API Token Added Successfully",
        description: `"${anotherTokenName}" has been added successfully to your account`,
        duration: 5000,
      });
      
      // Add notification for test API token added
      addApiTokenAddedNotification(anotherTokenName);
    }, 4000); // 4 second delay
  };

  // Test function to generate webhook notification toasts
  const generateTestWebhookToasts = () => {
    // Test webhook added notification
    const testWebhookUrl = "https://api.example.com/webhooks/test";
    
    toast({
      title: "Webhook Added Successfully",
      description: `Webhook for URL "${testWebhookUrl}" has been added successfully`,
      duration: 5000,
    });
    
    // Add notification for test webhook added
    addWebhookAddedNotification(testWebhookUrl);

    // Test webhook removed notification after a delay
    setTimeout(() => {
      const removedWebhookUrl = "https://api.example.com/webhooks/removed";
      
      toast({
        title: "Webhook Removed Successfully",
        description: `Webhook for URL "${removedWebhookUrl}" has been removed successfully`,
        duration: 5000,
        variant: "destructive",
      });
      
      // Add notification for test webhook removed
      addWebhookRemovedNotification(removedWebhookUrl);
    }, 2000); // 2 second delay

    // Test another webhook added notification after a delay
    setTimeout(() => {
      const anotherWebhookUrl = "https://api.example.com/webhooks/another";
      
      toast({
        title: "Webhook Added Successfully",
        description: `Webhook for URL "${anotherWebhookUrl}" has been added successfully`,
        duration: 5000,
      });
      
      // Add notification for test webhook added
      addWebhookAddedNotification(anotherWebhookUrl);
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

  // Organization form helper functions
  const handleOrganizationFormChange = (field: string, value: any) => {
    setOrganizationFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrganizationCollaboratorChange = (index: number, field: string, value: any) => {
    setOrganizationCollaborators(prev => prev.map((collaborator, i) => 
      i === index ? { ...collaborator, [field]: value } : collaborator
    ));
  };

  const addOrganizationCollaborator = () => {
    setOrganizationCollaborators(prev => [...prev, { 
      name: '', 
      email: '', 
      contractPermissions: [], 
      showNamesDropdown: false, 
      namesDropdownRef: React.createRef<HTMLDivElement>(), 
      contractRoleInputRef: React.createRef<HTMLDivElement>(), 
      contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
      namesInputRef: React.createRef<HTMLInputElement>(),
      showContractRoleDropdown: false
    }]);
  };

  const removeOrganizationCollaborator = (index: number) => {
    if (organizationCollaborators.length > 1) {
      setOrganizationCollaborators(prev => prev.filter((_, i) => i !== index));
    }
  };

  const sortOrganizationPermissions = (permissions: string[]) => {
    const order = ['Edit', 'View', 'Sign'];
    return permissions.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  // Group form helper functions
  const handleGroupFormChange = (field: string, value: any) => {
    setGroupFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGroupCollaboratorChange = (index: number, field: string, value: any) => {
    setGroupCollaborators(prev => prev.map((collaborator, i) => 
      i === index ? { ...collaborator, [field]: value } : collaborator
    ));
  };

  const addGroupCollaborator = () => {
    setGroupCollaborators(prev => [...prev, { 
      name: '', 
      email: '', 
      showNamesDropdown: false, 
      namesDropdownRef: React.createRef<HTMLDivElement>(), 
      namesInputRef: React.createRef<HTMLInputElement>()
    }]);
  };

  const removeGroupCollaborator = (index: number) => {
    if (groupCollaborators.length > 1) {
      setGroupCollaborators(prev => prev.filter((_, i) => i !== index));
    }
  };


  const handleAddGroupCollaborator = () => {
    const collaborator = groupCollaborators[0];
    
    // Check for duplicates
    const isDuplicateName = addedGroupCollaborators.some(c => 
      c.name.toLowerCase() === collaborator.name.toLowerCase()
    );
    const isDuplicateEmail = addedGroupCollaborators.some(c => 
      c.email.toLowerCase() === collaborator.email.toLowerCase()
    );
    
    if (isDuplicateName && isDuplicateEmail) {
      setDuplicateGroupCollaboratorError('both');
      return;
    } else if (isDuplicateEmail) {
      setDuplicateGroupCollaboratorError('email');
      return;
    } else if (isDuplicateName) {
      setDuplicateGroupCollaboratorError('name');
      return;
    }
    
    // Add collaborator
    setAddedGroupCollaborators(prev => [...prev, {
      ...collaborator,
      isEditingEmail: false
    }]);
    
    // Reset form
    setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { 
      ...r, 
      name: '', 
      email: '', 
      showNamesDropdown: false
    } : r));
    
    // Clear any errors
    setGroupRecipientErrors({});
    setDuplicateGroupCollaboratorError(false);
  };

  // Helper functions for organization collaborators (matching contracts page)
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCollaboratorBadgeColor = (index: number) => {
    const colors = [
      { bg: 'bg-teal-50 dark:bg-teal-900/30', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-500 dark:text-teal-400' },
      { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-500 dark:text-blue-400' },
      { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-500 dark:text-purple-400' },
      { bg: 'bg-orange-100 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-500 dark:text-orange-400' },
      { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-500 dark:text-green-400' },
      { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-200 dark:border-pink-800', text: 'text-pink-500 dark:text-pink-400' },
      { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-500 dark:text-indigo-400' },
    ];
    return colors[index % colors.length];
  };

  const handleAddOrganizationCollaborator = () => {
    const collaborator = organizationCollaborators[0];
    
    // Check for duplicates
    const isDuplicateName = addedOrganizationCollaborators.some(c => 
      c.name.toLowerCase() === collaborator.name.toLowerCase()
    );
    const isDuplicateEmail = addedOrganizationCollaborators.some(c => 
      c.email.toLowerCase() === collaborator.email.toLowerCase()
    );
    
    if (isDuplicateName && isDuplicateEmail) {
      setDuplicateOrganizationCollaboratorError('both');
      return;
    } else if (isDuplicateEmail) {
      setDuplicateOrganizationCollaboratorError('email');
      return;
    } else if (isDuplicateName) {
      setDuplicateOrganizationCollaboratorError('name');
      return;
    }
    
    // Add collaborator
    setAddedOrganizationCollaborators(prev => [...prev, {
      ...collaborator,
      isEditingEmail: false
    }]);
    
    // Reset form
    setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { 
      ...r, 
      name: '', 
      email: '', 
      contractPermissions: [],
      showNamesDropdown: false,
      showContractRoleDropdown: false
    } : r));
    
    setDuplicateOrganizationCollaboratorError(false);
  };

  // Mock data for assignees (matching contracts page)
  const allAssignees = [
    'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis', 'David Brown',
    'Lisa Anderson', 'Chris Taylor', 'Jessica Martinez', 'Ryan Thompson', 'Amanda White'
  ];

  // Click outside handler for organization form dropdowns and collaborator name dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Check if click is inside any organization form dropdown
      if (
        organizationFormTypeDropdownRef.current?.contains(target) ||
        organizationFormStateDropdownRef.current?.contains(target) ||
        organizationFormCountryDropdownRef.current?.contains(target) ||
        organizationFormIndustriesDropdownRef.current?.contains(target) ||
        organizationCollaborators[0]?.contractRoleInputRef?.current?.contains(target) ||
        organizationCollaborators[0]?.contractRoleDropdownRef?.current?.contains(target) ||
        organizationCollaborators[0]?.namesInputRef?.current?.contains(target) ||
        organizationCollaborators[0]?.namesDropdownRef?.current?.contains(target) ||
        // Group form dropdowns
        groupOrganizationDropdownRef.current?.contains(target) ||
        groupCollaborators[0]?.namesInputRef?.current?.contains(target) ||
        groupCollaborators[0]?.namesDropdownRef?.current?.contains(target)
      ) {
        // Click inside any organization form dropdown or collaborator input: do nothing
        return;
      }
      
      // Close organization form dropdowns
      if (showCompanyTypeDropdown) {
        setShowCompanyTypeDropdown(false);
      }
      if (showStateDropdown) {
        setShowStateDropdown(false);
        setStateSearchTerm('');
      }
      if (showCountryDropdown) {
        setShowCountryDropdown(false);
        setCountrySearchTerm('');
      }
      if (showIndustriesDropdown) {
        setShowIndustriesDropdown(false);
        setIndustrySearchTerm('');
      }
      
      // Close organization collaborator dropdowns
      if (showOrganizationPermissionsDropdown) {
        setShowOrganizationPermissionsDropdown(false);
      }
      if (organizationCollaborators[0]?.showNamesDropdown) {
        setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, showNamesDropdown: false } : r));
      }
      
      // Close group form dropdowns
      if (showGroupOrganizationDropdown) {
        setShowGroupOrganizationDropdown(false);
      }
      if (groupCollaborators[0]?.showNamesDropdown) {
        setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, showNamesDropdown: false } : r));
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCompanyTypeDropdown, showStateDropdown, showCountryDropdown, showIndustriesDropdown, showOrganizationPermissionsDropdown, organizationCollaborators[0]?.showNamesDropdown, showGroupOrganizationDropdown, groupCollaborators[0]?.showNamesDropdown]);

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
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
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
              <button
                onClick={generateTestApiTokenToasts}
                className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-semibold w-full sm:w-auto"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                🧪 Test API Token Notifications
              </button>
              <button
                onClick={generateTestWebhookToasts}
                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold w-full sm:w-auto"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                🧪 Test Webhook Notifications
              </button>
            </div>
          </div>
          {/* Divider Line */}
          <hr className="my-3 sm:my-6 border-gray-300 cursor-default select-none" />
          
          {/* Navigation Tabs */}
          <div className="hidden lg:flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700 w-fit cursor-default select-none mb-4 -mt-2">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
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
                  <h2 className="text-xl font-bold mb-2 text-black dark:text-white">Profile Information</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Change Password</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Two Factor Authentication</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Passkeys</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Recent Activity</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Active Sessions</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Wallets</h2>
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
                            <span className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-primary bg-white dark:bg-primary/10 text-gray-900 dark:text-white rounded text-xs font-medium cursor-default select-none mt-1">
                              <Logo width={12} height={12} className="flex-shrink-0" />
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
                        {connectedWallets.map((wallet, index) => (
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
              <h2 className="text-xl font-bold mb-2 text-black dark:text-white">Preferences</h2>
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
              <h2 className="text-xl font-bold mb-2 text-black dark:text-white">Sign Out</h2>
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
              <h2 className="text-xl font-bold mb-2 text-black dark:text-white">Delete Account</h2>
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">API Tokens</h2>
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
                                      variant: "destructive",
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
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Webhooks</h2>
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
                                    addWebhookRemovedNotification(webhook.url);
                                    
                                    // Show toast notification
                                    toast({
                                      title: "Webhook Removed Successfully",
                                      description: `Webhook for URL "${webhook.url}" has been removed successfully`,
                                      duration: 5000,
                                      variant: "destructive",
                                    });
                                    
                                    // Remove from local state (in a real app, this would call an API)
                                    const newWebhooksData = webhooksData.filter((_, i) => i !== index);
                                    // Note: In a real implementation, you'd update state here
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
          
          {activeTab === 'policies' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
              <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Policies</h2>
              <p className="text-gray-600 dark:text-gray-400 text-xs mb-6">Create & manage policies</p>
              {!showPolicies && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                      <TbGavel size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{policiesData.length} policies configured</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Manage your policies for compliance and governance</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowPolicies(!showPolicies)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" style={{ fontFamily: 'Avenir, sans-serif' }}
                  >
                    Manage Policies
                  </button>
                </div>
              )}
              
              {showPolicies && (
                <div className="flex justify-end mb-4">
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowPolicies(!showPolicies)}
                      className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Hide Policies
                    </button>
                    <button 
                      onClick={() => setShowAddPolicyModal(true)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                      style={{ fontFamily: 'Avenir, sans-serif' }}
                    >
                      Add Policy
                    </button>
                  </div>
                </div>
              )}
              
              {showPolicies && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto overflow-y-auto pr-2 h-64 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                    <table className="w-full">
                      <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Policy Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Modified</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {policiesData.map((policy, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{policy.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">{policy.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{policy.created}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">{policy.lastModified}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                              <div className="pl-3">
                                <button
                                  onClick={() => {
                                    // Policy removed notification
                                    
                                    // Show toast notification
                                    toast({
                                      title: "Policy Removed Successfully",
                                      description: `Policy "${policy.name}" has been removed successfully`,
                                      duration: 5000,
                                      variant: "destructive",
                                    });
                                    
                                    // Remove from local state (in a real app, this would call an API)
                                    const newPoliciesData = policiesData.filter((_, i) => i !== index);
                                    // Note: In a real implementation, you'd update state here
                                  }}
                                  className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center"
                                  title="Remove policy"
                                >
                                  <TbWallpaperOff className="text-sm sm:text-base transition-colors" />
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
                        Showing {policiesData.length} policies.
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
                  <h2 className="text-lg font-bold text-black dark:text-white mb-2">Billing</h2>
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
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 p-6 shadow-sm flex flex-col min-h-[600px]">
                    <div className="text-center mb-6 h-40 relative">
                      <h3 className="text-lg font-bold text-black dark:text-white mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{plan.description}</p>
                      <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
                        {plan.monthlyPrice !== null ? (
                          <>
                            <span className="text-2xl font-bold text-black dark:text-white">${billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/month</span>
                            {billingPeriod === 'yearly' && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                *Billed annually
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-black dark:text-white">Custom</span>
                        )}
                      </div>
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
                        <button className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-semibold">
                          30-day free trial
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
              {/* Organizations */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 w-full shadow-sm">
                {!showOrganizationCreateForm && !showGroupCreateForm ? (
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold mb-2 text-black dark:text-white">Organizations</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">Create & manage organizations</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 items-center">
                      <div className="relative" ref={organizationDropdownRef}>
                        <button
                          onClick={() => setShowOrganizationDropdown(!showOrganizationDropdown)}
                          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary dark:focus:ring-0 dark:focus:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-center justify-between w-full gap-3"
                          style={{ fontFamily: 'Avenir, sans-serif' }}
                        >
                          <span>
                            {selectedOrganizationFilter.includes('all') 
                              ? `All (${organizationsData.length})` 
                              : selectedOrganizationFilter.length === 1
                                ? organizationsData.find(org => org.id === selectedOrganizationFilter[0])?.name || 'All'
                                : `${selectedOrganizationFilter.map(id => organizationsData.find(org => org.id === id)?.name).filter(Boolean).join(', ')} (${selectedOrganizationFilter.length})`
                            }
                          </span>
                          <TbChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        
                        {showOrganizationDropdown && (
                          <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                            <button
                              className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedOrganizationFilter.includes('all') ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                              onClick={() => {
                                setSelectedOrganizationFilter(['all']);
                                setShowOrganizationDropdown(false);
                              }}
                            >
                              <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                                {selectedOrganizationFilter.includes('all') && (
                                  <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={8} />
                                  </div>
                                )}
                              </div>
                              All
                            </button>
                            {organizationsData.map((org) => (
                              <button
                                key={org.id}
                                className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${selectedOrganizationFilter.includes(org.id) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setSelectedOrganizationFilter(prev => {
                                    const newFilters = prev.filter(f => f !== 'all');
                                    if (prev.includes(org.id)) {
                                      const updatedFilters = newFilters.filter(f => f !== org.id);
                                      // If no organizations left, default to 'all'
                                      return updatedFilters.length === 0 ? ['all'] : updatedFilters;
                                    } else {
                                      return [...newFilters, org.id];
                                    }
                                  });
                                }}
                              >
                                <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                                  {selectedOrganizationFilter.includes(org.id) && (
                                    <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                      <FaCheck className="text-white" size={8} />
                                    </div>
                                  )}
                                </div>
                                {org.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowOrganizationCreateForm(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold sm:ml-1 flex items-center gap-2"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <TbBuildingPlus size={16} />
                        Create Organization
                      </button>
                      <button 
                        onClick={() => setShowGroupCreateForm(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold sm:ml-1 flex items-center gap-2"
                        style={{ fontFamily: 'Avenir, sans-serif' }}
                      >
                        <TbUsersPlus size={16} />
                        Create Group
                      </button>
                    </div>
                  </div>
                ) : showGroupCreateForm ? (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                        <TbUsersPlus size={21} className="text-teal-500 dark:text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-black dark:text-white leading-tight">Create New Group</h2>
                        <p className="text-gray-500 text-xs leading-tight cursor-default select-none">Fill in group details & add collaborators</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowGroupCreateForm(false);
                        setGroupFormStep(1);
                        setGroupFormData({
                          name: '',
                          organization: '',
                          description: ''
                        });
                        setGroupCollaborators([{
                          name: '',
                          email: '',
                          showNamesDropdown: false,
                          namesDropdownRef: React.createRef<HTMLDivElement>(),
                          namesInputRef: React.createRef<HTMLInputElement>()
                        }]);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border-2 border-teal-200 dark:border-teal-800">
                        <TbBuildingPlus size={21} className="text-teal-500 dark:text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-black dark:text-white leading-tight">Create New Organization</h2>
                        <p className="text-gray-500 text-xs leading-tight cursor-default select-none">Fill in the organization details to get started</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setShowOrganizationCreateForm(false);
                        setOrganizationFormStep(1);
                        setOrganizationFormData({
                          name: '',
                          type: '',
                          businessAddress: '',
                          city: '',
                          state: '',
                          zipCode: '',
                          country: '',
                          phone: '',
                          website: '',
                          industries: []
                        });
                        setOrganizationCollaborators([{
                          name: '',
                          email: '',
                          contractPermissions: [],
                          showNamesDropdown: false,
                          namesDropdownRef: React.createRef<HTMLDivElement>(),
                          contractRoleInputRef: React.createRef<HTMLDivElement>(),
                          contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
                          namesInputRef: React.createRef<HTMLInputElement>(),
                          showContractRoleDropdown: false
                        }]);
                      }}
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Organization Create Inline Form */}
                {showOrganizationCreateForm && (
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl pb-6">

                      {/* Stepper */}
                      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        <div className="flex items-center justify-between mb-6 min-w-0">
                          <div className="flex items-center space-x-2 w-full flex-nowrap">
                            {[1, 2].map((step, idx) => (
                            <React.Fragment key={step}>
                              <button
                                type="button"
                                onClick={() => setOrganizationFormStep(step)}
                                className={`flex items-center gap-2 rounded-xl font-semibold border transition-all duration-300 text-sm px-3 sm:px-4 py-2 whitespace-nowrap flex-shrink-0
                                  ${organizationFormStep === step
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                              >
                                <span className={`inline-block transition-all duration-300 ${organizationFormStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: organizationFormStep === step ? 18 : 0}}>
                                  {organizationFormStep === step && <Logo width={18} height={18} className="pointer-events-none" />}
                                </span>
                                {step === 1 && 'Step 1: Details'}
                                {step === 2 && 'Step 2: Collaborators'}
                              </button>
                              {idx < 1 && <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-1 sm:mx-2" />}
                            </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="space-y-6 pt-4">
                        {organizationFormStep === 1 && (
                          <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">Organization Name <span className="text-red-500">*</span></label>
                                <input 
                                  type="text" 
                                  value={organizationFormData.name}
                                  onChange={(e) => handleOrganizationFormChange('name', e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                  placeholder="Enter organization name..." 
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">Organization Type <span className="text-red-500">*</span></label>
                                <div className="relative w-full" ref={organizationFormTypeDropdownRef}>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                                    placeholder="Select organization type..."
                                    value={COMPANY_TYPES.find(t => t.value === organizationFormData.type)?.label || ''}
                                    readOnly
                                    onClick={() => {
                                      setShowCompanyTypeDropdown(!showCompanyTypeDropdown);
                                      // Close other dropdowns when opening this one
                                      if (!showCompanyTypeDropdown) {
                                        setShowStateDropdown(false);
                                        setShowCountryDropdown(false);
                                        setShowIndustriesDropdown(false);
                                        setStateSearchTerm('');
                                        setCountrySearchTerm('');
                                        setIndustrySearchTerm('');
                                      }
                                    }}
                                  />
                                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  {showCompanyTypeDropdown && (
                                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar]:hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                      {COMPANY_TYPES.map(type => (
                                        <button
                                          key={type.value}
                                          className={`w-full text-left px-3 py-2 text-xs font-medium ${organizationFormData.type === type.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                          onClick={() => {
                                            handleOrganizationFormChange('type', type.value);
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
                                value={organizationFormData.businessAddress}
                                onChange={(e) => handleOrganizationFormChange('businessAddress', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                placeholder="Enter business address..." 
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">City</label>
                                <input 
                                  type="text" 
                                  value={organizationFormData.city}
                                  onChange={(e) => handleOrganizationFormChange('city', e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                  placeholder="Enter City..." 
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">State</label>
                                <div className="relative w-full" ref={organizationFormStateDropdownRef}>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                                    placeholder="Select State..."
                                    value={stateSearchTerm || US_STATES.find(s => s.value === organizationFormData.state)?.label || ''}
                                    onChange={(e) => setStateSearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && !stateSearchTerm) {
                                        e.preventDefault();
                                        handleOrganizationFormChange('state', '');
                                      }
                                    }}
                                    onClick={() => {
                                      setShowStateDropdown(!showStateDropdown);
                                      // Close other dropdowns when opening this one
                                      if (!showStateDropdown) {
                                        setShowCompanyTypeDropdown(false);
                                        setShowCountryDropdown(false);
                                        setShowIndustriesDropdown(false);
                                        setCountrySearchTerm('');
                                        setIndustrySearchTerm('');
                                      }
                                    }}
                                  />
                                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  {showStateDropdown && (
                                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar]:hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                      {US_STATES
                                        .filter(stateOption => 
                                          stateOption.label.toLowerCase().includes(stateSearchTerm.toLowerCase())
                                        )
                                        .map(stateOption => (
                                        <button
                                          key={stateOption.value}
                                          className={`w-full text-left px-3 py-2 text-xs font-medium ${organizationFormData.state === stateOption.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                          onClick={() => {
                                            handleOrganizationFormChange('state', stateOption.value);
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
                                  value={organizationFormData.zipCode}
                                  onChange={(e) => handleOrganizationFormChange('zipCode', e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                  placeholder="Enter ZIP code..." 
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">Country</label>
                                <div className="relative w-full" ref={organizationFormCountryDropdownRef}>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                                    placeholder="Select Country..."
                                    value={countrySearchTerm || COUNTRIES.find(c => c.value === organizationFormData.country)?.label || ''}
                                    onChange={(e) => setCountrySearchTerm(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && !countrySearchTerm) {
                                        e.preventDefault();
                                        handleOrganizationFormChange('country', '');
                                      }
                                    }}
                                    onClick={() => {
                                      setShowCountryDropdown(!showCountryDropdown);
                                      // Close other dropdowns when opening this one
                                      if (!showCountryDropdown) {
                                        setShowCompanyTypeDropdown(false);
                                        setShowStateDropdown(false);
                                        setShowIndustriesDropdown(false);
                                        setStateSearchTerm('');
                                        setIndustrySearchTerm('');
                                      }
                                    }}
                                  />
                                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  {showCountryDropdown && (
                                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar]:hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                      {COUNTRIES
                                        .filter(countryOption => 
                                          countryOption.label.toLowerCase().includes(countrySearchTerm.toLowerCase())
                                        )
                                        .map(countryOption => (
                                        <button
                                          key={countryOption.value}
                                          className={`w-full text-left px-3 py-2 text-xs font-medium ${organizationFormData.country === countryOption.value ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                          onClick={() => {
                                            handleOrganizationFormChange('country', countryOption.value);
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
                                  value={organizationFormData.phone}
                                  onChange={(e) => handleOrganizationFormChange('phone', e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                  placeholder="Enter phone number..." 
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-black dark:text-white mb-1">Website</label>
                              <input 
                                type="url" 
                                value={organizationFormData.website}
                                onChange={(e) => handleOrganizationFormChange('website', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                placeholder="Enter website..." 
                              />
                            </div>
                            <div className="mb-8">
                              <label className="block text-xs font-medium text-black dark:text-white mb-1">Industries</label>
                              <div className="relative w-full" ref={organizationFormIndustriesDropdownRef}>
                                <div className="relative">
                                  <div 
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary dark:focus-within:ring-0 dark:focus-within:border-gray-600 transition-colors bg-white dark:bg-gray-900 min-h-[40px] flex flex-wrap items-center gap-2 cursor-text"
                                    onClick={() => {
                                      setShowIndustriesDropdown(!showIndustriesDropdown);
                                      if (!showIndustriesDropdown) {
                                        setIndustrySearchTerm('');
                                        // Close other dropdowns when opening this one
                                        setShowCompanyTypeDropdown(false);
                                        setShowStateDropdown(false);
                                        setShowCountryDropdown(false);
                                        setStateSearchTerm('');
                                        setCountrySearchTerm('');
                                      }
                                    }}
                                  >
                                    {/* Selected industries display inside the field */}
                                    {organizationFormData.industries.map(industry => {
                                      const IconComponent = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS];
                                      return (
                                        <span 
                                          key={industry}
                                          className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-primary bg-white dark:bg-primary/10 text-gray-900 dark:text-white rounded text-xs font-medium"
                                        >
                                          <IconComponent className="w-3 h-3 text-primary dark:text-white" />
                                          {industry}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOrganizationFormChange('industries', organizationFormData.industries.filter(i => i !== industry));
                                            }}
                                            className="ml-1 hover:text-primary-dark dark:hover:text-gray-300"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      );
                                    })}
                                    {/* Input field for typing */}
                                    <input
                                      type="text"
                                      className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-xs font-medium text-black dark:text-white placeholder-gray-400"
                                      placeholder={organizationFormData.industries.length === 0 ? "Search or select industries..." : ""}
                                      value={industrySearchTerm}
                                      onChange={(e) => {
                                        setIndustrySearchTerm(e.target.value);
                                        setShowIndustriesDropdown(true);
                                      }}
                                      onFocus={(e) => {
                                        e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                      }}
                                    />
                                  </div>
                                </div>
                                {showIndustriesDropdown && (
                                  <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                    {INDUSTRIES
                                      .filter(industry => 
                                        industry.toLowerCase().includes(industrySearchTerm.toLowerCase())
                                      )
                                      .map(industry => {
                                        const IconComponent = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS];
                                        return (
                                          <button
                                            key={industry}
                                            className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${organizationFormData.industries.includes(industry) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            onClick={e => {
                                              e.preventDefault();
                                              const newIndustries = organizationFormData.industries.includes(industry)
                                                ? organizationFormData.industries.filter(i => i !== industry)
                                                : [...organizationFormData.industries, industry];
                                              handleOrganizationFormChange('industries', newIndustries);
                                              setIndustrySearchTerm('');
                                            }}
                                          >
                                            <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                                              {organizationFormData.industries.includes(industry) && (
                                                <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                  </svg>
                                                </div>
                                              )}
                                            </div>
                                            <IconComponent className="w-4 h-4" />
                                            {industry}
                                          </button>
                                        );
                                      })}
                                    {INDUSTRIES.filter(industry => 
                                      industry.toLowerCase().includes(industrySearchTerm.toLowerCase())
                                    ).length === 0 && industrySearchTerm.length > 0 && (
                                      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                        No industries found
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Cancel and Continue Buttons - Step 1 */}
                            <div className="flex items-center justify-between w-full !mt-5">
                              <button
                                onClick={() => {
                                  setShowOrganizationCreateForm(false);
                                  setOrganizationFormStep(1);
                                  setOrganizationFormData({
                                    name: '',
                                    type: '',
                                    businessAddress: '',
                                    city: '',
                                    state: '',
                                    zipCode: '',
                                    country: '',
                                    phone: '',
                                    website: '',
                                    industries: []
                                  });
                                  setOrganizationCollaborators([{
                                    name: '',
                                    email: '',
                                    contractPermissions: [],
                                    showNamesDropdown: false,
                                    namesDropdownRef: React.createRef<HTMLDivElement>(),
                                    contractRoleInputRef: React.createRef<HTMLDivElement>(),
                                    contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
                                    namesInputRef: React.createRef<HTMLInputElement>(),
                                    showContractRoleDropdown: false
                                  }]);
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setOrganizationFormStep(organizationFormStep + 1)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Continue
                              </button>
                            </div>
                          </form>
                        )}

                        {organizationFormStep === 2 && (
                          <form className="space-y-4">
                            {/* I am working solo checkbox */}
                            <div className="flex items-center gap-2 mb-6">
                              <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center cursor-pointer" onClick={() => {
                                const newValue = !isWorkingSolo;
                                setIsWorkingSolo(newValue);
                                
                                // If checking the box, automatically add current user as collaborator
                                if (newValue && user) {
                                  const currentUserCollaborator = {
                                    name: user.name,
                                    email: user.email,
                                    contractPermissions: ['Edit', 'View', 'Sign'],
                                    isEditingEmail: false
                                  };
                                  
                                  // Check if user is already added as collaborator
                                  const existingUser = addedOrganizationCollaborators.find(collaborator => 
                                    collaborator.email.toLowerCase() === user.email.toLowerCase()
                                  );
                                  
                                  if (!existingUser) {
                                    setAddedOrganizationCollaborators(prev => [...prev, currentUserCollaborator]);
                                  }
                                } else if (!newValue && user) {
                                  // If unchecking the box, remove current user as collaborator
                                  setAddedOrganizationCollaborators(prev => prev.filter(collaborator => 
                                    collaborator.email.toLowerCase() !== user.email.toLowerCase()
                                  ));
                                }
                              }}>
                                {isWorkingSolo && (
                                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
                                    <FaCheck className="text-white" size={10} />
                                  </div>
                                )}
                              </div>
                              <label 
                                className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                                onClick={() => {
                                  const newValue = !isWorkingSolo;
                                  setIsWorkingSolo(newValue);
                                  
                                  // If checking the box, automatically add current user as collaborator
                                  if (newValue && user) {
                                    const currentUserCollaborator = {
                                      name: user.name,
                                      email: user.email,
                                      contractPermissions: ['Edit', 'View', 'Sign'],
                                      isEditingEmail: false
                                    };
                                    
                                    // Check if user is already added as collaborator
                                    const existingUser = addedOrganizationCollaborators.find(collaborator => 
                                      collaborator.email.toLowerCase() === user.email.toLowerCase()
                                    );
                                    
                                    if (!existingUser) {
                                      setAddedOrganizationCollaborators(prev => [...prev, currentUserCollaborator]);
                                    }
                                  } else if (!newValue && user) {
                                    // If unchecking the box, remove current user as collaborator
                                    setAddedOrganizationCollaborators(prev => prev.filter(collaborator => 
                                      collaborator.email.toLowerCase() !== user.email.toLowerCase()
                                    ));
                                  }
                                }}
                              >
                                I am working solo
                              </label>
                            </div>
                            
                            {/* Single form fields */}
                            <div className="relative mb-4">
                              {/* Form fields */}
                              <div className="flex gap-6">
                                <div className="w-1/2">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Collaborator Name <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      ref={organizationCollaborators[0].namesInputRef}
                                      type="text"
                                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white pr-10"
                                      placeholder="Enter collaborator name..."
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                      value={organizationCollaborators[0].name}
                                      onChange={e => {
                                        setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, name: e.target.value } : r));
                                        setOrganizationRecipientErrors(prev => ({ ...prev, [`name-0`]: false }));
                                        setDuplicateOrganizationCollaboratorError(false);
                                      }}
                                      onClick={() => {
                                        setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { 
                                          ...r, 
                                          showNamesDropdown: !r.showNamesDropdown,
                                          showContractRoleDropdown: false // Close permissions dropdown
                                        } : r));
                                        // Also close the showPermissionsDropdown state
                                        setShowOrganizationPermissionsDropdown(false);
                                      }}
                                      autoComplete="off"
                                    />
                                    <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    
                                    {/* Names/Emails Autocomplete Dropdown */}
                                    {organizationCollaborators[0].showNamesDropdown && (
                                      <div 
                                        ref={organizationCollaborators[0].namesDropdownRef}
                                        className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                                      >
                                        {/* Assignees Section */}
                                        {allAssignees
                                          .filter(assignee => 
                                            assignee.toLowerCase().includes(organizationCollaborators[0].name.toLowerCase())
                                          )
                                          .sort()
                                          .map((assignee) => (
                                            <button
                                              key={`assignee-${assignee}`}
                                              className="w-full text-left px-3 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                              onClick={() => {
                                                setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, name: assignee, showNamesDropdown: false } : r));
                                                setOrganizationRecipientErrors(prev => ({ ...prev, [`name-0`]: false }));
                                              }}
                                            >
                                              <TbUser className="w-4 h-4 flex-shrink-0" />
                                              {assignee}
                                            </button>
                                          ))}
                                        
                                        {/* Contract Parties Section */}
                                        {(() => {
                                          const mockContracts = [
                                            'Robert Chen', 'Eastside Properties', 'GreenSpace Developers', 'BuildRight Construction',
                                            'TechCorp', 'Property Holdings', 'Smith Family', 'Real Estate Co', 'InvestPro', 
                                            'Property Group', 'Johnson Family', 'Home Sales', 'Office Solutions', 'Property Co',
                                            'Corporate Holdings', 'Real Estate', 'Retail Corp', 'Marketing Solutions Inc', 'Legal Advisory LLC'
                                          ];
                                          
                                          const filteredParties = mockContracts
                                            .filter(party => 
                                              party.toLowerCase().includes(organizationCollaborators[0].name.toLowerCase()) &&
                                              !allAssignees.includes(party)
                                            )
                                            .sort();
                                          
                                          return filteredParties.length > 0 ? (
                                            <>
                                              {filteredParties.map((party) => (
                                                <button
                                                  key={`party-${party}`}
                                                  className="w-full text-left px-3 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                  onClick={() => {
                                                    setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, name: party, showNamesDropdown: false } : r));
                                                    setOrganizationRecipientErrors(prev => ({ ...prev, [`name-0`]: false }));
                                                  }}
                                                >
                                                  <TbUser className="w-4 h-4 flex-shrink-0" />
                                                  {party}
                                                </button>
                                              ))}
                                            </>
                                          ) : null;
                                        })()}
                                        
                                        {/* No Matches Message */}
                                        {(() => {
                                          const allAssigneesFiltered = allAssignees.filter(assignee => 
                                            assignee.toLowerCase().includes(organizationCollaborators[0].name.toLowerCase())
                                          );
                                          const mockContracts = [
                                            'Robert Chen', 'Eastside Properties', 'GreenSpace Developers', 'BuildRight Construction',
                                            'TechCorp', 'Property Holdings', 'Smith Family', 'Real Estate Co', 'InvestPro', 
                                            'Property Group', 'Johnson Family', 'Home Sales', 'Office Solutions', 'Property Co',
                                            'Corporate Holdings', 'Real Estate', 'Retail Corp', 'Marketing Solutions Inc', 'Legal Advisory LLC'
                                          ];
                                          const filteredParties = mockContracts.filter(party => 
                                            party.toLowerCase().includes(organizationCollaborators[0].name.toLowerCase()) &&
                                            !allAssignees.includes(party)
                                          );
                                          
                                          return allAssigneesFiltered.length === 0 && filteredParties.length === 0 && organizationCollaborators[0].name.length > 0 ? (
                                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                              No matches found
                                            </div>
                                          ) : null;
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                  {organizationRecipientErrors[`name-0`] && (
                                    <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Collaborator name is required
                                    </p>
                                  )}
                                
                                  {/* Email Field */}
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-6" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Collaborator Email <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                    placeholder="Enter collaborator email address..."
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    value={organizationCollaborators[0].email || ''}
                                    onChange={e => {
                                      setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, email: e.target.value } : r));
                                      setOrganizationRecipientErrors(prev => ({ ...prev, [`email-0`]: false }));
                                      setDuplicateOrganizationCollaboratorError(false);
                                    }}
                                  />
                                  {organizationRecipientErrors[`email-0`] && (
                                    <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Collaborator email is required
                                    </p>
                                  )}
                                </div>
                                <div className="w-1/2">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Contract Permissions <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative w-full">
                                    {/* Permissions Field with Selected Permissions Inside */}
                                    <div 
                                      ref={organizationCollaborators[0].contractRoleInputRef}
                                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors bg-white dark:bg-gray-900 flex items-center justify-between cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowOrganizationPermissionsDropdown(!showOrganizationPermissionsDropdown);
                                        // Close names dropdown when opening permissions dropdown
                                        setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, showNamesDropdown: false } : r));
                                      }}
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      <div className="flex-1 flex items-center overflow-hidden">
                                        {organizationCollaborators[0].contractPermissions.length > 0 ? (
                                          <span className="text-gray-900 dark:text-white">
                                            {sortOrganizationPermissions(organizationCollaborators[0].contractPermissions).join(', ')}
                                          </span>
                                        ) : (
                                          <span className="text-gray-500">Define collaborator contract permissions...</span>
                                        )}
                                      </div>
                                      <TbChevronDown 
                                        className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-2" 
                                      />
                                    </div>
                                    
                                    {/* Permissions Dropdown */}
                                    {showOrganizationPermissionsDropdown && (
                                      <div
                                        key="permissions-dropdown"
                                        ref={organizationCollaborators[0].contractRoleDropdownRef}
                                        className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-2"
                                        style={{ 
                                          top: 'calc(100% + 4px)',
                                          fontFamily: 'Avenir, sans-serif'
                                        }}
                                      >
                                        {['Edit', 'View', 'Sign'].map((permission) => (
                                          <button
                                            key={permission}
                                            className={`w-full px-4 py-2 text-left text-xs hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center ${organizationCollaborators[0].contractPermissions.includes(permission) ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              setOrganizationCollaborators(prev => prev.map((r, i) => i === 0 ? {
                                                ...r,
                                                contractPermissions: r.contractPermissions.includes(permission)
                                                  ? r.contractPermissions.filter(p => p !== permission)
                                                  : [...r.contractPermissions, permission]
                                              } : r));
                                              setOrganizationRecipientErrors(prev => ({ ...prev, [`contractPermissions-0`]: false }));
                                              // Don't close the dropdown - allow multiple selections
                                            }}
                                          >
                                            <div className="w-4 h-4 border border-gray-300 rounded mr-2 flex items-center justify-center">
                                              {organizationCollaborators[0].contractPermissions.includes(permission) && (
                                                <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                                  <FaCheck className="text-white" size={8} />
                                                </div>
                                              )}
                                            </div>
                                            {permission}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {organizationRecipientErrors[`contractPermissions-0`] && (
                                      <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                        Permissions must be defined
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Added Collaborators Display */}
                            <div className="pt-2.5 min-h-[120px]">
                              {addedOrganizationCollaborators.length > 0 ? (
                                <>
                                  <button 
                                    className="flex items-center gap-2 mb-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-0 active:transform-none transition-colors cursor-pointer"
                                    onClick={() => setShowManageOrganizationCollaboratorsModal(true)}
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    <TbUsers className="h-5 w-5" />
                                    <span className="text-xs font-semibold">Manage</span>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                      ({addedOrganizationCollaborators.length})
                                    </span>
                                  </button>
                                  <div className="flex flex-wrap gap-1">
                                    {addedOrganizationCollaborators.map((collaborator, idx) => {
                                      const colorScheme = getCollaboratorBadgeColor(idx);
                                      return (
                                        <div 
                                          key={idx} 
                                          className={`h-10 w-10 rounded-lg ${colorScheme.bg} flex items-center justify-center border-2 ${colorScheme.border} relative group cursor-pointer`}
                                          onClick={() => setShowManageOrganizationCollaboratorsModal(true)}
                                        >
                                          <span className={`text-sm font-semibold ${colorScheme.text}`} style={{ fontFamily: 'Avenir, sans-serif' }}>
                                            {getInitials(collaborator.name)}
                                          </span>
                                          
                                          {/* X button for removal - only visible on hover */}
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              
                                              // Check if the collaborator being removed is the current user
                                              const collaboratorToRemove = addedOrganizationCollaborators[idx];
                                              const isCurrentUser = user && collaboratorToRemove.email.toLowerCase() === user.email.toLowerCase();
                                              
                                              // Remove the collaborator
                                              setAddedOrganizationCollaborators(prev => prev.filter((_, i) => i !== idx));
                                              
                                              // If removing current user, uncheck the "I am working solo" box
                                              if (isCurrentUser) {
                                                setIsWorkingSolo(false);
                                              }
                                            }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 border-2 border-red-200 dark:border-red-800"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              ) : (
                                <div className="text-center py-8 pb-8 text-gray-500 dark:text-gray-400 cursor-default select-none">
                                  <TbUsers size={26} className="mx-auto mb-2 text-primary" />
                                  <p className="text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>No collaborators yet</p>
                                  <p className="text-xs" style={{ fontFamily: 'Avenir, sans-serif' }}>Add a collaborator by filling in the details above and clicking the "Add Collaborator" button</p>
                                </div>
                              )}
                            </div>

                            {/* Step 2 specific content - no buttons here */}
                          </form>
                        )}

                        {/* Form Actions */}
                        {organizationFormStep > 1 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {organizationFormStep > 1 && (
                              <button
                                onClick={() => { setOrganizationFormStep(1); setCountrySearchTerm(''); setStateSearchTerm(''); }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Previous
                              </button>
                            )}
                          </div>
                          <div className="flex items-center" style={{ gap: '3px' }}>
                            {organizationFormStep === 2 && (
                              <div className="relative flex">
                                {/* Duplicate Collaborator Error */}
                                {duplicateOrganizationCollaboratorError && (
                                  <p className="absolute bottom-full left-0 mb-1 text-xs text-red-600 font-medium cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    {duplicateOrganizationCollaboratorError === 'both' ? 'Collaborator name & email already used' : 
                                     duplicateOrganizationCollaboratorError === 'email' ? 'Collaborator email has already been used' : 
                                     'Collaborator has already been added'}
                                  </p>
                                )}
                                
                                <button
                                  type="button"
                                  onClick={handleAddOrganizationCollaborator}
                                  disabled={!organizationCollaborators[0].name.trim() || organizationCollaborators[0].contractPermissions.length === 0 || !organizationCollaborators[0].email.trim()}
                                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                  style={{ fontFamily: 'Avenir, sans-serif' }}
                                >
                                  <TbUserPlus className="w-4 h-4 mr-2" />
                                  Add Collaborator
                                </button>
                              </div>
                            )}
                            {organizationFormStep === 2 && (
                              <button
                                onClick={() => {
                                  // Handle form submission here
                                  console.log('Organization form submitted:', { organizationFormData, organizationCollaborators });
                                  setShowOrganizationCreateForm(false);
                                  setOrganizationFormStep(1);
                                  setOrganizationFormData({
                                    name: '',
                                    type: '',
                                    businessAddress: '',
                                    city: '',
                                    state: '',
                                    zipCode: '',
                                    country: '',
                                    phone: '',
                                    website: '',
                                    industries: []
                                  });
                                  setOrganizationCollaborators([{
                                    name: '',
                                    email: '',
                                    contractPermissions: [],
                                    showNamesDropdown: false,
                                    namesDropdownRef: React.createRef<HTMLDivElement>(),
                                    contractRoleInputRef: React.createRef<HTMLDivElement>(),
                                    contractRoleDropdownRef: React.createRef<HTMLDivElement>(),
                                    namesInputRef: React.createRef<HTMLInputElement>(),
                                    showContractRoleDropdown: false
                                  }]);
                                }}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Create
                              </button>
                            )}
                          </div>
                        </div>
                        )}
                        
                        {/* Divider Line */}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-6"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Group Create Inline Form */}
                {showGroupCreateForm && (
                  <div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl pb-6">

                      {/* Stepper */}
                      <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500">
                        <div className="flex items-center justify-between mb-6 min-w-0">
                          <div className="flex items-center space-x-2 w-full flex-nowrap">
                            {[1, 2].map((step, idx) => (
                            <React.Fragment key={step}>
                              <button
                                type="button"
                                onClick={() => setGroupFormStep(step)}
                                className={`flex items-center gap-2 rounded-xl font-semibold border transition-all duration-300 text-sm px-3 sm:px-4 py-2 whitespace-nowrap flex-shrink-0
                                  ${groupFormStep === step
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 ring-1 ring-inset ring-gray-200 dark:ring-gray-600 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                                  }`}
                              >
                                <span className={`inline-block transition-all duration-300 ${groupFormStep === step ? 'opacity-100 mr-2' : 'opacity-0 w-0 mr-0'}`} style={{width: groupFormStep === step ? 18 : 0}}>
                                  {groupFormStep === step && <Logo width={18} height={18} className="pointer-events-none" />}
                                </span>
                                {step === 1 && 'Step 1: Details'}
                                {step === 2 && 'Step 2: Collaborators'}
                              </button>
                              {idx < 1 && <div className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-600 mx-1 sm:mx-2" />}
                            </React.Fragment>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="space-y-6 pt-4">
                        {groupFormStep === 1 && (
                          <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">Group Name <span className="text-red-500">*</span></label>
                                <input 
                                  type="text" 
                                  value={groupFormData.name}
                                  onChange={(e) => handleGroupFormChange('name', e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                  placeholder="Enter group name..." 
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-black dark:text-white mb-1">Organization <span className="text-red-500">*</span></label>
                                <div className="relative w-full" ref={groupOrganizationDropdownRef}>
                                  <input
                                    type="text"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                                    placeholder="Select organization..."
                                    value={organizationsData.find(org => org.id === groupFormData.organization)?.name || ''}
                                    readOnly
                                    onClick={() => setShowGroupOrganizationDropdown(!showGroupOrganizationDropdown)}
                                  />
                                  <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  {showGroupOrganizationDropdown && (
                                    <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar]:hidden" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                      {organizationsData.map(org => (
                                        <button
                                          key={org.id}
                                          className={`w-full text-left px-3 py-2 text-xs font-medium ${groupFormData.organization === org.id ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                          onClick={() => {
                                            handleGroupFormChange('organization', org.id);
                                            setShowGroupOrganizationDropdown(false);
                                          }}
                                        >
                                          {org.name}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-black dark:text-white mb-1">Description</label>
                              <textarea 
                                value={groupFormData.description}
                                onChange={(e) => handleGroupFormChange('description', e.target.value)}
                                className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs resize-none" 
                                placeholder="Enter group description..."
                                rows={4}
                              />
                            </div>
                            
                            {/* Cancel and Continue Buttons - Step 1 */}
                            <div className="flex items-center justify-between w-full !mt-5">
                              <button
                                onClick={() => {
                                  setShowGroupCreateForm(false);
                                  setGroupFormStep(1);
                                  setGroupFormData({
                                    name: '',
                                    organization: '',
                                    description: ''
                                  });
                                  setGroupCollaborators([{
                                    name: '',
                                    email: '',
                                    showNamesDropdown: false,
                                    namesDropdownRef: React.createRef<HTMLDivElement>(),
                                    namesInputRef: React.createRef<HTMLInputElement>()
                                  }]);
                                }}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setGroupFormStep(groupFormStep + 1)}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                                style={{ fontFamily: 'Avenir, sans-serif' }}
                              >
                                Continue
                              </button>
                            </div>
                          </form>
                        )}

                        {groupFormStep === 2 && (
                          <form>
                            
                            {/* Single form fields */}
                            <div className="relative mb-4">
                              {/* Form fields */}
                              <div className="flex gap-6">
                                <div className="w-1/2">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Collaborator Name <span className="text-red-500">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      ref={groupCollaborators[0].namesInputRef}
                                      type="text"
                                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white pr-10"
                                      placeholder="Enter collaborator name..."
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                      value={groupCollaborators[0].name}
                                      onChange={e => {
                                        setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, name: e.target.value } : r));
                                        setGroupRecipientErrors(prev => ({ ...prev, [`name-0`]: false }));
                                        setDuplicateGroupCollaboratorError(false);
                                      }}
                                      onClick={() => {
                                        setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { 
                                          ...r, 
                                          showNamesDropdown: !r.showNamesDropdown
                                        } : r));
                                      }}
                                      autoComplete="off"
                                    />
                                    <TbChevronDown className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                                    
                                    {/* Names/Emails Autocomplete Dropdown */}
                                    {groupCollaborators[0].showNamesDropdown && (
                                      <div 
                                        ref={groupCollaborators[0].namesDropdownRef}
                                        className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:dark:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500"
                                      >
                                        {/* Assignees Section */}
                                        {allAssignees
                                          .filter(assignee => 
                                            assignee.toLowerCase().includes(groupCollaborators[0].name.toLowerCase())
                                          )
                                          .sort()
                                          .map((assignee) => (
                                            <button
                                              key={`assignee-${assignee}`}
                                              className="w-full text-left px-3 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                              onClick={() => {
                                                setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, name: assignee, showNamesDropdown: false } : r));
                                                setGroupRecipientErrors(prev => ({ ...prev, [`name-0`]: false }));
                                              }}
                                            >
                                              <TbUser className="w-4 h-4 flex-shrink-0" />
                                              {assignee}
                                            </button>
                                          ))}
                                        
                                        {/* Contract Parties Section */}
                                        {(() => {
                                          const mockContracts = [
                                            'Robert Chen', 'Eastside Properties', 'GreenSpace Developers', 'BuildRight Construction',
                                            'TechCorp', 'Property Holdings', 'Smith Family', 'Real Estate Co', 'InvestPro', 
                                            'Property Group', 'Johnson Family', 'Home Sales', 'Office Solutions', 'Property Co',
                                            'Corporate Holdings', 'Real Estate', 'Retail Corp', 'Marketing Solutions Inc', 'Legal Advisory LLC'
                                          ];
                                          
                                          const filteredParties = mockContracts
                                            .filter(party => 
                                              party.toLowerCase().includes(groupCollaborators[0].name.toLowerCase()) &&
                                              !allAssignees.includes(party)
                                            )
                                            .sort();
                                          
                                          return filteredParties.length > 0 ? (
                                            <>
                                              {filteredParties.map((party) => (
                                                <button
                                                  key={`party-${party}`}
                                                  className="w-full text-left px-3 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                                  onClick={() => {
                                                    setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, name: party, showNamesDropdown: false } : r));
                                                    setGroupRecipientErrors(prev => ({ ...prev, [`name-0`]: false }));
                                                  }}
                                                >
                                                  <TbUser className="w-4 h-4 flex-shrink-0" />
                                                  {party}
                                                </button>
                                              ))}
                                            </>
                                          ) : null;
                                        })()}
                                        
                                        {/* No Matches Message */}
                                        {(() => {
                                          const allAssigneesFiltered = allAssignees.filter(assignee => 
                                            assignee.toLowerCase().includes(groupCollaborators[0].name.toLowerCase())
                                          );
                                          const mockContracts = [
                                            'Robert Chen', 'Eastside Properties', 'GreenSpace Developers', 'BuildRight Construction',
                                            'TechCorp', 'Property Holdings', 'Smith Family', 'Real Estate Co', 'InvestPro', 
                                            'Property Group', 'Johnson Family', 'Home Sales', 'Office Solutions', 'Property Co',
                                            'Corporate Holdings', 'Real Estate', 'Retail Corp', 'Marketing Solutions Inc', 'Legal Advisory LLC'
                                          ];
                                          const filteredParties = mockContracts.filter(party => 
                                            party.toLowerCase().includes(groupCollaborators[0].name.toLowerCase()) &&
                                            !allAssignees.includes(party)
                                          );
                                          
                                          return allAssigneesFiltered.length === 0 && filteredParties.length === 0 && groupCollaborators[0].name.length > 0 ? (
                                            <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                              No matches found
                                            </div>
                                          ) : null;
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                  {groupRecipientErrors[`name-0`] && (
                                    <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Collaborator name is required
                                    </p>
                                  )}
                                </div>
                                
                                <div className="w-1/2">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                    Collaborator Email <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="email"
                                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-white dark:bg-gray-900 dark:text-white"
                                    placeholder="Enter collaborator email address..."
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                    value={groupCollaborators[0].email || ''}
                                    onChange={e => {
                                      setGroupCollaborators(prev => prev.map((r, i) => i === 0 ? { ...r, email: e.target.value } : r));
                                      setGroupRecipientErrors(prev => ({ ...prev, [`email-0`]: false }));
                                      setDuplicateGroupCollaboratorError(false);
                                    }}
                                  />
                                  {groupRecipientErrors[`email-0`] && (
                                    <p className="text-red-600 text-xs mt-1" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Collaborator email is required
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                            </div>

                            {/* Added Collaborators Display */}
                            <div className="mt-8 min-h-[120px]">
                              {addedGroupCollaborators.length > 0 ? (
                                <>
                                  <div className="flex items-center gap-2 mb-5 ml-3">
                                    <TbUsers className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                      Added Collaborators ({addedGroupCollaborators.length})
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 -ml-6">
                                    {addedGroupCollaborators.map((collaborator, idx) => {
                                      const colorScheme = getCollaboratorBadgeColor(idx);
                                      return (
                                        <div 
                                          key={idx} 
                                          className={`h-10 w-10 rounded-lg ${colorScheme.bg} flex items-center justify-center border-2 ${colorScheme.border} relative group`}
                                        >
                                          <span className={`text-sm font-semibold ${colorScheme.text}`} style={{ fontFamily: 'Avenir, sans-serif' }}>
                                            {getInitials(collaborator.name)}
                                          </span>
                                          
                                          {/* X button for removal - only visible on hover */}
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setAddedGroupCollaborators(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-lg flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/30 border-2 border-red-200 dark:border-red-800"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </>
                              ) : (
                                <div className="text-center py-8 pb-8 text-gray-500 dark:text-gray-400 cursor-default select-none">
                                  <TbUsers size={26} className="mx-auto mb-2 text-primary" />
                                  <p className="text-sm" style={{ fontFamily: 'Avenir, sans-serif' }}>No collaborators yet</p>
                                  <p className="text-xs" style={{ fontFamily: 'Avenir, sans-serif' }}>Add a collaborator by filling in the details above and clicking the "Add Collaborator" button</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Form Actions */}
                            <div className="flex items-center justify-between w-full !mt-5">
                              <div className="flex items-center">
                                {groupFormStep > 1 && (
                                  <button
                                    onClick={() => setGroupFormStep(groupFormStep - 1)}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    Previous
                                  </button>
                                )}
                              </div>
                              <div className="flex items-center" style={{ gap: '3px' }}>
                                {groupFormStep === 2 && (
                                  <div className="relative flex">
                                    {/* Duplicate Collaborator Error */}
                                    {duplicateGroupCollaboratorError && (
                                      <p className="absolute bottom-full left-0 mb-1 text-xs text-red-600 font-medium cursor-default select-none" style={{ fontFamily: 'Avenir, sans-serif' }}>
                                        {duplicateGroupCollaboratorError === 'both' ? 'Collaborator name & email already used' : 
                                         duplicateGroupCollaboratorError === 'email' ? 'Collaborator email has already been used' : 
                                         'Collaborator has already been added'}
                                      </p>
                                    )}
                                    
                                    <button
                                      type="button"
                                      onClick={handleAddGroupCollaborator}
                                      disabled={!groupCollaborators[0].name.trim() || !groupCollaborators[0].email.trim()}
                                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                      style={{ fontFamily: 'Avenir, sans-serif' }}
                                    >
                                      <TbUserPlus className="w-4 h-4 mr-2" />
                                      Add Collaborator
                                    </button>
                                  </div>
                                )}
                                {groupFormStep === 2 && (
                                  <button
                                    onClick={() => {
                                      // Handle form submission here
                                      console.log('Group form submitted:', { groupFormData, groupCollaborators });
                                      setShowGroupCreateForm(false);
                                      setGroupFormStep(1);
                                      setGroupFormData({
                                        name: '',
                                        organization: '',
                                        description: ''
                                      });
                                      setGroupCollaborators([{
                                        name: '',
                                        email: '',
                                        showNamesDropdown: false,
                                        namesDropdownRef: React.createRef<HTMLDivElement>(),
                                        namesInputRef: React.createRef<HTMLInputElement>()
                                      }]);
                                    }}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    Create
                                  </button>
                                )}
                              </div>
                            </div>
                          </form>
                        )}
                        
                        {/* Divider Line */}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-6"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  {organizationsData
                    .filter((org) => selectedOrganizationFilter.includes('all') || selectedOrganizationFilter.includes(org.id))
                    .map((org, index, filteredOrgs) => (
                    <div key={org.id}>
                      {index > 0 && (
                        <div className="mt-2 pt-4 border-t border-gray-200 dark:border-gray-700 mx-6"></div>
                      )}
                      <div 
                        className={`bg-white dark:bg-gray-800 rounded-xl ${index > 0 ? 'pt-2 pb-6 px-6' : 'p-6'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 mr-3 ${
                              org.color === 'cyan' ? 'bg-cyan-100 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800' :
                              org.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' :
                              'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                            }`}>
                              <span className={`font-semibold text-sm ${
                                org.color === 'cyan' ? 'text-cyan-500 dark:text-cyan-400' :
                                org.color === 'blue' ? 'text-blue-500 dark:text-blue-400' :
                                'text-green-500 dark:text-green-400'
                              }`}>{org.initials}</span>
                            </div>
                            <div>
                              <div className="flex items-center">
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{org.name}</div>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{org.description}</div>
                            </div>
                          </div>
                          <div className="relative" data-org-dropdown={org.id}>
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowOrganizationActionsDropdown(showOrganizationActionsDropdown === org.id ? null : org.id);
                              }}
                              className="border border-gray-300 dark:border-gray-800 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-gray-600 relative group flex items-center justify-center"
                            >
                              <TbDotsVertical size={14} />
                            </button>
                            
                            {showOrganizationActionsDropdown === org.id && (
                              <div 
                                className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5"
                              >
                                <button
                                  className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                                  onClick={() => {
                                    setConfiguredOrganization(configuredOrganization === org.id ? null : org.id);
                                    setShowOrganizationActionsDropdown(null);
                                  }}
                                >
                                  <TbBuildingCog className="h-4 w-4 mr-2" />
                                  Edit
                                </button>
                                <button
                                  className="w-full px-3 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                                  onClick={() => {
                                    setShowOrganizationActionsDropdown(null);
                                    // Add remove functionality here
                                  }}
                                >
                                  <TbBuildingOff className="h-4 w-4 mr-2" />
                                  Remove
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Organization Configuration Section */}
                        {configuredOrganization === org.id && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-end mb-4">
                              <button
                                onClick={() => setConfiguredOrganization(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full -mr-1.5"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                            <div className="mb-6">
                              <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Organization Name</label>
                    <input 
                      type="text" 
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs" 
                                      placeholder="Enter organization name..." 
                    />
                  </div>
                  <div>
                                    <label className="block text-xs font-medium text-black dark:text-white mb-1">Organization Type</label>
                    <div className="relative w-full" ref={companyTypeDropdownRef}>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs pr-10 cursor-pointer caret-transparent"
                                        placeholder="Select organization type..."
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
                                    <div className="relative">
                                      <div 
                                        className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-xs font-medium text-black dark:text-white focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-colors bg-white dark:bg-gray-900 min-h-[40px] flex flex-wrap items-center gap-2 cursor-text"
                                        onClick={() => {
                                          setShowIndustriesDropdown(!showIndustriesDropdown);
                                          if (!showIndustriesDropdown) {
                                            setIndustrySearchTerm('');
                                          }
                                        }}
                                      >
                                        {/* Selected industries display inside the field */}
                                        {selectedIndustries.map(industry => {
                                          const IconComponent = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS];
                                          return (
                                            <span 
                                              key={industry}
                                              className="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 dark:border-primary bg-white dark:bg-primary/10 text-gray-900 dark:text-white rounded text-xs font-medium"
                                            >
                                              <IconComponent className="w-3 h-3 text-primary dark:text-white" />
                                              {industry}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedIndustries(prev => prev.filter(i => i !== industry));
                                                }}
                                                className="ml-1 hover:text-primary-dark dark:hover:text-gray-300"
                                              >
                                                ×
                                              </button>
                                            </span>
                                          );
                                        })}
                                        {/* Input field for typing */}
                                        <input
                                          type="text"
                                          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-xs font-medium text-black dark:text-white placeholder-gray-400"
                                          placeholder={selectedIndustries.length === 0 ? "Search or select industries..." : ""}
                                          value={industrySearchTerm}
                                          onChange={(e) => {
                                            setIndustrySearchTerm(e.target.value);
                                            setShowIndustriesDropdown(true);
                                          }}
                                          onFocus={(e) => {
                                            e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                                          }}
                                        />
                                      </div>
                                    </div>
                                    {showIndustriesDropdown && (
                                      <div className="absolute left-0 mt-1 w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 z-50 py-0.5 max-h-48 overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                        {INDUSTRIES
                                          .filter(industry => 
                                            industry.toLowerCase().includes(industrySearchTerm.toLowerCase())
                                          )
                                          .map(industry => {
                                            const IconComponent = INDUSTRY_ICONS[industry as keyof typeof INDUSTRY_ICONS];
                                            return (
                                              <button
                                                key={industry}
                                                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${selectedIndustries.includes(industry) ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                onClick={e => {
                                                  e.preventDefault();
                                                  setSelectedIndustries(prev => {
                                                    if (prev.includes(industry)) {
                                                      return prev.filter(i => i !== industry);
                                                    } else {
                                                      return [...prev, industry];
                                                    }
                                                  });
                                                  setIndustrySearchTerm('');
                                                }}
                                              >
                                                <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                                                  {selectedIndustries.includes(industry) && (
                                                    <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                                                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                      </svg>
                                                    </div>
                                                  )}
                                                </div>
                                                <IconComponent className="w-4 h-4" />
                                                {industry}
                                              </button>
                                            );
                                          })}
                                        {INDUSTRIES.filter(industry => 
                                          industry.toLowerCase().includes(industrySearchTerm.toLowerCase())
                                        ).length === 0 && industrySearchTerm.length > 0 && (
                                          <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                            No industries found
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}
              
                        {/* Collaborators Section */}
                          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="mb-6">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="text-sm font-bold text-black dark:text-white">Collaborators</h3>
                                  <p className="text-gray-600 dark:text-gray-400 text-xs">Manage collaborators who have access to this organization</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                  <button 
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-transparent bg-white dark:bg-primary text-gray-900 dark:text-white font-semibold text-sm hover:bg-gray-50 dark:hover:bg-primary-dark transition-colors cursor-pointer"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    <TbMailShare className="w-4 h-4 text-primary dark:text-white" /> Invite
                                  </button>
                                  <button 
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-transparent bg-white dark:bg-primary text-gray-900 dark:text-white font-semibold text-xs hover:bg-gray-50 dark:hover:bg-primary-dark transition-colors cursor-pointer sm:ml-1"
                                    style={{ fontFamily: 'Avenir, sans-serif' }}
                                  >
                                    <TbUserPlus className="text-base text-primary dark:text-white" /> Add
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <div className="overflow-x-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-track]:dark:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:dark:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-gray-400 [&::-webkit-scrollbar-thumb:hover]:dark:bg-gray-500 [&::-webkit-scrollbar-corner]:bg-gray-50 [&::-webkit-scrollbar-corner]:dark:bg-gray-700">
                                <table className="w-full">
                                  <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">Name</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Role</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Status</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Last Active</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/5">Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {collaboratorsData.map((collaborator, index) => (
                                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-2/5">
                                          <div className="flex items-center">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border-2 mr-3 ${
                                              index === 0 ? 'bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800' :
                                              index === 1 ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' :
                                              index === 2 ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800' :
                                              index === 3 ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800' :
                                              index === 4 ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800' :
                                              index === 5 ? 'bg-pink-100 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800' :
                                              index === 6 ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800' :
                                              'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                                            }`}>
                                              <span className={`font-semibold text-xs ${
                                                index === 0 ? 'text-teal-500 dark:text-teal-400' :
                                                index === 1 ? 'text-blue-500 dark:text-blue-400' :
                                                index === 2 ? 'text-purple-500 dark:text-purple-400' :
                                                index === 3 ? 'text-orange-500 dark:text-orange-400' :
                                                index === 4 ? 'text-green-500 dark:text-green-400' :
                                                index === 5 ? 'text-pink-500 dark:text-pink-400' :
                                                index === 6 ? 'text-indigo-500 dark:text-indigo-400' :
                                                'text-yellow-500 dark:text-yellow-400'
                                              }`}>{collaborator.avatar}</span>
                                            </div>
                                            <div>
                                              <div className="font-medium">{collaborator.name}</div>
                                              <div className="text-gray-500 dark:text-gray-400">{collaborator.email}</div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            collaborator.role === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                            collaborator.role === 'Editor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                            collaborator.role === 'Viewer' ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' :
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                          }`}>
                                            {collaborator.role}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            collaborator.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                            'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                          }`}>
                                            {collaborator.status}
                                          </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                                          {collaborator.lastActive}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white w-1/5">
                                          <div className="flex items-center space-x-1">
                                            <button
                                              className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-primary dark:hover:text-primary relative group flex items-center justify-center"
                                            >
                                              <TbUserCog size={14} />
                                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                Edit
                                              </span>
                                            </button>
                                            <button
                                              onClick={() => {
                                                toast({
                                                  title: "Collaborator removed",
                                                  description: `${collaborator.name} has been removed from the organization`,
                                                  duration: 5000,
                                                  variant: "destructive",
                                                });
                                                
                                                // Remove from local state (in a real app, this would call an API)
                                                const newCollaboratorsData = collaboratorsData.filter((_, i) => i !== index);
                                                // Note: In a real implementation, you'd update state here
                                              }}
                                              className="border border-gray-300 rounded-md px-1 sm:px-1.5 py-1 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-500 transition-colors bg-transparent dark:bg-gray-800 dark:hover:border-red-500 dark:hover:text-red-500 relative group flex items-center justify-center"
                                            >
                                              <TbUserOff size={14} />
                                              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
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
                                  <div className="flex items-center gap-2">
                                    <TbUsers size={16} className="text-gray-600 dark:text-gray-400" />
                                    <div className="text-xs text-gray-700 dark:text-gray-300">
                                      {collaboratorsData.length} collaborators have been configured for this organization
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                    </div>
                  ))}
                </div>

            </div>
          </>
          )}

          {activeTab !== 'profile' && activeTab !== 'api' && activeTab !== 'webhooks' && activeTab !== 'security' && activeTab !== 'billing' && activeTab !== 'company' && activeTab !== 'policies' && (
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
                  if (webhookUrl.trim()) {
                    addWebhookAddedNotification(webhookUrl);
                    
                    // Show toast notification
                    toast({
                      title: "Webhook Added Successfully",
                      description: `Webhook for URL "${webhookUrl}" has been added successfully`,
                      duration: 5000,
                    });
                    
                    // Reset form
                    setWebhookUrl('');
                    setWebhookName('');
                    setWebhookSecret('');
                    setWebhookTriggers([]);
                  }
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

      {/* Add Policy Modal */}
      {showAddPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 cursor-default select-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 cursor-default select-none">
            <div className="flex justify-between items-start mb-4 cursor-default select-none">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white cursor-default select-none">Create policy</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 cursor-default select-none">On this page, you can create a new policy.</p>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowAddPolicyModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-6 cursor-default select-none">
              {/* Policy Name Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Policy Name *
                </label>
                <input
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter policy name"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  A descriptive name for your policy
                </p>
              </div>
              
              {/* Policy Description Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Description *
                </label>
                <input
                  type="text"
                  value={policyDescription}
                  onChange={(e) => setPolicyDescription(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs"
                  placeholder="Enter policy description"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  Brief description of what this policy covers
                </p>
              </div>
              
              {/* Policy Content Section */}
              <div>
                <label className="block text-xs font-medium text-gray-900 dark:text-white mb-1 cursor-default select-none">
                  Policy Content *
                </label>
                <textarea
                  value={policyContent}
                  onChange={(e) => setPolicyContent(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-xs resize-none"
                  placeholder="Enter the full policy content..."
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 cursor-default select-none">
                  The complete text of your policy
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 cursor-default select-none">
              <button
                onClick={() => setShowAddPolicyModal(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-semibold"
                style={{ fontFamily: 'Avenir, sans-serif' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle create policy logic here
                  if (policyName.trim() && policyDescription.trim() && policyContent.trim()) {
                    // Policy added notification
                    
                    // Show toast notification
                    toast({
                      title: "Policy Added Successfully",
                      description: `Policy "${policyName}" has been added successfully`,
                      duration: 5000,
                    });
                    
                    // Reset form
                    setPolicyName('');
                    setPolicyDescription('');
                    setPolicyContent('');
                  }
                  setShowAddPolicyModal(false);
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