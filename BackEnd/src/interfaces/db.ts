export interface DBUser {
    uid: number;
    userId: string;
    password?: string;
    passwordSalt?: string;
    signUpPath: string;
    email: string;
    name: string;
    points: number;
    regiTime: Date;
    temporaryPassword: string;
    forgetPwdStatus: string;
}