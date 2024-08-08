export enum WorkoutType {
  GYM = 'GYM',
  CARDIO = 'CARDIO',
  YOGA = 'YOGA',
  SPORT = 'SPORT',
  OTHER = 'OTHER',
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export type Media = {
  type: MediaType;
  path: string;
};

export type GymEntry = {
  date: Date;
  type: WorkoutType;
  points: number;
  updatedAt: string;
  media: Media[];
  notes?: string;
};

export type WeightEntry = {
  date: Date;
  weight: number;
  updatedAt: string;
  notes?: string;
};

export type UserData = {
  username: string;
  profilePic: string | null;
  gymEntries: GymEntry[];
  weightEntries: WeightEntry[];
  createdAt: string;
};
