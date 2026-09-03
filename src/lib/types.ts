export interface Article {
  id: string;
  content: string;
  // timestamp can be a string from the backend or a Date object in the client
  timestamp: string | Date;
}
