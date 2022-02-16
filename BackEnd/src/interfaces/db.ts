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