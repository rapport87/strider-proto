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

export interface UserLedger{
    user_id : number;
    ledger_id : number;
    ledger_name : string;
}

export interface ListLedgerProps{
    user_id : number;
    ledger_id : number;
    ledger_name : string;
    is_default : boolean;
    is_owner : boolean;
}

export interface ListInvitedLedgerProps{
    id : number;
    user_id : number;
    ledger_id : number;
    ledger_name : string;
}

export interface ListLedgerDetailProps{
    id : number | undefined;
    category_code : number;
    asset_category_id : number | undefined;
    transaction_category_id : number;
    asset_category_name : string;
    transaction_category_name : string;
    title : string;
    price : number;
    evented_at : Date;
}