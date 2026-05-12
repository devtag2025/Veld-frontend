/**
 * Predefined safari hunt packages with pricing and optional add-ons.
 * Single source of truth used by BookingModal, ResendContractModal, and payment preview.
 */

export interface PackageAddOn {
  label: string;
  price: number;
}

export interface SafariPackage {
  id: string;
  name: string;
  price: number;
  addOn: PackageAddOn | null;
}

export const SAFARI_PACKAGES: SafariPackage[] = [
  {
    id: "6-day-classic-buffalo",
    name: "6–Day CLASSIC BUFFALO HUNT SAFARI",
    price: 16500,
    addOn: { label: "ADD CHARTER", price: 1800 },
  },
  {
    id: "7-day-two-buffalo",
    name: "7–Day TWO BUFFALO SAFARI",
    price: 21500,
    addOn: { label: "CHARTER", price: 2400 },
  },
  {
    id: "8-day-buffalo-banteng",
    name: "8–Day BUFFALO & BANTENG COMBINATION SAFARI",
    price: 35000,
    addOn: null,
  },
  {
    id: "8-day-2buffalo-1banteng",
    name: "8–Day 2-BUFFALO & 1-BANTENG COMBINATION SAFARI",
    price: 42500,
    addOn: null,
  },
  {
    id: "10-day-6species",
    name: "10–Day 6 SPECIES TOP-END SLAM SAFARI",
    price: 55000,
    addOn: null,
  },
];

/**
 * Finds a safari package by its name.
 */
export function findPackageByName(name: string): SafariPackage | undefined {
  return SAFARI_PACKAGES.find((p) => p.name === name);
}
