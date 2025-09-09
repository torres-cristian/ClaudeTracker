export interface Session {
  id: string;
  startTime: string;
  endTime: string;
}

export interface Account {
  id: string;
  name: string;
  price: number;
  startDate: string;
  sessions: Record<string, Omit<Session, 'id'>>;
}
