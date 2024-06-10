function parseDate(dateString: string) {    
    const date = new Date(dateString);
  
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
  
    return { year, month, day, hours, minutes };
  }

export function formatToWon(price:bigint){
    return price.toLocaleString("ko-KR");
}
