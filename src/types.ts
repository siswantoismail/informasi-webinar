export interface EventDetails {
  logoUrl?: string;
  institutionName?: string;
  institutionSubtitle?: string;
  title: string;
  subTitle: string;
  welcomeMessage: string;
  targetDateTime: string; // ISO string
  eventDateText?: string;
  eventTimeText?: string;
  meetingPlatform?: string;
  meetingUrl?: string;
  meetingId?: string;
  passcode?: string;
  certificateInfo?: string;
  slidoCode?: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  role: string;
  institution: string;
  photoUrl: string;
  topic: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  description: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMilliseconds: number;
  isComplete: boolean;
}
