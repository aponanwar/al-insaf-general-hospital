/**
 * Centralized Hospital Configuration & Public Metadata
 * Collects values dynamically from .env.local (NEXT_PUBLIC_*) with robust defaults.
 */

export const HOSPITAL_CONFIG = {
  nameEn: process.env.NEXT_PUBLIC_HOSPITAL_NAME || 'Al Insaf General Hospital',
  nameBn: 'আল ইনসাফ জেনারেল হাসপাতাল',
  phone: process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '01303-359905',
  phoneRaw: (process.env.NEXT_PUBLIC_HOSPITAL_PHONE || '01303-359905').replace(/[^0-9]/g, ''),
  phoneAlt: process.env.NEXT_PUBLIC_HOSPITAL_PHONE_ALT || '01913-129020',
  phoneAltRaw: (process.env.NEXT_PUBLIC_HOSPITAL_PHONE_ALT || '01913-129020').replace(/[^0-9]/g, ''),
  emergencyPhone: process.env.NEXT_PUBLIC_EMERGENCY_PHONE || '01303-359905',
  emergencyPhoneRaw: (process.env.NEXT_PUBLIC_EMERGENCY_PHONE || '01303-359905').replace(/[^0-9]/g, ''),
  email: process.env.NEXT_PUBLIC_HOSPITAL_EMAIL || 'alinsafhospital2025@gmail.com',
  addressEn:
    process.env.NEXT_PUBLIC_HOSPITAL_ADDRESS ||
    'Govt. High School Gate, Dewanganj Bazar, Dewanganj, Jamalpur, Bangladesh',
  addressBn: 'সরকারি হাই স্কুল গেট সংলগ্ন, দেওয়ানগঞ্জ বাজার, দেওয়ানগঞ্জ, জামালপুর, বাংলাদেশ',
  mapsUrl:
    process.env.NEXT_PUBLIC_HOSPITAL_MAPS_URL ||
    'https://www.google.com/maps/search/Dewanganj+Government+High+School+Jamalpur',
  mapsEmbed:
    process.env.NEXT_PUBLIC_HOSPITAL_MAPS_EMBED ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14456.289196886367!2d89.7716999!3d25.1437000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fc561491764653%3A0x6b78d2b7754b2efc!2sDewanganj%20Govt.%20High%20School!5e0!3m2!1sen!2sbd!4v1711234567890!5m2!1sen!2sbd',
};
