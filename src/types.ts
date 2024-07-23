export interface Beat {
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
}
