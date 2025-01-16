export interface UserRegisterDto {
    name: string;
    email: string;
    password: string;
    role: 'employer' | 'candidate';
  }
  
  export interface UserLoginDto {
    email: string;
    password: string;
  }
  