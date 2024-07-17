export interface SessionContentProps{
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

export interface InvitedLedgerListProps{
    id : string;
    user_id : string;
    ledger_id : string;
    ledger_name : string;
}

export interface LedgerDetailFormProps {
    category: UserCategory[];
    ledgerDetail?: LedgerDetail;
    isEdit?: boolean;
  }

export interface LedgerDetail{
    id : string;
    ledger_id : string;
    category_code : number;
    asset_category_id : string;
    transaction_category_id : string;
    title : string;
    detail : string | null;
    price : bigint;
    photo : string | null;
    evented_at : Date;
}

export interface LedgerDetailListProps{
    id : string | undefined;
    user_name : string;
    category_code : number;
    asset_category_id : string | undefined;
    transaction_category_id : string;
    asset_category_name : string;
    transaction_category_name : string;
    title : string;
    price : bigint;
    evented_at : Date;
}

export interface NavigationProps {
    ledger_id: string;
}

export interface UserLedgerProps {
    user_id: string;
    ledger_name: string;
    is_default: boolean;
    is_owner: boolean;
    user_name: string;
}

export interface CategoryGroup {
    id: string;
    category_group_name: string;
}

export interface EditLedgerFormProps {
    user_id: string;
    ledger: Ledger;
    category_group: CategoryGroup[];
}  
  
export interface Ledger {
  id: string;
  user_category_group_id: string;
  user_ledger: UserLedgerProps[];
}

export interface LedgerListProps{
    user_id: string;
    ledger_id: string;
    ledger_name: string;
    is_default: boolean;
    is_owner: boolean;
}

export interface MemberListProps {
    user_id: string;
    ledger_id: string;
    user_ledger: UserLedgerProps[];
}

export interface UserCategory {
    id: string;
    parent_id: string | null;
    category_code: number;
    category_name: string;
    is_active: boolean;
}
  
export interface UserCategoryProps {
    category: UserCategory[];
}  


export interface CreateLedgerProps {
    category_group: CategoryGroup[];
}  

export interface CategoryGroupRel {
    user_category_group_id: string;
    user_category_id: string;
}

export interface CreateCategoryGroupRelProps {
    category: UserCategory[];
    category_group: CategoryGroup[];
    category_group_rel: CategoryGroupRel[];
}  