export interface IBook {
  title: string;
  author: string;
  genre: string;
  isbn: string;
  description?: string;
  copies: number;
  imageUrl?: string;
  available: boolean;
}

export interface BookInstanceMethods {
  updateAvailability(): Promise<void>;
}
