export interface Beat {
  beat: any;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  bpm: number;
  songKey: string;
  audioSrc: string;
  price: number;
  stripePriceId: string;
  producerId: string;
  purchased: boolean;
  genre: string;
  length: number;
  wavesurferRef: any;
  selectedLicense: BeatLicense;
  licenses: BeatLicense[];
}

export interface BeatLicense {
  id: string;
  price: number;
  licenseOption: LicenseOption;
}

export interface LicenseOption {
  id: string;
  name: string;
  basePrice: number;
  productSrc: string;
  contents: string[];
}
