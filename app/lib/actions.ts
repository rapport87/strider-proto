"use server";

export async function handleForm(prevState: any, formData : FormData){
    await new Promise((r) => setTimeout(r, 3000));
    return {
      errors: ["Error message test"]
    }
  }