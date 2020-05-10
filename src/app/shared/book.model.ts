export interface Book {
  title: string;
  author: string;
  id: string;
  barcode: string;
  coverImage: string;
  statusTaken: boolean;
  statusReturned: boolean;
  takenDate: string;
  returnDate: string;
}
