export interface linkIF {
  uid: number;
  url: string;
  image: string;
  tag: string;
  location: string;
  field: string;
  title: string;
}

export interface likesIF {
  uid: number;
  linkUid: number;
  userUid: number;
}