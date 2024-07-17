import db from "@/app/lib/db";
import getSession from "./session";
import { notFound } from "next/navigation";

export async function getUser() {
    const session = await getSession();
    if (session.id) {
      const user = await db.user.findUnique({
        where: {
          id: session.id,
        },
      });
      if (user) {
        return user;
      }
    }
    notFound();
  }

  export async function getUserCategory() {
    const session = await getSession();
    const userId = session.id;
  
    const categories = await db.user_category.findMany({
      where: { user_id: userId, is_active: true },
      select: {
        id: true,
        parent_id: true,
        category_name: true,
        category_code: true,
        is_active: true,
      },
    });
  
    return categories;
  }

  export async function getUserCategoryById(categoryId : string){

    const category = await db.user_category.findUnique({
      select: {
        id: true,
        parent_id: true,
        category_code: true,
        category_name: true,
        is_active: true,
      },
      where: {
        id: categoryId,
        is_active : true
      },
    });

    if (category) {
      return category;
    }    
    
    notFound();
  }  

  export async function getUserCategoryByIdByLedgerId(ledgerId : string){
    const userCategoryGroup = await db.ledger.findUnique({
      select : {
        user_category_group_id : true,
      },
      where : { 
        id : ledgerId
      }
    })
  
    if (!userCategoryGroup) {
      return notFound();
    }    
  
    const userCategory = await db.user_category.findMany({
      select: {
        id: true,
        parent_id: true,
        category_code: true,
        category_name: true,
        is_active: true,
      },
      where: {
        user_category_group_rel : {
          some : {
            user_category_group_id : userCategoryGroup!.user_category_group_id
          }
        }
      },
    });
  
    if (userCategory) {
      return userCategory;
    }    
    
    notFound();
  }

  export async function getCategoryGroup(){
    const user = await getSession();
    const category_group = await db.user_category_group.findMany({
      select : {
        id : true,
        category_group_name : true,
      },
      where : {
        user_id : user.id,
      }
    })
  
    return category_group
  }

  export async function getUserCategoryByIdGroupRel() {
    const user = await getSession();
    const user_category_group_rel = await db.user_category_group_rel.findMany({
      select: {
        user_category_group_id: true,
        user_category_id: true,
      },
      where: {
        user_category_group : {
          user_id : user.id
        }
      },
    });
  
    return user_category_group_rel;
  }  

  
export async function getLedgerDetailById(ledgerDetailId : string){
  try{
    const ledgerDetail = await db.ledger_detail.findUnique({
      where : {
        id : ledgerDetailId
      }
    })
    return ledgerDetail
  }catch(error){
    throw new Error("가계부 내역 불러오기에 실패했습니다");
  }
}

export async function getLedgerById(ledgerId: string) {
    const ledger = await db.ledger.findUnique({
      where: {
        id: ledgerId,
      },
      select: {
        id: true,
        user_category_group_id : true,
        userLedger: {
          select: {
            user_id: true,
            ledger_name: true,
            is_owner: true,
            is_default: true,
            user: {
              select: {
                user_name: true,
              },
            },
          },
        },
      },
    });
  
    if (!ledger) {
      return null;
    }
  
    const ledgerUsers = {
      id: ledger.id,
      user_category_group_id: ledger.user_category_group_id,
      user_ledger: ledger.userLedger.map((userLedger) => ({
        user_id: userLedger.user_id,
        ledger_name: userLedger.ledger_name,
        is_owner: userLedger.is_owner,
        is_default: userLedger.is_default,
        user_name: userLedger.user.user_name,
      })),
    };
  
    return ledgerUsers;
  }


  export async function getUserLedgers(){
    const user = await getSession();
    const ledger = await db.user_ledger.findMany({
      where: {
        user_id : user.id
      },
      select : {
        user_id : true,
        ledger_id : true,
        ledger_name : true,
        is_default : true,
        is_owner : true,
      }
    })
    return ledger
  }

  export async function getDefaultLedger(){
    const user = await getSession();
    const ledger = await db.user_ledger.findMany({
      where: {
        user_id : user.id,
        is_default : true
      },
      select : {
        ledger_id : true,
      }
    })
    return ledger
  }  
  

  export async function getLedgerDetailsByLedgerId(ledgerId : string){
    //   SELECT ld.*
    //   FROM ledger_detail ld
    //  INNER JOIN ledger l ON l.id = ld.ledger_id
    //  INNER JOIN user_ledger ul ON ul.ledger_id = l.id
    //         AND ul.user_id = 1
    //   LEFT JOIN user_category uc ON ld.asset_category_id = uc.category_code
    //   LEFT JOIN user_category ac ON ld.transaction_category_id = uc.category_code
    //  ORDER BY ld.evented_at DESC;  
    
      const user = await getSession();
      const ledgerDetails = await db.ledger_detail.findMany({
        where: {
          ledger_id : ledgerId,
          ledger: {
            userLedger: {
              some: {
                user_id: user.id,
              },
            },
          },
        },
        orderBy: {
          evented_at: 'desc',
        },
        include: {     
          user : { 
            select: {
              user_name : true
            }
          },
          asset_category: {
            select: {
              category_name: true,
            },
          },
          transaction_category: {
            select: {
              category_name: true,
            },
          },
        },        
      });

      return ledgerDetails.map((detail) => ({
        id: detail.id,
        asset_category_id: detail.asset_category_id,
        transaction_category_id: detail.transaction_category_id,
        category_code: detail.category_code,
        title: detail.title,
        price: detail.price,
        evented_at: detail.evented_at,
        asset_category_name: detail.asset_category.category_name,
        transaction_category_name: detail.transaction_category.category_name,
        user_name : detail.user.user_name
      }));
    }


export async function getInvitedLedgerList(){
//   SELECT t1.user_id, t1.ledger_id, t1.invite_prg_code, t1.created_at, t1.updated_at
//     FROM user_ledger_invite t1
//    INNER JOIN (
//                SELECT user_id, ledger_id, MAX(created_at) AS max_created_at
//                  FROM user_ledger_invite
//                 GROUP BY user_id, ledger_id
//               ) t2
//            ON t1.ledger_id = t2.ledger_id
//           AND t1.user_id = t2.user_id
//           AND t1.created_at = t2.max_created_at;
  
  const user = await getSession();
  const subquery = await db.user_ledger_invite.groupBy({
    by: ['user_id', 'ledger_id'],
    _max: {
      created_at: true,
    },
    where: {
      user_id: user.id,
    },    
  });

  const result = await db.user_ledger_invite.findMany({
    where: {
      OR: subquery.map((row) => ({
        user_id: row.user_id,
        ledger_id: row.ledger_id,
        created_at: row._max.created_at as Date,
      })),
      invite_prg_code : 0
    },
    include: {
      ledger: {
        include : {
          userLedger : {
            select : {
              ledger_name : true
            }
          }
        }
      },
    },    
  });

  return result.map(invite => ({
    id : invite.id,
    user_id: invite.user_id,
    ledger_id: invite.ledger_id,
    invite_prg_code: invite.invite_prg_code,
    created_at: invite.created_at,
    updated_at: invite.updated_at,
    ledger_name: invite.ledger.userLedger[0].ledger_name,
  }));
}    

