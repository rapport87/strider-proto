export interface SessionContent{
    id:number;
}

export interface InputProps{
    name:string;
    errors?:string[];
};

export interface ButtonProps{
    text : string;
};

export interface SmsTokenProps{
    token: boolean;
}