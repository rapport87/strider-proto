export interface SessionContent{
    id:string;
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
    user_id : string;
    ledger_id : string;
    ledger_name : string;
}

export interface ListLedgerProps{
    user_id : string;
    ledger_id : string;
    ledger_name : string;
    is_default : boolean;
    is_owner : boolean;
}

export interface ListInvitedLedgerProps{
    id : string;
    user_id : string;
    ledger_id : string;
    ledger_name : string;
}

export interface LedgerDetailProps{
    id : string;
    ledger_id : string;
    asset_category_id : string;
    transaction_category_id : string;
    category_code : number;
    title : string;
    detail : string | null;
    price : bigint;
    photo : string | null;
    evented_at : Date;
}

export interface ListLedgerDetailProps{
    id : string | undefined;
    category_code : number;
    asset_category_id : string | undefined;
    transaction_category_id : string;
    asset_category_name : string;
    transaction_category_name : string;
    title : string;
    price : bigint;
    evented_at : Date;
}