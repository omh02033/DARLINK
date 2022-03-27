export interface linkIF {
  uid: number;
  url: string;
  image: string;
  tag: string;
  likeNum: number;
  location: string;
  field: string;
  title: string;
}

export interface likesIF {
  [key: number]: number;
}