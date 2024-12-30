import WaveSurfer from "wavesurfer.js";

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
  producerId: string;
  purchased: boolean;
  genre: string;
  length: number;
  wavesurferRef: any;
}
