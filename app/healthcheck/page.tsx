import { healthCheck } from "@/app/lib/actions";

export default async function Page() {
  const status = await healthCheck;
  return status;
}
