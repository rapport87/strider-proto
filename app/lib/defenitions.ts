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

// NavigationUI.tsx
export interface NavigationUIProps {
    default_ledger_id: string;
  }

export interface LedgerDetailFormProps {
    category: Category[];
    ledger_detail?: LedgerDetailProps;
    isEdit?: boolean;
}

// EditLedger.tsx
export interface User {
    user_id: string;
    user_name: string;
    is_owner: boolean;
    is_default: boolean;
  }
  
export interface ledgerEditForm {
    id: string;
    ledger_name: string;
    user_category_group_id: string;
    user_ledger: User[];
  }
  
export interface CategoryGroup {
    id: string;
    category_group_name: string;
  }
  
export interface EditLedgerProps {
    user_id: string;
    ledger: ledgerEditForm;
    category_group: CategoryGroup[];
  }  
  
export interface UserLedgerProps {
    user_id: string;
    ledger_id: string;
    user_ledger: User[];
  }

export interface Category {
    id: string;
    parent_id: string | null;
    category_code: number;
    category_name: string;
    is_active: boolean;
  }
  
export interface WriteProps {
    category: Category[];
  }  

export interface CategoryGroup {
    id: string;
    category_group_name: string;
  }
  
export interface CategoryGroupProps {
    categoryGroup: CategoryGroup[];
  }  

export interface CategoryGroupRel {
    user_category_group_id: string;
    user_category_id: string;
  }

export interface CreateCategoryGroupRelProps {
    category: Category[];
    category_group: CategoryGroup[];
    category_group_rel: CategoryGroupRel[];
  }  