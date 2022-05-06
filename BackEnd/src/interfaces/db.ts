export interface DBUser {
  uid: number;
  userId: string;
  password?: string;
  passwordSalt?: string;
  signUpPath: string;
  name: string;
  points: number;
  regiTime: Date;
  temporaryPassword: string;
  forgetPwdStatus: string;
}
export interface DBAdmin {
  uid: number;
  userUid: number;
}

export interface DBLinks {
  uid: number;
  url: string;
  image: string;
  tag: 'food' | 'etc' | 'reporters' | 'beauty';
  field: string;
  location: string;
  title: string;
}

export interface DBLikes {
  uid: number;
  userUid: number;
  linkUid: number;
}

export interface DBAttendance {
  uid: number;
  userUid: number;
  time: Date;
  day: string;
}

export interface DBBanner {
  uid: number;
  path: string;
}