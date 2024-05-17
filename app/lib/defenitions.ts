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

export interface ListLedgerDetailProps{
    id : number;
    title : string;
    price : number;
    evented_at : Date;
}